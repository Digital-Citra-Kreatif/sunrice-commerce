<?php

declare(strict_types=1);

use Sunrice\Commerce\Commerce as CommerceManager;
use Sunrice\Commerce\CommerceServiceProvider;
use Sunrice\Commerce\Facades\Commerce;
use Inertia\Testing\AssertableInertia;
use Sunrice\Admin\AdminServiceProvider;
use Sunrice\Cms\CmsServiceProvider;

it('loads next to the panel and the CMS', function () {
    expect(app()->getProviders(AdminServiceProvider::class))->not->toBeEmpty()
        ->and(app()->getProviders(CmsServiceProvider::class))->not->toBeEmpty()
        ->and(app()->getProviders(CommerceServiceProvider::class))->not->toBeEmpty()
        ->and(Commerce::version())->toBeString()
        ->and(app(CommerceManager::class))->toBe(app(CommerceManager::class));
});

it('loads its config defaults', function () {
    expect(config('commerce.catalog.collections'))->toBe(['products'])
        ->and(config('commerce.auth.guard'))->toBe('commerce')
        ->and(config('commerce.defaults.general.currency.code'))->toBe('IDR');
});

it('gives the panel its admin bundle for the Commerce pages', function () {
    actingAsSuperAdmin();

    $this->get('/admin/commerce')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->where('sunrice.bundles', fn ($bundles) => collect($bundles)->contains(fn (array $b) => $b['id'] === 'commerce'
            && str_contains((string) $b['module'], 'vendor/commerce/admin.js?v=') && $b['pages'] === ['Commerce/'])));
});

it('publishes the admin bundle', function () {
    $this->artisan('commerce:publish-assets')->assertSuccessful();

    expect(public_path('vendor/commerce/admin.js'))->toBeFile();
});
