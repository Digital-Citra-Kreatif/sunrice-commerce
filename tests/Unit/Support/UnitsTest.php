<?php

declare(strict_types=1);

use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\Units;

it('shows stored grams and millimetres in the store\'s units without converting them', function () {
    $settings = app(StoreSettings::class);
    expect(Units::weight(1250))->toBe('1,25 kg')->and(Units::dimension(125))->toBe('12,5 cm')->and(Units::weight(null))->toBeNull();

    $settings->saveSection('general', [...$settings->section('general'), 'weight_unit' => 'g', 'dimension_unit' => 'm']);
    expect(Units::weight(1250))->toBe('1.250 g')->and(Units::dimension(1500))->toBe('1,5 m');
});
