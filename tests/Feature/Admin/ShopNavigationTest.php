<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Admin\ShopNavigation;
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

    expect(shopItems())->toMatchArray(['Dashboard', 'Wishlists']);

    app(ToggleFeature::class)->handle('wishlist', false);
    expect(shopItems())->toContain('Dashboard')->not->toContain('Wishlists');
});

it('hides the Shop group from editors without commerce permissions', function () {
    actingAsUserWith(['commerce.settings.features'], 'editor@example.com');

    expect(shopItems())->toBe([]);
});
