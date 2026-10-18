<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions;

use Sunrice\Commerce\Support\Money;

/** Tier math shared by product tiers and pricing rules. */
final class Tiers
{
    /** The unit price a tier gives from a base unit price. */
    public static function apply(int $base, string $type, int $value): int
    {
        return max(0, match ($type) {
            'percent_off' => $base - Money::percentOf($base, $value),
            'amount_off' => $base - $value,
            'fixed_price' => $value,
            default => $base,
        });
    }

    /**
     * The best (lowest) tier reached by a quantity, or null.
     *
     * @param  iterable<array{min_qty: int, type: string, value: int}>  $tiers
     * @return array{min_qty: int, type: string, value: int, price: int}|null
     */
    public static function best(iterable $tiers, int $quantity, int $base): ?array
    {
        $best = null;
        foreach ($tiers as $tier) {
            if ($quantity < (int) $tier['min_qty']) {
                continue;
            }
            $price = self::apply($base, (string) $tier['type'], (int) $tier['value']);
            if ($best === null || $price < $best['price']) {
                $best = [...$tier, 'price' => $price];
            }
        }

        return $best;
    }
}
