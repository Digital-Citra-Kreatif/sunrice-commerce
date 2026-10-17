<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\ActivityLog;

it('opens the first section the user may edit from the Store tab', function () {
    actingAsUserWith(['commerce.settings.catalog']);

    $this->get('/cms/commerce/settings')->assertRedirect('/cms/commerce/settings/catalog');
    $this->get('/cms/commerce/settings/catalog')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Commerce/Settings/Section', false)
        ->where('section.key', 'catalog')
        ->where('sections', [['key' => 'catalog', 'label' => 'Catalog', 'href' => 'commerce/settings/catalog']])
        ->where('form.values.price_visibility', 'everyone')
        ->where('settingsTabs.0.key', 'store'));
    $this->get('/cms/commerce/settings/general')->assertForbidden();
    $this->put('/cms/commerce/settings/general', ['values' => ['name' => 'X']])->assertForbidden();
});

it('renders and saves every built-in section', function (string $section, array $values, string $key, mixed $expected) {
    actingAsSuperAdmin();

    $this->get("/cms/commerce/settings/{$section}")->assertOk();
    $this->from("/cms/commerce/settings/{$section}")
        ->put("/cms/commerce/settings/{$section}", ['values' => $values])
        ->assertSessionHasNoErrors()->assertRedirect("/cms/commerce/settings/{$section}");

    expect(app(StoreSettings::class)->get("{$section}.{$key}"))->toBe($expected);
})->with([
    'general' => ['general', ['name' => 'Toko Sunrice', 'email' => 'toko@example.com', 'selling_mode' => 'shop',
        'currency' => ['code' => 'IDR', 'symbol' => 'Rp', 'decimals' => 0], 'address' => ['line1' => 'Jl. Merdeka 1', 'region' => ['country' => 'SG']]], 'address.region.country', 'SG'],
    'catalog' => ['catalog', ['price_visibility' => 'signed_in', 'low_stock_threshold' => 3], 'price_visibility', 'signed_in'],
    'checkout' => ['checkout', ['guest_checkout' => false, 'minimum_order' => 50000, 'order_number_format' => 'SO-{seq:5}', 'quote_number_format' => 'Q-{seq}'], 'minimum_order', 50000],
    'accounts' => ['accounts', ['registration' => false, 'customer_roles' => ['Customer']], 'registration', false],
    'documents' => ['documents', ['invoice_number_format' => 'INV-{Y}-{seq:4}'], 'invoice_number_format', 'INV-{Y}-{seq:4}'],
]);

it('shows validation errors under values.', function () {
    actingAsSuperAdmin();

    $this->from('/cms/commerce/settings/checkout')
        ->put('/cms/commerce/settings/checkout', ['values' => ['order_number_format' => 'ORD-{Y}', 'quote_number_format' => 'Q-{seq}']])
        ->assertSessionHasErrors(['values.order_number_format']);
    $this->put('/cms/commerce/settings/general', ['values' => ['name' => '', 'selling_mode' => 'shop', 'currency' => ['code' => 'rupiah', 'symbol' => 'Rp', 'decimals' => 0]]])
        ->assertSessionHasErrors(['values.name', 'values.currency.code']);
});

it('refuses a selling mode the switched-on modules cannot serve, and logs saves', function () {
    actingAsSuperAdmin();
    $general = ['name' => 'Toko', 'currency' => ['code' => 'IDR', 'symbol' => 'Rp', 'decimals' => 0]];
    $this->put('/cms/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'quote']])->assertSessionHasNoErrors();
    app(ToggleFeature::class)->handle('payments', false);

    $this->put('/cms/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'shop']])
        ->assertSessionHasErrors(['section' => 'Online store mode needs Payment methods. Choose another selling mode first, or switch on what it needs.']);
    expect(app(StoreSettings::class)->get('general.selling_mode'))->toBe('quote')
        ->and(ActivityLog::query()->where('subject_label', 'Store settings: General')->exists())->toBeTrue();
});

it('hides sections of inactive modules', function () {
    actingAsSuperAdmin();
    app(ToggleFeature::class)->handle('documents', false);

    $this->get('/cms/commerce/settings/documents')->assertNotFound();
});
