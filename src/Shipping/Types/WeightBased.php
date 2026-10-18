<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Types;

use Sunrice\Commerce\Shipping\Contracts\ShippingMethodType;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\ShippingRate;
use Sunrice\Commerce\Shipping\ShippingRequest;

/**
 * By weight: a price per kg, rounding up only past a tolerance (with 300 g,
 * 1.3 kg counts as 1 kg and 1.31 kg as 2 kg) above a minimum weight, or a
 * table ("up to X kg costs Y"). Optionally charges the volumetric weight
 * when it is larger.
 */
class WeightBased implements ShippingMethodType
{
    public static function key(): string
    {
        return 'weight';
    }

    public function label(): string
    {
        return 'By weight';
    }

    public function settingsSchema(): array
    {
        return [
            ['handle' => 'mode', 'type' => 'select', 'label' => 'Pricing', 'config' => ['options' => [
                ['value' => 'per_kg', 'label' => 'A price per kg'],
                ['value' => 'table', 'label' => 'A weight table'],
            ]]],
            ['handle' => 'price_per_kg', 'type' => 'commerce_money', 'label' => 'Price per kg'],
            ['handle' => 'tolerance', 'type' => 'number', 'label' => 'Rounding tolerance (g)', 'instructions' => 'Weight above a whole kg up to this is not charged (300: 1.3 kg counts as 1 kg).', 'config' => ['min' => 0, 'max' => 999], 'validation' => ['integer']],
            ['handle' => 'min_weight', 'type' => 'number', 'label' => 'Minimum weight (kg)', 'config' => ['min' => 0], 'validation' => ['integer']],
            ['handle' => 'table', 'type' => 'repeater', 'label' => 'Weight table', 'config' => ['max' => 50, 'fields' => [
                ['handle' => 'up_to', 'type' => 'number', 'label' => 'Up to (kg)', 'required' => true, 'config' => ['min' => 0]],
                ['handle' => 'cost', 'type' => 'commerce_money', 'label' => 'Cost', 'required' => true],
            ]]],
            ['handle' => 'volumetric', 'type' => 'toggle', 'label' => 'Charge volumetric weight when larger'],
            ['handle' => 'divisor', 'type' => 'number', 'label' => 'Volumetric divisor', 'instructions' => 'L×W×H (cm) ÷ divisor = kg. Usually 6000.', 'config' => ['min' => 1], 'validation' => ['integer']],
        ];
    }

    public function settingsRules(): array
    {
        return ['mode' => ['nullable', 'in:per_kg,table']];
    }

    public function rates(ShippingRequest $request, ShippingMethod $method): array
    {
        $divisor = (int) ($method->setting('divisor') ?: config('commerce.shipping.volumetric_divisor', 6000));
        $grams = $method->setting('volumetric') ? $request->package->chargeableWeight($divisor) : $request->package->weight();
        $cost = $method->setting('mode', 'per_kg') === 'table' ? $this->fromTable($method, $grams) : $this->perKg($method, $grams);

        return $cost === null ? [] : [ShippingRate::for($method, $cost, meta: ['weight' => $grams])];
    }

    /** The kg charged: whole kg, plus one when the rest is over the tolerance; at least the minimum. */
    public static function chargedKg(int $grams, int $tolerance, int $minimum): int
    {
        $kg = intdiv($grams, 1000);
        if ($grams % 1000 > $tolerance) {
            $kg++;
        }

        return max($kg, $minimum);
    }

    protected function perKg(ShippingMethod $method, int $grams): int
    {
        $kg = self::chargedKg($grams, (int) $method->setting('tolerance', 0), (int) ($method->setting('min_weight') ?? 1));

        return $kg * (int) $method->setting('price_per_kg', 0);
    }

    /** The first row whose limit fits; null when the package is heavier than the table. */
    protected function fromTable(ShippingMethod $method, int $grams): ?int
    {
        $rows = (array) $method->setting('table', []);
        usort($rows, fn ($a, $b) => (float) ($a['up_to'] ?? 0) <=> (float) ($b['up_to'] ?? 0));
        foreach ($rows as $row) {
            if ($grams <= (float) ($row['up_to'] ?? 0) * 1000) {
                return (int) ($row['cost'] ?? 0);
            }
        }

        return null;
    }
}
