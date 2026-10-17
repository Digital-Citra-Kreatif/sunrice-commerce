<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\FeeProvider;

/** The chosen payment method's fee, as a fee adjustment. */
class PaymentFeeProvider implements FeeProvider
{
    public function __construct(protected PaymentManager $payments) {}

    public function apply(CalculationState $state): void
    {
        $key = $state->ctx->paymentMethod;
        $method = $key === null ? null : $this->payments->get($key);
        if ($method === null || ! $this->payments->isActive($method)) {
            return;
        }
        // Subtotal after discounts, plus shipping: what the fee is a percentage of.
        $base = array_sum(array_map(fn ($l) => $l->net(), $state->lines)) + $state->shipping['cost']
            - array_sum(array_map(fn (Adjustment $a) => $a->amount, $state->adjustmentsOfType(Adjustment::SHIPPING_DISCOUNT)));
        $ctx = new PaymentContext(max(0, $base), destination: $state->ctx->destination, shippingMethod: $state->shipping['rate']['method'] ?? null,
            roles: $state->ctx->roles, needsShipping: $state->shipping['needed']);
        $fee = $method->fee($ctx);
        if ($fee === null || $fee->amount <= 0) {
            return;
        }
        $state->addAdjustment(new Adjustment('payment_fee:'.$key, Adjustment::FEE, $fee->label, $fee->amount, ['type' => 'payment_fee', 'id' => $key]));
        $state->data['payment_fee'] = $fee->amount;
    }
}
