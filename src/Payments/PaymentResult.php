<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use Carbon\CarbonInterface;

/**
 * What a gateway, staff or the scheduler reports about a payment: its new
 * status, the amount, a reference (the gateway's transaction id, a
 * confirmation id) and the raw data.
 */
final class PaymentResult
{
    public const STATUSES = ['paid', 'pending', 'awaiting_confirmation', 'failed', 'expired', 'cancelled', 'refunded'];

    /** @param  array<string, mixed>  $raw */
    public function __construct(
        public readonly string $status,
        public readonly ?int $amount = null,
        public readonly ?string $reference = null,
        public readonly ?CarbonInterface $occurredAt = null,
        public readonly array $raw = [],
    ) {}

    /** @param  array<string, mixed>  $raw */
    public static function paid(?int $amount = null, ?string $reference = null, ?CarbonInterface $at = null, array $raw = []): self
    {
        return new self('paid', $amount, $reference, $at, $raw);
    }

    /** @param  array<string, mixed>  $raw */
    public static function failed(?string $reference = null, array $raw = []): self
    {
        return new self('failed', null, $reference, null, $raw);
    }

    public static function expired(): self
    {
        return new self('expired');
    }

    public static function cancelled(): self
    {
        return new self('cancelled');
    }

    public static function pending(?string $reference = null): self
    {
        return new self('pending', null, $reference);
    }

    public static function awaitingConfirmation(?string $reference = null): self
    {
        return new self('awaiting_confirmation', null, $reference);
    }

    public static function refunded(int $amount, ?string $reference = null): self
    {
        return new self('refunded', $amount, $reference);
    }
}
