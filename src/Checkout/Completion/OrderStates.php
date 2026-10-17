<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Completion;

/** The three states a new order starts with. */
final class OrderStates
{
    public function __construct(public readonly string $status, public readonly string $payment, public readonly string $fulfillment) {}
}
