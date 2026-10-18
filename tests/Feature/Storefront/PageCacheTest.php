<?php

declare(strict_types=1);

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Storefront\PageCache;
use Sunrice\Events\ContentChanged;
use Sunrice\Facades\Sunrice;
use Workbench\App\Models\User;

use function Pest\Laravel\get;

$unsupported = ! PageCache::bypassSupported();

beforeEach(function () {
    $this->mug = checkoutStore();
});

it('treats visitors with a cart, wishlist, comparison or account as personal', function () {
    $request = fn (array $cookies = []) => Request::create('/about', cookies: $cookies);

    expect(PageCache::personal($request()))->toBeFalse()
        ->and(PageCache::personal($request(['commerce_cart' => 'x'])))->toBeTrue()
        ->and(PageCache::personal($request(['commerce_wishlist' => 'x'])))->toBeTrue();

    $comparing = $request();
    $comparing->setLaravelSession(app('session.store'));
    expect(PageCache::personal($comparing))->toBeFalse();
    $comparing->session()->put('commerce.compare', [$this->mug->product_id]);
    expect(PageCache::personal($comparing))->toBeTrue();

    $this->actingAs(User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => bcrypt('secret-pass')]), 'commerce');
    expect(PageCache::personal($request()))->toBeTrue();
});

it('keeps product pages for anonymous visitors, briefly', function () {
    get('/products/mug')->assertOk();
    expect(Sunrice::shouldCachePage(request()))->toBeTrue()
        ->and(Sunrice::pageCacheLifetime(request()))->toBe(300);

    // Commerce's own pages never.
    get('/cart')->assertOk();
    expect(Sunrice::shouldCachePage(request()))->toBeFalse();

    // A shopper with a cart is never served the anonymous copy.
    $this->withCookie('commerce_cart', 'token')->get('/products/mug')->assertOk();
    expect(Sunrice::bypassesPageCache(request()))->toBeTrue();
})->skip($unsupported, 'Needs Sunrice::bypassPageCacheUsing()');

it('leaves product pages out with a zero lifetime', function () {
    config(['commerce.cache.product_pages_ttl' => 0]);

    get('/products/mug')->assertOk();
    expect(Sunrice::shouldCachePage(request()))->toBeFalse();
})->skip($unsupported, 'Needs Sunrice::bypassPageCacheUsing()');

it('clears the page cache when availability or prices change', function () {
    config(['sunrice.cache.full_page' => true]);
    Event::fake([ContentChanged::class]);
    $inventory = app(Inventory::class);

    $inventory->adjust($this->mug, 4, set: true); // 5 -> 4: nothing shown changes much
    Event::assertNotDispatched(ContentChanged::class);

    $inventory->adjust(Variant::query()->findOrFail($this->mug->id), 0, set: true); // sold out
    Event::assertDispatched(ContentChanged::class, fn (ContentChanged $e) => $e->reason === 'commerce.stock_changed');

    Event::fake([ContentChanged::class]);
    CatalogVersion::bump(); // pricing rules and flash sales
    Event::assertDispatched(ContentChanged::class, fn (ContentChanged $e) => $e->reason === 'commerce.catalog_changed');

    // Nothing to clear without the full-page cache.
    config(['sunrice.cache.full_page' => false]);
    Event::fake([ContentChanged::class]);
    CatalogVersion::bump();
    Event::assertNotDispatched(ContentChanged::class);
})->skip($unsupported, 'Needs Sunrice::bypassPageCacheUsing()');
