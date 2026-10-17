<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

/**
 * What is being shipped: lines with weight (grams), dimensions
 * (millimetres), quantity and value.
 */
final class Package
{
    /** @param  array<int, array{weight: int, length: int, width: int, height: int, quantity: int, value: int}>  $lines */
    public function __construct(public readonly array $lines = []) {}

    /** Actual weight in grams. */
    public function weight(): int
    {
        return array_sum(array_map(fn (array $l) => $l['weight'] * $l['quantity'], $this->lines));
    }

    /** Volumetric weight in grams: L×W×H (cm) ÷ divisor, in kg, per unit. */
    public function volumetricWeight(int $divisor = 6000): int
    {
        $grams = 0.0;
        foreach ($this->lines as $l) {
            $cm3 = ($l['length'] / 10) * ($l['width'] / 10) * ($l['height'] / 10);
            $grams += $cm3 / max(1, $divisor) * 1000 * $l['quantity'];
        }

        return (int) ceil($grams);
    }

    /** The weight carriers charge: the larger of actual and volumetric. */
    public function chargeableWeight(int $divisor = 6000): int
    {
        return max($this->weight(), $this->volumetricWeight($divisor));
    }

    public function quantity(): int
    {
        return array_sum(array_column($this->lines, 'quantity'));
    }

    public function value(): int
    {
        return array_sum(array_map(fn (array $l) => $l['value'], $this->lines));
    }
}
