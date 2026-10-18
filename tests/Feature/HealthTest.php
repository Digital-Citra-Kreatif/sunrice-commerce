<?php

declare(strict_types=1);

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Admin\Setup\SetupChecklist;
use Sunrice\Commerce\Facades\Commerce;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthRegistry;
use Sunrice\Commerce\Health\HealthResult;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Storefront\PageCache;

class FailingCheck implements HealthCheck
{
    public function key(): string
    {
        return 'failing';
    }

    public function label(): string
    {
        return 'Failing';
    }

    public function run(): HealthResult
    {
        return HealthResult::error('Broken.', 'Fix it.');
    }
}

it('reports the scheduler stale until commerce:tick runs', function () {
    $scheduler = fn () => app(HealthRegistry::class)->run()['scheduler']['result']->status;

    expect($scheduler())->toBe(HealthResult::ERROR);
    $this->artisan('commerce:tick')->assertSuccessful();
    expect($scheduler())->toBe(HealthResult::OK);

    $this->travel(6)->minutes();
    expect($scheduler())->toBe(HealthResult::ERROR);
});

it('fails commerce:doctor on an error', function () {
    checkoutStore(); // a store that can take orders
    $this->artisan('commerce:tick');
    config(['mail.default' => 'smtp', 'mail.mailers.smtp.transport' => 'smtp']);
    $this->artisan('commerce:doctor')->assertSuccessful();

    Commerce::registerHealthCheck(FailingCheck::class);
    $this->artisan('commerce:doctor')->expectsOutputToContain('Broken.')->assertFailed();
});

it('runs registered tick and prune steps and schedules them', function () {
    $ran = [];
    Commerce::onTick('demo', function () use (&$ran) {
        $ran[] = 'tick';
    });
    Commerce::onPrune('demo', function () use (&$ran) {
        $ran[] = 'prune';

        return 3;
    });

    $this->artisan('commerce:tick')->assertSuccessful();
    $this->artisan('commerce:prune')->expectsOutputToContain('demo')->assertSuccessful();
    expect($ran)->toBe(['tick', 'prune']);

    $commands = collect(app(Schedule::class)->events())->map(fn ($e) => $e->command)->implode(' ');
    expect($commands)->toContain('commerce:tick')->toContain('commerce:prune');
});

it('warns while the full-page cache is on', function () {
    $status = fn () => app(HealthRegistry::class)->run()['full_page_cache']['result']->status;

    expect($status())->toBe(HealthResult::OK);
    config(['sunrice.cache.full_page' => true, 'responsecache.cache_profile' => null]);
    expect($status())->toBe(HealthResult::WARNING);

    // With Sunrice's cache profile, commerce leaves store pages out.
    if (PageCache::supported() && class_exists('Spatie\\ResponseCache\\CacheProfiles\\CacheAllSuccessfulGetRequests')) {
        config(['responsecache.cache_profile' => 'Sunrice\\Cache\\FullPageCacheProfile']);
        expect($status())->toBe(HealthResult::OK);
    }
});

it('keeps store pages and visitors with a cart or account out of the full-page cache', function () {
    $request = fn (string $uri = '/about') => tap(Request::create($uri), fn (Request $r) => $r->setRouteResolver(fn () => null));

    expect(PageCache::cacheable($request(), null))->toBeTrue();

    $cart = $request();
    $cart->cookies->set('commerce_cart', 'token');
    expect(PageCache::cacheable($cart, null))->toBeFalse();

    $product = $request();
    $product->attributes->set(PageCache::DYNAMIC, true);
    expect(PageCache::cacheable($product, null))->toBeFalse();

    $store = $request('/cart');
    $store->setRouteResolver(fn () => (new Route('GET', 'cart', []))->name('commerce.cart.show'));
    expect(PageCache::cacheable($store, null))->toBeFalse();
});

it('clears old IP addresses when pruning', function () {
    $old = makeOrder(['ip_address' => '10.0.0.1', 'user_agent' => 'Firefox']);
    $old->forceFill(['created_at' => now()->subDays(400)])->save();
    $recent = makeOrder(['ip_address' => '10.0.0.2']);

    $this->artisan('commerce:prune')->assertSuccessful();

    expect($old->fresh()->ip_address)->toBeNull()->and($old->fresh()->user_agent)->toBeNull()
        ->and($recent->fresh()->ip_address)->toBe('10.0.0.2');
});

it('tells when customers can\'t order, and when product or region data is missing', function () {
    $status = fn (string $key) => app(HealthRegistry::class)->run()[$key]['result']->status;

    expect($status('store_readiness'))->toBe(HealthResult::ERROR)   // no payment method yet
        ->and($status('catalog_data'))->toBe(HealthResult::WARNING); // no regions

    checkoutStore();
    expect($status('store_readiness'))->toBe(HealthResult::OK)->and($status('catalog_data'))->toBe(HealthResult::OK);

    ShippingMethod::query()->update(['active' => false]);
    expect($status('store_readiness'))->toBe(HealthResult::ERROR);   // products to ship, nowhere to ship them

    app(StoreSettings::class)->saveSection('checkout', ['village_level' => true]);
    DB::table('commerce_regions')->where('level', 4)->delete();
    expect($status('catalog_data'))->toBe(HealthResult::ERROR);
});

it('lists the setup steps until they are done', function () {
    $steps = fn () => collect(app(SetupChecklist::class)->evaluate())->pluck('done', 'key')->all();

    expect($steps())->toBe(['details' => false, 'address' => false, 'products' => false, 'payments' => false, 'shipping' => false, 'terms' => false, 'test_order' => false]);
    checkoutStore();
    expect($steps())->toMatchArray(['products' => true, 'payments' => true, 'shipping' => true, 'test_order' => false]);
});
