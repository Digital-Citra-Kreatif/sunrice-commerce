<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Sunrice\Commerce\Pricing\PricingContext;

/** How often a voucher was used, overall and by a customer (redemptions not released). */
class VoucherUsage
{
    public function byCustomer(Voucher $voucher, PricingContext $ctx): int
    {
        if ($ctx->customerId() === null && $ctx->email === null && $ctx->phone === null) {
            return 0;
        }

        return VoucherRedemption::query()->where('voucher_id', $voucher->id)->whereNull('released_at')
            ->where(fn ($q) => $q
                ->when($ctx->customerId() !== null, fn ($w) => $w->orWhere('customer_id', $ctx->customerId()))
                ->when($ctx->email !== null, fn ($w) => $w->orWhere('email', mb_strtolower((string) $ctx->email)))
                ->when($ctx->phone !== null, fn ($w) => $w->orWhere('phone', $ctx->phone)))
            ->count();
    }

    /** Whether the customer has ordered before (for first-order vouchers). */
    public function hasOrdered(PricingContext $ctx): bool
    {
        if (! Schema::hasTable('commerce_orders') || ($ctx->customerId() === null && $ctx->email === null)) {
            return false;
        }

        return DB::table('commerce_orders')->whereNotIn('status', ['cancelled', 'expired'])->where('type', 'order')
            ->where(fn ($q) => $q
                ->when($ctx->customerId() !== null, fn ($w) => $w->orWhere('customer_id', $ctx->customerId()))
                ->when($ctx->email !== null, fn ($w) => $w->orWhere('email', mb_strtolower((string) $ctx->email))))
            ->exists();
    }
}
