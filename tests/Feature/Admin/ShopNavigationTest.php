<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Cms\Models\Taxonomy;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Settings\StoreSettings;

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

    expect(shopItems())->toMatchArray(['Overview', 'Reports', 'Store settings']);

    app(ToggleFeature::class)->handle('analytics', false);
    expect(shopItems())->toContain('Overview')->not->toContain('Reports');
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
        // First, right under the panel's own Dashboard and Media.
        expect($groups->keys()->search('Shop'))->toBe(1);
        $shop = collect($groups['Shop']['items'])->keyBy('label'); // Marketing is off by default

        expect($shop->keys()->all())->toBe(['Overview', 'Orders', 'Products', 'Customers', 'Promotions', 'Reports', 'Store settings'])
            ->and(array_column($shop['Products']['children'], 'label'))->toBe(['Product categories', 'Brands', 'Product tags', 'Inventory', 'Reviews'])
            ->and(array_column($shop['Orders']['children'], 'label'))->toBe(['Payments to verify'])
            ->and(array_column($shop['Promotions']['children'], 'label'))->toBe(['Vouchers', 'Flash sales', 'Pricing rules']);
    });
});

it('opens the first promotions page the user may see', function () {
    actingAsUserWith(['commerce.flash-sales.manage']);

    $this->get('/admin/commerce/promotions')->assertRedirect('/admin/commerce/flash-sales');
    expect(shopItems())->toContain('Promotions');
});

it('lists products and their taxonomies once, under Shop, attributes included', function () {
    app(ScaffoldStore::class)->handle();
    Taxonomy::query()->create(['handle' => 'sizes', 'title' => 'Sizes']);
    app(StoreSettings::class)->saveSection('catalog', [...app(StoreSettings::class)->section('catalog'), 'attribute_taxonomies' => ['sizes']]);
    actingAsSuperAdmin();

    $this->get('/admin/commerce/settings/features')->assertInertia(function (AssertableInertia $page) {
        $groups = collect($page->toArray()['props']['navigation'])->keyBy('group');
        $urls = fn (string $group) => collect($groups[$group]['items'] ?? [])->pluck('url')->map(fn ($u) => (string) $u)->all();
        $products = collect($groups['Shop']['items'])->keyBy('label')['Products'];

        expect(collect($urls('Content'))->filter(fn ($u) => str_contains($u, 'cms/collections/products'))->all())->toBe([])
            ->and(collect($urls('Taxonomies'))->filter(fn ($u) => str_contains($u, 'product') || str_contains($u, 'brand') || str_contains($u, 'sizes'))->all())->toBe([])
            ->and(array_column($products['children'], 'label'))->toContain('Sizes');
    });
    // Only the sidebar: their pages stay where they are.
    $this->get('/admin/cms/taxonomies/sizes/terms')->assertOk();
});
