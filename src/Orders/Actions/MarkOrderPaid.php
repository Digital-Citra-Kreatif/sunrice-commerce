<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Carbon;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Support\DomainException;

/**
 * Staff mark an order paid without a confirmation (a transfer seen in the
 * bank app, cash on delivery collected): the open payment, or a new
 * manual one, is recorded paid with the reference, date and account.
 */
class MarkOrderPaid
{
    public function __construct(protected RecordPaymentResult $record) {}

    /** @throws DomainException */
    public function handle(Order $order, Actor $actor, ?string $reference = null, ?Carbon $paidAt = null, ?string $account = null): Payment
    {
        if ($order->isQuote() || ! $order->isUnpaid() || $order->total <= 0) {
            throw new DomainException('This order has nothing left to pay.');
        }
        $payment = $order->payments()->whereIn('status', ['pending', 'awaiting_confirmation', 'failed', 'expired'])->latest('id')->first()
            ?? Payment::query()->create([
                'order_id' => $order->id, 'method' => $order->payment_method ?? 'manual', 'method_title' => $order->payment_method_title ?? 'Manual payment',
                'amount' => $order->total - $order->paid_total, 'currency' => $order->currency, 'status' => 'pending',
            ]);
        if ($account !== null) {
            $payment->forceFill(['meta' => [...(array) $payment->meta, 'account' => $account]])->save();
        }
        $this->record->handle($payment, PaymentResult::paid($payment->amount, $reference, $paidAt), $actor);

        return $payment->refresh();
    }
}
