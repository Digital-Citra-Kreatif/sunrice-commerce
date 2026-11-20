<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Regions\RegionImporter;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Taxes\TaxRate;

it('saves tax settings and rates, and shows the tax note on prices', function () {
    actingAsSuperAdmin();
    (new RegionImporter(__DIR__.'/../../Fixtures/regions'))->import(1);
    $this->get('/admin/commerce/settings/taxes')->assertNotFound(); // off by default

    app(ToggleFeature::class)->handle('taxes', true);
    $this->put('/admin/commerce/settings/taxes', ['values' => ['prices_include_tax' => true, 'display_prices' => 'incl', 'based_on' => 'shipping', 'classes' => ['standard', 'exempt']]])
        ->assertSessionHasNoErrors();
    $this->get('/admin/commerce/settings/tax-rates')->assertOk();
    $this->put('/admin/commerce/settings/tax-rates', ['values' => ['rates' => [
        ['name' => 'PPN', 'tax_class' => 'standard', 'percent' => 11, 'region' => ['country' => 'ID'], 'shipping' => true],
        ['name' => 'PPN', 'tax_class' => 'standard', 'percent' => 12, 'region' => ['country' => 'ID', 'province_code' => '31'], 'shipping' => true],
    ]]])->assertSessionHasNoErrors()->assertRedirect();

    expect(TaxRate::query()->orderBy('rate')->get(['rate', 'country', 'region_code'])->toArray())
        ->toBe([['rate' => 1100, 'country' => 'ID', 'region_code' => null], ['rate' => 1200, 'country' => 'ID', 'region_code' => '31']])
        ->and(app(StoreSettings::class)->get('taxes.classes'))->toBe(['standard', 'exempt']);

    app(ScaffoldStore::class)->handle();
    publishProduct(['variants' => [['id' => 'a', 'price' => 111000]]], title: 'Mug');
    $this->get('/products/mug')->assertSee('Rp111.000')->assertSee('termasuk pajak');
});

it('applies one rate to several countries, provinces and cities, and shows it as one rate again', function () {
    actingAsSuperAdmin();
    (new RegionImporter(__DIR__.'/../../Fixtures/regions'))->import(2);
    app(ToggleFeature::class)->handle('taxes', true);
    $rows = fn () => TaxRate::query()->orderBy('id')->get(['name', 'rate', 'country', 'region_code'])->map(fn ($r) => [$r->name, $r->rate, $r->country, $r->region_code])->all();

    $this->put('/admin/commerce/settings/tax-rates', ['values' => ['rates' => [
        ['name' => 'VAT', 'tax_class' => 'standard', 'percent' => 9, 'countries' => ['sg', 'MY'], 'regions' => []],
        ['name' => 'PPN', 'tax_class' => 'standard', 'percent' => 12, 'countries' => ['ID'], 'regions' => ['31', '32.73']],
        // Provinces left over after Indonesia was taken out don't count.
        ['name' => 'GST', 'tax_class' => 'standard', 'percent' => 5, 'countries' => ['AU'], 'regions' => ['31']],
        ['name' => 'Levy', 'tax_class' => 'standard', 'percent' => 1, 'countries' => [], 'regions' => []],
    ]]])->assertSessionHasNoErrors();
    expect($rows())->toBe([
        ['VAT', 900, 'SG', null], ['VAT', 900, 'MY', null],
        ['PPN', 1200, 'ID', '31'], ['PPN', 1200, 'ID', '32.73'],
        ['GST', 500, 'AU', null],
        ['Levy', 100, null, null],
    ]);

    $this->get('/admin/commerce/settings/tax-rates')->assertInertia(fn ($page) => $page
        ->where('form.values.rates', fn ($rates) => collect($rates)->map(fn ($r) => [$r['name'], $r['countries'], $r['regions']])->sortBy(0)->values()->all() === [
            ['GST', ['AU'], []], ['Levy', [], []], ['PPN', ['ID'], ['31', '32.73']], ['VAT', ['SG', 'MY'], []],
        ]));

    $this->put('/admin/commerce/settings/tax-rates', ['values' => ['rates' => [
        ['name' => 'PPN', 'tax_class' => 'standard', 'percent' => 12, 'countries' => ['ID'], 'regions' => ['99']],
    ]]])->assertSessionHasErrors('values.rates.0.regions.0');
});
