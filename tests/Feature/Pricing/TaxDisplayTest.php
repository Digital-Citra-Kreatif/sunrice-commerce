<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\ProductViewFactory;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Pricing\Calculator;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Taxes\TaxDisplay;
use Sunrice\Commerce\Taxes\TaxRate;
use Sunrice\Models\Entry;

function taxesOn(array $settings): void
{
    app(ToggleFeature::class)->handle('taxes', true);
    app(StoreSettings::class)->saveSection('taxes', ['prices_include_tax' => true, 'display_prices' => 'incl', 'based_on' => 'shipping', ...$settings]);
    app()->forgetScopedInstances();
}

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    TaxRate::query()->create(['name' => 'PPN', 'rate' => 1100, 'tax_class' => 'standard']);
    publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 111000, 'compare_at_price' => 222000]]], title: 'Mug');
    $this->product = Product::query()->firstOrFail();
});

it('shows prices entered with tax as they are', function () {
    taxesOn([]);

    $view = app(ProductViewFactory::class)->forEntry(Entry::query()->findOrFail($this->product->entry_id));
    expect($view->price['amount'])->toBe(111000)->and($view->price['compareAt'])->toBe(222000);
});

it('takes the tax out of prices shown excluding tax', function () {
    taxesOn(['display_prices' => 'excl']);

    $view = app(ProductViewFactory::class)->forEntry(Entry::query()->findOrFail($this->product->entry_id));
    expect($view->price['amount'])->toBe(100000)->and($view->price['compareAt'])->toBe(200000)
        ->and($view->price['taxSuffix'])->toBe(__('commerce::storefront.price.excl_tax'));
});

it('adds the tax to prices entered without it but shown with it', function () {
    taxesOn(['prices_include_tax' => false]);

    expect(app(TaxDisplay::class)->price(100000))->toBe(111000);
});

it('converts cart lines but never the totals', function () {
    taxesOn(['display_prices' => 'excl']);
    $state = app(Calculator::class)->calculate([[$this->product->variants->first(), 2]], PricingContext::guest());
    $line = array_values($state->lines)[0];

    expect(app(TaxDisplay::class)->line($line, $line->unitPrice))->toBe(100000)
        ->and(app(TaxDisplay::class)->line($line, $line->net()))->toBe(200000)
        ->and($state->totals['total'])->toBe(222000);
});

it('taxes by the billing address when set to', function () {
    TaxRate::query()->create(['name' => 'PPN', 'rate' => 1200, 'tax_class' => 'standard', 'country' => 'ID', 'region_code' => '31']);
    taxesOn(['prices_include_tax' => false, 'based_on' => 'billing']);
    $variant = $this->product->variants->first();
    $bandung = ['country' => 'ID', 'province_code' => '32'];
    $jakarta = ['country' => 'ID', 'province_code' => '31'];

    $byBilling = app(Calculator::class)->calculate([[$variant, 1]], PricingContext::guest()->with(['destination' => $bandung, 'billingAddress' => $jakarta]));
    expect($byBilling->totals['tax'])->toBe(13320);   // 12% in Jakarta

    // Without a billing address the shipping address counts.
    $fallback = app(Calculator::class)->calculate([[$variant, 1]], PricingContext::guest()->with(['destination' => $bandung]));
    expect($fallback->totals['tax'])->toBe(12210);
});
