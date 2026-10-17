<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

/** A verified gateway notification: its id (for de-duplication), the payment reference and the result. */
final class WebhookEvent
{
    public function __construct(public readonly string $eventId, public readonly string $reference, public readonly PaymentResult $result) {}
}
