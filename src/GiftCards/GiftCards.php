<?php

declare(strict_types=1);

namespace Sunrice\Commerce\GiftCards;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\GiftCards\Models\GiftCard;
use Sunrice\Commerce\GiftCards\Models\GiftCardTransaction;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;
use Sunrice\Commerce\Pricing\Contracts\ReservesDiscounts;

/**
 * Gift cards at checkout: the last stage of the calculation (after
 * Totals), so a card pays part or all of the total like store credit:
 * after tax, not a discount on prices. A card's code goes in the same box
 * as vouchers. Each card gives at most its balance and at most what is
 * left to pay, in the order the codes were entered. PlaceOrder takes the
 * amounts from the cards (commit) in its transaction; a cancelled order
 * gives them back (release).
 */
class GiftCards implements CalculationStage, ReservesDiscounts
{
    public function __construct(protected Features $features) {}

    /**
     * The gift card codes among these (uppercase) codes, in one query.
     *
     * @param  array<int, string>  $codes
     * @return array<int, string>
     */
    public static function codesIn(array $codes): array
    {
        if ($codes === [] || ! commerce_feature('gift_cards')) {
            return [];
        }

        return GiftCard::query()->whereIn('code', $codes)->pluck('code')->all();
    }

    public function run(CalculationState $state): void
    {
        $state->totals['gift_card'] = 0;
        // Staff pricing (manual orders, edits, quotes) takes no codes; storefront carts do.
        if ($state->codes === [] || $state->ctx->isStaff() || ! $this->features->active('gift_cards')) {
            return;
        }
        $cards = GiftCard::query()->whereIn('code', $state->codes)->get()->keyBy('code');
        foreach ($state->codes as $code) {
            $card = $cards->get($code);
            if ($card === null) {
                continue;
            }
            $left = $state->totals['total'];
            if (! $card->usable() || $card->balance <= 0) {
                $state->notice('gift_card_empty', __('commerce::validation.gift_card.unusable', ['code' => $card->masked()]), voucher: $code);

                continue;
            }
            if ($left <= 0) {
                $state->notice('gift_card_not_needed', __('commerce::validation.gift_card.not_needed'), voucher: $code);

                continue;
            }
            $amount = min($card->balance, $left);
            $state->addAdjustment(new Adjustment("gift_card:{$card->id}", Adjustment::GIFT_CARD,
                __('commerce::storefront.cart.gift_card', ['code' => $card->masked()]), $amount, ['type' => 'gift_card', 'id' => $card->id, 'code' => $code]));
            $state->appliedCodes[] = $code;
            $state->totals['gift_card'] += $amount;
            $state->totals['total'] -= $amount;
        }
    }

    /** Takes each card's amount, or refuses the order when a card can't give it any more (spent or switched off meanwhile). */
    public function commit(Order $order, CalculationState $state): void
    {
        foreach ($state->adjustmentsOfType(Adjustment::GIFT_CARD) as $adjustment) {
            $id = (int) $adjustment->source['id'];
            $taken = DB::table('commerce_gift_cards')->where('id', $id)->where('balance', '>=', $adjustment->amount)->whereNull('disabled_at')
                ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
                ->update(['balance' => DB::raw('balance - '.(int) $adjustment->amount), 'updated_at' => now()]) === 1;
            if (! $taken) {
                throw new CheckoutRefused(__('commerce::checkout.errors.gift_card'));
            }
            GiftCardTransaction::query()->create(['gift_card_id' => $id, 'order_id' => $order->id, 'kind' => 'redeem', 'amount' => -$adjustment->amount]);
        }
    }

    /** The order was cancelled: what it took goes back on each card. Runs once per order (ReleaseReservations). */
    public function release(Order $order): void
    {
        $taken = GiftCardTransaction::query()->where('order_id', $order->id)->where('kind', 'redeem')->get();
        foreach ($taken as $redeemed) {
            DB::table('commerce_gift_cards')->where('id', $redeemed->gift_card_id)
                ->update(['balance' => DB::raw('balance + '.(int) -$redeemed->amount), 'updated_at' => now()]);
            GiftCardTransaction::query()->create(['gift_card_id' => $redeemed->gift_card_id, 'order_id' => $order->id, 'kind' => 'release', 'amount' => -$redeemed->amount]);
        }
    }
}
