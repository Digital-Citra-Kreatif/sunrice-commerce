<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Admin\Tables\Column;
use Sunrice\Commerce\Admin\Tables\TableQuery;
use Sunrice\Commerce\Loyalty\GiftCards;
use Sunrice\Commerce\Loyalty\Models\GiftCard;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * Shop → Promotions → Gift cards: the codes customers redeem for loyalty
 * points (bought with a gift card product, or made here), and whether
 * they were. A code not redeemed yet can be disabled.
 */
class GiftCardsController extends Controller
{
    public function index(Request $request, MoneyFormatter $money): Response
    {
        $this->guard();
        $table = TableQuery::for(GiftCard::query()->with(['redeemer', 'order']))->searchable(['code', 'note'])
            ->filter('status', fn ($q, $v) => $q->where('status', $v))
            ->sortable(['code', 'value', 'created_at', 'redeemed_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->latest('id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Gift cards',
            'description' => 'Codes customers redeem for loyalty points in My Account → Points: bought with a gift card product, or made here.',
            'createUrl' => 'commerce/gift-cards/create',
            'createLabel' => 'New gift cards',
            ...$this->tableProps('commerce-gift-cards', $table, [
                new Column('code', 'Code', sortable: true),
                new Column('value', 'Value', sortable: true),
                new Column('source', 'From'),
                new Column('redeemed_by', 'Redeemed by'),
                new Column('created_at', 'Made', sortable: true),
                new Column('status', 'Status', type: 'badge'),
            ], $rows->through(fn (Model $c) => $c instanceof GiftCard ? [
                'id' => $c->id,
                'href' => "commerce/gift-cards/{$c->id}",
                'code' => $c->formatted(),
                'value' => $money->format($c->value),
                'source' => $c->order !== null ? 'Order '.$c->order->displayNumber() : ($c->note ?: 'Made by staff'),
                'redeemed_by' => $c->redeemer !== null ? trim(($c->redeemer->name ?? '').' '.($c->redeemer->email ? "({$c->redeemer->email})" : '')) : null,
                'created_at' => $c->created_at?->isoFormat('D MMM YYYY'),
                'status' => $status = match (true) {
                    $c->status === GiftCard::REDEEMED => 'Redeemed', $c->status === GiftCard::DISABLED => 'Disabled',
                    ! $c->redeemable() => 'Expired', default => 'Active',
                },
                'status_tone' => ['Active' => 'ok', 'Redeemed' => 'info', 'Expired' => 'warning'][$status] ?? 'neutral',
            ] : []), [[
                'key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => [
                    ['value' => GiftCard::ACTIVE, 'label' => 'Active'], ['value' => GiftCard::REDEEMED, 'label' => 'Redeemed'], ['value' => GiftCard::DISABLED, 'label' => 'Disabled'],
                ],
            ]], []),
        ]);
    }

    public function create(): Response
    {
        $this->guard();

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => 'New gift cards',
            'description' => 'Codes you give away (prizes, apologies, partners). Customers redeem each once for points worth its value.',
            'form' => SchemaForm::make($this->createFields(), ['quantity' => 1])->action(route('sunrice.admin.commerce.gift-cards.store', [], false), 'post')->submitLabel('Make codes'),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Gift cards', 'href' => 'commerce/gift-cards']],
        ]);
    }

    public function store(Request $request, GiftCards $cards): RedirectResponse
    {
        $this->guard();
        $values = SchemaForm::make($this->createFields())->validate((array) $request->input('values', []));
        $quantity = max(1, min(100, (int) $values['quantity']));
        $expires = filled($values['expires_at'] ?? null) ? Carbon::parse((string) $values['expires_at'])->endOfDay() : null;
        $made = [];
        for ($i = 0; $i < $quantity; $i++) {
            $made[] = $cards->make((int) $values['value'], note: $values['note'] ?? null, userId: (int) $request->user()->getAuthIdentifier(), expiresAt: $expires);
        }
        app(ActivityRecorder::class)->record('created', "Gift cards: {$quantity}", [], 'gift_card');

        return redirect()->route('sunrice.admin.commerce.gift-cards')
            ->with('success', $quantity === 1 ? 'Gift card made: '.$made[0]->formatted() : "{$quantity} gift cards made.");
    }

    public function show(GiftCard $giftCard, MoneyFormatter $money): Response
    {
        $this->guard();
        $giftCard->load('redeemer', 'order');
        // A redeemed code can't be switched off: its points are the customer's.
        $switchable = $giftCard->status !== GiftCard::REDEEMED;

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => $giftCard->formatted(),
            'description' => implode(' · ', array_filter([
                $money->format($giftCard->value),
                $giftCard->order !== null ? 'Bought with order '.$giftCard->order->displayNumber() : null,
                $giftCard->recipient_email !== null ? 'For '.($giftCard->recipient_name ? "{$giftCard->recipient_name} ({$giftCard->recipient_email})" : $giftCard->recipient_email)
                    .($giftCard->sent_at !== null ? ', emailed '.$giftCard->sent_at->isoFormat('D MMM YYYY HH:mm') : ', not emailed yet') : null,
                $giftCard->redeemed_at !== null ? 'Redeemed '.$giftCard->redeemed_at->isoFormat('D MMM YYYY').($giftCard->redeemer ? ' by '.($giftCard->redeemer->email ?? $giftCard->redeemer->name) : '') : null,
                $giftCard->expires_at !== null ? 'Redeem by '.$giftCard->expires_at->isoFormat('D MMM YYYY') : null,
            ])),
            'form' => SchemaForm::make($this->editFields($switchable, $giftCard->recipient_email !== null && $giftCard->redeemable()), ['note' => $giftCard->note, 'disabled' => $giftCard->status === GiftCard::DISABLED])
                ->action(route('sunrice.admin.commerce.gift-cards.update', $giftCard, false), 'put'),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Gift cards', 'href' => 'commerce/gift-cards']],
        ]);
    }

    public function update(Request $request, GiftCard $giftCard, GiftCards $cards): RedirectResponse
    {
        $this->guard();
        $values = SchemaForm::make($this->editFields(true, true))->validate((array) $request->input('values', []));
        $changes = ['note' => $values['note'] ?? null];
        // A redeemed card stays redeemed: its points are the customer's.
        if ($giftCard->status !== GiftCard::REDEEMED) {
            $changes['status'] = ($values['disabled'] ?? false) ? GiftCard::DISABLED : GiftCard::ACTIVE;
        }
        $giftCard->forceFill($changes)->save();
        app(ActivityRecorder::class)->record('updated', 'Gift card: '.$giftCard->formatted(), [], 'gift_card');
        $resent = ($values['resend'] ?? false) && $cards->send($giftCard->fresh() ?? $giftCard);

        return redirect()->route('sunrice.admin.commerce.gift-cards.show', $giftCard)
            ->with('success', $resent ? 'Gift card saved and emailed to '.$giftCard->recipient_email.'.' : 'Gift card saved.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('loyalty');
        $this->authorize('commerce.gift-cards.manage');
    }

    /** @return array<int, array<string, mixed>> */
    protected function createFields(): array
    {
        return [
            ['handle' => 'value', 'type' => 'commerce_money', 'label' => 'Value', 'required' => true, 'width' => 50, 'config' => ['min' => 1, 'allow_null' => false],
                'instructions' => 'Points added when redeemed (1 point is 1 of your currency).'],
            ['handle' => 'quantity', 'type' => 'number', 'label' => 'How many codes', 'required' => true, 'width' => 50, 'config' => ['min' => 1, 'max' => 100], 'validation' => ['integer', 'min:1', 'max:100']],
            ['handle' => 'expires_at', 'type' => 'date', 'label' => 'Redeem by', 'width' => 50, 'instructions' => 'Empty: Settings → Loyalty decides.', 'validation' => ['nullable', 'date', 'after_or_equal:today']],
            ['handle' => 'note', 'type' => 'text', 'label' => 'Note', 'translatable' => false, 'width' => 50, 'config' => ['max' => 500], 'instructions' => 'For you: who it is for, why.'],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected function editFields(bool $switchable, bool $resendable): array
    {
        return [
            ...($switchable ? [['handle' => 'disabled', 'type' => 'toggle', 'label' => 'Disabled', 'instructions' => 'A disabled code can\'t be redeemed.']] : []),
            ...($resendable ? [['handle' => 'resend', 'type' => 'toggle', 'label' => 'Email it to the recipient again', 'instructions' => 'When you save: the code, the buyer\'s name and message.']] : []),
            ['handle' => 'note', 'type' => 'text', 'label' => 'Note', 'translatable' => false, 'config' => ['max' => 500]],
        ];
    }
}
