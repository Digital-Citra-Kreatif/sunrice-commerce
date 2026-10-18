<?php

declare(strict_types=1);

namespace Workbench\App\Commerce;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Feature;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderRefunded;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\DiscountProvider;
use Sunrice\Commerce\Pricing\Contracts\ReservesDiscounts;

/**
 * A loyalty extension for tests, using every extension point a real one
 * would: a feature, a discount provider that reserves points when the
 * order is placed and gives them back when it is cancelled, listeners
 * that earn points when an order is paid and take them back on refunds and
 * cancellations, a My Account page, a checkout slot and a dashboard widget.
 * One point is worth Rp100; customers earn one point per Rp1.000 paid.
 */
class FakeLoyalty implements DiscountProvider, ReservesDiscounts
{
    public const POINT_VALUE = 100;

    public const EARN_PER = 1000;

    /** What the extension's service provider would do. */
    public static function register(): void
    {
        $commerce = app(Commerce::class);
        $commerce->registerFeature(new Feature('loyalty', 'promotions', 'Loyalty points', 'Customers earn points on paid orders and spend them at checkout.', ['accounts']));
        $commerce->registerDiscountProvider(self::class);
        $commerce->registerAccountPage('points', 'Points', 'loyalty.points', 'loyalty');
        $commerce->registerStorefrontSlot('checkout.after_payment', 'loyalty::checkout', 'loyalty');
        $commerce->registerDashboardWidget('loyalty-points', fn () => [
            'issued' => (int) DB::table('loyalty_ledger')->where('reason', 'earn')->sum('points'),
            'redeemed' => (int) -DB::table('loyalty_ledger')->where('reason', 'redeem')->sum('points'),
        ], 'commerce.dashboard.view', 'loyalty');

        Event::listen(OrderPaid::class, fn (OrderPaid $e) => self::earn($e->order));
        Event::listen(OrderRefunded::class, fn (OrderRefunded $e) => self::reverse($e->order, intdiv($e->refund->amount, self::EARN_PER)));
        Event::listen(OrderCancelled::class, fn (OrderCancelled $e) => self::reverse($e->order, PHP_INT_MAX));

        View::addNamespace('loyalty', dirname(__DIR__, 2).'/resources/views/loyalty');
        Route::middleware(['web', 'commerce.auth'])->group(function (): void {
            Route::get('account/points', fn () => view('loyalty::points', ['balance' => self::balance((int) app(Commerce::class)->customer()?->id)]))->name('loyalty.points');
            Route::post('loyalty/use', function (): RedirectResponse {
                $customer = app(Commerce::class)->customer();
                $customer?->forceFill(['meta' => [...(array) $customer->meta, 'loyalty_use' => request()->boolean('use')]])->save();

                return back();
            })->name('loyalty.use');
        });
    }

    public static function balance(int $customerId): int
    {
        return (int) DB::table('loyalty_ledger')->where('customer_id', $customerId)->sum('points');
    }

    public function priority(): int
    {
        return 100; // after vouchers
    }

    public function apply(CalculationState $state): void
    {
        $customer = self::customerOf($state);
        if ($customer === null || ! app(Features::class)->active('loyalty') || ! (($customer->meta['loyalty_use'] ?? false))) {
            return;
        }
        $left = self::balance($customer->id) * self::POINT_VALUE;
        $allocations = [];
        foreach ($state->lines as $key => $line) {
            $take = min($left, max(0, $line->net()));
            if ($take > 0) {
                $allocations[$key] = $take;
                $left -= $take;
            }
        }
        $amount = array_sum($allocations);
        if ($amount > 0) {
            $state->addAdjustment(new Adjustment('loyalty', Adjustment::DISCOUNT, 'Points', $amount, ['type' => 'loyalty'], $allocations,
                ['points' => (int) ceil($amount / self::POINT_VALUE)]));
        }
    }

    public function commit(Order $order, CalculationState $state): void
    {
        foreach ($state->adjustments as $adjustment) {
            if ($adjustment->source['type'] !== 'loyalty' || $order->customer_id === null) {
                continue;
            }
            $points = (int) $adjustment->meta['points'];
            if (self::balance($order->customer_id) < $points) {
                throw new CheckoutRefused('You no longer have enough points.');
            }
            DB::table('loyalty_ledger')->insert(['customer_id' => $order->customer_id, 'order_id' => $order->id, 'points' => -$points, 'reason' => 'redeem', 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    public function release(Order $order): void
    {
        $redeemed = (int) -DB::table('loyalty_ledger')->where('order_id', $order->id)->where('reason', 'redeem')->sum('points');
        if ($redeemed > 0 && $order->customer_id !== null) {
            DB::table('loyalty_ledger')->insert(['customer_id' => $order->customer_id, 'order_id' => $order->id, 'points' => $redeemed, 'reason' => 'release', 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    public static function earn(Order $order): void
    {
        if ($order->customer_id === null || ! app(Features::class)->active('loyalty')
            || DB::table('loyalty_ledger')->where('order_id', $order->id)->where('reason', 'earn')->exists()) {
            return;
        }
        $points = intdiv($order->total, self::EARN_PER);
        if ($points > 0) {
            DB::table('loyalty_ledger')->insert(['customer_id' => $order->customer_id, 'order_id' => $order->id, 'points' => $points, 'reason' => 'earn', 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    /** Takes back up to $points of what the order earned. */
    public static function reverse(Order $order, int $points): void
    {
        $earned = (int) DB::table('loyalty_ledger')->where('order_id', $order->id)->where('reason', 'earn')->sum('points');
        $reversed = (int) -DB::table('loyalty_ledger')->where('order_id', $order->id)->where('reason', 'reverse')->sum('points');
        $points = min($points, $earned - $reversed);
        if ($points > 0 && $order->customer_id !== null) {
            DB::table('loyalty_ledger')->insert(['customer_id' => $order->customer_id, 'order_id' => $order->id, 'points' => -$points, 'reason' => 'reverse', 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    protected static function customerOf(CalculationState $state): ?Customer
    {
        $userId = $state->ctx->customerId();

        return $userId === null ? null : Customer::query()->where('user_id', $userId)->first();
    }
}
