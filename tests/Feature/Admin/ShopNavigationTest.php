<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Admin\ShopNavigation;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Features\Actions\ToggleFeature;

function shopItems(): array
{
    $items = [];
    test()->get('/cms/commerce/settings/features')->assertInertia(function (AssertableInertia $page) use (&$items) {
        $groups = $page->toArray()['props']['navigation'];
        foreach ($groups as $index => $group) {
            if ($group['label'] === 'Shop') {
                $items = array_column($group['items'], 'label');
                $items['position'] = $index;
            }
        }
    });

    return $items;
}

it('shows the Shop items a user may open, while their module is active', function () {
    ShopNavigation::add('Wishlists', 'commerce/wishlists', 'heart', 'commerce.reports.view', 'wishlist');
    actingAsUserWith(['commerce.dashboard.view', 'commerce.reports.view', 'commerce.settings.features']);

    expect(shopItems())->toMatchArray(['Dashboard', 'Reports', 'Wishlists']);

    app(ToggleFeature::class)->handle('wishlist', false);
    expect(shopItems())->toContain('Dashboard')->not->toContain('Wishlists');
});

it('hides the Shop group from editors without commerce permissions', function () {
    actingAsUserWith(['commerce.settings.features'], 'editor@example.com');

    expect(shopItems())->toBe([]);   // Store settings stays under Settings → Store
});

it('keeps the whole store in one group: products, their taxonomies and the settings', function () {
    app(ScaffoldStore::class)->handle();
    actingAsSuperAdmin();

    $this->get('/cms/commerce/settings/features')->assertInertia(function (AssertableInertia $page) {
        $groups = collect($page->toArray()['props']['navigation'])->keyBy('label');
        $shop = array_column($groups['Shop']['items'], 'label');
        $elsewhere = $groups->except('Shop')->flatMap(fn ($g) => array_column($g['items'], 'href'));

        expect($shop)->toContain('Products', 'Product categories', 'Brands', 'Product tags', 'Store settings')
            ->and(array_search('Product categories', $shop))->toBe(array_search('Products', $shop) + 1)
            ->and($elsewhere)->not->toContain('collections/products/entries', 'taxonomies/brands/terms', 'taxonomies/product_categories/terms')
            ->and($groups->keys()->search('Shop'))->toBe($groups->keys()->search('Content') === false ? 0 : $groups->keys()->search('Content') + 1);
    });
});
