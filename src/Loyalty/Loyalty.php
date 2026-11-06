<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty;

use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Loyalty\Models\LoyaltyTransaction;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;
use Sunrice\Commerce\Pricing\Contracts\ReservesDiscounts;
use Sunrice\Commerce\Promotions\TargetMatcher;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Loyalty points (the `loyalty` module): customers with an account earn a
 * share of what they buy (Settings → Loyalty: a percentage, products to
 * include or leave out, a minimum order) when an order is completed, and
 * spend the balance at checkout. 1 point is 1 unit of the store's
 * currency.
 *
 * Spending is the last stage of the calculation (after Totals): points
 * pay part or all of what is left, after tax, like store credit. PlaceOrder
 * takes them from the wallet (commit); a cancelled order gives them back
 * (release) and refunds beyond the money paid go back onto the wallet.
 */
class Loyalty implements CalculationStage, ReservesDiscounts
{
    public function __construct(protected Features $features, protected StoreSettings $settings, protected Wallet $wallet) {}

    public function run(CalculationState $state): void
    {
        $state->totals['points'] = 0;
        $user = $state->ctx->customer;
        if (! $state->ctx->usePoints || $user === null || $state->ctx->isStaff() || ! $this->features->active('loyalty')) {
            return;
        }
        $customer = Customer::query()->where('user_id', $user->getAuthIdentifier())->first(['id', 'loyalty_points']);
        $points = min((int) ($customer->loyalty_points ?? 0), $state->totals['total']);
        if ($customer === null || $points <= 0) {
            return;
        }
        $state->addAdjustment(new Adjustment('points', Adjustment::POINTS, __('commerce::storefront.cart.points_used'), $points, ['type' => 'points', 'id' => $customer->id]));
        $state->totals['points'] = $points;
        $state->totals['total'] -= $points;
    }

    /** Takes the points from the wallet, or refuses the order when the balance is short now (spent elsewhere meanwhile). */
    public function commit(Order $order, CalculationState $state): void
    {
        foreach ($state->adjustmentsOfType(Adjustment::POINTS) as $adjustment) {
            if ($this->wallet->debit((int) $adjustment->source['id'], $adjustment->amount, 'redeem', $order) !== $adjustment->amount) {
                throw new CheckoutRefused(__('commerce::checkout.errors.points'));
            }
        }
    }

    /** The order was cancelled: the points it took and that weren't refunded yet go back. Runs once per order. */
    public function release(Order $order): void
    {
        if (($left = $this->refundable($order)) > 0 && $order->customer_id !== null) {
            $this->wallet->credit($order->customer_id, $left, 'release', $order);
        }
    }

    /** Points this order paid with, given back or not. */
    public function paid(Order $order): int
    {
        return -(int) LoyaltyTransaction::query()->where('order_id', $order->id)->where('kind', 'redeem')->sum('points');
    }

    /** Points this order paid with that haven't gone back to the wallet (refunded or released). */
    public function refundable(Order $order): int
    {
        return max(0, -(int) LoyaltyTransaction::query()->where('order_id', $order->id)->whereIn('kind', ['redeem', 'release', 'refund'])->sum('points'));
    }

    /** @return int points that went back onto the wallet, at most what the order paid with */
    public function refund(Order $order, int $points, ?int $userId = null): int
    {
        $back = min($points, $this->refundable($order));
        if ($back > 0 && $order->customer_id !== null) {
            $this->wallet->credit($order->customer_id, $back, 'refund', $order, userId: $userId);
        }

        return max(0, $back);
    }

    /**
     * What an order earns: `loyalty.earn_percent` of its eligible lines after discounts, less the share
     * paid with points, for an order of at least `loyalty.min_subtotal` by a customer with an account.
     */
    public function earnable(Order $order): int
    {
        $percent = (float) $this->settings->get('loyalty.earn_percent', 0);
        if ($percent <= 0 || $order->isQuote() || $order->customer_id === null || $order->customer?->user_id === null) {
            return 0;
        }
        if ($order->subtotal - $order->discount_total < (int) $this->settings->get('loyalty.min_subtotal', 0)) {
            return 0;
        }
        $include = (array) $this->settings->get('loyalty.include', []);
        $exclude = (array) $this->settings->get('loyalty.exclude', []);
        $matcher = app(TargetMatcher::class);
        $items = $order->items()->whereNull('parent_id')->with('variant.product')->get();
        $matcher->preload($items->map(fn (OrderItem $i) => $i->variant?->product?->entry_id)->filter()->map(fn ($id) => (int) $id)->all());
        $base = 0;
        foreach ($items as $item) {
            $variant = $item->variant;
            $eligible = $variant instanceof Variant
                ? ($include === [] || $matcher->matches($include, $variant)) && ($exclude === [] || ! $matcher->matches($exclude, $variant))
                : $include === [];
            if ($eligible) {
                $base += max(0, (int) $item->total);
            }
        }
        // Points don't earn points: only the share paid otherwise.
        $paidWithPoints = $this->paid($order);
        if ($paidWithPoints > 0) {
            $base = intdiv($base * $order->total, max(1, $order->total + $paidWithPoints));
        }

        return (int) floor($base * $percent / 100);
    }

    /** Credits what a completed order earns, once. */
    public function earn(Order $order): int
    {
        if (! $this->features->active('loyalty') || $order->meta('loyalty.earned') !== null) {
            return 0;
        }
        $points = $this->earnable($order);
        $order->setMeta('loyalty.earned', $points);
        $order->save();
        if ($points > 0 && $order->customer_id !== null) {
            $this->wallet->credit($order->customer_id, $points, 'earn', $order);
        }

        return $points;
    }

    /** A refund takes back the share of the points the order earned (as far as the balance allows). */
    public function revoke(Order $order): int
    {
        $earned = (int) $order->meta('loyalty.earned', 0);
        $gross = $order->total + $this->paid($order);
        if ($earned <= 0 || $gross <= 0 || $order->customer_id === null) {
            return 0;
        }
        $refunded = $order->refunded_total + (int) LoyaltyTransaction::query()->where('order_id', $order->id)->where('kind', 'refund')->sum('points');
        $due = min($earned, intdiv($earned * $refunded, $gross));
        $done = (int) $order->meta('loyalty.revoked', 0);
        if ($due <= $done) {
            return 0;
        }
        $order->setMeta('loyalty.revoked', $due);
        $order->save();

        return $this->wallet->debit($order->customer_id, $due - $done, 'revoke', $order, all: false);
    }
}
