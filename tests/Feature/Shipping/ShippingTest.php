<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Pricing\Calculator;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Shipping\Contracts\ShippingMethodType;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\Models\ShippingZone;
use Sunrice\Commerce\Shipping\Package;
use Sunrice\Commerce\Shipping\ShippingManager;
use Sunrice\Commerce\Shipping\ShippingRate;
use Sunrice\Commerce\Shipping\ShippingRequest;
use Sunrice\Commerce\Shipping\Types\WeightBased;
use Sunrice\Commerce\Shipping\ZoneMatcher;
use Sunrice\Commerce\Support\Address;

/** @param  array<int, array{0: string, 1?: string|null}>  $regions */
function zone(string $name, array $regions = [], bool $everywhere = false, int $position = 0): ShippingZone
{
    $zone = ShippingZone::query()->create(['name' => $name, 'everywhere_else' => $everywhere, 'position' => $position]);
    foreach ($regions as $r) {
        $zone->regions()->create(['country' => $r[0], 'region_code' => $r[1] ?? null]);
    }

    return $zone;
}

function method(ShippingZone $zone, string $type, array $settings = [], array $attributes = []): ShippingMethod
{
    return $zone->methods()->create(['type' => $type, 'title' => ['id' => ucfirst($type), 'en' => ucfirst($type)], 'settings' => $settings, 'active' => true, ...$attributes]);
}

function shippingRequest(?array $to, array $lines = [[1000, 1]], int $subtotal = 100000, bool $voucher = false): ShippingRequest
{
    return new ShippingRequest(
        origin: Address::fromArray(['country' => 'ID']),
        destination: $to === null ? null : Address::fromArray($to),
        package: new Package(array_map(fn ($l) => ['weight' => $l[0], 'quantity' => $l[1], 'length' => $l[2] ?? 0, 'width' => $l[3] ?? 0, 'height' => $l[4] ?? 0, 'value' => 0], $lines)),
        subtotal: $subtotal,
        freeShippingVoucher: $voucher,
    );
}

function quoted(?array $to, array $lines = [[1000, 1]], int $subtotal = 100000, bool $voucher = false): array
{
    app()->forgetScopedInstances();

    return array_map(fn (ShippingRate $r) => [$r->label, $r->cost], app(ShippingManager::class)->quote(shippingRequest($to, $lines, $subtotal, $voucher)));
}

$bandung = ['country' => 'ID', 'province_code' => '32', 'city_code' => '32.73', 'district_code' => '32.73.01'];
$bogor = ['country' => 'ID', 'province_code' => '32', 'city_code' => '32.01', 'district_code' => '32.01.01'];
$jakarta = ['country' => 'ID', 'province_code' => '31', 'city_code' => '31.71', 'district_code' => '31.71.01'];

it('matches zones by district, city, province, country and everywhere else, in order', function () use ($bandung, $bogor, $jakarta) {
    $everywhere = zone('Rest of world', everywhere: true, position: 0);
    $district = zone('Coblong', [['ID', '32.73.01']], position: 1);
    $city = zone('Bandung', [['ID', '32.73']], position: 2);
    $province = zone('Jawa Barat', [['ID', '32']], position: 3);
    $country = zone('Indonesia', [['ID']], position: 4);
    $matcher = app(ZoneMatcher::class);
    $match = fn (array $a) => $matcher->match(Address::fromArray($a))?->name;

    expect($match($bandung))->toBe('Coblong')
        ->and($match([...$bandung, 'district_code' => '32.73.02']))->toBe('Bandung')
        ->and($match($bogor))->toBe('Jawa Barat')
        ->and($match($jakarta))->toBe('Indonesia')
        ->and($match(['country' => 'SG', 'city' => 'Singapore']))->toBe('Rest of world');

    // Order decides: the country zone first now wins everywhere in Indonesia.
    $country->update(['position' => 0]);
    $matcher->flush();
    expect($match($bandung))->toBe('Indonesia');
    // "32.7" isn't the parent of "32.73".
    $country->delete();
    $province->regions()->update(['region_code' => '32.7']);
    $district->delete();
    $city->delete();
    $matcher->flush();
    expect($match($bandung))->toBe('Rest of world');
});

