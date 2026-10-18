<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Pricing\PricingContext;

/**
 * Counts voucher use when an order is placed (inside its transaction):
 * an atomic increment under the global limit, the per-customer limit
 * re-checked under the lock, and a redemption row. Released on
 * cancellation or expiry.
 */
class VoucherRedemptions
{
    public function __construct(protected VoucherUsage $usage) {}

    /** False when a limit was reached meanwhile (nothing counted). */
    public function redeem(Voucher $voucher, int $orderId, int $amount, PricingContext $ctx): bool
    {
        $locked = Voucher::query()->whereKey($voucher->id)->lockForUpdate()->first();
        if ($locked === null) {
            return false;
        }
        if ($voucher->usage_limit_per_customer !== null && $this->usage->byCustomer($locked, $ctx) >= $voucher->usage_limit_per_customer) {
            return false;
        }
        $counted = DB::table('commerce_vouchers')->where('id', $voucher->id)
            ->where(fn ($q) => $q->whereNull('usage_limit')->orWhereColumn('times_used', '<', 'usage_limit'))
            ->increment('times_used');
        if ($counted !== 1) {
            return false;
        }
        VoucherRedemption::query()->create([
            'voucher_id' => $voucher->id, 'order_id' => $orderId, 'customer_id' => $ctx->customerId(),
            'email' => $ctx->email !== null ? mb_strtolower($ctx->email) : null, 'phone' => $ctx->phone,
            'code' => $voucher->code, 'amount' => $amount,
        ]);

        return true;
    }

    /** Give back an order's vouchers (idempotent). */
    public function release(int $orderId): void
    {
        DB::transaction(function () use ($orderId): void {
            $redemptions = VoucherRedemption::query()->where('order_id', $orderId)->whereNull('released_at')->lockForUpdate()->get();
            foreach ($redemptions as $redemption) {
                $redemption->forceFill(['released_at' => now()])->save();
                DB::table('commerce_vouchers')->where('id', $redemption->voucher_id)->where('times_used', '>', 0)->decrement('times_used');
            }
        });
    }
}
