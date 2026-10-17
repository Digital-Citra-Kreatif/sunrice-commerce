<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

use Sunrice\Commerce\Features\Feature;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\SettingsRegistry;
use Sunrice\Commerce\Settings\SettingsSection;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\Money;

/**
 * The Sunrice Commerce registration API. Extension packages call it from
 * their service providers (payment methods, shipping types, features,
 * settings sections…); templates and code read the store through it.
 *
 * See docs/extending.md for every method.
 */
class Commerce
{
    public const VERSION = '1.0.0-dev';

    public function version(): string
    {
        return self::VERSION;
    }

    // ---- Modules and settings ----------------------------------------------

    /** Add a module of your own to Settings → Store → Features. */
    public function registerFeature(Feature $feature): void
    {
        app(FeatureRegistry::class)->register($feature);
    }

    public function features(): Features
    {
        return app(Features::class);
    }

    /** Is a module active (switched on, in its selling modes, requirements active)? */
    public function active(string $feature): bool
    {
        return $this->features()->active($feature);
    }

    /** Add a section to Settings → Store. */
    public function registerSettingsSection(SettingsSection $section): void
    {
        app(SettingsRegistry::class)->register($section);
    }

    public function settings(): StoreSettings
    {
        return app(StoreSettings::class);
    }

    public function money(int $amount): Money
    {
        return Money::of($amount);
    }
}
