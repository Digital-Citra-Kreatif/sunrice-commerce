<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\View;
use Sunrice\Commerce\Facades\Commerce;
use Sunrice\Commerce\Regions\RegionImporter;

beforeEach(fn () => (new RegionImporter(__DIR__.'/../Fixtures/regions'))->import(4));

it('serves the regions endpoint in every language', function () {
    $this->getJson('/commerce/api/regions')->assertOk()
        ->assertJsonPath('data.0.code', '31')
        ->assertJsonCount(2, 'data');
    $this->getJson('/commerce/api/regions?parent=32.73.01')->assertOk()
        ->assertJsonPath('data.0', ['code' => '32.73.01.1001', 'name' => 'Sarijadi', 'kind' => 'kelurahan', 'postal_code' => '40151']);
    $this->getJson('/en/commerce/api/regions?parent=32')->assertOk()->assertJsonCount(2, 'data');
    $this->getJson('/commerce/api/regions?parent=../etc')->assertOk()->assertJsonCount(2, 'data');
});

it('builds store URLs in the current language', function () {
    expect(commerce_url('commerce.api.regions'))->toEndWith('/commerce/api/regions');
    app()->setLocale('en');
    expect(commerce_url('commerce.api.regions'))->toEndWith('/en/commerce/api/regions')
        ->and(commerce_url('commerce.api.regions', locale: 'id'))->toEndWith('/commerce/api/regions');
});

it('renders partials registered for a slot while their module is active', function () {
    View::addNamespace('demo', __DIR__.'/../Fixtures/views');
    Commerce::registerStorefrontSlot('checkout.before_submit', 'demo::slot');
    Commerce::registerStorefrontSlot('checkout.before_submit', 'demo::slot', feature: 'taxes');

    $html = Blade::render('<x-commerce::slot name="checkout.before_submit" note="hi" />');

    expect(substr_count($html, 'Slot says hi'))->toBe(1);
});
