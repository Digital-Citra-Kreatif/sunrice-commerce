<?php

declare(strict_types=1);

use Sunrice\Commerce\Promotions\Vouchers\Voucher;

$voucher = function (array $attributes, array $targets = []): Voucher {
    $voucher = Voucher::query()->create([...['name' => 'Promo', 'code' => 'HEMAT', 'type' => 'percent', 'value' => 1000], ...$attributes]);
    foreach ($targets as [$mode, $type, $id]) {
        $voucher->targets()->create(['mode' => $mode, 'target_type' => $type, 'target_id' => $id]);
    }

    return $voucher;
};
$products = ['MUG' => 50000, 'TEA' => 25000, 'PEN' => 3333];

return [
    'percent off the cart, allocated exactly' => [
        'products' => $products,
        'setup' => fn () => $voucher(['value' => 1000]),
        'codes' => ['hemat'],
        'cart' => [['MUG', 1], ['TEA', 1], ['PEN', 3]],
        'expect' => ['totals' => ['subtotal' => 84999, 'discount' => 8500, 'total' => 76499], 'codes' => ['HEMAT'],
            'check' => fn ($state) => expect(array_sum(array_map(fn ($l) => $l->discount(), $state->lines)))->toBe(8500)],
    ],
    'percent capped by the maximum discount' => [
        'products' => $products,
        'setup' => fn () => $voucher(['value' => 5000, 'max_discount' => 20000]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 2]],
        'expect' => ['totals' => ['discount' => 20000, 'total' => 80000]],
    ],
    'fixed amount off the cart, never below zero' => [
        'products' => $products,
        'setup' => fn () => $voucher(['type' => 'fixed_cart', 'value' => 100000]),
        'codes' => ['HEMAT'],
        'cart' => [['TEA', 1]],
        'expect' => ['totals' => ['discount' => 25000, 'total' => 0]],
    ],
    'fixed amount off each item' => [
        'products' => $products,
        'setup' => fn () => $voucher(['type' => 'fixed_item', 'value' => 5000]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 2], ['PEN', 1]],
        'expect' => ['lines' => ['MUG' => [50000, 100000, 10000], 'PEN' => [3333, 3333, 3333]], 'totals' => ['discount' => 13333]],
    ],
    'include and exclude targets' => [
        'products' => $products,
        'setup' => fn ($v) => $voucher(['value' => 5000], [['include', 'product', $v['MUG']->product_id], ['include', 'product', $v['TEA']->product_id], ['exclude', 'variant', $v['TEA']->id]]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 1], ['TEA', 1]],
        'expect' => ['lines' => ['MUG' => [50000, 50000, 25000], 'TEA' => [25000, 25000, 0]]],
    ],
    'sale items excluded' => [
        'products' => ['MUG' => ['price' => 50000, 'compare_at_price' => 60000], 'TEA' => 25000],
        'setup' => fn () => $voucher(['value' => 1000, 'exclude_sale_items' => true]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 1], ['TEA', 1]],
        'expect' => ['lines' => ['MUG' => [50000, 50000, 0], 'TEA' => [25000, 25000, 2500]]],
    ],
    'minimum subtotal refused with what is missing' => [
        'products' => $products,
        'setup' => fn () => $voucher(['min_subtotal' => 100000]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 1]],
        'expect' => ['totals' => ['discount' => 0], 'codes' => [], 'notices' => ['voucher_min_subtotal'],
            'check' => fn ($state) => expect($state->notices[0]['message'])->toBe('Spend at least Rp100.000 to use this code (Rp50.000 more).')],
    ],
    'minimum subtotal on eligible items only' => [
        'products' => $products,
        'setup' => fn ($v) => $voucher(['min_subtotal' => 60000, 'subtotal_basis' => 'eligible'], [['include', 'product', $v['TEA']->product_id]]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 1], ['TEA', 2]],
        'expect' => ['notices' => ['voucher_min_subtotal']],
    ],
    'minimum quantity' => [
        'products' => $products,
        'setup' => fn () => $voucher(['min_quantity' => 3]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 2]],
        'expect' => ['notices' => ['voucher_min_quantity']],
    ],
    'unknown, expired, not started and used-up codes' => [
        'products' => $products,
        'setup' => function () use ($voucher) {
            $voucher(['code' => 'OLD', 'ends_at' => now()->subDay()]);
            $voucher(['code' => 'SOON', 'starts_at' => now()->addDay()]);
            $voucher(['code' => 'GONE', 'usage_limit' => 5, 'times_used' => 5]);
            $voucher(['code' => 'OFF', 'active' => false]);
        },
        'codes' => ['NOPE', 'OLD', 'SOON', 'GONE', 'OFF'],
        'cart' => [['MUG', 1]],
        'expect' => ['notices' => ['voucher_invalid', 'voucher_expired', 'voucher_not_started', 'voucher_usage_limit', 'voucher_inactive'], 'totals' => ['discount' => 0]],
    ],
    'signed-in and role audiences' => [
        'products' => $products,
        'setup' => function () use ($voucher) {
            $voucher(['code' => 'MEMBER', 'audience' => 'signed_in']);
            $voucher(['code' => 'VIP', 'audience' => 'roles', 'roles' => ['VIP']]);
        },
        'codes' => ['MEMBER', 'VIP'],
        'cart' => [['MUG', 1]],
        'expect' => ['notices' => ['voucher_sign_in', 'voucher_sign_in']],
    ],
    'role audience for a customer with the role' => [
        'products' => $products,
        'setup' => fn () => $voucher(['code' => 'VIP', 'audience' => 'roles', 'roles' => ['VIP']]),
        'customer' => 'role:VIP',
        'codes' => ['VIP'],
        'cart' => [['MUG', 1]],
        'expect' => ['codes' => ['VIP'], 'totals' => ['discount' => 5000]],
    ],
    'combination rules' => [
        'products' => $products,
        'setup' => function () use ($voucher) {
            $voucher(['code' => 'A', 'value' => 1000]);
            $voucher(['code' => 'B', 'type' => 'fixed_cart', 'value' => 5000]);
            $voucher(['code' => 'SOLO', 'value' => 2000, 'combinable' => false]);
        },
        'codes' => ['A', 'B', 'SOLO'],
        'cart' => [['MUG', 2]],
        'expect' => ['codes' => ['A', 'B'], 'notices' => ['voucher_not_combinable'], 'totals' => ['discount' => 15000]],
    ],
    'an exclusive automatic discount blocks codes' => [
        'products' => $products,
        'setup' => function () use ($voucher) {
            $voucher(['code' => null, 'automatic' => true, 'name' => 'Ramadan', 'value' => 1500, 'exclusive' => true]);
            $voucher(['code' => 'A', 'value' => 1000]);
        },
        'codes' => ['A'],
        'cart' => [['MUG', 2]],
        'expect' => ['codes' => [], 'notices' => ['voucher_not_combinable'], 'totals' => ['discount' => 15000]],
    ],
    'conditions known only at checkout are noted' => [
        'products' => $products,
        'setup' => fn () => $voucher(['payment_methods' => ['bank_transfer']]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 1]],
        'expect' => ['codes' => ['HEMAT'], 'notices' => ['voucher_conditional']],
    ],
    'a payment condition refuses another method' => [
        'products' => $products,
        'setup' => fn () => $voucher(['payment_methods' => ['bank_transfer']]),
        'context' => ['paymentMethod' => 'cod'],
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 1]],
        'expect' => ['codes' => [], 'notices' => ['voucher_payment_method']],
    ],
    'a destination condition' => [
        'products' => $products,
        'setup' => fn () => $voucher(['destinations' => [['country' => 'ID', 'region_code' => '32']]]),
        'context' => ['destination' => ['country' => 'ID', 'province_code' => '31', 'city_code' => '31.71']],
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 1]],
        'expect' => ['notices' => ['voucher_destination']],
    ],
    'buy 2 get 1 free, cheapest first, repeated sets' => [
        'products' => $products,
        'setup' => fn () => $voucher(['type' => 'buy_x_get_y', 'value' => 0, 'bxgy' => ['buy_qty' => 2, 'get_qty' => 1, 'get_type' => 'free', 'get_value' => 0]]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 3], ['TEA', 2], ['PEN', 1]],
        // 6 units → 2 sets → the 2 cheapest units are free: PEN (3333) and one TEA (25000)
        'expect' => ['lines' => ['MUG' => [50000, 150000, 0], 'TEA' => [25000, 50000, 25000], 'PEN' => [3333, 3333, 3333]], 'totals' => ['discount' => 28333]],
    ],
    'buy a mug, get tea half price' => [
        'products' => $products,
        'setup' => fn ($v) => $voucher(['type' => 'buy_x_get_y', 'value' => 0, 'bxgy' => ['buy_qty' => 1, 'get_qty' => 1, 'get_type' => 'percent_off', 'get_value' => 5000]],
            [['buy', 'product', $v['MUG']->product_id], ['get', 'product', $v['TEA']->product_id]]),
        'codes' => ['HEMAT'],
        'cart' => [['MUG', 2], ['TEA', 3]],
        'expect' => ['lines' => ['TEA' => [25000, 75000, 25000], 'MUG' => [50000, 100000, 0]]],
    ],
];
