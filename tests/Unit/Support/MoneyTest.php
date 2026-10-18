<?php

declare(strict_types=1);

use Sunrice\Commerce\Support\Allocator;
use Sunrice\Commerce\Support\Money;
use Sunrice\Commerce\Support\MoneyFormatter;

it('formats rupiah by default and other formats from settings', function () {
    expect(commerce_money(150000))->toBe('Rp150.000')
        ->and(commerce_money(-2500))->toBe('-Rp2.500')
        ->and(commerce_money(150000, withSymbol: false))->toBe('150.000');

    $usd = new MoneyFormatter(['symbol' => '$', 'thousands' => ',', 'decimal' => '.', 'decimals' => 2]);
    expect($usd->format(123456))->toBe('$1,234.56')
        ->and($usd->format(5))->toBe('$0.05')
        ->and((new MoneyFormatter(['symbol' => '€', 'position' => 'right', 'space' => true]))->format(1000))->toBe('1.000 €');
});

it('parses amounts', function () {
    $idr = new MoneyFormatter;
    expect($idr->parse('Rp150.000'))->toBe(150000)
        ->and($idr->parse('150000'))->toBe(150000)
        ->and($idr->parse('-Rp 2.500'))->toBe(-2500)
        ->and($idr->parse('abc'))->toBeNull()
        ->and((new MoneyFormatter(['symbol' => '$', 'thousands' => ',', 'decimal' => '.', 'decimals' => 2]))->parse('$1,234.5'))->toBe(123450);
});

it('rounds percentages half up', function () {
    expect(Money::percentOf(1005, 1000))->toBe(101)   // 100.5 → 101
        ->and(Money::percentOf(1004, 1000))->toBe(100)
        ->and(Money::percentOf(-1005, 1000))->toBe(-101)
        ->and(Money::of(200000)->percent(1100)->amount)->toBe(22000)
        ->and(Money::of(100)->add(50)->subtract(Money::of(30))->multiply(2)->amount)->toBe(240);
});

it('allocates amounts that always sum exactly', function (int $total, array $weights, array $expected) {
    $parts = Allocator::proportional($total, $weights);

    expect($parts)->toBe($expected)->and(array_sum($parts))->toBe($total);
})->with([
    'even' => [100, [1, 1, 1], [34, 33, 33]],
    'by amount' => [10000, ['a' => 15000, 'b' => 5000], ['a' => 7500, 'b' => 2500]],
    'remainders' => [10, [1, 1, 1, 1, 1, 1, 1, 3], [1, 1, 1, 1, 1, 1, 1, 3]],
    'zero weights split evenly' => [5, [0, 0], [3, 2]],
    'negative' => [-100, [1, 1, 1], [-34, -33, -33]],
    'with a zero weight' => [99, [0, 1, 2], [0, 33, 66]],
]);
