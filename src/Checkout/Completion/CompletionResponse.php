<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Completion;

/** Where to send the customer after placing (the order page, a gateway, WhatsApp). */
final class CompletionResponse
{
    public function __construct(public readonly string $url, public readonly ?string $message = null) {}
}
