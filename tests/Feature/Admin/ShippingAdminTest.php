<?php

declare(strict_types=1);

use Sunrice\Commerce\Shipping\Couriers;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\Models\ShippingZone;

it('manages zones and methods with the shipping permission', function () {
    actingAsUserWith(['commerce.settings.shipping']);

    $this->get('/admin/commerce/settings/shipping')->assertOk()->assertInertia(fn ($page) => $page->component('Commerce/Settings/Shipping')->where('zones', []));

    $this->post('/admin/commerce/settings/shipping/zones', ['values' => ['name' => 'Indonesia', 'everywhere_else' => false, 'regions' => [['region' => ['country' => 'ID']], ['region' => ['country' => 'id']]]]])
        ->assertRedirect('/admin/commerce/settings/shipping');
    $zone = ShippingZone::query()->firstOrFail();
    expect($zone->regions->map->only('country', 'region_code')->all())->toBe([['country' => 'ID', 'region_code' => null]]);

    $this->get("/admin/commerce/settings/shipping/zones/{$zone->id}/methods/create?type=flat")->assertOk()
        ->assertInertia(fn ($page) => $page->component('Commerce/Shared/SchemaForm')->where('title', 'New Flat rate method'));
    $this->post("/admin/commerce/settings/shipping/zones/{$zone->id}/methods?type=flat", ['values' => [
        'title' => ['id' => 'Reguler', 'en' => 'Regular'], 'etd' => ['id' => '2–3 hari'], 'active' => true,
        'settings' => ['cost' => 15000, 'per_item' => 0], 'min_subtotal' => null, 'max_subtotal' => null, 'max_weight' => 5,
    ]])->assertRedirect('/admin/commerce/settings/shipping');
    $method = ShippingMethod::query()->firstOrFail();
    expect($method->type)->toBe('flat')->and($method->setting('cost'))->toBe(15000)->and($method->setting('max_weight'))->toEqual(5)->and($method->titleFor('en'))->toBe('Regular');

    $this->post("/admin/commerce/settings/shipping/zones/{$zone->id}/methods?type=flat", ['values' => ['title' => ['id' => '']]])
        ->assertSessionHasErrors(['values.title.id']);
    $this->get("/admin/commerce/settings/shipping/zones/{$zone->id}/methods/create?type=nope")->assertNotFound();

    $other = ShippingZone::query()->create(['name' => 'Else', 'everywhere_else' => true, 'position' => 5]);
    $this->post('/admin/commerce/settings/shipping/move', ['kind' => 'zone', 'id' => $other->id, 'direction' => 'up']);
    expect(ShippingZone::query()->orderBy('position')->pluck('name')->all())->toBe(['Else', 'Indonesia']);

    $this->delete("/admin/commerce/settings/shipping/zones/{$zone->id}")->assertRedirect();
    expect(ShippingMethod::query()->count())->toBe(0);
});

it('refuses users without the permission', function () {
    actingAsUserWith(['commerce.settings.general']);
    $this->get('/admin/commerce/settings/shipping')->assertForbidden();
});

it('identifies fully and partly shadowed zones without treating the fallback as a match', function () {
    actingAsUserWith(['commerce.settings.shipping']);
    ShippingZone::query()->create(['name' => 'Elsewhere', 'everywhere_else' => true, 'position' => 0]);
    $country = ShippingZone::query()->create(['name' => 'Indonesia', 'position' => 1]);
    $country->regions()->create(['country' => 'ID']);
    $java = ShippingZone::query()->create(['name' => 'Java', 'position' => 2]);
    $java->regions()->create(['country' => 'ID', 'region_code' => '32']);
    $mixed = ShippingZone::query()->create(['name' => 'Mixed', 'position' => 3]);
    $mixed->regions()->create(['country' => 'ID', 'region_code' => '31']);
    $mixed->regions()->create(['country' => 'SG']);

    $this->get('/admin/commerce/settings/shipping')->assertOk()->assertInertia(fn ($page) => $page
        ->where('zones.1.overlap', null)
        ->where('zones.2.overlap', ['zones' => ['Indonesia'], 'all' => true])
        ->where('zones.3.overlap', ['zones' => ['Indonesia'], 'all' => false]));
    $this->post('/admin/commerce/settings/shipping/move', ['kind' => 'zone', 'id' => $java->id, 'direction' => 'up']);
    $this->get('/admin/commerce/settings/shipping')->assertOk()->assertInertia(fn ($page) => $page
        ->where('zones.1.name', 'Java')->where('zones.1.overlap', null));
});

it('manages courier presets in the admin, keeping old shipments named and linked', function () {
    actingAsUserWith(['commerce.settings.shipping']);
    $couriers = app(Couriers::class);

    $this->get('/admin/commerce/settings/shipping/couriers')->assertOk()->assertInertia(fn ($page) => $page->component('Commerce/Settings/Section')
        ->where('parent.href', 'commerce/settings/shipping')
        ->where('form.values.couriers.0', ['key' => 'jne', 'name' => 'JNE', 'tracking_url' => 'https://www.jne.co.id/tracking-package?awb={tracking}', 'active' => true]));

    $this->put('/admin/commerce/settings/shipping/couriers', ['values' => ['couriers' => [
        ['key' => 'rpx', 'name' => 'RPX', 'tracking_url' => 'not a link', 'active' => true],
    ]]])->assertSessionHasErrors('values.couriers.0.tracking_url');

    $this->put('/admin/commerce/settings/shipping/couriers', ['values' => ['couriers' => [
        ['key' => 'jne', 'name' => 'JNE Express', 'tracking_url' => 'https://jne.example/{tracking}', 'active' => false],
        ['key' => '', 'name' => 'Paxel Same Day', 'tracking_url' => 'https://paxel.example/t/{tracking}', 'active' => true],
        ['key' => 'gosend', 'name' => 'GoSend', 'tracking_url' => '', 'active' => true],
    ]]])->assertRedirect('/admin/commerce/settings/shipping');

    expect(array_keys($couriers->all()))->toBe(['jne', 'paxel_same_day', 'gosend'])
        ->and(array_keys($couriers->offered()))->toBe(['paxel_same_day', 'gosend'])
        // Switched off: still names and links its shipments.
        ->and($couriers->trackingUrl('jne', 'A1'))->toBe('https://jne.example/A1')
        ->and($couriers->get('jne')['name'])->toBe('JNE Express')
        ->and($couriers->get('jnt'))->toBeNull();

    // A courier a package adds later joins the list; removed ones stay away.
    $couriers->register('giftex', 'GiftEx', 'https://giftex.example/{tracking}');
    expect(array_keys($couriers->all()))->toBe(['jne', 'paxel_same_day', 'gosend', 'giftex']);
});
