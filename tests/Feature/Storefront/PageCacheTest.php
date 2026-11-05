<?php

declare(strict_types=1);

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Sunrice\Cms\Events\ContentChanged;
use Sunrice\Cms\Site\Page;
use Sunrice\Cms\Site\PageCache as SitePageCache;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Storefront\PageCache;
use Workbench\App\Models\User;

use function Pest\Laravel\get;

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
    $page = Page::current();
    expect($page?->collection?->handle)->toBe('products')
        ->and(PageCache::cacheable(request(), $page))->toBeTrue()
        ->and(PageCache::showsProducts(request(), $page))->toBeTrue()
        ->and(PageCache::productPagesTtl())->toBe(300);

    // A shopper with a cart is never kept a copy, nor served one.
    $this->withCookie('commerce_cart', 'token')->get('/products/mug')->assertOk();
    expect(PageCache::cacheable(request(), Page::current()))->toBeFalse();
});

it('leaves product pages out with a zero lifetime', function () {
    config(['commerce.cache.product_pages_ttl' => 0]);

    get('/products/mug')->assertOk();
    expect(PageCache::cacheable(request(), Page::current()))->toBeFalse();
});

it('clears the page cache when availability or prices change', function () {
    Event::fake([ContentChanged::class]);
    $inventory = app(Inventory::class);

    $inventory->adjust($this->mug, 4, set: true); // 5 -> 4: nothing shown changes much
    Event::assertNotDispatched(ContentChanged::class);

    $inventory->adjust(Variant::query()->findOrFail($this->mug->id), 0, set: true); // sold out
    Event::assertDispatched(ContentChanged::class, fn (ContentChanged $e) => $e->what === 'commerce.stock_changed');

    Event::fake([ContentChanged::class]);
    CatalogVersion::bump(); // pricing rules and flash sales
    Event::assertDispatched(ContentChanged::class, fn (ContentChanged $e) => $e->what === 'commerce.catalog_changed');

})->skip(fn () => ! SitePageCache::enabled(), 'Needs the full-page cache (spatie/laravel-responsecache)');
