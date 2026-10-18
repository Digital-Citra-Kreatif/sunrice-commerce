<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Settings\StoreSettings;

it('shows the setup checklist and health on a fresh store', function () {
    actingAsUserWith(['commerce.dashboard.view']);

    $this->get('/cms/commerce')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Commerce/Dashboard', false)
        ->where('setup.0.key', 'details')
        ->where('setup.0.done', false)
        ->where('health', fn ($health) => collect($health)->firstWhere('key', 'scheduler')['status'] === 'error')
        ->missing('kpis'));

    app(StoreSettings::class)->saveSection('general', ['name' => 'Toko', 'email' => 'toko@example.com']);
    $this->get('/cms/commerce')->assertInertia(fn (AssertableInertia $page) => $page->where('setup.0.done', true));
});

it('needs the dashboard permission', function () {
    actingAsUserWith(['commerce.orders.view']);

    $this->get('/cms/commerce')->assertForbidden();
});
