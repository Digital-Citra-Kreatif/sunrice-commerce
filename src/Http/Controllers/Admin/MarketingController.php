<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Marketing\Actions\LaunchCampaign;
use Sunrice\Commerce\Marketing\Actions\SaveCampaign;
use Sunrice\Commerce\Marketing\Audience;
use Sunrice\Commerce\Marketing\Automations\Trigger;
use Sunrice\Commerce\Marketing\Automations\Triggers;
use Sunrice\Commerce\Marketing\MarketingMail;
use Sunrice\Commerce\Marketing\MessageBuilder;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Commerce\Marketing\SmartTags;
use Sunrice\Commerce\Marketing\StartingPoints;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Fields\BlueprintSchema;
use Sunrice\Support\Locales;

/** Shop → Marketing (Campaigns and Automations): marketing emails, their audiences and results. */
class MarketingController extends Controller
{
    public function index(Request $request, string $type): Response
    {
        $this->guard();
        $automation = $type === Campaign::AUTOMATION;
        $triggers = app(Triggers::class);
        $table = TableQuery::for(Campaign::query()->where('type', $type))->searchable(['name'])
            ->filter('status', fn ($q, $v) => $q->where('status', (string) $v))
            ->sortable(['name', 'sent_count', 'created_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->latest('id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);
        $statuses = $automation ? ['draft', 'active', 'paused'] : ['draft', 'scheduled', 'sending', 'sent', 'cancelled'];

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => $automation ? 'Automations' : 'Campaigns',
            'description' => $automation
                ? 'Emails sent by themselves when something happens: a cart left behind, a customer who hasn\'t ordered for a while…'
                : 'Emails to customers who accept marketing ('.number_format(Audience::reachable()->count()).' now).',
            'createUrl' => $automation ? 'commerce/marketing/automations/create' : 'commerce/marketing/campaigns/create',
            'createLabel' => $automation ? 'New automation' : 'New campaign',
            ...$this->tableProps('commerce-marketing-'.$type, $table, [
                new Column('name', 'Name', sortable: true),
                $automation ? new Column('trigger', 'When') : new Column('when', 'Date'),
                new Column('sent_count', 'Sent', sortable: true, type: 'number'),
                new Column('opened', 'Opened'),
                new Column('clicked', 'Clicked'),
                new Column('status', 'Status', type: 'badge'),
            ], $rows->through(fn (Model $c) => $c instanceof Campaign ? [
                'id' => $c->id,
                'href' => $c->editable() ? "commerce/marketing/{$c->id}/edit" : "commerce/marketing/{$c->id}",
                'name' => $c->name,
                'trigger' => $this->triggerSummary($c, $triggers->get($c->trigger)),
                'when' => match ($c->status) {
                    'scheduled' => 'Scheduled '.$c->scheduled_at?->isoFormat('D MMM YYYY HH:mm'),
                    'sent', 'sending', 'cancelled' => $c->started_at?->isoFormat('D MMM YYYY HH:mm'),
                    default => null,
                },
                'sent_count' => $c->sent_count,
                'opened' => $c->sent_count > 0 ? $c->openRate().'% ('.$c->opened_count.')' : '—',
                'clicked' => $c->sent_count > 0 ? $c->clickRate().'% ('.$c->clicked_count.')' : '—',
                'status' => ucfirst($c->status),
                'status_tone' => ['active' => 'ok', 'sent' => 'ok', 'sending' => 'info', 'scheduled' => 'info', 'paused' => 'warning', 'cancelled' => 'danger'][$c->status] ?? 'neutral',
            ] : []), [[
                'key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => array_map(fn (string $s) => ['value' => $s, 'label' => ucfirst($s)], $statuses),
            ]], []),
        ]);
    }

    public function create(Request $request, string $type): Response
    {
        $this->guard();
        $campaign = new Campaign(['type' => $type, 'status' => 'draft', 'name' => '', 'audience' => ['match' => 'all', 'rules' => []]]);
        if ($type === Campaign::AUTOMATION) {
            $trigger = app(Triggers::class)->get((string) $request->query('trigger')) ?? array_values(app(Triggers::class)->all())[0];
            $campaign->fill(['trigger' => $trigger->key(), 'trigger_config' => ['delay' => $trigger->delay()['default']], 'name' => $trigger->label(),
                'content' => StartingPoints::content($trigger->template())]);
        } else {
            $start = collect(StartingPoints::campaigns())->firstWhere('key', (string) $request->query('template', 'announcement'));
            $campaign->fill(['content' => $start['content'] ?? [], 'audience' => $start['audience'] ?? null]);
        }

        return $this->editor($campaign);
    }

    public function edit(Campaign $campaign): Response|RedirectResponse
    {
        $this->guard();
        if (! $campaign->editable()) {
            return redirect()->route('sunrice.admin.commerce.marketing.show', $campaign);
        }

        return $this->editor($campaign);
    }

    public function store(Request $request, string $type, SaveCampaign $save): RedirectResponse
    {
        $this->guard();
        $campaign = $save->handle(new Campaign(['type' => $type, 'status' => 'draft']), $request->all(), $request->user()?->getAuthIdentifier());
        app(ActivityRecorder::class)->record('created', ($type === Campaign::AUTOMATION ? 'Automation: ' : 'Campaign: ').$campaign->name, [], 'marketing');

        return redirect()->route('sunrice.admin.commerce.marketing.edit', $campaign)->with('success', 'Saved.');
    }

    public function update(Request $request, Campaign $campaign, SaveCampaign $save): RedirectResponse
    {
        $this->guard();
        $save->handle($campaign, $request->all());

        return back()->with('success', 'Saved.');
    }

    public function destroy(Campaign $campaign): RedirectResponse
    {
        $this->guard();
        abort_if($campaign->status === 'sending', 422, 'Cancel the campaign before deleting it.');
        $campaign->delete();
        app(ActivityRecorder::class)->record('deleted', ($campaign->isAutomation() ? 'Automation: ' : 'Campaign: ').$campaign->name, [], 'marketing');

        return redirect()->route($campaign->isAutomation() ? 'sunrice.admin.commerce.marketing.automations' : 'sunrice.admin.commerce.marketing.campaigns')->with('success', 'Deleted.');
    }

    /** Send now, or at `at` (a date and time in the future). */
    public function send(Request $request, Campaign $campaign, LaunchCampaign $launch): RedirectResponse
    {
        $this->guard();
        $at = $request->filled('at') ? Carbon::parse((string) $request->input('at')) : null;
        if ($at !== null && $at->isPast()) {
            throw ValidationException::withMessages(['at' => 'Choose a time in the future.']);
        }
        $launch->handle($campaign, $at);
        app(ActivityRecorder::class)->record($at ? 'scheduled' : 'sent', 'Campaign: '.$campaign->name, [], 'marketing');

        return $at !== null
            ? back()->with('success', 'Scheduled for '.$at->isoFormat('D MMM YYYY HH:mm').'.')
            : redirect()->route('sunrice.admin.commerce.marketing.show', $campaign)->with('success', 'Sending. The emails go out in the background.');
    }

    public function unschedule(Campaign $campaign, LaunchCampaign $launch): RedirectResponse
    {
        $this->guard();
        $launch->unschedule($campaign);

        return back()->with('success', 'Back to draft.');
    }

    public function cancel(Campaign $campaign, LaunchCampaign $launch): RedirectResponse
    {
        $this->guard();
        $launch->cancel($campaign);

        return back()->with('success', 'Cancelled. Emails not yet sent won\'t go out.');
    }

    /** Activate or pause an automation. Activating starts from now: nobody already due is emailed. */
    public function status(Request $request, Campaign $campaign): RedirectResponse
    {
        $this->guard();
        abort_unless($campaign->isAutomation(), 404);
        $active = $request->boolean('active');
        if ($active && $campaign->status !== 'active') {
            $campaign->forceFill(['status' => 'active', 'last_run_at' => $campaign->status === 'paused' ? $campaign->last_run_at : now()])->save();
        } elseif (! $active && $campaign->status === 'active') {
            $campaign->forceFill(['status' => 'paused'])->save();
        }
        app(ActivityRecorder::class)->record($active ? 'activated' : 'paused', 'Automation: '.$campaign->name, [], 'marketing');

        return back()->with('success', $active ? 'Automation on.' : 'Automation paused.');
    }

    public function duplicate(Campaign $campaign): RedirectResponse
    {
        $this->guard();
        $copy = $campaign->replicate(['status', 'scheduled_at', 'started_at', 'finished_at', 'last_run_at', 'recipients_count', 'sent_count',
            'failed_count', 'opened_count', 'clicked_count', 'unsubscribed_count']);
        $copy->forceFill(['name' => $campaign->name.' (copy)', 'status' => 'draft'])->save();

        return redirect()->route('sunrice.admin.commerce.marketing.edit', $copy)->with('success', 'Duplicated.');
    }

    /** How many customers an audience matches, and a few of them (the editor's live count). */
    public function audience(Request $request, Audience $audience): JsonResponse
    {
        $this->guard();
        $query = $audience->query((array) $request->input('audience', []));

        return response()->json([
            'count' => (clone $query)->count(),
            'sample' => $query->orderByDesc('commerce_customers.id')->limit(5)->get(['commerce_customers.name', 'commerce_customers.email'])
                ->map(fn (Customer $c) => ['name' => $c->name, 'email' => $c->email])->all(),
        ]);
    }

    /** The email as a recipient would see it, from the editor's unsaved content. */
    public function preview(Request $request, MessageBuilder $builder): JsonResponse
    {
        $this->guard();
        [$campaign, $customer, $locale] = $this->draft($request);
        $message = $builder->build($campaign, $customer, $customer->email, $locale, '', [], track: false);

        return response()->json(['subject' => $message['subject'], 'html' => $message['html'], 'to' => $customer->name ?: $customer->email]);
    }

    /** Send the editor's unsaved content to the signed-in user. */
    public function test(Request $request, MessageBuilder $builder): RedirectResponse
    {
        $this->guard();
        [$campaign, $customer, $locale] = $this->draft($request);
        $to = (string) $request->user()?->getAttribute('email');
        $message = $builder->build($campaign, $customer, $to, $locale, '', [], track: false);
        Mail::mailer(config('commerce.marketing.mailer') ?: null)->to($to)
            ->send(new MarketingMail('[Test] '.$message['subject'], $message['html'], $message['text'], $message['unsubscribe_url']));

        return back()->with('success', "Test email sent to {$to}.");
    }

    /** A campaign's results: totals, rates, links and the latest recipients. */
    public function show(Campaign $campaign): Response
    {
        $this->guard();
        $trigger = app(Triggers::class)->get($campaign->trigger);

        return Inertia::render('Commerce/Marketing/Report', [
            'campaign' => [
                'id' => $campaign->id, 'name' => $campaign->name, 'type' => $campaign->type, 'status' => $campaign->status,
                'editable' => $campaign->editable(), 'trigger' => $trigger !== null ? $this->triggerSummary($campaign, $trigger) : null,
                'subject' => $campaign->contentFor(Locales::main())['subject'],
                'started_at' => $campaign->started_at?->toIso8601String(), 'finished_at' => $campaign->finished_at?->toIso8601String(),
                'scheduled_at' => $campaign->scheduled_at?->toIso8601String(),
            ],
            'stats' => [
                'recipients' => $campaign->recipients_count, 'sent' => $campaign->sent_count, 'failed' => $campaign->failed_count,
                'queued' => $campaign->sends()->whereIn('status', ['queued', 'sending'])->count(),
                'opened' => $campaign->opened_count, 'clicked' => $campaign->clicked_count, 'unsubscribed' => $campaign->unsubscribed_count,
                'open_rate' => $campaign->openRate(), 'click_rate' => $campaign->clickRate(),
            ],
            'links' => $campaign->links()->orderByDesc('clicks')->limit(20)->get()
                ->map(fn ($l) => ['url' => $l->url, 'clicks' => $l->clicks, 'unique_clicks' => $l->unique_clicks])->all(),
            'recipients' => $campaign->sends()->latest('id')->limit(50)->get()->map(fn ($s) => [
                'email' => $s->email, 'status' => $s->status, 'error' => $s->error,
                'sent_at' => $s->sent_at?->toIso8601String(), 'opened_at' => $s->opened_at?->toIso8601String(),
                'clicked_at' => $s->clicked_at?->toIso8601String(), 'unsubscribed' => $s->unsubscribed_at !== null,
            ])->all(),
        ]);
    }

    protected function editor(Campaign $campaign): Response
    {
        $triggers = app(Triggers::class);
        $automation = $campaign->isAutomation();
        $content = [];
        foreach (Locales::available() as $locale) {
            $content[$locale] = array_replace(['subject' => '', 'preheader' => '', 'body' => '', 'button_label' => '', 'button_url' => ''],
                array_map(fn ($v) => (string) $v, (array) (($campaign->content ?? [])[$locale] ?? [])));
        }

        return Inertia::render('Commerce/Marketing/Editor', [
            'campaign' => [
                'id' => $campaign->id, 'type' => $campaign->type, 'name' => $campaign->name, 'status' => $campaign->status,
                'trigger' => $campaign->trigger, 'delay' => ($campaign->trigger_config ?? [])['delay'] ?? null,
                'voucher_code' => ($campaign->trigger_config ?? [])['voucher_code'] ?? '',
                'audience' => Audience::clean($campaign->audience),
                'content' => $content,
                'scheduled_at' => $campaign->scheduled_at?->toIso8601String(),
                'sent_count' => $campaign->sent_count,
            ],
            'locales' => array_map(fn (string $l) => ['code' => $l, 'name' => Locales::name($l)], Locales::available()),
            'mainLocale' => Locales::main(),
            'rules' => Audience::rules(),
            'tags' => SmartTags::all(),
            'triggers' => $automation ? array_values(array_map(fn (Trigger $t) => [
                'key' => $t->key(), 'label' => $t->label(), 'description' => $t->description(), 'delay' => $t->delay(),
                'content' => StartingPoints::content($t->template()),
            ], $triggers->all())) : [],
            'templates' => $automation || $campaign->exists ? [] : StartingPoints::campaigns(),
            'reachable' => Audience::reachable()->count(),
            'bodyFields' => BlueprintSchema::make([['handle' => 'body', 'type' => 'rich_text', 'label' => 'Text', 'translatable' => false]])->toAdminSchema(),
            'currency' => $this->currencySymbol(),
        ]);
    }

    /** @return array{0: Campaign, 1: Customer, 2: string} the unsaved campaign, a sample recipient and the language */
    protected function draft(Request $request): array
    {
        $locale = in_array($request->input('locale'), Locales::available(), true) ? (string) $request->input('locale') : Locales::main();
        $campaign = new Campaign([
            'type' => Campaign::CAMPAIGN,
            'content' => (array) $request->input('content', []),
            'trigger_config' => ['voucher_code' => (string) $request->input('voucher_code', '')],
        ]);
        $campaign->id = 0;
        $customer = app(Audience::class)->query((array) $request->input('audience', []))->latest('commerce_customers.id')->first()
            ?? (new Customer)->forceFill(['name' => 'Rina Wijaya', 'email' => 'rina@example.com', 'orders_count' => 3, 'total_spent' => 450000, 'last_order_at' => now()->subDays(45)]);

        return [$campaign, $customer, $locale];
    }

    protected function triggerSummary(Campaign $campaign, ?Trigger $trigger): ?string
    {
        if ($trigger === null) {
            return null;
        }
        $delay = (int) (($campaign->trigger_config ?? [])['delay'] ?? $trigger->delay()['default']);

        return $trigger->label().' · '.$delay.' '.($trigger->delay()['unit'] === 'hours' ? ($delay === 1 ? 'hour' : 'hours') : ($delay === 1 ? 'day' : 'days'));
    }

    protected function currencySymbol(): string
    {
        return (string) (app(StoreSettings::class)->get('general.currency.symbol') ?? 'Rp');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('marketing');
        $this->authorize('commerce.marketing.manage');
    }
}
