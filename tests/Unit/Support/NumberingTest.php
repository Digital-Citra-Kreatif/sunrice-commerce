<?php

declare(strict_types=1);

use Illuminate\Support\Carbon;
use Sunrice\Commerce\Support\NumberFormat;
use Sunrice\Commerce\Support\Sequences;

it('renders number formats', function () {
    $at = Carbon::parse('2026-10-17 10:00');

    expect(NumberFormat::render('ORD-{Y}{m}{d}-{seq:4}', 7, $at))->toBe('ORD-20261017-0007')
        ->and(NumberFormat::render('INV/{Y}/{m}/{seq:4}', 12345, $at))->toBe('INV/2026/10/12345')
        ->and(NumberFormat::render('#{seq}', 1001, $at))->toBe('#1001')
        ->and(NumberFormat::render('{y}-{seq:2}', 3, $at))->toBe('26-03')
        ->and(NumberFormat::valid('ORD-{Y}'))->toBeFalse()
        ->and(NumberFormat::valid('ORD-{seq:5}'))->toBeTrue();
});

it('keys counters by reset rule', function (string $reset, string $key) {
    expect(NumberFormat::key('order', $reset, Carbon::parse('2026-10-17')))->toBe($key);
})->with([
    ['never', 'order'],
    ['yearly', 'order:2026'],
    ['monthly', 'order:2026-10'],
    ['daily', 'order:2026-10-17'],
]);

it('gives out numbers that never repeat', function () {
    $sequences = app(Sequences::class);
    $numbers = collect(range(1, 50))->map(fn () => $sequences->next('order:2026'));

    expect($numbers->unique()->count())->toBe(50)
        ->and($numbers->last())->toBe(50)
        ->and($sequences->next('invoice'))->toBe(1)
        ->and($sequences->current('order:2026'))->toBe(50);
});