it('prices each built-in method', function () use ($jakarta) {
    $zone = zone('Indonesia', [['ID']]);
    method($zone, 'flat', ['cost' => 10000, 'per_item' => 2000]);
    expect(quoted($jakarta, [[500, 2], [500, 1]]))->toBe([['Flat', 16000]]);

    ShippingMethod::query()->delete();
    method($zone, 'free', ['requires' => 'min_subtotal', 'min_subtotal' => 200000]);
    expect(quoted($jakarta, subtotal: 199999))->toBe([])
        ->and(quoted($jakarta, subtotal: 200000))->toBe([['Free', 0]]);
    ShippingMethod::query()->update(['settings' => ['requires' => 'voucher']]);
    expect(quoted($jakarta))->toBe([])->and(quoted($jakarta, voucher: true))->toBe([['Free', 0]]);

    ShippingMethod::query()->delete();
    method($zone, 'weight', ['mode' => 'per_kg', 'price_per_kg' => 9000, 'tolerance' => 300, 'min_weight' => 1]);
    expect(quoted($jakarta, [[1300, 1]]))->toBe([['Weight', 9000]])     // 1.3 kg → 1 kg
        ->and(quoted($jakarta, [[1310, 1]]))->toBe([['Weight', 18000]]) // 1.31 kg → 2 kg
        ->and(quoted($jakarta, [[200, 1]]))->toBe([['Weight', 9000]]);  // the minimum

    // Volumetric: 30×30×20 cm ÷ 6000 = 3 kg, more than the 1 kg it weighs.
    ShippingMethod::query()->update(['settings' => ['mode' => 'per_kg', 'price_per_kg' => 9000, 'tolerance' => 300, 'min_weight' => 1, 'volumetric' => true]]);
    expect(quoted($jakarta, [[1000, 1, 300, 300, 200]]))->toBe([['Weight', 27000]]);

    ShippingMethod::query()->update(['settings' => ['mode' => 'table', 'table' => [['up_to' => 5, 'cost' => 30000], ['up_to' => 1, 'cost' => 12000]]]]);
    expect(quoted($jakarta, [[900, 1]]))->toBe([['Weight', 12000]])
        ->and(quoted($jakarta, [[4000, 1]]))->toBe([['Weight', 30000]])
        ->and(quoted($jakarta, [[6000, 1]]))->toBe([]);

    expect(WeightBased::chargedKg(0, 300, 1))->toBe(1)->and(WeightBased::chargedKg(2000, 0, 1))->toBe(2)->and(WeightBased::chargedKg(2001, 0, 1))->toBe(3);
});

it('filters methods by subtotal, weight and active', function () use ($jakarta) {
    $zone = zone('Indonesia', [['ID']]);
    method($zone, 'flat', ['cost' => 10000, 'min_subtotal' => 50000, 'max_subtotal' => 500000, 'max_weight' => 2], ['title' => ['id' => 'A']]);
    method($zone, 'flat', ['cost' => 20000], ['title' => ['id' => 'B'], 'active' => false]);

    expect(quoted($jakarta, [[1000, 1]], 49999))->toBe([])
        ->and(quoted($jakarta, [[1000, 1]], 100000))->toBe([['A', 10000]])
        ->and(quoted($jakarta, [[1000, 1]], 600000))->toBe([])
        ->and(quoted($jakarta, [[2500, 1]], 100000))->toBe([]);
});

it('offers pickup from any zone without an address, and needs an address for the rest', function () use ($jakarta) {
    $zone = zone('Bandung', [['ID', '32.73']]);
    method($zone, 'flat', ['cost' => 10000]);
    method($zone, 'pickup', ['locations' => [['name' => 'Toko Dago', 'address' => 'Jl. Dago 1'], ['name' => 'Gudang', 'address' => 'Jl. Soekarno']]]);

    expect(quoted(null))->toBe([['Pickup: Toko Dago', 0], ['Pickup: Gudang', 0]])
        ->and(quoted($jakarta))->toBe([['Pickup: Toko Dago', 0], ['Pickup: Gudang', 0]]); // Jakarta matches no zone

    $rate = app(ShippingManager::class)->quote(shippingRequest(null))[0];
    expect($rate->id())->toStartWith('pickup:')->and($rate->meta['location']['address'])->toBe('Jl. Dago 1');
});

it('takes a carrier type registered by a package and the calculator charges the chosen rate', function () use ($jakarta) {
    app(Commerce::class)->registerShippingMethodType(FakeCarrier::class);
    $zone = zone('Indonesia', [['ID']]);
    method($zone, 'fake', ['base' => 7000]);
    expect(quoted($jakarta, [[1500, 2]]))->toBe([['Fake REG', 10000], ['Fake YES', 20000]]);

    app(ScaffoldStore::class)->handle();
    publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000, 'weight' => 400]]], title: 'Mug');
    $mug = Variant::query()->where('sku', 'MUG')->firstOrFail();
    app()->forgetScopedInstances();
    $rateId = 'fake:'.ShippingMethod::query()->value('id').':yes';
    $state = app(Calculator::class)->calculate([[$mug, 2]], PricingContext::guest()->with(['destination' => $jakarta, 'shippingRate' => $rateId]));

    expect(array_column($state->shipping['rates'], 'id'))->toContain($rateId)
        ->and($state->shipping['cost'])->toBe(16000) // 800 g → 1 kg: (7000 + 1000) × 2
        ->and($state->totals['total'])->toBe(116000);
});

class FakeCarrier implements ShippingMethodType
{
    public static function key(): string
    {
        return 'fake';
    }

    public function label(): string
    {
        return 'Fake carrier';
    }

    public function settingsSchema(): array
    {
        return [['handle' => 'base', 'type' => 'commerce_money', 'label' => 'Base']];
    }

    public function settingsRules(): array
    {
        return [];
    }

    public function rates(ShippingRequest $request, ShippingMethod $method): array
    {
        $kg = (int) ceil($request->package->weight() / 1000);
        $reg = (int) $method->setting('base') + $kg * 1000;

        return [ShippingRate::for($method, $reg, 'reg', 'Fake REG', '2-3 days'), ShippingRate::for($method, $reg * 2, 'yes', 'Fake YES', '1 day')];
    }
}
