<?php

declare(strict_types=1);

use Sunrice\Commerce\Commerce as CommerceManager;
use Sunrice\Commerce\CommerceServiceProvider;
use Sunrice\Commerce\Facades\Commerce;
use Sunrice\SunriceServiceProvider;

it('loads next to Sunrice', function () {
    expect(app()->getProviders(SunriceServiceProvider::class))->not->toBeEmpty()
        ->and(app()->getProviders(CommerceServiceProvider::class))->not->toBeEmpty()
        ->and(Commerce::version())->toBeString()
        ->and(app(CommerceManager::class))->toBe(app(CommerceManager::class));
});

it('loads its config defaults', function () {
    expect(config('commerce.catalog.collections'))->toBe(['products'])
        ->and(config('commerce.auth.guard'))->toBe('commerce')
        ->and(config('commerce.defaults.general.currency.code'))->toBe('IDR');
});

it('loads its admin bundle on admin pages', function () {
    actingAsSuperAdmin();

    $this->get('/cms')->assertOk()
        ->assertSee('vendor/commerce/admin.js?v=', false)
        ->assertSee('vendor/commerce/admin.css?v=', false);
});

it('publishes the admin bundle', function () {
    $this->artisan('commerce:publish-assets')->assertSuccessful();

    expect(public_path('vendor/commerce/admin.js'))->toBeFile();
});
