<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

/** The outcome of checking a voucher: ok with its eligible lines, or the reason with its message. */
final class Eligibility
{
    /**
     * @param  array<int, string>  $lines  eligible line keys
     * @param  array<int, string>  $pending  conditions checked only at checkout (destination, payment, shipping)
     * @param  array<string, mixed>  $params  for the message
     */
    public function __construct(
        public readonly ?string $reason = null,
        public readonly array $lines = [],
        public readonly array $pending = [],
        public readonly array $params = [],
    ) {}

    public function ok(): bool
    {
        return $this->reason === null;
    }

    public function message(): string
    {
        return $this->reason === null ? '' : __('commerce::validation.voucher.'.$this->reason, $this->params);
    }
}
