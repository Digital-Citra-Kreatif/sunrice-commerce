<?php

declare(strict_types=1);

use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Models\Entry;
use Sunrice\Models\Taxonomy;
use Sunrice\Models\Term;

$rule = function (array $attributes, array $targets = []): PriceRule {
    $rule = PriceRule::query()->create([...['name' => 'Rule', 'tiers' => [], 'scope' => 'all'], ...$attributes]);
    foreach ($targets as [$type, $id]) {
        $rule->targets()->create(['target_type' => $type, 'target_id' => $id]);
    }

    return $rule;
};

return [
    'product tiers count the product\'s lines together' => [
        'products' => ['SHIRT' => ['type' => 'variable', 'options' => [['id' => 'o', 'name' => 'Size', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]]],
            'variants' => [['id' => 'vs', 'options' => ['o' => 's'], 'sku' => 'SHIRT-S', 'price' => 100000], ['id' => 'vm', 'options' => ['o' => 'm'], 'sku' => 'SHIRT-M', 'price' => 100000]],
            'tiers' => [['min_qty' => 10, 'type' => 'percent_off', 'value' => 1000], ['min_qty' => 20, 'type' => 'fixed_price', 'value' => 80000]]]],
        'cart' => [['SHIRT-S', 6], ['SHIRT-M', 4]],
        'expect' => ['lines' => ['SHIRT-S' => [90000, 540000], 'SHIRT-M' => [90000, 360000]], 'sources' => ['SHIRT-S' => 'tier']],
    ],
    'the best price wins between rules and tiers' => [
        'products' => ['MUG' => ['price' => 50000, 'tiers' => [['min_qty' => 5, 'type' => 'amount_off', 'value' => 5000]]]],
        'setup' => fn () => $rule(['name' => 'Wholesale', 'tiers' => [['min_qty' => 5, 'type' => 'percent_off', 'value' => 2000]]]),
        'cart' => [['MUG', 5]],
        'expect' => ['lines' => ['MUG' => [40000, 200000]], 'sources' => ['MUG' => 'price_rule']],
    ],
    'role-only rules apply to that role' => [
        'products' => ['MUG' => 50000],
        'setup' => fn () => $rule(['audience' => 'roles', 'roles' => ['Reseller'], 'tiers' => [['min_qty' => 1, 'type' => 'fixed_price', 'value' => 35000]]]),
        'customer' => 'role:Reseller',
        'cart' => [['MUG', 1]],
        'expect' => ['lines' => ['MUG' => [35000, 35000]]],
    ],
    'role-only rules ignore other customers' => [
        'products' => ['MUG' => 50000],
        'setup' => fn () => $rule(['audience' => 'roles', 'roles' => ['Reseller'], 'tiers' => [['min_qty' => 1, 'type' => 'fixed_price', 'value' => 35000]]]),
        'customer' => 'customer',
        'cart' => [['MUG', 1]],
        'expect' => ['lines' => ['MUG' => [50000, 50000]], 'sources' => ['MUG' => 'base']],
    ],
    'rule quantity basis counts every targeted line' => [
        'products' => ['MUG' => 50000, 'TEA' => 20000, 'PEN' => 5000],
        'setup' => function (array $v) use ($rule) {
            $rule(['scope' => 'products', 'quantity_basis' => 'rule', 'tiers' => [['min_qty' => 4, 'type' => 'percent_off', 'value' => 1000]]],
                [['product', $v['MUG']->product_id], ['product', $v['TEA']->product_id]]);
        },
        'cart' => [['MUG', 2], ['TEA', 2], ['PEN', 10]],
        'expect' => ['lines' => ['MUG' => [45000, 90000], 'TEA' => [18000, 36000], 'PEN' => [5000, 50000]]],
    ],
    'variant quantity basis counts the line only' => [
        'products' => ['MUG' => 50000, 'TEA' => 20000],
        'setup' => fn () => $rule(['quantity_basis' => 'variant', 'tiers' => [['min_qty' => 3, 'type' => 'amount_off', 'value' => 1000]]]),
        'cart' => [['MUG', 2], ['TEA', 3]],
        'expect' => ['lines' => ['MUG' => [50000, 100000], 'TEA' => [19000, 57000]]],
    ],
    'category targets include subcategories' => [
        'products' => ['MUG' => 50000, 'TEA' => 20000],
        'setup' => function (array $v) use ($rule) {
            $taxonomy = Taxonomy::query()->create(['handle' => 'product_categories', 'title' => 'Categories', 'settings' => []]);
            $parent = Term::query()->create(['taxonomy_id' => $taxonomy->id, 'sort_order' => 0]);
            $child = Term::query()->create(['taxonomy_id' => $taxonomy->id, 'parent_id' => $parent->id, 'sort_order' => 0]);
            Entry::query()->find($v['MUG']->product->entry_id)->terms()->attach($child->id);
            $rule(['scope' => 'categories', 'tiers' => [['min_qty' => 1, 'type' => 'percent_off', 'value' => 5000]]], [['term', $parent->id]]);
        },
        'cart' => [['MUG', 1], ['TEA', 1]],
        'expect' => ['lines' => ['MUG' => [25000, 25000], 'TEA' => [20000, 20000]]],
    ],
    'rules outside their dates do nothing' => [
        'products' => ['MUG' => 50000],
        'setup' => function () use ($rule) {
            $rule(['starts_at' => now()->addDay(), 'tiers' => [['min_qty' => 1, 'type' => 'fixed_price', 'value' => 1]]]);
            $rule(['ends_at' => now()->subMinute(), 'tiers' => [['min_qty' => 1, 'type' => 'fixed_price', 'value' => 2]]]);
            $rule(['active' => false, 'tiers' => [['min_qty' => 1, 'type' => 'fixed_price', 'value' => 3]]]);
        },
        'cart' => [['MUG', 1]],
        'expect' => ['lines' => ['MUG' => [50000, 50000]]],
    ],
];
