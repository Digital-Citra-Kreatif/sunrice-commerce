<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Admin\Tables\Column;
use Sunrice\Commerce\Admin\Tables\TableQuery;
use Sunrice\Commerce\GiftCards\Actions\IssueGiftCard;
use Sunrice\Commerce\GiftCards\Actions\UpdateGiftCard;
use Sunrice\Commerce\GiftCards\Models\GiftCard;
use Sunrice\Commerce\GiftCards\Models\GiftCardTransaction;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Support\MoneyFormatter;

/** Shop → Promotions → Gift cards: issue cards, see their balance and history, switch them off. */
class GiftCardsController extends Controller
{
    public function index(Request $request, MoneyFormatter $money): Response
    {
        $this->guard();
        $table = TableQuery::for(GiftCard::query())->searchable(['code', 'recipient_email'])
            ->filter('status', fn ($q, $v) => match ($v) {
                'active' => $q->whereNull('disabled_at')->where('balance', '>', 0)->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now())),
                'used' => $q->where('balance', 0),
                'off' => $q->whereNotNull('disabled_at')->orWhere('expires_at', '<=', now()),
                default => $q,
            })
            ->sortable(['code', 'balance', 'created_at', 'expires_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->latest('id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Gift cards',
            'description' => 'Codes with a balance that pay part or all of an order at checkout, after tax.',
            'createUrl' => 'commerce/gift-cards/create',
            ...$this->tableProps('commerce-gift-cards', $table, [
                new Column('code', 'Code', sortable: true),
                new Column('balance', 'Balance', sortable: true),
                new Column('initial', 'Issued for'),
                new Column('recipient', 'Recipient'),
                new Column('status', 'Status', type: 'badge'),
                new Column('expires_at', 'Expires', sortable: true),
            ], $rows->through(fn (Model $c) => $c instanceof GiftCard ? [
                'id' => $c->id,
                'href' => "commerce/gift-cards/{$c->id}/edit",
                'code' => $c->code,
                'balance' => $money->format($c->balance),
                'initial' => $money->format($c->initial_amount),
                'recipient' => $c->recipient_email,
                'status' => self::status($c),
                'status_tone' => match (self::status($c)) {
                    'Active' => 'ok', 'Used' => 'neutral', default => 'warning'
                },
                'expires_at' => $c->expires_at?->isoFormat('D MMM YYYY'),
            ] : []), [
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => [['value' => 'active', 'label' => 'Active'], ['value' => 'used', 'label' => 'Used'], ['value' => 'off', 'label' => 'Switched off or expired']]],
            ]),
        ]);
    }

    public function create(): Response
    {
        $this->guard();

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => 'New gift card',
            'description' => 'The code is emailed to the recipient, when given.',
            'form' => SchemaForm::make([
                ['handle' => 'amount', 'type' => 'commerce_money', 'label' => 'Amount', 'required' => true],
                ['handle' => 'code', 'type' => 'text', 'label' => 'Code', 'translatable' => false, 'instructions' => 'Empty: one is made up (like ABCD-EFGH-JKMN-PQRS).', 'validation' => ['regex:/^[A-Za-z0-9-]*$/', 'min:6', 'max:32']],
                ['handle' => 'recipient_email', 'type' => 'text', 'label' => 'Recipient email', 'translatable' => false, 'validation' => ['email', 'max:255']],
                ['handle' => 'expires_at', 'type' => 'date', 'label' => 'Expires', 'instructions' => 'Empty: never.'],
                ['handle' => 'note', 'type' => 'textarea', 'label' => 'Note', 'instructions' => 'For staff only.', 'validation' => ['max:2000']],
            ], [])->action(route('sunrice.admin.commerce.gift-cards.store', [], false), 'post'),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Gift cards', 'href' => 'commerce/gift-cards']],
        ]);
    }

    public function store(Request $request, IssueGiftCard $issue): RedirectResponse
    {
        $this->guard();
        $data = $request->validate([
            'values.amount' => ['required', 'integer', 'min:1', 'max:100000000000000'],
            'values.code' => ['nullable', 'string', 'min:6', 'max:32', 'regex:/^[A-Za-z0-9-]+$/', Rule::unique('commerce_gift_cards', 'code')],
            'values.recipient_email' => ['nullable', 'email', 'max:255'],
            'values.expires_at' => ['nullable', 'date', 'after:today'],
            'values.note' => ['nullable', 'string', 'max:2000'],
        ]);
        $v = $data['values'];
        $card = $issue->handle((int) $v['amount'], filled($v['code'] ?? null) ? mb_strtoupper((string) $v['code']) : null,
            filled($v['expires_at'] ?? null) ? Carbon::parse((string) $v['expires_at'])->endOfDay() : null,
            $v['recipient_email'] ?? null, $v['note'] ?? null, (int) $request->user()->getAuthIdentifier());
        app(ActivityRecorder::class)->record('created', 'Gift card '.$card->code, [], 'gift_card');

        return redirect()->route('sunrice.admin.commerce.gift-cards.edit', $card)->with('success', 'Gift card issued.');
    }

    public function edit(GiftCard $card, MoneyFormatter $money): Response
    {
        $this->guard();
        $history = $card->transactions()->with('order')->latest('id')->limit(50)->get()
            ->map(fn (GiftCardTransaction $t) => ($t->created_at?->isoFormat('D MMM YYYY') ?? '').': '.ucfirst($t->kind).' '.$money->format($t->amount)
                .($t->order !== null ? ' ('.$t->order->displayNumber().')' : ''))->implode(' · ');

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => "Gift card {$card->code}",
            'description' => 'Balance '.$money->format($card->balance).' of '.$money->format($card->initial_amount)
                .($card->recipient_email ? ' · for '.$card->recipient_email : '').($history !== '' ? ' · '.$history : ''),
            'form' => SchemaForm::make([
                ['handle' => 'disabled', 'type' => 'toggle', 'label' => 'Switched off', 'instructions' => 'It can\'t be used while off; orders already placed keep what they took.'],
                ['handle' => 'expires_at', 'type' => 'date', 'label' => 'Expires', 'instructions' => 'Empty: never.'],
                ['handle' => 'adjust', 'type' => 'commerce_money', 'label' => 'Add to the balance', 'instructions' => 'Negative to take away.'],
                ['handle' => 'note', 'type' => 'textarea', 'label' => 'Note', 'instructions' => 'For staff only.', 'validation' => ['max:2000']],
            ], ['disabled' => $card->disabled_at !== null, 'expires_at' => $card->expires_at?->toDateString(), 'adjust' => null, 'note' => $card->note])
                ->action(route('sunrice.admin.commerce.gift-cards.update', $card, false), 'put'),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Gift cards', 'href' => 'commerce/gift-cards']],
        ]);
    }

    public function update(Request $request, GiftCard $card, UpdateGiftCard $update): RedirectResponse
    {
        $this->guard();
        $data = $request->validate([
            'values.disabled' => ['boolean'],
            'values.expires_at' => ['nullable', 'date'],
            'values.adjust' => ['nullable', 'integer', 'min:-100000000000000', 'max:100000000000000'],
            'values.note' => ['nullable', 'string', 'max:2000'],
        ]);
        $v = $data['values'] ?? [];
        $update->handle($card, (bool) ($v['disabled'] ?? false), filled($v['expires_at'] ?? null) ? Carbon::parse((string) $v['expires_at'])->endOfDay() : null,
            $v['note'] ?? null, (int) ($v['adjust'] ?? 0), (int) $request->user()->getAuthIdentifier());
        app(ActivityRecorder::class)->record('updated', 'Gift card '.$card->code, [], 'gift_card');

        return back()->with('success', 'Gift card saved.');
    }

    protected static function status(GiftCard $card): string
    {
        return match (true) {
            $card->disabled_at !== null => 'Switched off',
            $card->expires_at !== null && $card->expires_at->isPast() => 'Expired',
            $card->balance <= 0 => 'Used',
            default => 'Active',
        };
    }

    protected function guard(): void
    {
        $this->authorizeFeature('gift_cards');
        $this->authorize('commerce.gift_cards.manage');
    }
}
