<?php

declare(strict_types=1);

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\ProductViewFactory;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\Entry;

beforeEach(fn () => app(ScaffoldStore::class)->handle());

function kaos(array $overrides = []): array
{
    return array_replace([
        'type' => 'variable',
        'options' => [['id' => 'size', 'name' => 'Ukuran', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]]],
        'variants' => [
            ['id' => 'v-s', 'options' => ['size' => 's'], 'sku' => 'KAOS-S', 'price' => 99000, 'compare_at_price' => 129000],
            ['id' => 'v-m', 'options' => ['size' => 'm'], 'sku' => 'KAOS-M', 'price' => 109000],
        ],
        'tiers' => [['min_qty' => 10, 'type' => 'percent_off', 'value' => 1000]],
    ], $overrides);
}

it('renders a product page through the fallback template', function () {
    publishProduct(kaos(), title: 'Kaos Polos');

    $this->get('/products/kaos-polos')->assertOk()
        ->assertSee('Kaos Polos')
        ->assertSee('Rp99.000 – Rp109.000')
        ->assertSee('data-commerce-picker', false)
        ->assertSee('AggregateOffer', false)
        ->assertSee('"lowPrice":"99000"', false)
        ->assertSee('Mulai 10 pcs');
});

it('shows a simple product with its sale price, stock and SKU', function () {
    app(StoreSettings::class)->saveSection('catalog', ['show_stock' => 'always']);
    publishProduct(['variants' => [['id' => 'a', 'sku' => 'MUG-1', 'price' => 50000, 'compare_at_price' => 75000, 'track_stock' => true, 'initial_stock' => 7]]], title: 'Mug');

    $this->get('/products/mug')->assertOk()
        ->assertSee('Rp50.000')->assertSee('Rp75.000')
        ->assertSee('Stok 7')->assertSee('MUG-1')
        ->assertSee('"price":"50000"', false)->assertSee('commerce-badge--sale', false);
});

it('leaves no price anywhere when prices are hidden', function () {
    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'signed_in']);
    publishProduct(kaos(), title: 'Kaos Polos');

    $html = $this->get('/products/kaos-polos')->assertOk()->getContent();
    expect($html)->not->toContain('99.000')->not->toContain('99000')->not->toContain('offers')
        ->and($html)->not->toContain('"price":9');
});

it('shows calls to action instead of the cart in catalog mode', function () {
    app(StoreSettings::class)->saveSection('general', ['selling_mode' => 'catalog']);
    app(StoreSettings::class)->saveSection('catalog', ['call_to_action' => 'inquiry']);
    $entry = publishProduct(kaos(), title: 'Kaos Polos');

    $this->get('/products/kaos-polos')->assertOk()
        ->assertSee("/go/inquiry/{$entry->id}", false)
        ->assertSee('id="inquiry"', false)
        ->assertDontSee('data-commerce-add', false);
});

it('keeps an app template of its own', function () {
    View::getFinder()->prependLocation(__DIR__.'/../../Fixtures/views');
    publishProduct(kaos(), title: 'Kaos Polos');

    $this->get('/products/kaos-polos')->assertOk()->assertSee('App template: Kaos Polos')->assertSee('Rp99.000');
});

it('previews draft prices without writing', function () {
    actingAsSuperAdmin();
    $entry = publishProduct(kaos(), title: 'Kaos Polos');
    $draft = kaos();
    $draft['variants'][0]['price'] = 59000;
    publishProduct($draft, $entry, title: 'Kaos Polos', publish: false);

    $url = URL::temporarySignedRoute('sunrice.frontend.preview', now()->addMinutes(5), ['entry' => $entry->id, 'locale' => 'id']);
    $this->get($url)->assertOk()->assertSee('Rp59.000');
    expect(commerce_product(Entry::query()->find($entry->id))->price['from'])->toBe(99000);
});

it('builds views for a page of products in a fixed number of queries', function () {
    foreach (range(1, 24) as $i) {
        publishProduct(kaos(['variants' => [
            ['id' => "s{$i}", 'options' => ['size' => 's'], 'sku' => "K{$i}-S", 'price' => 99000],
            ['id' => "m{$i}", 'options' => ['size' => 'm'], 'sku' => "K{$i}-M", 'price' => 109000],
        ]]), title: "Kaos {$i}");
    }
    $entries = sunrice_entries('products')->get();
    app(ProductViewFactory::class)->flush();

    DB::enableQueryLog();
    $views = app(ProductViewFactory::class)->forEntries($entries);
    $queries = count(DB::getQueryLog());

    expect($views)->toHaveCount(24)->and($queries)->toBeLessThanOrEqual(10);
});
