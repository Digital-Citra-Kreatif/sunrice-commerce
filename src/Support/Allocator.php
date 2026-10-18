<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

/**
 * Splits an amount over parts in proportion to their weights so the parts
 * always add up to the amount exactly (largest-remainder method). Used to
 * spread a discount or a tax over cart lines.
 */
final class Allocator
{
    /**
     * @param  array<array-key, int>  $weights  non-negative, e.g. line amounts
     * @return array<array-key, int> same keys
     */
    public static function proportional(int $total, array $weights): array
    {
        if ($weights === []) {
            return [];
        }

        $sum = array_sum(array_map(fn (int $w) => max(0, $w), $weights));
        $sign = $total < 0 ? -1 : 1;
        $total = abs($total);

        // Nothing to weigh by: split evenly.
        if ($sum === 0) {
            $weights = array_map(fn () => 1, $weights);
            $sum = count($weights);
        }

        $shares = [];
        $remainders = [];
        foreach ($weights as $key => $weight) {
            $exact = $total * max(0, $weight);
            $shares[$key] = intdiv($exact, $sum);
            $remainders[$key] = $exact % $sum;
        }

        $left = $total - array_sum($shares);
        // Biggest remainders first; ties keep their order (usort is stable).
        $order = array_keys($remainders);
        usort($order, fn ($a, $b) => $remainders[$b] <=> $remainders[$a]);
        foreach (array_slice($order, 0, $left) as $key) {
            $shares[$key]++;
        }

        return array_map(fn (int $share) => $share * $sign, $shares);
    }
}
