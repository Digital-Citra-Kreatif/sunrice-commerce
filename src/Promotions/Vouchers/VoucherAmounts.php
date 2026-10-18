<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Promotions\TargetMatcher;
use Sunrice\Commerce\Support\Allocator;
use Sunrice\Commerce\Support\Money;

/** How much a voucher takes off, allocated to lines (ARCHITECTURE.md §9.3). */
class VoucherAmounts
{
    public function __construct(protected TargetMatcher $targets) {}

    /**
     * @param  array<int, string>  $lines  eligible line keys
     * @return array<string, int> line key => amount
     */
    public function allocations(Voucher $voucher, CalculationState $state, array $lines): array
    {
        $remaining = [];
        foreach ($lines as $key) {
            $remaining[$key] = $state->lines[$key]->net();
        }
        $eligible = array_sum($remaining);

        $allocations = match ($voucher->type) {
            'percent' => Allocator::proportional(
                $voucher->max_discount !== null ? min(Money::percentOf($eligible, $voucher->value), $voucher->max_discount) : Money::percentOf($eligible, $voucher->value),
                $remaining,
            ),
            'fixed_cart' => Allocator::proportional(min($voucher->value, $eligible), $remaining),
            'fixed_item' => array_map(fn (string $key) => min($remaining[$key], $voucher->value * $state->lines[$key]->quantity), array_combine($lines, $lines)),
            'buy_x_get_y' => $this->buyXGetY($voucher, $state, $lines),
            default => [],
        };

        return array_filter($allocations, fn (int $amount) => $amount > 0);
    }

    /**
     * Free or discounted "get" units, cheapest first: floor(buy units ÷ buy_qty) × get_qty sets,
     * or, when buy and get are the same products, floor(units ÷ (buy_qty + get_qty)) × get_qty.
     *
     * @param  array<int, string>  $lines
     * @return array<string, int>
     */
    protected function buyXGetY(Voucher $voucher, CalculationState $state, array $lines): array
    {
        $config = (array) $voucher->bxgy + ['buy_qty' => 1, 'get_qty' => 1, 'get_type' => 'free', 'get_value' => 0];
        $buyQty = max(1, (int) $config['buy_qty']);
        $getQty = max(1, (int) $config['get_qty']);
        $buyTargets = $voucher->targets->where('mode', 'buy');
        // An empty "Get from" means the same products as "Buy from".
        $getTargets = $voucher->targets->where('mode', 'get')->whenEmpty(fn () => $buyTargets);
        $isBuy = fn (string $k) => $buyTargets->isEmpty() || $this->targets->matches($buyTargets, $state->lines[$k]->variant);
        $isGet = fn (string $k) => $getTargets->isEmpty() || $this->targets->matches($getTargets, $state->lines[$k]->variant);

        $buyUnits = array_sum(array_map(fn (string $k) => $isBuy($k) ? $state->lines[$k]->quantity : 0, $lines));
        $getLines = array_values(array_filter($lines, $isGet));
        $key = fn ($targets) => $targets->map(fn ($t) => $t->target_type.':'.$t->target_id)->sort()->values()->all();
        $same = $key($buyTargets) === $key($getTargets);
        $freeUnits = $same ? intdiv($buyUnits, $buyQty + $getQty) * $getQty : intdiv($buyUnits, $buyQty) * $getQty;
        if ($freeUnits <= 0 || $getLines === []) {
            return [];
        }

        // Cheapest units first.
        $units = [];
        foreach ($getLines as $key) {
            $line = $state->lines[$key];
            $unit = $line->quantity > 0 ? intdiv($line->net(), $line->quantity) : 0;
            for ($i = 0; $i < $line->quantity; $i++) {
                $units[] = [$key, $unit];
            }
        }
        usort($units, fn (array $a, array $b) => $a[1] <=> $b[1]);
        $allocations = [];
        foreach (array_slice($units, 0, $freeUnits) as [$key, $price]) {
            $off = match ($config['get_type']) {
                'percent_off' => Money::percentOf($price, (int) $config['get_value']),
                'amount_off' => min($price, (int) $config['get_value']),
                default => $price,
            };
            $allocations[$key] = ($allocations[$key] ?? 0) + $off;
        }

        return $allocations;
    }
}
