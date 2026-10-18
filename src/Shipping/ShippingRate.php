<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use Sunrice\Commerce\Shipping\Models\ShippingMethod;

/**
 * A price to ship the package with a method's service. Its id is
 * "{type}:{method id}:{service}", so the method type is known from the
 * id alone (vouchers limited to shipping methods).
 */
final class ShippingRate
{
    /** @param  array<string, mixed>  $meta */
    public function __construct(
        public readonly int $methodId,
        public readonly string $type,
        public readonly string $service,
        public readonly string $label,
        public readonly int $cost,
        public readonly ?string $etd = null,
        public readonly array $meta = [],
    ) {}

    /** @param  array<string, mixed>  $meta */
    public static function for(ShippingMethod $method, int $cost, string $service = 'default', ?string $label = null, ?string $etd = null, array $meta = []): self
    {
        return new self($method->id, $method->type, $service, $label ?? $method->titleFor(), max(0, $cost), $etd ?? $method->etdFor(), $meta);
    }

    public function id(): string
    {
        return "{$this->type}:{$this->methodId}:{$this->service}";
    }

    /** @return array{id: string, method: string, method_id: int, service: string, label: string, cost: int, eta: string|null, meta: array<string, mixed>} */
    public function toArray(): array
    {
        return ['id' => $this->id(), 'method' => $this->type, 'method_id' => $this->methodId, 'service' => $this->service,
            'label' => $this->label, 'cost' => $this->cost, 'eta' => $this->etd, 'meta' => $this->meta];
    }
}
