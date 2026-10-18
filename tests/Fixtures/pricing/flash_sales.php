<?php

declare(strict_types=1);

use Sunrice\Commerce\Promotions\FlashSales\FlashSale;

$sale = function (array $variants, array $item, array $attributes = []): FlashSale {
    $sale = FlashSale::query()->create([...['name' => '12.12', 'slug' => 'twelve', 'starts_at' => now()->subHour(), 'ends_at' => now()->addHour()], ...$attributes]);
    $sale->items()->create([...['product_id' => $variants['MUG']->product_id, 'discount_type' => 'percent_off', 'discount_value' => 2000], ...$item]);

    return $sale;
};

return [
    'a running sale lowers the price' => [
        'products' => ['MUG' => 50000],
        'setup' => fn ($v) => $sale($v, []),
        'cart' => [['MUG', 2]],
        'expect' => ['lines' => ['MUG' => [40000, 80000]], 'sources' => ['MUG' => 'flash_sale'],
            'check' => fn ($state) => expect($state->lines['MUG']->onSale)->toBeTrue()],
    ],
    'a sale that has not started or has ended does nothing' => [
        'products' => ['MUG' => 50000],
        'setup' => function ($v) use ($sale) {
            $sale($v, [], ['starts_at' => now()->addMinute(), 'slug' => 'later']);
            $sale($v, [], ['starts_at' => now()->subDay(), 'ends_at' => now()->subSecond(), 'slug' => 'over']);
        },
        'cart' => [['MUG', 1]],
        'expect' => ['lines' => ['MUG' => [50000, 50000]], 'sources' => ['MUG' => 'base']],
    ],
    'past the cap the regular price applies, with a notice' => [
        'products' => ['MUG' => 50000],
        'setup' => fn ($v) => $sale($v, ['quantity_limit' => 10, 'sold_quantity' => 9]),
        'cart' => [['MUG', 2]],
        'expect' => ['lines' => ['MUG' => [50000, 100000]], 'notices' => ['flash_sale_sold_out']],
    ],
    'within the cap the sale price applies' => [
        'products' => ['MUG' => 50000],
        'setup' => fn ($v) => $sale($v, ['quantity_limit' => 10, 'sold_quantity' => 9, 'discount_type' => 'fixed_price', 'discount_value' => 29900]),
        'cart' => [['MUG', 1]],
        'expect' => ['lines' => ['MUG' => [29900, 29900]]],
    ],
    'the per-customer limit refuses extra quantity at the sale price' => [
        'products' => ['MUG' => 50000],
        'setup' => fn ($v) => $sale($v, ['per_customer_limit' => 2]),
        'customer' => 'customer',
        'cart' => [['MUG', 3]],
        // The line is cut to what this customer may still buy at the sale price.
        'expect' => ['lines' => ['MUG' => [40000, 80000]], 'notices' => ['flash_sale_limit']],
    ],
    'a sale on one variant leaves the others' => [
        'products' => ['MUG' => 50000, 'TEA' => 20000],
        'setup' => fn ($v) => $sale($v, ['product_id' => $v['TEA']->product_id, 'variant_id' => $v['TEA']->id, 'discount_type' => 'amount_off', 'discount_value' => 5000]),
        'cart' => [['MUG', 1], ['TEA', 1]],
        'expect' => ['lines' => ['MUG' => [50000, 50000], 'TEA' => [15000, 15000]]],
    ],
];
