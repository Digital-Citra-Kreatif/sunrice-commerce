<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Sunrice\Commerce\Pricing\PricingContext;

/**
 * Units a customer already bought at a flash sale item's price: order
 * items with that item in their price source, for the customer's id, or
 * for a guest's email or phone, excluding cancelled orders.
 */
class CustomerPurchases
{
    public function count(FlashSaleItem $item, PricingContext $ctx): int
    {
        if (! Schema::hasTable('commerce_order_items') || ($ctx->customerId() === null && $ctx->email === null && $ctx->phone === null)) {
            return 0;
        }

        return (int) DB::table('commerce_order_items as i')
            ->join('commerce_orders as o', 'o.id', '=', 'i.order_id')
            ->where('i.flash_sale_item_id', $item->id)
            ->whereNotIn('o.status', ['cancelled', 'expired'])
            ->where(fn ($q) => $q
                ->when($ctx->customerId() !== null, fn ($w) => $w->orWhere('o.customer_id', $ctx->customerId()))
                ->when($ctx->email !== null, fn ($w) => $w->orWhere('o.email', mb_strtolower((string) $ctx->email)))
                ->when($ctx->phone !== null, fn ($w) => $w->orWhere('o.phone', $ctx->phone)))
            ->sum('i.quantity');
    }
}
