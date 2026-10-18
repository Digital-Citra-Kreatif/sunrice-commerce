<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use ArrayAccess;
use JsonSerializable;
use LogicException;

/**
 * A typed reader of a `commerce_product` value (what the field hydrates
 * to). Live pages use commerce_product($entry) instead, which reads the
 * projected rows with prices and stock.
 *
 * @implements ArrayAccess<string, mixed>
 */
final class ProductData implements ArrayAccess, JsonSerializable
{
    /** @var array<string, mixed> */
    public readonly array $value;

    public function __construct(mixed $value)
    {
        $this->value = ProductValue::normalize($value);
    }

    public function type(): string
    {
        return $this->value['type'];
    }

    public function isVariable(): bool
    {
        return $this->value['type'] === 'variable';
    }

    public function isBundle(): bool
    {
        return $this->value['type'] === 'bundle';
    }

    public function purchaseMode(): string
    {
        return $this->value['purchase_mode'];
    }

    /** @return array<int, array<string, mixed>> */
    public function options(): array
    {
        return $this->value['options'];
    }

    /** @return array<int, array<string, mixed>> */
    public function variants(): array
    {
        return $this->value['variants'];
    }

    /** @return array<int, array<string, mixed>> only the active variants */
    public function activeVariants(): array
    {
        return array_values(array_filter($this->value['variants'], fn (array $v) => $v['active']));
    }

    /** @return array<string, mixed>|null */
    public function variant(string $id): ?array
    {
        foreach ($this->value['variants'] as $variant) {
            if ($variant['id'] === $id) {
                return $variant;
            }
        }

        return null;
    }

    /** @return array{0: int, 1: int}|null lowest and highest price of the active variants */
    public function priceRange(): ?array
    {
        $prices = array_column($this->activeVariants(), 'price');

        return $prices === [] ? null : [min($prices), max($prices)];
    }

    /** The label of an option value ("M", or the term's id for attribute values). */
    public function valueLabel(string $optionId, string $valueId): ?string
    {
        foreach ($this->value['options'] as $option) {
            if ($option['id'] === $optionId) {
                foreach ($option['values'] as $value) {
                    if ($value['id'] === $valueId) {
                        return $value['label'] ?? (isset($value['term_id']) ? (string) $value['term_id'] : null);
                    }
                }
            }
        }

        return null;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return $this->value;
    }

    /** @return array<string, mixed> */
    public function jsonSerialize(): array
    {
        return $this->value;
    }

    public function offsetExists(mixed $offset): bool
    {
        return array_key_exists($offset, $this->value);
    }

    public function offsetGet(mixed $offset): mixed
    {
        return $this->value[$offset] ?? null;
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
        throw new LogicException('ProductData is read-only.');
    }

    public function offsetUnset(mixed $offset): void
    {
        throw new LogicException('ProductData is read-only.');
    }
}
