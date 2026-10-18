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
        $shop = collect($groups['Shop']['items'])->keyBy('label');
        $elsewhere = $groups->except('Shop')->flatMap(fn ($g) => array_column($g['items'], 'href'));

        expect($shop->keys()->all())->toBe(['Dashboard', 'Orders', 'Products', 'Customers', 'Promotions', 'Reports', 'Store settings'])
            ->and($elsewhere)->not->toContain('collections/products/entries', 'taxonomies/brands/terms', 'taxonomies/product_categories/terms')
            ->and($groups->keys()->search('Shop'))->toBe($groups->keys()->search('Content') === false ? 0 : $groups->keys()->search('Content') + 1);
        // Related pages share a submenu; a submenu's own page comes first.
        expect(array_column($shop['Products']['items'], 'label'))->toBe(['All products', 'Product categories', 'Brands', 'Product tags', 'Inventory'])
            ->and(array_column($shop['Orders']['items'], 'label'))->toBe(['All orders', 'Payments to verify'])
            ->and(array_column($shop['Promotions']['items'], 'label'))->toBe(['Vouchers', 'Flash sales', 'Pricing rules']);
    });
})->skip(fn () => ! ShopNavigation::nests(), 'Needs Sunrice\'s sidebar submenus');

it('shows a submenu\'s only link on its own', function () {
    actingAsUserWith(['commerce.vouchers.manage', 'commerce.settings.features']);

    expect(shopItems())->toMatchArray(['Vouchers']);
})->skip(fn () => ! ShopNavigation::nests(), 'Needs Sunrice\'s sidebar submenus');
