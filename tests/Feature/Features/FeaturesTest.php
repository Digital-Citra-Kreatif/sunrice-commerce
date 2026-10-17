<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Facades\Commerce;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\Feature;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;

function setMode(string $mode): void
{
    app(StoreSettings::class)->saveSection('general', ['selling_mode' => $mode]);
    app(Features::class)->flush();
}

it('has a requirement graph without cycles or unknown keys', function () {
    $registry = app(FeatureRegistry::class);
    foreach ($registry->all() as $feature) {
        foreach ([...$feature->requires, ...array_merge([], ...array_values($feature->modeRequires))] as $required) {
            expect($registry->has($required))->toBeTrue("{$feature->key} requires unknown {$required}");
        }
    }

    // Depth-first search for a cycle.
    $visit = function (string $key, array $path) use (&$visit, $registry): void {
        expect(in_array($key, $path, true))->toBeFalse('cycle: '.implode(' → ', [...$path, $key]));
        $feature = $registry->get($key);
        foreach ([...$feature->requires, ...array_merge([], ...array_values($feature->modeRequires))] as $required) {
            $visit($required, [...$path, $key]);
        }
    };
    foreach (array_keys($registry->all()) as $key) {
        $visit($key, []);
    }
});

it('uses defaults, modes and requirements', function () {
    $features = app(Features::class);

    expect($features->active('catalog'))->toBeTrue()
        ->and($features->active('checkout'))->toBeTrue()
        ->and($features->active('taxes'))->toBeFalse()               // off by default
        ->and($features->active('passwordless_login'))->toBeFalse();

    setMode('catalog');
    expect(app(Features::class)->active('cart'))->toBeFalse()          // not in catalog mode
        ->and(app(Features::class)->active('vouchers'))->toBeFalse()   // needs cart
        ->and(app(Features::class)->explain('vouchers')['reasons'])->toBe(['mode:catalog', 'needs:cart'])
        ->and(app(Features::class)->active('orders'))->toBeTrue();     // manual orders still work

    setMode('whatsapp');
    expect(app(Features::class)->active('checkout'))->toBeTrue()       // no payments needed
        ->and(app(Features::class)->active('payments'))->toBeFalse();
});

it('keeps dependents switched on while their requirement is off', function () {
    $changes = app(ToggleFeature::class)->handle('wishlist', false);
    expect($changes['deactivated'])->toBe(['wishlist']);

    setMode('quote');
    $changes = app(ToggleFeature::class)->handle('payments', false);
    expect($changes['deactivated'])->toContain('payments', 'manual_payments');

    // Switching it back on restores the dependent as it was.
    $changes = app(ToggleFeature::class)->handle('payments', true);
    expect($changes['activated'])->toContain('payments', 'manual_payments')
        ->and(app(Features::class)->switchedOn('manual_payments'))->toBeTrue();
});

it('refuses switches the selling mode can not work without', function () {
    expect(fn () => app(ToggleFeature::class)->handle('payments', false))
        ->toThrow(ValidationException::class, 'Online store mode needs Payment methods');
    expect(fn () => app(ToggleFeature::class)->handle('cart', false))
        ->toThrow(ValidationException::class, 'needs Cart');
    expect(fn () => app(ToggleFeature::class)->handle('catalog', false))
        ->toThrow(ValidationException::class);

    setMode('catalog');
    expect(app(ToggleFeature::class)->handle('cart', false)['deactivated'])->toBe([]);
});

it('lets packages add modules', function () {
    Commerce::registerFeature(new Feature('midtrans', 'integrations', 'Midtrans', requires: ['payments'], default: false));

    expect(Commerce::active('midtrans'))->toBeFalse();
    app(ToggleFeature::class)->handle('midtrans', true);
    expect(Commerce::active('midtrans'))->toBeTrue();
});

it('gates routes and Blade by module', function () {
    Route::get('/gated', fn () => 'ok')->middleware(['web', 'commerce.feature:wishlist']);

    $this->get('/gated')->assertOk();
    app(ToggleFeature::class)->handle('wishlist', false);
    $this->get('/gated')->assertNotFound();

    expect(Blade::render("@commerceFeature('wishlist') yes @else no @endcommerceFeature"))->toContain('no')
        ->and(commerce_feature('compare'))->toBeTrue();
});
