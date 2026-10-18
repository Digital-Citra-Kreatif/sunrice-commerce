<?php

declare(strict_types=1);

use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Facades\Commerce;
use Sunrice\Commerce\Settings\Actions\SaveStoreSettings;
use Sunrice\Commerce\Settings\SettingsSection;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\ActivityLog;

it('lays saved values over the config defaults', function () {
    $settings = app(StoreSettings::class);
    expect($settings->get('checkout.guest_checkout'))->toBeTrue()
        ->and($settings->get('general.currency.symbol'))->toBe('Rp');

    $settings->saveSection('checkout', ['guest_checkout' => false]);
    expect(app(StoreSettings::class)->get('checkout.guest_checkout'))->toBeFalse()
        ->and(app(StoreSettings::class)->get('checkout.require_phone'))->toBeTrue();
});

it('validates, cross-checks and logs a section save', function () {
    actingAsSuperAdmin();
    Commerce::registerSettingsSection(new SettingsSection('demo', 'Demo',
        fields: [['handle' => 'limit', 'type' => 'number', 'label' => 'Limit']],
        rules: ['limit' => ['required', 'integer', 'min:1']],
        check: fn (array $values) => $values['limit'] > 100 ? 'Too many.' : null,
    ));

    expect(fn () => app(SaveStoreSettings::class)->handle('demo', ['limit' => 0]))->toThrow(ValidationException::class);
    expect(fn () => app(SaveStoreSettings::class)->handle('demo', ['limit' => 500]))->toThrow(ValidationException::class, 'Too many.');

    app(SaveStoreSettings::class)->handle('demo', ['limit' => 5, 'unknown' => 'x']);
    expect(app(StoreSettings::class)->section('demo'))->toBe(['limit' => 5])
        ->and(ActivityLog::query()->where('subject_label', 'Store settings: Demo')->exists())->toBeTrue();
});

it('refuses locked values through guards', function () {
    Commerce::registerSettingsSection(new SettingsSection('demo', 'Demo', rules: ['code' => ['string']]));
    SaveStoreSettings::guardUsing(fn (string $section, array $values) => isset($values['code']) ? ['code' => 'Locked.'] : []);

    expect(fn () => app(SaveStoreSettings::class)->handle('demo', ['code' => 'USD']))->toThrow(ValidationException::class, 'Locked.');
    SaveStoreSettings::flushGuards();
});
