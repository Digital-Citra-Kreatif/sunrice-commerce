<?php

declare(strict_types=1);

use Illuminate\Cache\Events\CacheHit;
use Illuminate\Cache\Events\CacheMissed;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Pricing\Calculator;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Models\Entry;
use Sunrice\Models\Taxonomy;
use Sunrice\Models\Term;
use Workbench\App\Models\User;

/*
| Pricing scenarios: each file in tests/Fixtures/pricing returns
| [name => scenario]. A scenario has:
|   products  sku => product value overrides (simple products unless 'type' is given;
|             variable products list their variants with their own SKUs)
|   setup     fn (array $variants) => void  (rules, sales, vouchers, settings…)
|   customer  'guest' (default) | 'customer' | 'role:<Name>'
|   context   PricingContext overrides (destination, shippingRate, paymentMethod…)
|   codes     voucher codes
|   cart      [[sku, qty], …]
|   expect    lines: sku => [unit, subtotal, discount?] | totals: [...] | notices: [codes] | codes: [applied] | sources: sku => type
*/

function pricingScenarios(): array
{
    $all = [];
    foreach (glob(__DIR__.'/../../Fixtures/pricing/*.php') as $file) {
        foreach (require $file as $name => $scenario) {
            $all[basename($file, '.php').': '.$name] = [$scenario];
        }
    }

    return $all;
}

/** @return array<string, Variant> sku => variant */
function seedPricingProducts(array $products): array
{
    foreach ($products as $sku => $value) {
        $value = is_int($value) ? ['price' => $value] : $value;
        if (($value['type'] ?? 'simple') === 'simple') {
            $variant = array_diff_key($value, array_flip(['title', 'featured', 'tiers', 'requires_shipping', 'downloadable', 'tax_class']));
            $value = array_intersect_key($value, array_flip(['title', 'featured', 'tiers', 'requires_shipping', 'downloadable', 'tax_class']))
                + ['variants' => [['id' => Str::slug($sku), 'sku' => $sku, ...$variant]]];
        }
        publishProduct($value, title: $value['title'] ?? $sku);
    }

    return Variant::query()->with('product')->whereNotNull('sku')->get()->keyBy('sku')->all();
}

it('calculates', function (array $scenario) {
    $variants = seedPricingProducts($scenario['products'] ?? []);
    if (isset($scenario['setup'])) {
        $scenario['setup']($variants);
    }

    $customer = null;
    $kind = $scenario['customer'] ?? 'guest';
    if ($kind !== 'guest') {
        $customer = User::query()->create(['name' => 'Customer', 'email' => 'customer@example.com', 'password' => 'x']);
        if (str_starts_with($kind, 'role:')) {
            $customer->assignRole(Role::findOrCreate(substr($kind, 5), 'web'));
        }
        $this->actingAs($customer, 'commerce');
    }
    $ctx = PricingContext::for($customer)->with($scenario['context'] ?? []);
    app()->forgetScopedInstances();

    $lines = [];
    foreach ($scenario['cart'] as $i => [$sku, $qty]) {
        $lines[$sku] = [$variants[$sku] ?? throw new RuntimeException("No product {$sku}"), $qty];
    }
    $state = app(Calculator::class)->calculate($lines, $ctx, $scenario['codes'] ?? []);
    $expect = $scenario['expect'];

    foreach ($expect['lines'] ?? [] as $sku => $values) {
        expect($state->lines)->toHaveKey($sku);
        $line = $state->lines[$sku];
        expect([$line->unitPrice, $line->subtotal, $line->discount()])->toBe([$values[0], $values[1], $values[2] ?? 0], "line {$sku}");
    }
    if (isset($expect['removed'])) {
        foreach ($expect['removed'] as $sku) {
            expect($state->lines)->not->toHaveKey($sku);
        }
    }
    if (isset($expect['quantities'])) {
        foreach ($expect['quantities'] as $sku => $qty) {
            expect($state->lines[$sku]->quantity)->toBe($qty);
        }
    }
    foreach ($expect['totals'] ?? [] as $key => $value) {
        expect($state->totals[$key])->toBe($value, "total {$key}");
    }
    if (isset($expect['notices'])) {
        expect(array_column($state->notices, 'code'))->toBe($expect['notices']);
    }
    if (isset($expect['codes'])) {
        expect($state->appliedCodes)->toBe($expect['codes']);
    }
    foreach ($expect['sources'] ?? [] as $sku => $type) {
        expect($state->lines[$sku]->priceSource['type'])->toBe($type, "source of {$sku}");
    }
    if (isset($expect['check'])) {
        $expect['check']($state, $variants);
    }
})->with(pricingScenarios());

it('hashes the same input the same way, and any price change differently', function () {
    $variants = seedPricingProducts(['MUG' => 50000, 'TEA' => 25000]);
    $calc = fn () => app(Calculator::class)->calculate([[$variants['MUG']->fresh(), 2], [$variants['TEA']->fresh(), 1]], PricingContext::guest());

    $first = $calc()->hash();
    expect($calc()->hash())->toBe($first);

    Variant::query()->whereKey($variants['TEA']->id)->update(['price' => 26000]);
    app()->forgetScopedInstances();
    expect($calc()->hash())->not->toBe($first);
});

it('expands a category rule\'s terms once per request, not once per line', function () {
    $variants = seedPricingProducts(['MUG' => 50000, 'TEA' => 20000, 'PEN' => 5000, 'CUP' => 30000]);
    $taxonomy = Taxonomy::query()->create(['handle' => 'product_categories', 'title' => 'Categories', 'settings' => []]);
    $parent = Term::query()->create(['taxonomy_id' => $taxonomy->id, 'sort_order' => 0]);
    $child = Term::query()->create(['taxonomy_id' => $taxonomy->id, 'parent_id' => $parent->id, 'sort_order' => 0]);
    foreach ($variants as $variant) {
        Entry::query()->find($variant->product->entry_id)->terms()->attach($child->id);
    }
    PriceRule::query()->create(['name' => 'Kopi', 'scope' => 'categories', 'tiers' => [['min_qty' => 1, 'type' => 'percent_off', 'value' => 1000]]])
        ->targets()->create(['target_type' => 'term', 'target_id' => $parent->id]);
    $reads = 0;
    Event::listen([CacheHit::class, CacheMissed::class], function ($event) use (&$reads) {
        $reads += str_contains($event->key, 'rule-terms') ? 1 : 0;
    });

    $state = app(Calculator::class)->calculate(array_map(fn (Variant $v) => [$v, 1], $variants), PricingContext::current());

    expect(array_map(fn ($line) => $line->unitPrice, array_values($state->lines)))->toBe([45000, 18000, 4500, 27000])
        ->and($reads)->toBe(1);
});
