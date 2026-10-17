<?php

declare(strict_types=1);

use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\Models\ShippingZone;

it('manages zones and methods with the shipping permission', function () {
    actingAsUserWith(['commerce.settings.shipping']);

    $this->get('/cms/commerce/settings/shipping')->assertOk()->assertInertia(fn ($page) => $page->component('Commerce/Settings/Shipping')->where('zones', []));

    $this->post('/cms/commerce/settings/shipping/zones', ['values' => ['name' => 'Indonesia', 'everywhere_else' => false, 'regions' => [['region' => ['country' => 'ID']], ['region' => ['country' => 'id']]]]])
        ->assertRedirect('/cms/commerce/settings/shipping');
    $zone = ShippingZone::query()->firstOrFail();
    expect($zone->regions->map->only('country', 'region_code')->all())->toBe([['country' => 'ID', 'region_code' => null]]);

    $this->get("/cms/commerce/settings/shipping/zones/{$zone->id}/methods/create?type=flat")->assertOk()
        ->assertInertia(fn ($page) => $page->component('Commerce/Shared/SchemaForm')->where('title', 'New Flat rate method'));
    $this->post("/cms/commerce/settings/shipping/zones/{$zone->id}/methods?type=flat", ['values' => [
        'title' => ['id' => 'Reguler', 'en' => 'Regular'], 'etd' => ['id' => '2–3 hari'], 'active' => true,
        'settings' => ['cost' => 15000, 'per_item' => 0], 'min_subtotal' => null, 'max_subtotal' => null, 'max_weight' => 5,
    ]])->assertRedirect('/cms/commerce/settings/shipping');
    $method = ShippingMethod::query()->firstOrFail();
    expect($method->type)->toBe('flat')->and($method->setting('cost'))->toBe(15000)->and($method->setting('max_weight'))->toEqual(5)->and($method->titleFor('en'))->toBe('Regular');

    $this->post("/cms/commerce/settings/shipping/zones/{$zone->id}/methods?type=flat", ['values' => ['title' => ['id' => '']]])
        ->assertSessionHasErrors(['values.title.id']);
    $this->get("/cms/commerce/settings/shipping/zones/{$zone->id}/methods/create?type=nope")->assertNotFound();

    $other = ShippingZone::query()->create(['name' => 'Else', 'everywhere_else' => true, 'position' => 5]);
    $this->post('/cms/commerce/settings/shipping/move', ['kind' => 'zone', 'id' => $other->id, 'direction' => 'up']);
    expect(ShippingZone::query()->orderBy('position')->pluck('name')->all())->toBe(['Else', 'Indonesia']);

    $this->delete("/cms/commerce/settings/shipping/zones/{$zone->id}")->assertRedirect();
    expect(ShippingMethod::query()->count())->toBe(0);
});

it('refuses users without the permission', function () {
    actingAsUserWith(['commerce.settings.general']);
    $this->get('/cms/commerce/settings/shipping')->assertForbidden();
});
