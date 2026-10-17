<?php

declare(strict_types=1);

use Sunrice\Models\Entry;

return [
    'base prices and quantities' => [
        'products' => ['MUG' => 50000, 'TEA' => ['price' => 25000, 'compare_at_price' => 30000]],
        'cart' => [['MUG', 2], ['TEA', 3]],
        'expect' => [
            'lines' => ['MUG' => [50000, 100000], 'TEA' => [25000, 75000]],
            'totals' => ['subtotal' => 175000, 'discount' => 0, 'total' => 175000],
            'sources' => ['MUG' => 'base', 'TEA' => 'base'],
            'check' => fn ($state) => expect($state->lines['TEA']->onSale)->toBeTrue()->and($state->lines['MUG']->onSale)->toBeFalse(),
        ],
    ],
    'lines that cannot be bought are removed with a notice' => [
        'products' => ['MUG' => 50000, 'GONE' => ['price' => 10000, 'stock_status' => 'out_of_stock'], 'OFF' => ['price' => 5000, 'active' => false]],
        'cart' => [['MUG', 1], ['GONE', 1], ['OFF', 2]],
        'expect' => [
            'lines' => ['MUG' => [50000, 50000]],
            'removed' => ['GONE', 'OFF'],
            'notices' => ['out_of_stock', 'inactive_variant'],
            'totals' => ['total' => 50000],
        ],
    ],
    'too few left keeps what can be bought' => [
        'products' => ['MUG' => ['price' => 50000, 'track_stock' => true, 'initial_stock' => 2]],
        'cart' => [['MUG', 5]],
        'expect' => ['quantities' => ['MUG' => 2], 'notices' => ['quantity_reduced'], 'totals' => ['total' => 100000]],
    ],
    'quantity rules refuse invalid quantities' => [
        'products' => ['BOX' => ['price' => 1000, 'min_qty' => 6, 'qty_step' => 6]],
        'cart' => [['BOX', 7]],
        'expect' => ['removed' => ['BOX'], 'notices' => ['qty_rules'], 'totals' => ['total' => 0]],
    ],
    'an empty cart totals zero' => [
        'products' => ['MUG' => 50000],
        'cart' => [['MUG', 0]],
        'expect' => ['totals' => ['subtotal' => 0, 'total' => 0], 'removed' => ['MUG']],
    ],
    'unpublished products are removed' => [
        'products' => ['MUG' => 50000],
        'setup' => function (array $variants) {
            Entry::query()->whereKey($variants['MUG']->product->entry_id)->update(['status' => 'draft']);
        },
        'cart' => [['MUG', 1]],
        'expect' => ['removed' => ['MUG'], 'notices' => ['not_published']],
    ],
];
