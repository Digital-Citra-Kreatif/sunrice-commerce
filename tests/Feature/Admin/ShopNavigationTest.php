<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Features\Actions\ToggleFeature;

/** The Shop group's top-level labels, and its position among the groups. */
function shopItems(): array
{
    $items = [];
    test()->get('/admin/commerce/settings/features')->assertInertia(function (AssertableInertia $page) use (&$items) {
        foreach ($page->toArray()['props']['navigation'] as $index => $group) {
            if ($group['group'] === 'Shop') {
                $items = array_column($group['items'], 'label');
                $items['position'] = $index;
            }
        }
    });

    return $items;
}

it('shows the Shop items a user may open, while their module is active', function () {
    actingAsUserWith(['commerce.dashboard.view', 'commerce.reports.view', 'commerce.settings.features']);

    expect(shopItems())->toMatchArray(['Dashboard', 'Reports', 'Store settings']);

    app(ToggleFeature::class)->handle('analytics', false);
    expect(shopItems())->toContain('Dashboard')->not->toContain('Reports');
});

it('shows only what a user may open: Store settings for one who may only switch features', function () {
    actingAsUserWith(['commerce.settings.features'], 'editor@example.com');

    expect(shopItems())->toBe(['Store settings', 'position' => shopItems()['position']]);
});

it('keeps the whole store in one group: products, their taxonomies and the settings', function () {
    app(ScaffoldStore::class)->handle();
    actingAsSuperAdmin();

    $this->get('/admin/commerce/settings/features')->assertInertia(function (AssertableInertia $page) {
        $groups = collect($page->toArray()['props']['navigation'])->keyBy('group');
        $shop = collect($groups['Shop']['items'])->keyBy('label'); // Marketing is off by default

        expect($shop->keys()->all())->toBe(['Dashboard', 'Orders', 'Products', 'Customers', 'Promotions', 'Reports', 'Store settings'])
            ->and(array_column($shop['Products']['children'], 'label'))->toBe(['Product categories', 'Brands', 'Product tags', 'Inventory'])
            ->and(array_column($shop['Orders']['children'], 'label'))->toBe(['Payments to verify'])
            ->and(array_column($shop['Promotions']['children'], 'label'))->toBe(['Vouchers', 'Flash sales', 'Pricing rules']);
    });
});

it('opens the first promotions page the user may see', function () {
    actingAsUserWith(['commerce.flash-sales.manage']);

    $this->get('/admin/commerce/promotions')->assertRedirect('/admin/commerce/flash-sales');
    expect(shopItems())->toContain('Promotions');
});
