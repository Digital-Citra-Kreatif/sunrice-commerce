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
    $this->get('/cms/commerce/settings/taxes')->assertNotFound(); // off by default

    app(ToggleFeature::class)->handle('taxes', true);
    $this->put('/cms/commerce/settings/taxes', ['values' => ['prices_include_tax' => true, 'display_prices' => 'incl', 'based_on' => 'shipping', 'classes' => ['standard', 'exempt']]])
        ->assertSessionHasNoErrors();
    $this->get('/cms/commerce/settings/tax-rates')->assertOk();
    $this->put('/cms/commerce/settings/tax-rates', ['values' => ['rates' => [
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
