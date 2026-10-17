<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Listeners;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleReservations;
use Sunrice\Commerce\Promotions\Vouchers\VoucherRedemptions;

/**
 * A cancelled order gives back what it reserved: stock (less what was
 * already restocked by refunds), flash sale quantities and voucher uses,
 * and its open payments are cancelled. Each part runs once (meta flags),
 * so retries and repeated events are harmless.
 */
class ReleaseReservations
{
    public function handle(OrderCancelled $event): void
    {
        $this->release($event->order);
    }

    public function release(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            /** @var Order $locked */
            $locked = Order::withTrashed()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            if ($locked->meta('reserved.stock') && ! $locked->meta('released.stock')) {
                $lines = [];
                foreach ($locked->items()->whereNull('parent_id')->get() as $item) {
                    $variant = $item->variant_id === null ? null : Variant::withTrashed()->with('product')->find($item->variant_id);
                    $qty = $item->quantity - (int) ($item->meta['restocked'] ?? 0);
                    if ($variant !== null && $qty > 0) {
                        $lines[] = [$variant, $qty];
                    }
                }
                app(Inventory::class)->release($lines, $locked, 'cancel');
                $locked->setMeta('released.stock', true);
            }
            if (($flash = $locked->meta('reserved.flash')) && ! $locked->meta('released.flash')) {
                foreach ((array) $flash as $itemId => $qty) {
                    app(FlashSaleReservations::class)->release((int) $itemId, (int) $qty);
                }
                $locked->setMeta('released.flash', true);
            }
            if ($locked->meta('reserved.vouchers') && ! $locked->meta('released.vouchers')) {
                app(VoucherRedemptions::class)->release($locked->id);
                $locked->setMeta('released.vouchers', true);
            }
            $locked->save();
        });

        foreach ($order->payments()->whereIn('status', ['pending', 'failed'])->get() as $payment) {
            app(RecordPaymentResult::class)->handle($payment, PaymentResult::cancelled(), Actor::system());
        }
    }
}
