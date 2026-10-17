<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

use Illuminate\Events\Dispatcher;
use Sunrice\Commerce\Customers\Events\AccountDeletionRequested;
use Sunrice\Commerce\Digital\Events\DownloadsGranted;
use Sunrice\Commerce\Inventory\Events\StockLow;
use Sunrice\Commerce\Inventory\Events\StockOut;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\Events\OrderCompleted;
use Sunrice\Commerce\Orders\Events\OrderEdited;
use Sunrice\Commerce\Orders\Events\OrderNoteAdded;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Orders\Events\OrderRefunded;
use Sunrice\Commerce\Orders\Events\PaymentLinkRequested;
use Sunrice\Commerce\Orders\Events\QuoteRequested;
use Sunrice\Commerce\Orders\Events\QuoteSent;
use Sunrice\Commerce\Orders\Events\ShipmentCreated;
use Sunrice\Commerce\Payments\Events\PaymentConfirmationRejected;
use Sunrice\Commerce\Payments\Events\PaymentConfirmationSubmitted;

/** Which event sends which email (each one can be switched off in Settings → Emails). */
class SendStoreEmails
{
    public function __construct(protected Notifier $notifier) {}

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(OrderPlaced::class, function (OrderPlaced $e): void {
            $this->notifier->send('order_received', $e->order);
            $this->notifier->send('staff_new_order', $e->order);
        });
        $events->listen(QuoteRequested::class, function (QuoteRequested $e): void {
            $this->notifier->send('quote_received', $e->order);
            $this->notifier->send('staff_new_quote', $e->order);
        });
        $events->listen(QuoteSent::class, fn (QuoteSent $e) => $this->notifier->send('quote_ready', $e->order));
        $events->listen(OrderPaid::class, function (OrderPaid $e): void {
            // An order that costs nothing was "paid" when placed: the order email says it all.
            if ($e->order->total > 0) {
                $this->notifier->send('payment_received', $e->order);
            }
        });
        $events->listen(PaymentConfirmationSubmitted::class, function (PaymentConfirmationSubmitted $e): void {
            $this->notifier->send('payment_confirmation_received', $e->confirmation->order);
            $this->notifier->send('staff_payment_confirmation', $e->confirmation->order, ['confirmation' => $e->confirmation]);
        });
        $events->listen(PaymentConfirmationRejected::class, fn (PaymentConfirmationRejected $e) => $this->notifier->send('payment_rejected', $e->confirmation->order,
            ['reason' => $e->confirmation->review_note]));
        $events->listen(ShipmentCreated::class, fn (ShipmentCreated $e) => $this->notifier->send('order_shipped', $e->order, ['shipment' => $e->shipment]));
        $events->listen(OrderCompleted::class, fn (OrderCompleted $e) => $this->notifier->send('order_completed', $e->order));
        $events->listen(OrderCancelled::class, function (OrderCancelled $e): void {
            $this->notifier->send('order_cancelled', $e->order, ['reason' => $e->reason]);
            $this->notifier->send('staff_order_cancelled', $e->order, ['reason' => $e->reason, 'by' => $e->actor->source]);
        });
        $events->listen(OrderRefunded::class, fn (OrderRefunded $e) => $this->notifier->send('order_refunded', $e->order, ['refund' => $e->refund]));
        $events->listen(OrderNoteAdded::class, function (OrderNoteAdded $e): void {
            if ($e->note->visibility === 'customer' && $e->note->type === 'note') {
                $this->notifier->send('customer_note', $e->order, ['note' => $e->note->message]);
            }
        });
        $events->listen(OrderEdited::class, function (OrderEdited $e): void {
            if ($e->notify) {
                $this->notifier->send('order_updated', $e->order, ['changes' => $e->changes]);
            }
        });
        $events->listen(PaymentLinkRequested::class, fn (PaymentLinkRequested $e) => $this->notifier->send('payment_link', $e->order));
        $events->listen(DownloadsGranted::class, fn (DownloadsGranted $e) => $this->notifier->send('downloads_ready', $e->order, ['grants' => $e->grants]));
        $events->listen(StockLow::class, fn (StockLow $e) => $this->notifier->send('staff_low_stock', $e->variant, ['quantity' => $e->after]));
        $events->listen(StockOut::class, fn (StockOut $e) => $this->notifier->send('staff_out_of_stock', $e->variant));
        $events->listen(AccountDeletionRequested::class, fn (AccountDeletionRequested $e) => $this->notifier->send('staff_deletion_request', $e->customer));
    }
}
