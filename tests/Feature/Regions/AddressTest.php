<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Validator;
use Sunrice\Commerce\Regions\RegionImporter;
use Sunrice\Commerce\Support\AddressRules;
use Sunrice\Commerce\Support\Phone;

beforeEach(fn () => (new RegionImporter(__DIR__.'/../../Fixtures/regions'))->import(4));

function validateAddress(array $address): Illuminate\Validation\Validator
{
    $validator = Validator::make(['address' => $address], AddressRules::rules('address'));
    $validator->after(fn ($v) => AddressRules::after($v, 'address'));
    $validator->passes();

    return $validator;
}

$valid = ['name' => 'Rina', 'phone' => '0812 3456 7890', 'country' => 'ID', 'province_code' => '32', 'city_code' => '32.73',
    'district_code' => '32.73.01', 'village_code' => '32.73.01.1001', 'line1' => 'Jl. Sarijadi 1'];

it('accepts a matching Indonesian region chain and fills in names', function () use ($valid) {
    expect(validateAddress($valid)->errors()->all())->toBe([]);

    $address = AddressRules::normalize($valid);
    expect($address->get('city'))->toBe('Kota Bandung')
        ->and($address->get('postal_code'))->toBe('40151')
        ->and($address->get('phone'))->toBe('+6281234567890')
        ->and($address->regionCodes())->toBe(['32.73.01.1001', '32.73.01', '32.73', '32'])
        ->and($address->format())->toContain("Sarijadi, Sukasari, Kota Bandung\nJawa Barat 40151");
});

it('refuses broken or inactive chains', function () use ($valid) {
    expect(validateAddress([...$valid, 'city_code' => '32.04'])->errors()->keys())->toContain('address.district_code')
        ->and(validateAddress([...$valid, 'province_code' => '31'])->errors()->keys())->toContain('address.city_code')
        ->and(validateAddress([...$valid, 'district_code' => null])->errors()->keys())->toContain('address.district_code');
});

it('takes free-text addresses abroad', function () {
    $validator = validateAddress(['name' => 'Tan', 'phone' => '+6591234567', 'country' => 'SG', 'city' => 'Singapore', 'postal_code' => '018956', 'line1' => '10 Bayfront Ave']);

    expect($validator->errors()->all())->toBe([])
        ->and(AddressRules::normalize(['country' => 'SG', 'city' => 'Singapore', 'phone' => '91234567'])->get('phone'))->toBe('+6591234567');
});

it('normalizes phone numbers', function (?string $in, ?string $out) {
    expect(Phone::normalize($in))->toBe($out);
})->with([
    ['0812-3456-789', '+628123456789'],
    ['628123456789', '+628123456789'],
    ['+62 812 3456 789', '+628123456789'],
    ['00628123456789', '+628123456789'],
    ['12', null],
    [null, null],
]);
