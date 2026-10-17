<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

use Closure;
use Sunrice\Commerce\Features\Feature;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthRegistry;
use Sunrice\Commerce\Settings\SettingsRegistry;
use Sunrice\Commerce\Settings\SettingsSection;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\Slots;
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

    // ---- Storefront ------------------------------------------------------------

    /**
     * Render a partial in a slot of the store templates (e.g.
     * "checkout.before_submit"); only while $feature is active, when given.
     */
    public function registerStorefrontSlot(string $slot, string $view, ?string $feature = null): void
    {
        app(Slots::class)->register($slot, $view, $feature);
    }

    // ---- Health and scheduled work ---------------------------------------

    /** @param  class-string<HealthCheck>  $class */
    public function registerHealthCheck(string $class): void
    {
        app(HealthRegistry::class)->register($class);
    }

    /** @var array<string, Closure(): mixed> */
    protected array $tickSteps = [];

    /** @var array<string, Closure(): mixed> */
    protected array $pruneSteps = [];

    /**
     * @internal Work for commerce:tick (every minute); modules register theirs.
     *
     * @param  Closure(): mixed  $step
     */
    public function onTick(string $name, Closure $step): void
    {
        $this->tickSteps[$name] = $step;
    }

    /** @return array<string, Closure(): mixed> */
    public function tickSteps(): array
    {
        return $this->tickSteps;
    }

    /**
     * @internal Work for commerce:prune (daily); a step may return how many rows it removed.
     *
     * @param  Closure(): mixed  $step
     */
    public function onPrune(string $name, Closure $step): void
    {
        $this->pruneSteps[$name] = $step;
    }

    /** @return array<string, Closure(): mixed> */
    public function pruneSteps(): array
    {
        return $this->pruneSteps;
    }

    public function money(int $amount): Money
    {
        return Money::of($amount);
    }
}
