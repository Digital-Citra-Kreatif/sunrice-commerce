<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing;

use Illuminate\Support\Str;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

/**
 * The one price calculation (ARCHITECTURE.md §8.2), used by the cart,
 * checkout, order placement, manual orders, quotes and MCP: stages run in
 * priority order over a CalculationState.
 *
 *     $state = app(Calculator::class)->calculate([[$variant, 2]], PricingContext::current(), ['HEMAT10']);
 */
class Calculator
{
    /** @var array<class-string<CalculationStage>, int> */
    protected array $stages = [
        Stages\ResolveLines::class => 10,
        Stages\UnitPrices::class => 20,
        Stages\Subtotals::class => 30,
        Stages\Discounts::class => 40,
        Stages\Shipping::class => 50,
        Stages\ShippingDiscounts::class => 60,
        Stages\Fees::class => 70,
        Stages\Taxes::class => 80,
        Stages\Totals::class => 90,
    ];

    /** @param  class-string<CalculationStage>  $stage */
    public function registerStage(string $stage, int $priority): void
    {
        $this->stages[$stage] = $priority;
    }

    /**
     * @param  array<int|string, array{0: Variant|int, 1: int, 2?: array<string, mixed>}>  $lines  [variant, quantity, meta]; string keys are kept as line keys
     * @param  array<int, string>  $codes
     */
    public function calculate(array $lines, PricingContext $ctx, array $codes = []): CalculationState
    {
        $state = new CalculationState($ctx);
        $state->codes = array_values(array_unique(array_filter(array_map(fn ($c) => Str::upper(trim((string) $c)), $codes))));

        $ids = array_filter(array_map(fn (array $l) => $l[0] instanceof Variant ? null : (int) $l[0], $lines));
        $loaded = Variant::withTrashed()->with('product')->whereIn('id', $ids)->get()->keyBy('id');
        foreach ($lines as $key => $line) {
            $variant = $line[0] instanceof Variant ? $line[0] : $loaded->get((int) $line[0]);
            if ($variant === null) {
                $state->notice('not_found', __('commerce::storefront.availability.not_published'), (string) $key);

                continue;
            }
            $lineKey = is_string($key) ? $key : 'l'.($key + 1);
            $state->lines[$lineKey] = new CalcLine($lineKey, $variant, max(0, (int) $line[1]), (array) ($line[2] ?? []));
        }

        $stages = $this->stages;
        asort($stages);
        foreach (array_keys($stages) as $stage) {
            app($stage)->run($state);
        }

        return $state;
    }
}
