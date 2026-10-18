<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

/**
 * Whether a quantity of a variant can be bought now; otherwise why
 * (not_published, sync_failed, inactive_variant, purchase_mode,
 * price_hidden, feature_off, out_of_stock, qty_rules, flash_sale_limit).
 */
final class Availability
{
    /** @param  array<string, mixed>  $details  e.g. ['available' => 3] */
    public function __construct(public readonly ?string $reason = null, public readonly array $details = []) {}

    public static function ok(): self
    {
        return new self;
    }

    public function isOk(): bool
    {
        return $this->reason === null;
    }

    /** A message for the customer. */
    public function message(string $product = ''): string
    {
        if ($this->reason === null) {
            return '';
        }
        $key = $this->reason === 'out_of_stock' && ($this->details['available'] ?? 0) > 0 ? 'not_enough_stock' : $this->reason;

        return __('commerce::storefront.availability.'.$key, ['product' => $product, 'count' => $this->details['available'] ?? 0]);
    }
}
