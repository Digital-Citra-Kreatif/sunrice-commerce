<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Pricing\CalculationState;

/** What payment availability and fees depend on: amount, destination, shipping, customer. */
final class PaymentContext
{
    /**
     * @param  array<string, mixed>|null  $destination
     * @param  array<int, string>  $roles
     */
    public function __construct(
        public readonly int $amount,
        public readonly string $currency = 'IDR',
        public readonly ?array $destination = null,
        public readonly ?string $shippingMethod = null,
        public readonly array $roles = [],
        public readonly bool $needsShipping = true,
        public readonly ?Order $order = null,
    ) {}

    /** From a calculation (before fees: the amount without any payment fee). */
    public static function fromState(CalculationState $state): self
    {
        $fees = (int) ($state->data['payment_fee'] ?? 0);

        return new self(
            amount: max(0, $state->totals['total'] - $fees),
            destination: $state->ctx->destination,
            shippingMethod: $state->shipping['rate']['method'] ?? ($state->ctx->shippingRate !== null ? explode(':', $state->ctx->shippingRate)[0] : null),
            roles: $state->ctx->roles,
            needsShipping: $state->shipping['needed'],
        );
    }

    public static function fromOrder(Order $order): self
    {
        return new self(
            amount: $order->total - $order->fee_total,
            currency: $order->currency,
            destination: $order->shipping_address,
            shippingMethod: $order->shipping_method['method'] ?? null,
            needsShipping: $order->needsShipping(),
            order: $order,
        );
    }
}
