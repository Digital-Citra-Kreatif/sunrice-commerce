<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Contracts;

use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;

/** A hosted session which can be opened before the shopper commits to a payment. */
interface StartsCheckoutSession
{
    /** Null only when the gateway has no payment for this session. Connectivity errors must throw. */
    public function checkoutStatus(Payment $payment): ?PaymentResult;

    /** True only once the gateway confirms this session can no longer accept a payment. */
    public function cancelCheckoutSession(Payment $payment): bool;
}
