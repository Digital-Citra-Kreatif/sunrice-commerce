<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Dashboard;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * The dashboard's own to-dos (SPEC.md): payments to verify, orders to
 * ship, quotes to answer and low stock — each behind its module and
 * permission, linking to the filtered list.
 */
final class BuiltinTodos
{
    public static function register(DashboardCards $cards): void
    {
        $active = fn (string $feature): bool => app(Features::class)->active($feature);

        $cards->addTodo('confirmations', fn (mixed $user) => $active('manual_payments') && $user->can('commerce.payments.verify') ? [
            'label' => 'Payment confirmations to verify',
            'count' => DB::table('commerce_payment_confirmations')->where('status', 'submitted')->count(),
            'href' => 'commerce/confirmations',
        ] : null);

        $cards->addTodo('to_ship', fn (mixed $user) => $active('orders') && $user->can('commerce.orders.view') ? [
            'label' => 'Orders to ship',
            'count' => DB::table('commerce_orders')->where('type', 'order')->whereNull('deleted_at')->where('status', OrderStatus::PROCESSING)
                ->whereIn('fulfillment_status', [OrderStatus::UNFULFILLED, OrderStatus::PARTIALLY_SHIPPED])->count(),
            'href' => 'commerce/orders?filters[status]=processing&filters[fulfillment]=unfulfilled',
        ] : null);

        $cards->addTodo('quotes', fn (mixed $user) => $active('orders') && $user->can('commerce.quotes.respond') ? [
            'label' => 'Quote requests to answer',
            'count' => DB::table('commerce_orders')->where('type', 'quote')->whereNull('deleted_at')->where('status', OrderStatus::REQUESTED)->count(),
            'href' => 'commerce/orders?filters[type]=quote&filters[status]=requested',
        ] : null);

        $cards->addTodo('low_stock', function (mixed $user) use ($active) {
            if (! $active('inventory') || ! $user->can('commerce.inventory.view')) {
                return null;
            }
            $threshold = (int) app(StoreSettings::class)->get('catalog.low_stock_threshold', 5);

            return [
                'label' => 'Variants low on stock',
                'count' => DB::table('commerce_variants')->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')
                    ->whereNull('commerce_variants.deleted_at')->whereNull('commerce_products.removed_at')->where('commerce_variants.active', true)
                    ->where('commerce_variants.track_stock', true)
                    ->whereRaw('commerce_variants.stock_quantity <= COALESCE(commerce_variants.low_stock_threshold, ?)', [$threshold])->count(),
                'href' => 'commerce/inventory?filters[stock]=low',
            ];
        });
    }
}
