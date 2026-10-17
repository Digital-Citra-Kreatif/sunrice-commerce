<?php

declare(strict_types=1);

use Sunrice\Commerce\Contracts\ShippingQuoter;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Taxes\TaxRate;

$taxes = function (bool $inclusive, array $rates) {
    app(ToggleFeature::class)->handle('taxes', true);
    app(StoreSettings::class)->saveSection('taxes', ['prices_include_tax' => $inclusive, 'based_on' => 'shipping']);
    foreach ($rates as $rate) {
        TaxRate::query()->create([...['name' => 'PPN', 'rate' => 1100, 'tax_class' => 'standard'], ...$rate]);
    }
};
$shipping = function (int $cost) {
    app()->instance(ShippingQuoter::class, new class($cost) implements ShippingQuoter
    {
        public function __construct(private int $cost) {}

        public function rates(CalculationState $state): array
        {
            return [['id' => 'flat_rate:flat', 'method' => 'flat_rate', 'label' => 'Flat', 'cost' => $this->cost]];
        }
    });
};
$jakarta = ['destination' => ['country' => 'ID', 'province_code' => '31', 'city_code' => '31.71'], 'shippingRate' => 'flat_rate:flat'];

return [
    'inclusive prices take the tax out' => [
        'products' => ['MUG' => 111000],
        'setup' => fn () => $taxes(true, [[]]),
        'cart' => [['MUG', 1]],
        'expect' => ['totals' => ['subtotal' => 111000, 'tax' => 11000, 'total' => 111000]],
    ],
    'exclusive prices add the tax' => [
        'products' => ['MUG' => 100000],
        'setup' => fn () => $taxes(false, [[]]),
        'cart' => [['MUG', 2]],
        'expect' => ['totals' => ['subtotal' => 200000, 'tax' => 22000, 'total' => 222000]],
    ],
    'a province rate replaces the general one there' => [
        'products' => ['MUG' => 100000],
        'setup' => fn () => $taxes(false, [['country' => 'ID'], ['country' => 'ID', 'region_code' => '31', 'rate' => 1200]]),
        'context' => $jakarta,
        'cart' => [['MUG', 1]],
        'expect' => ['totals' => ['tax' => 12000 + 0]],
    ],
    'compound rates apply on top' => [
        'products' => ['MUG' => 100000],
        'setup' => fn () => $taxes(false, [['name' => 'A', 'rate' => 1000], ['name' => 'B', 'rate' => 500, 'compound' => true]]),
        'cart' => [['MUG', 1]],
        'expect' => ['totals' => ['tax' => 15500, 'total' => 115500]],   // 10% + 5% of 110000
    ],
    'shipping is taxed too' => [
        'products' => ['MUG' => 100000],
        'setup' => function () use ($taxes, $shipping) {
            $taxes(false, [[]]);
            $shipping(20000);
        },
        'context' => $jakarta,
        'cart' => [['MUG', 1]],
        'expect' => ['totals' => ['shipping' => 20000, 'tax' => 13200, 'total' => 133200]],
    ],
    'rounding is per line' => [
        'products' => ['PEN' => 3333, 'INK' => 1111],
        'setup' => fn () => $taxes(false, [[]]),
        'cart' => [['PEN', 1], ['INK', 1]],
        'expect' => ['totals' => ['tax' => 367 + 122]],
    ],
    'with taxes off there is no tax' => [
        'products' => ['MUG' => 100000],
        'setup' => function () {
            TaxRate::query()->create(['name' => 'PPN', 'rate' => 1100]);
            app(StoreSettings::class)->saveSection('taxes', ['prices_include_tax' => false]);
        },
        'cart' => [['MUG', 1]],
        'expect' => ['totals' => ['tax' => 0, 'total' => 100000]],
    ],
    'free shipping voucher capped by an amount' => [
        'products' => ['MUG' => 100000],
        'setup' => function () use ($shipping) {
            $shipping(30000);
            Voucher::query()->create(['name' => 'Ongkir', 'code' => 'ONGKIR', 'type' => 'free_shipping', 'value' => 20000]);
        },
        'context' => $jakarta,
        'codes' => ['ONGKIR'],
        'cart' => [['MUG', 1]],
        'expect' => ['totals' => ['shipping' => 30000, 'shipping_discount' => 20000, 'total' => 110000], 'codes' => ['ONGKIR']],
    ],
    'shipping method condition' => [
        'products' => ['MUG' => 100000],
        'setup' => function () use ($shipping) {
            $shipping(30000);
            Voucher::query()->create(['name' => 'Ongkir', 'code' => 'ONGKIR', 'type' => 'free_shipping', 'value' => 0, 'shipping_methods' => ['courier']]);
        },
        'context' => $jakarta,
        'codes' => ['ONGKIR'],
        'cart' => [['MUG', 1]],
        'expect' => ['totals' => ['shipping_discount' => 0, 'total' => 130000], 'notices' => ['voucher_shipping_method']],
    ],
];
