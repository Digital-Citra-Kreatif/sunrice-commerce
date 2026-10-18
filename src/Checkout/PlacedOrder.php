<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Sunrice\Commerce\Checkout\Completion\CompletionResponse;
use Sunrice\Commerce\Orders\Models\Order;

/** The result of placing: the order, where to go, and whether this call created it. */
final class PlacedOrder
{
    public function __construct(public readonly Order $order, public readonly CompletionResponse $response, public readonly bool $created) {}
}
