<?php

declare(strict_types=1);

use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Models\Entry;
use Sunrice\Commerce\Settings\Actions\SaveStoreSettings;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    checkoutStore();
});

it('uses the localized catalog everywhere and falls back to the localized homepage', function () {
    $order = makeOrder();
    actAsOwnerOf($order);
    foreach (['/compare', '/wishlist', '/cart', route('commerce.order', ['key' => $order->order_key])] as $path) {
        $this->get($path)->assertOk()->assertSee('href="'.url('/products').'"', false);
    }
    $this->get('/en/compare')->assertOk()->assertSee('href="'.url('/en/products').'"', false);

    Collection::query()->where('handle', 'products')->firstOrFail()->update(['listing_route' => null]);
    $this->get('/en/compare')->assertOk()->assertSee('href="'.url('/en').'"', false);
});

it('uses a CMS page for the shared link and falls back when it is unpublished', function () {
    $entry = Entry::query()->whereHas('translations', fn ($query) => $query->where('slug', 'mug'))->firstOrFail();
    app(SaveStoreSettings::class)->handle('catalog', [
        'continue_shopping_mode' => 'page', 'continue_shopping_target' => 'entry', 'continue_shopping_page' => $entry->id,
    ]);

    $order = makeOrder();
    actAsOwnerOf($order);
    foreach (['/compare', '/wishlist', '/cart', route('commerce.order', ['key' => $order->order_key])] as $path) {
        $this->get($path)->assertOk()->assertSee('href="'.url('/products/mug').'"', false);
    }

    expect($this->blade('<x-commerce::mini-cart />')->__toString())
        ->toContain(
            '<template data-commerce-drawer-empty>',
            __('commerce::storefront.cart.empty'),
            __('commerce::storefront.theme.cart_empty_text'),
            'href="'.url('/products/mug').'"',
            'data-commerce-drawer-footer hidden',
        );

    unpublishEntry($entry);
    $this->get('/compare')->assertOk()->assertSee('href="'.url('/products').'"', false)
        ->assertDontSee('href="'.url('/products/mug').'"', false);
});

it('allows the admin to choose a collection listing', function () {
    $collection = Collection::query()->create(['handle' => 'offers', 'title' => 'Offers', 'listing_route' => '/offers']);
    app(SaveStoreSettings::class)->handle('catalog', [
        'continue_shopping_mode' => 'page', 'continue_shopping_target' => 'collection', 'continue_shopping_collection' => $collection->handle,
    ]);

    $this->get('/en/compare')->assertOk()->assertSee('href="'.url('/en/offers').'"', false);
    app(StoreSettings::class)->saveSection('catalog', ['continue_shopping_mode' => 'auto']);
    $this->get('/en/compare')->assertOk()->assertDontSee('href="'.url('/en/offers').'"', false);
});
