<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Admin\Tables\Column;
use Sunrice\Commerce\Admin\Tables\TableQuery;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Webhooks\Actions\SaveWebhook;
use Sunrice\Commerce\Webhooks\Models\Webhook;
use Sunrice\Commerce\Webhooks\Models\WebhookDelivery;
use Sunrice\Commerce\Webhooks\Webhooks;

/** Settings → Webhooks: endpoints that receive the store's events, their signing secrets and recent deliveries. */
class WebhooksController extends Controller
{
    public function index(Request $request): Response
    {
        $this->guard();
        $table = TableQuery::for(Webhook::query())->searchable(['name', 'url'])->sortable(['name', 'created_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->orderBy('name')->orderBy('id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Webhooks',
            'description' => 'Send orders, shipments and stock changes to other systems as they happen. See the developer docs for the format and signature.',
            'createUrl' => 'commerce/settings/webhooks/create',
            'createLabel' => 'New webhook',
            ...$this->tableProps('commerce-webhooks', $table, [
                new Column('name', 'Name', sortable: true),
                new Column('url', 'URL'),
                new Column('events', 'Events'),
                new Column('status', 'Status', type: 'badge'),
            ], $rows->through(fn (Model $w) => $w instanceof Webhook ? [
                'id' => $w->id, 'href' => "commerce/settings/webhooks/{$w->id}/edit", 'name' => $w->name, 'url' => $w->url,
                'events' => implode(', ', $w->events),
                'status' => $this->status($w),
                'status_tone' => match ($this->status($w)) {
                    'Active' => 'ok', 'Switched off after failures' => 'danger', default => 'neutral'
                },
            ] : []), [], []),
        ]);
    }

    public function create(): Response
    {
        $this->guard();

        return $this->form(new Webhook(['active' => true, 'events' => []]));
    }

    public function edit(Webhook $webhook): Response
    {
        $this->guard();

        return $this->form($webhook);
    }

    public function store(Request $request, SaveWebhook $save): RedirectResponse
    {
        $this->guard();
        $webhook = $save->handle(new Webhook, (array) $request->input('values', []));

        return redirect()->route('sunrice.admin.commerce.settings.webhooks.edit', $webhook)->with('success', 'Webhook created. Copy its signing secret to the receiving end.');
    }

    public function update(Request $request, Webhook $webhook, SaveWebhook $save): RedirectResponse
    {
        $this->guard();
        $save->handle($webhook, (array) $request->input('values', []));

        return back()->with('success', 'Webhook saved.');
    }

    public function destroy(Webhook $webhook): RedirectResponse
    {
        $this->guard();
        $webhook->delete();
        app(Webhooks::class)->flush();
        app(ActivityRecorder::class)->record('deleted', "Webhook: {$webhook->name}", [], 'webhook');

        return redirect()->route('sunrice.admin.commerce.settings.webhooks')->with('success', 'Webhook deleted.');
    }

    protected function form(Webhook $webhook): Response
    {
        $save = app(SaveWebhook::class);
        $description = 'Each delivery is a signed JSON POST. ';
        if ($webhook->exists) {
            $recent = $webhook->deliveries()->latest('id')->limit(10)->get()->map(fn (WebhookDelivery $d) => ($d->created_at?->isoFormat('D MMM HH:mm') ?? '')
                .": {$d->event} — ".match ($d->status) {
                    'delivered' => "delivered ({$d->response_status})", 'failed' => 'failed: '.($d->error ?? ''), default => "pending, {$d->attempts} tries".($d->error ? ': '.$d->error : ''),
                })->implode(' · ');
            $description .= "Signing secret: {$webhook->secret}".($webhook->disabled_at ? ' · Switched off after failed deliveries on '.$webhook->disabled_at->isoFormat('D MMM YYYY').'; switch it back on once the endpoint works.' : '')
                .($recent !== '' ? " · Recent deliveries: {$recent}" : ' · No deliveries yet.');
        } else {
            $description .= 'Its signing secret shows here once it is saved.';
        }
        $form = SchemaForm::make($save->fields(), $save->values($webhook))->action(
            $webhook->exists ? route('sunrice.admin.commerce.settings.webhooks.update', $webhook, false) : route('sunrice.admin.commerce.settings.webhooks.store', [], false),
            $webhook->exists ? 'put' : 'post',
        );

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => $webhook->exists ? $webhook->name : 'New webhook',
            'description' => $description,
            'form' => $form,
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Store settings', 'href' => 'commerce/settings'], ['label' => 'Webhooks', 'href' => 'commerce/settings/webhooks']],
            'deleteUrl' => $webhook->exists ? "commerce/settings/webhooks/{$webhook->id}" : null,
        ]);
    }

    protected function status(Webhook $webhook): string
    {
        return match (true) {
            $webhook->active => 'Active',
            $webhook->disabled_at !== null => 'Switched off after failures',
            default => 'Off',
        };
    }

    protected function guard(): void
    {
        $this->authorizeFeature('webhooks');
        $this->authorize('commerce.settings.webhooks');
    }
}
