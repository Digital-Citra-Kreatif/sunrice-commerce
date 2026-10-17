<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Methods;

use DateTimeInterface;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentStart;

/**
 * Cash on delivery: the order goes to Processing unpaid; staff mark it
 * paid when the cash arrives. Limited by the shared availability settings
 * (provinces, shipping method types); never for pickup-only or digital
 * orders unless allowed.
 */
class CashOnDelivery extends ManualMethod
{
    public static function key(): string
    {
        return 'cod';
    }

    public function label(): string
    {
        return 'Cash on delivery';
    }

    public function settingsSchema(): array
    {
        return self::instructionFields();
    }

    public function isAvailable(PaymentContext $ctx): bool
    {
        return $ctx->needsShipping && parent::isAvailable($ctx);
    }

    public function confirmation(): string
    {
        return 'off';
    }

    public function deadline(Order $order): ?DateTimeInterface
    {
        return null;
    }

    public function start(Order $order, Payment $payment): PaymentStart
    {
        return PaymentStart::instructions($this->snapshot($order, $payment));
    }

    public function instructionsView(): ?string
    {
        return 'commerce::storefront.payments.cod';
    }
}
