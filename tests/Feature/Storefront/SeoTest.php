<?php

declare(strict_types=1);

use Illuminate\Support\Str;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Settings\StoreSettings;

/*
 * SEO (EXECUTION_PLAN.md C12.4): private pages stay out of search
 * engines, product JSON-LD has the schema.org shape, filtered listings
 * point at the unfiltered listing, and the sitemap lists products and
 * terms but no store pages.
 */

/** @return array<string, mixed> */
function productJsonLd(string $html): array
{
    preg_match('#<script type="application/ld\+json">(.*?)</script>#s', $html, $m);
    expect($m)->not->toBeEmpty();

    return json_decode($m[1], true, flags: JSON_THROW_ON_ERROR);
}

function canonicalOf(string $html): ?string
{
    return preg_match('#<link rel="canonical" href="([^"]+)">#', $html, $m) === 1 ? html_entity_decode($m[1]) : null;
}

it('keeps cart, checkout, order, account and payment pages out of search engines', function () {
    $mug = checkoutStore();
    cartWith([[$mug, 1]]);
    $order = makeOrder();

    foreach (['/cart', '/checkout', '/confirm-payment', '/track-order', $order->url(), '/account/login'] as $url) {
        $response = $this->get($url);
        expect($response->status())->toBeLessThan(400, $url)
            ->and($response->headers->get('X-Robots-Tag'))->toBe('noindex, nofollow', $url);
        if (str_contains((string) $response->headers->get('Content-Type'), 'html')) {
            $response->assertSee('<meta name="robots" content="noindex', false);
        }
    }
    $this->get('/products/mug')->assertOk()->assertHeaderMissing('X-Robots-Tag')->assertDontSee('<meta name="robots" content="noindex', false);
});

it('describes a simple product as a Product with an Offer', function () {
    checkoutStore(['price' => 50000]);
    $data = productJsonLd($this->get('/products/mug')->assertOk()->getContent());

    expect($data)->toMatchArray(['@context' => 'https://schema.org', '@type' => 'Product', 'name' => 'Mug', 'url' => url('/products/mug')])
        ->and($data['sku'])->toBeString()
        ->and($data['offers'])->toBe(['@type' => 'Offer', 'priceCurrency' => 'IDR', 'price' => '50000', 'availability' => 'https://schema.org/InStock']);
});

it('describes a variable product with an AggregateOffer', function () {
    checkoutStore();
    publishProduct(['type' => 'variable', 'options' => [['id' => 'size', 'name' => 'Size', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]]],
        'variants' => [
            ['id' => 'tee-s', 'sku' => 'TEE-S', 'price' => 80000, 'options' => ['size' => 's']],
            ['id' => 'tee-m', 'sku' => 'TEE-M', 'price' => 85000, 'options' => ['size' => 'm']],
        ]], title: 'Kaos');
    $data = productJsonLd($this->get('/products/kaos')->assertOk()->getContent());

    expect($data)->not->toHaveKey('sku')
        ->and($data['offers'])->toMatchArray(['@type' => 'AggregateOffer', 'priceCurrency' => 'IDR', 'lowPrice' => '80000', 'highPrice' => '85000', 'offerCount' => 2]);
});

it('omits the offer when prices are hidden', function () {
    checkoutStore();
    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'signed_in']);
    $data = productJsonLd($this->get('/products/mug')->assertOk()->getContent());

    expect($data)->not->toHaveKey('offers');
});

it('points filtered and sorted listings at the unfiltered listing', function () {
    app(ScaffoldStore::class)->handle();
    $acme = term('brands', 'Acme');
    $entry = publishProduct(['variants' => [['id' => 'a', 'sku' => 'A', 'price' => 1000]]], title: 'Kaos Biru');
    $entry->terms()->attach($acme->id);

    expect(canonicalOf($this->get('/products?brand[]='.$acme->id.'&sort=price&min_price=1')->assertOk()->getContent()))->toBe(url('/products'))
        ->and(canonicalOf($this->get('/products?page=2&sort=price')->getContent()))->toBe(url('/products').'?page=2')
        ->and(canonicalOf($this->get('/brands/acme?sort=price')->assertOk()->getContent()))->toBe(url('/brands/acme'));

    $brands = $this->get('/brands')->assertOk()->getContent();
    expect(canonicalOf($brands))->toBe(url('/brands'))
        ->and($brands)->toContain('<title>'.e(__('commerce::storefront.listing.brands')));
});

it('lists products and terms in the sitemap but no store pages', function () {
    app(ScaffoldStore::class)->handle();
    $acme = term('brands', 'Acme');
    $entry = publishProduct(['variants' => [['id' => 'a', 'sku' => 'A', 'price' => 1000]]], title: 'Kaos Biru');
    $entry->terms()->attach($acme->id);

    $xml = $this->get('/sitemap.xml')->assertOk()->getContent();
    expect($xml)->toContain(url('/products/kaos-biru'))
        ->toContain(url('/brands/acme'));
    foreach (['/cart', '/checkout', '/account', '/order/', '/wishlist', '/compare', '/confirm-payment'] as $private) {
        expect(Str::contains($xml, url($private)))->toBeFalse($private);
    }
});
