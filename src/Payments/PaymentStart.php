<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

/**
 * What happens once an order is placed with a method: show instructions,
 * send the customer to the gateway, render an embedded widget, or it's
 * already paid.
 */
final class PaymentStart
{
    /** @param  array<string, mixed>  $data */
    private function __construct(
        public readonly string $kind,
        public readonly array $data = [],
        public readonly ?string $url = null,
        public readonly ?string $view = null,
        public readonly ?PaymentResult $result = null,
    ) {}

    /** @param  array<string, mixed>  $snapshot  stored on the payment (accounts, amount, deadline) */
    public static function instructions(array $snapshot = []): self
    {
        return new self('instructions', $snapshot);
    }

    public static function redirect(string $url): self
    {
        return new self('redirect', url: $url);
    }

    /** @param  array<string, mixed>  $data */
    public static function embedded(string $view, array $data = []): self
    {
        return new self('embedded', $data, view: $view);
    }

    public static function paid(PaymentResult $result): self
    {
        return new self('paid', result: $result);
    }
}
