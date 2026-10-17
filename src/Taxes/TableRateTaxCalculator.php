<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Taxes;

use Illuminate\Support\Collection;
use Sunrice\Commerce\Contracts\TaxCalculator;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\Allocator;
use Sunrice\Commerce\Support\Money;

/**
 * Taxes from the rate table (Settings → Store → Taxes): per line, the
 * rates of its tax class for the address (shipping or store), compound
 * rates on top of the others, rounded per line. With prices including
 * tax the tax is taken out of the price; otherwise it is added.
 */
class TableRateTaxCalculator implements TaxCalculator
{
    /** @var Collection<int, TaxRate>|null */
    protected ?Collection $rates = null;

    public function __construct(protected StoreSettings $settings) {}

    public function apply(CalculationState $state): void
    {
        $inclusive = (bool) $this->settings->get('taxes.prices_include_tax', true);
        $address = $this->settings->get('taxes.based_on') === 'store'
            ? $this->storeAddress()
            : ($state->ctx->destination ?? $this->storeAddress());
        $added = 0;

        foreach ($state->lines as $line) {
            $rates = $this->ratesFor($line->taxClass ?? 'standard', $address);
            $line->taxes = $this->taxes($line->net(), $rates, $inclusive);
            if (! $inclusive) {
                $added += $line->tax();
            }
        }

        $shipping = max(0, $state->shipping['cost'] - array_sum(array_map(fn ($a) => $a->amount, $state->adjustmentsOfType('shipping_discount'))));
        $shippingTax = 0;
        if ($shipping > 0) {
            $rates = $this->ratesFor('standard', $address)->filter(fn (TaxRate $r) => $r->shipping);
            $shippingTax = array_sum(array_column($this->taxes($shipping, $rates, $inclusive), 'amount'));
            $added += $inclusive ? 0 : $shippingTax;
        }
        $state->data['shipping_tax'] = $shippingTax;
        $state->data['tax_added'] = $added;
        $state->data['prices_include_tax'] = $inclusive;
    }

    /**
     * @param  Collection<int, TaxRate>  $rates
     * @return array<int, array{name: string, rate: int, amount: int, compound: bool}>
     */
    protected function taxes(int $amount, Collection $rates, bool $inclusive): array
    {
        if ($rates->isEmpty() || $amount <= 0) {
            return [];
        }
        $simple = $rates->where('compound', false)->values();
        $compound = $rates->where('compound', true)->values();

        if (! $inclusive) {
            $taxes = [];
            $base = $amount;
            foreach ($simple as $rate) {
                $taxes[] = ['name' => $rate->name, 'rate' => $rate->rate, 'amount' => Money::percentOf($amount, $rate->rate), 'compound' => false];
            }
            $base += array_sum(array_column($taxes, 'amount'));
            foreach ($compound as $rate) {
                $tax = Money::percentOf($base, $rate->rate);
                $taxes[] = ['name' => $rate->name, 'rate' => $rate->rate, 'amount' => $tax, 'compound' => true];
                $base += $tax;
            }

            return $taxes;
        }

        // Inclusive: price = net × (1 + Σsimple) × Π(1 + compound); take the tax out, then split it by each rate's share.
        $factor = (10000 + $simple->sum('rate')) / 10000;
        foreach ($compound as $rate) {
            $factor *= (10000 + $rate->rate) / 10000;
        }
        $net = (int) round($amount / $factor);
        $total = $amount - $net;
        $shares = [];
        $running = $net;
        foreach ($simple as $i => $rate) {
            $shares["s{$i}"] = (int) round($net * $rate->rate / 10000 * 1000);
        }
        $running += (int) round($net * $simple->sum('rate') / 10000);
        foreach ($compound as $i => $rate) {
            $shares["c{$i}"] = (int) round($running * $rate->rate / 10000 * 1000);
            $running += (int) round($running * $rate->rate / 10000);
        }
        $split = Allocator::proportional($total, $shares);
        $taxes = [];
        foreach ($simple as $i => $rate) {
            $taxes[] = ['name' => $rate->name, 'rate' => $rate->rate, 'amount' => $split["s{$i}"], 'compound' => false];
        }
        foreach ($compound as $i => $rate) {
            $taxes[] = ['name' => $rate->name, 'rate' => $rate->rate, 'amount' => $split["c{$i}"], 'compound' => true];
        }

        return $taxes;
    }

    /**
     * The rates of a class for an address: the most specific region match per name wins.
     *
     * @param  array<string, mixed>  $address
     * @return Collection<int, TaxRate>
     */
    public function ratesFor(string $class, array $address): Collection
    {
        $this->rates ??= TaxRate::query()->orderByDesc('priority')->orderBy('id')->get();
        $country = strtoupper((string) ($address['country'] ?? 'ID'));
        $codes = array_filter([$address['village_code'] ?? null, $address['district_code'] ?? null, $address['city_code'] ?? null, $address['province_code'] ?? null]);

        $matching = $this->rates->filter(fn (TaxRate $r) => $r->tax_class === $class
            && ($r->country === null || strtoupper($r->country) === $country)
            && ($r->region_code === null || in_array($r->region_code, $codes, true)));

        // A region-specific rate replaces the general rate of the same name.
        return $matching->sortByDesc(fn (TaxRate $r) => ($r->region_code !== null ? 2 : 0) + ($r->country !== null ? 1 : 0))
            ->unique('name')->sortByDesc('priority')->values();
    }

    /** @return array<string, mixed> */
    protected function storeAddress(): array
    {
        $region = (array) $this->settings->get('general.address.region', []);

        return ['country' => $region['country'] ?? 'ID', ...$region];
    }
}
