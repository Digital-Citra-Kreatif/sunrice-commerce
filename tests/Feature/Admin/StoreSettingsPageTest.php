<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;
use Sunrice\Admin\Activity\Activity;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Settings\StoreSettings;

it('opens the first section the user may edit from the Store tab', function () {
    actingAsUserWith(['commerce.settings.catalog']);

    $this->get('/admin/commerce/settings')->assertRedirect('/admin/commerce/settings/catalog');
    $this->get('/admin/commerce/settings/catalog')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Commerce/Settings/Section', false)
        ->where('section.key', 'catalog')
        ->where('sections', [['key' => 'catalog', 'label' => 'Catalog', 'href' => 'commerce/settings/catalog'], ['key' => 'digital', 'label' => 'Digital products', 'href' => 'commerce/settings/digital']])
        ->where('form.values.price_visibility', 'everyone')
        ->where('commerce.settingsNav.0.url', 'commerce/settings'));
    $this->get('/admin/commerce/settings/general')->assertForbidden();
    $this->put('/admin/commerce/settings/general', ['values' => ['name' => 'X']])->assertForbidden();
});

it('renders and saves every built-in section', function (string $section, array $values, string $key, mixed $expected) {
    actingAsSuperAdmin();
    Role::findOrCreate('Customer', 'web'); // the role customer_roles may name

    $this->get("/admin/commerce/settings/{$section}")->assertOk();
    $this->from("/admin/commerce/settings/{$section}")
        ->put("/admin/commerce/settings/{$section}", ['values' => $values])
        ->assertSessionHasNoErrors()->assertRedirect("/admin/commerce/settings/{$section}");

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

    $this->from('/admin/commerce/settings/checkout')
        ->put('/admin/commerce/settings/checkout', ['values' => ['order_number_format' => 'ORD-{Y}', 'quote_number_format' => 'Q-{seq}']])
        ->assertSessionHasErrors(['values.order_number_format']);
    $this->put('/admin/commerce/settings/general', ['values' => ['name' => '', 'selling_mode' => 'shop', 'currency' => ['code' => 'rupiah', 'symbol' => 'Rp', 'decimals' => 0]]])
        ->assertSessionHasErrors(['values.name', 'values.currency.code']);
});

it('refuses a selling mode the switched-on modules cannot serve, and logs saves', function () {
    actingAsSuperAdmin();
    $general = ['name' => 'Toko', 'currency' => ['code' => 'IDR', 'symbol' => 'Rp', 'decimals' => 0]];
    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'quote']])->assertSessionHasNoErrors();
    app(ToggleFeature::class)->handle('payments', false);

    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'shop']])
        ->assertSessionHasErrors(['section' => 'Online store mode needs Payment methods. Choose another selling mode first, or switch on what it needs.']);
    expect(app(StoreSettings::class)->get('general.selling_mode'))->toBe('quote')
        ->and(Activity::query()->where('subject_label', 'Store settings: General')->exists())->toBeTrue();
});

it('refuses WhatsApp orders without a number and the online store without a payment method', function () {
    actingAsSuperAdmin();
    $general = ['name' => 'Toko', 'currency' => ['code' => 'IDR', 'symbol' => 'Rp', 'decimals' => 0]];
    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'catalog']])->assertSessionHasNoErrors();

    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'whatsapp', 'whatsapp' => ['numbers' => []]]])
        ->assertSessionHasErrors(['section' => 'Add a WhatsApp number to take orders by WhatsApp.']);
    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'whatsapp', 'whatsapp' => ['numbers' => [['number' => '0812 0000 0000']]]]])
        ->assertSessionHasNoErrors();

    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'shop']])
        ->assertSessionHasErrors(['section' => 'Turn on a payment method (Settings → Store → Payments) before switching to the online store.']);
    app(StoreSettings::class)->saveSection('payments', ['methods' => ['cod' => ['active' => true]]]);
    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'selling_mode' => 'shop']])->assertSessionHasNoErrors();
    expect(app(StoreSettings::class)->get('general.selling_mode'))->toBe('shop');
});

it('hides sections of inactive modules', function () {
    actingAsSuperAdmin();
    app(ToggleFeature::class)->handle('documents', false);

    $this->get('/admin/commerce/settings/documents')->assertNotFound();
});
