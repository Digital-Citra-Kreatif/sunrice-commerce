<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Support\DomainException;

/**
 * Trash (soft delete) and restore orders; deleting for good is refused
 * for orders that received a payment, so the books stay complete.
 */
class TrashOrder
{
    public function trash(Order $order): void
    {
        $order->delete();
        app(ActivityRecorder::class)->record('deleted', $order->displayNumber(), [], 'order');
    }

    public function restore(Order $order): void
    {
        $order->restore();
        app(ActivityRecorder::class)->record('restored', $order->displayNumber(), [], 'order');
    }

    public function canForceDelete(Order $order): bool
    {
        return $order->paid_total === 0 && $order->payments()->whereIn('status', ['paid', 'refunded', 'partially_refunded'])->doesntExist();
    }

    /** @throws DomainException */
    public function forceDelete(Order $order): void
    {
        if (! $this->canForceDelete($order)) {
            throw new DomainException('Orders that received a payment can\'t be deleted for good.');
        }
        DB::transaction(function () use ($order): void {
            foreach (['commerce_order_adjustments', 'commerce_order_events', 'commerce_payment_confirmations', 'commerce_payments', 'commerce_refunds', 'commerce_shipments', 'commerce_documents'] as $table) {
                DB::table($table)->where('order_id', $order->id)->delete();
            }
            DB::table('commerce_order_items')->where('order_id', $order->id)->whereNotNull('parent_id')->delete();
            DB::table('commerce_order_items')->where('order_id', $order->id)->delete();
            $order->forceDelete();
        });
        app(ActivityRecorder::class)->record('deleted', $order->displayNumber(), ['note' => 'Deleted for good'], 'order');
    }
}
