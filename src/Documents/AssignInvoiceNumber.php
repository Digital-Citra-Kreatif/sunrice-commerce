<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Documents;

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Settings\StoreSettings;

/** Gives an order its invoice number when it is placed or paid (documents.invoice_assigned_on). */
class AssignInvoiceNumber
{
    public function __construct(protected StoreSettings $settings, protected Features $features, protected Documents $documents) {}

    public function handle(OrderPlaced|OrderPaid $event): void
    {
        $on = (string) $this->settings->get('documents.invoice_assigned_on', 'placed');
        if (! $this->features->active('documents') || $event->order->isQuote() || ($on === 'paid') !== ($event instanceof OrderPaid)) {
            return;
        }
        $this->documents->invoiceNumber($event->order);
    }
}
