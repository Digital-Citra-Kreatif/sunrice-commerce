<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\View\Components\Products;
use Sunrice\Models\Entry;
use Sunrice\Models\Term;

/** @param array<int, Term> $terms */
function listed(string $title, int $price, array $terms = [], array $extra = []): Entry
{
    $entry = publishProduct(array_replace_recursive(['variants' => [['id' => Str::slug($title), 'sku' => strtoupper(Str::slug($title)), 'price' => $price]]], $extra), title: $title);
    $entry->terms()->attach(array_map(fn (Term $t) => $t->id, $terms));

    return $entry;
}

function titles(ProductQuery $query): array
{
    return $query->paginate()->getCollection()->map(fn (Entry $e) => $e->title)->all();
}

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    $this->clothes = term('product_categories', 'Pakaian');
    $this->shirts = term('product_categories', 'Kaos', $this->clothes);
    $this->bags = term('product_categories', 'Tas');
    $this->acme = term('brands', 'Acme');
    $this->nusa = term('brands', 'Nusa');
    $this->a = listed('Kaos Biru', 100000, [$this->shirts, $this->acme]);
    $this->travel(1)->minutes();
    $this->b = listed('Kaos Merah', 80000, [$this->shirts, $this->nusa], ['variants' => [['compare_at_price' => 120000]]]);
    $this->travel(1)->minutes();
    $this->c = listed('Tas Kanvas', 250000, [$this->bags, $this->acme], ['featured' => true, 'variants' => [['stock_status' => 'out_of_stock']]]);
});

it('filters by category (with children), brand, stock and sale', function () {
    expect(titles(ProductQuery::make()->category('pakaian')->sort('name')))->toBe(['Kaos Biru', 'Kaos Merah'])
        ->and(titles(ProductQuery::make()->brand($this->acme->id)->sort('name')))->toBe(['Kaos Biru', 'Tas Kanvas'])
        ->and(titles(ProductQuery::make()->inStock()->sort('name')))->toBe(['Kaos Biru', 'Kaos Merah'])
        ->and(titles(ProductQuery::make()->onSale()))->toBe(['Kaos Merah'])
        ->and(titles(ProductQuery::make()->price(90000, 200000)))->toBe(['Kaos Biru']);
});

it('sorts every way', function (string $sort, array $expected) {
    Product::query()->where('entry_id', $this->b->id)->update(['sales_count' => 9]);
    expect(titles(ProductQuery::make()->sort($sort)))->toBe($expected);
})->with([
    'featured' => ['featured', ['Tas Kanvas', 'Kaos Biru', 'Kaos Merah']], // then the manual order
    'newest' => ['newest', ['Tas Kanvas', 'Kaos Merah', 'Kaos Biru']],
    'price' => ['price', ['Kaos Merah', 'Kaos Biru', 'Tas Kanvas']],
    '-price' => ['-price', ['Tas Kanvas', 'Kaos Biru', 'Kaos Merah']],
    'best selling' => ['best_selling', ['Kaos Merah', 'Kaos Biru', 'Tas Kanvas']],
    'name' => ['name', ['Kaos Biru', 'Kaos Merah', 'Tas Kanvas']],
]);

it('searches titles and SKUs', function () {
    expect(titles(ProductQuery::make()->search('kanvas')))->toBe(['Tas Kanvas'])
        ->and(titles(ProductQuery::make()->search('KAOS-MERAH')))->toBe(['Kaos Merah']);
});

it('leaves out unpublished entries', function () {
    $this->a->update(['status' => 'draft']);
    expect(titles(ProductQuery::make()->sort('name')))->toBe(['Kaos Merah', 'Tas Kanvas']);
});

it('counts facets without their own filter', function () {
    $facets = ProductQuery::make()->brand($this->acme->id)->facets();

    $brands = collect($facets['terms']['brands'])->pluck('count', 'name')->all();
    $categories = collect($facets['terms']['product_categories'])->pluck('count', 'name')->all();
    expect($brands)->toBe(['Acme' => 2, 'Nusa' => 1])
        ->and($categories)->toBe(['Kaos' => 1, 'Tas' => 1])
        ->and($facets['price'])->toBe(['min' => 100000, 'max' => 250000]);
});

it('drops price filters and sorts when prices are hidden', function () {
    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'nobody']);

    expect(titles(ProductQuery::make()->price(90000, 200000)->sort('name')))->toBe(['Kaos Biru', 'Kaos Merah', 'Tas Kanvas'])
        ->and(ProductQuery::make()->facets()['price'])->toBeNull();
    $this->get('/products')->assertOk()->assertDontSee('name="min_price"', false)->assertDontSee('100.000');
});

it('renders the shop, brand and category pages', function () {
    $this->get('/products?sort=price')->assertOk()->assertSeeInOrder(['Kaos Merah', 'Kaos Biru', 'Tas Kanvas'])->assertSeeText('Acme (2)');
    $this->get('/brands/nusa')->assertOk()->assertSee('Kaos Merah')->assertDontSee('Kaos Biru')->assertDontSee('Tas Kanvas');
    $this->get('/products/category/pakaian')->assertOk()->assertSee('Kaos Biru')->assertSee('Kaos Merah')->assertDontSee('Tas Kanvas');
    $this->get('/brands')->assertOk()->assertSee('Acme')->assertSee('Nusa');
});

it('hides brand pages, the index and the brand filter with Brands off', function () {
    app(ToggleFeature::class)->handle('brands', false);
    app(Features::class)->flush();

    $this->get('/brands/nusa')->assertNotFound();
    $this->get('/brands')->assertNotFound();
    $this->get('/products?brand='.$this->nusa->id)->assertOk()->assertSee('Kaos Biru')->assertDontSeeText('Acme (2)');
});

it('lists a page of products in a fixed number of queries', function () {
    foreach (range(1, 20) as $i) {
        listed("Produk {$i}", 1000 * $i, [$this->bags]);
    }
    DB::enableQueryLog();
    $page = ProductQuery::make()->sort('price')->paginate(24);
    $page->getCollection()->each(fn (Entry $e) => commerce_product($e));
    $queries = count(DB::getQueryLog());

    expect($page->count())->toBe(23)->and($queries)->toBeLessThanOrEqual(15);
});

it('keeps a fixed product block on the first products whatever the page asks', function () {
    foreach (range(1, 5) as $i) {
        listed("Extra {$i}", 1000 * $i, [$this->bags]);
    }
    request()->query->set('page', '2');
    request()->query->set('on_sale', '1');
    $block = new Products(sort: 'name', limit: 3, paginate: false);

    expect($block->products->currentPage())->toBe(1)->and($block->products->count())->toBe(3)
        ->and(ProductQuery::make()->sort('name')->get(3)->map(fn ($e) => $e->title)->all())->toBe(['Extra 1', 'Extra 2', 'Extra 3']);
});

it('lists the brands index in a fixed number of queries', function () {
    $measure = function (): int {
        Cache::flush(); // facet counts are cached; terms attached after publishing don't change the catalog version
        $this->get('/brands')->assertOk();
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->get('/brands')->assertOk();
        $count = count(DB::getQueryLog());
        DB::disableQueryLog();

        return $count;
    };
    $two = $measure();
    foreach (range(1, 6) as $i) {
        listed("Produk {$i}", 1000 * $i, [term('brands', "Merek {$i}")]);
    }

    expect($measure())->toBe($two);
    $this->get('/brands')->assertSee('Merek 6');
});
