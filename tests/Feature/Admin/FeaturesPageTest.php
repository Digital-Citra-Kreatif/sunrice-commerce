<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Features\Features;

it('lists the modules grouped, with requirements and dependents', function () {
    actingAsSuperAdmin();

    $this->get('/cms/commerce/settings/features')->assertOk()->assertInertia(function (AssertableInertia $page) {
        $groups = collect($page->toArray()['props']['groups']);
        expect($groups->pluck('key')->take(3)->all())->toBe(['catalog', 'selling', 'payments']);
        $checkout = collect($groups->firstWhere('key', 'selling')['features'])->firstWhere('key', 'checkout');
        expect($checkout['requires'])->toBe(['Cart and mini cart', 'Orders', 'Payment methods'])
            ->and($checkout['essential'])->toBeTrue();
        $cart = collect($groups->firstWhere('key', 'selling')['features'])->firstWhere('key', 'cart');
        expect(array_column($cart['dependents'], 'key'))->toContain('checkout');
    });
});

it('switches modules and refuses switches the selling mode needs', function () {
    actingAsSuperAdmin();

    $this->from('/cms/commerce/settings/features')->put('/cms/commerce/settings/features/wishlist', ['on' => false])
        ->assertSessionHasNoErrors()->assertSessionHas('success', 'Wishlist switched off.');
    expect(app(Features::class)->active('wishlist'))->toBeFalse();

    $this->put('/cms/commerce/settings/features/accounts', ['on' => false])
        ->assertSessionHas('success', fn (string $m) => str_contains($m, 'Also off now: Sign in with an emailed code') === false);

    $this->put('/cms/commerce/settings/features/payments', ['on' => false])->assertSessionHasErrors('feature');
    expect(app(Features::class)->active('payments'))->toBeTrue();
});

it('needs the features permission', function () {
    actingAsUserWith(['commerce.settings.general']);

    $this->get('/cms/commerce/settings/features')->assertForbidden();
    $this->put('/cms/commerce/settings/features/wishlist', ['on' => false])->assertForbidden();
});
