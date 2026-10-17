<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing;

/**
 * An order-level change of the total: a discount (allocated to lines), a
 * shipping discount, a fee or the unique transfer code. `amount` is
 * always positive; the type says which way it goes.
 */
final class Adjustment
{
    public const DISCOUNT = 'discount';

    public const SHIPPING_DISCOUNT = 'shipping_discount';

    public const FEE = 'fee';

    public const UNIQUE_CODE = 'unique_code';

    /**
     * @param  array{type: string, id?: int|string|null, code?: string|null}  $source  e.g. voucher 12 / code HEMAT10
     * @param  array<string, int>  $allocations  line key => amount
     * @param  array<string, mixed>  $meta
     */
    public function __construct(
        public readonly string $key,
        public readonly string $type,
        public readonly string $label,
        public int $amount,
        public readonly array $source = ['type' => 'manual'],
        public array $allocations = [],
        public array $meta = [],
    ) {}

    /** Discounts and shipping discounts lower the total; fees and unique codes raise it. */
    public function sign(): int
    {
        return in_array($this->type, [self::DISCOUNT, self::SHIPPING_DISCOUNT], true) ? -1 : 1;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return ['key' => $this->key, 'type' => $this->type, 'label' => $this->label, 'amount' => $this->amount,
            'source' => $this->source, 'allocations' => $this->allocations, 'meta' => $this->meta];
    }
}
