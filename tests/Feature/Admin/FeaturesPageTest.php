<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Features\Features;

it('lists the modules grouped, with requirements and dependents', function () {
    actingAsSuperAdmin();

    $this->get('/admin/commerce/settings/features')->assertOk()->assertInertia(function (AssertableInertia $page) {
        $groups = collect($page->toArray()['props']['groups']);
        expect($groups->pluck('key')->take(3)->all())->toBe(['catalog', 'selling', 'payments']);
        $checkout = collect($groups->firstWhere('key', 'selling')['features'])->firstWhere('key', 'checkout');
        expect($checkout['requires'])->toBe(['Cart and mini cart', 'Orders', 'Customer accounts', 'Payment methods'])
            ->and($checkout['essential'])->toBeTrue();
        $cart = collect($groups->firstWhere('key', 'selling')['features'])->firstWhere('key', 'cart');
        expect(array_column($cart['dependents'], 'key'))->toContain('checkout');
    });
});

it('switches modules and refuses switches the selling mode needs', function () {
    actingAsSuperAdmin();

    $this->from('/admin/commerce/settings/features')->put('/admin/commerce/settings/features/wishlist', ['on' => false])
        ->assertSessionHasNoErrors()->assertSessionHas('success', 'Wishlist switched off.');
    expect(app(Features::class)->active('wishlist'))->toBeFalse();

    // Every order belongs to an account: accounts can't be switched off.
    $this->put('/admin/commerce/settings/features/accounts', ['on' => false])->assertSessionHasErrors('feature');

    $this->put('/admin/commerce/settings/features/payments', ['on' => false])->assertSessionHasErrors('feature');
    expect(app(Features::class)->active('payments'))->toBeTrue();
});

it('needs the features permission', function () {
    actingAsUserWith(['commerce.settings.general']);

    $this->get('/admin/commerce/settings/features')->assertForbidden();
    $this->put('/admin/commerce/settings/features/wishlist', ['on' => false])->assertForbidden();
});
