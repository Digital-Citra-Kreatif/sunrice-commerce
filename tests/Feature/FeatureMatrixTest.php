<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\StoreTools;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;

/*
 * The feature matrix (ARCHITECTURE.md §4.6): each optional module switched
 * off takes its routes, menu items and AI tools with it, and what is
 * still on keeps working.
 */

/** module => [URLs that must answer 404, Shop menu items that must go] */
const MODULE_SURFACES = [
    'variants' => [[], []],
    'bundles' => [[], []],
    'digital' => [[], []],
    'brands' => [['/brands'], []],
    'inventory' => [['/cms/commerce/inventory'], ['Inventory']],
    'cart' => [['/cart', '/checkout'], []],
    'orders' => [['/cms/commerce/orders', '/track-order'], ['Orders']],
    'checkout' => [['/checkout'], []],
    'documents' => [[], []],
    'taxes' => [['/cms/commerce/settings/tax-rates'], []],
    'payments' => [['/cms/commerce/settings/payments'], []],
    'manual_payments' => [['/confirm-payment', '/cms/commerce/confirmations'], ['Payments to verify']],
    'shipping' => [['/cms/commerce/settings/shipping'], []],
    'pricing_rules' => [['/cms/commerce/pricing-rules'], ['Pricing rules']],
    'flash_sales' => [['/flash-sale', '/cms/commerce/flash-sales'], ['Flash sales']],
    'vouchers' => [['/cms/commerce/vouchers'], ['Vouchers']],
    'accounts' => [['/account/login'], []],
    'passwordless_login' => [[], []],
    'google_login' => [['/account/login/google'], []],
    'wishlist' => [['/wishlist'], []],
    'compare' => [['/compare'], []],
    'analytics' => [['/cms/commerce/reports/sales'], ['Reports']],
    'ai_tools' => [[], []],
];

function switchOff(string $feature): void
{
    try {
        app(ToggleFeature::class)->handle($feature, false);
    } catch (ValidationException) {
        // The online store can't work without it: fall back to the catalog mode, then switch it off.
        app(StoreSettings::class)->saveSection('general', [...app(StoreSettings::class)->section('general'), 'selling_mode' => 'catalog']);
        app(Features::class)->flush();
        app(ToggleFeature::class)->handle($feature, false);
    }
    app()->forgetScopedInstances();
}

/** @return array<int, string> */
function shopMenu(): array
{
    $items = [];
    test()->get('/cms/commerce')->assertInertia(function (AssertableInertia $page) use (&$items) {
        foreach ($page->toArray()['props']['navigation'] as $group) {
            if ($group['label'] === 'Shop') {
                $items = array_column($group['items'], 'label');
            }
        }
    });

    return $items;
}

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
    app(StoreSettings::class)->saveSection('general', ['name' => 'Toko', 'email' => 'toko@example.com', 'selling_mode' => 'shop']);
    $this->admin = actingAsSuperAdmin();
});

it('covers every optional module', function () {
    $optional = collect(app(FeatureRegistry::class)->all())->reject(fn ($f) => $f->core)->map(fn ($f) => $f->key)->values()->all();

    expect(array_keys(MODULE_SURFACES))->toEqualCanonicalizing($optional);
});

it('takes a module\'s surfaces away when it is off, and keeps the rest working', function (string $feature) {
    [$urls, $menu] = MODULE_SURFACES[$feature];
    $toolsBefore = collect(StoreTools::ALL)->filter(fn (string $t) => app($t)->shouldRegister())->values();

    switchOff($feature);
    $features = app(Features::class);
    expect($features->active($feature))->toBeFalse();

    foreach ($urls as $url) {
        $this->get($url)->assertNotFound();
    }
    expect(shopMenu())->not->toContain(...($menu ?: ['__none__']));

    // AI tools of this module (or of modules that went off with it) are no longer offered.
    foreach ($toolsBefore as $tool) {
        $instance = app($tool);
        $needs = (fn () => $this->feature)->call($instance);
        if ($feature === 'ai_tools' || ($needs !== null && ! $features->active($needs))) {
            expect($instance->shouldRegister())->toBeFalse("{$tool} is still offered");
        }
    }

    // What is still on works: the product page always; checkout when it is still on.
    $this->get('/products/mug')->assertOk();
    if ($features->active('checkout') && $features->mode() === 'shop') {
        auth()->logout();
        $cart = cartWith([[$this->mug, 1]]);
        $input = checkoutInput();
        $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirect();
        expect(Order::query()->where('channel', 'storefront')->count())->toBe(1, "checkout broke with {$feature} off");
    }
})->with(array_keys(MODULE_SURFACES));

it('still shows the catalog with every optional module off', function () {
    foreach (array_reverse(array_keys(MODULE_SURFACES)) as $feature) {
        if (app(Features::class)->active($feature)) {
            switchOff($feature);
        }
    }

    expect(collect(app(FeatureRegistry::class)->all())->filter(fn ($f) => app(Features::class)->active($f->key))->map(fn ($f) => $f->key)->values()->all())->toBe(['catalog']);
    $this->get('/products/mug')->assertOk()->assertSee('Mug');
    $this->get('/products')->assertOk();
    $this->get('/cart')->assertNotFound();
    expect(collect(StoreTools::ALL)->filter(fn (string $t) => is_subclass_of($t, CommerceTool::class) && app($t)->shouldRegister()))->toBeEmpty();
});
