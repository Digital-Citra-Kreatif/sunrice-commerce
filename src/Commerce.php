<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

use Closure;
use Sunrice\Commerce\Analytics\Reports\Report;
use Sunrice\Commerce\Analytics\Reports\Reports;
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

    /** @param  class-string<Report>  $class  a report on Shop → Reports */
    public function registerReport(string $class): void
    {
        app(Reports::class)->register($class);
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

    // ---- Pricing ------------------------------------------------------------

    /**
     * A source of unit prices (the lowest candidate wins).
     *
     * @param  class-string<Pricing\Contracts\PriceCandidateProvider>  $class
     */
    public function registerPriceCandidateProvider(string $class, int $order = 100): void
    {
        app(Pricing\PriceProviders::class)->price($class, $order);
    }

    /** @param  class-string<Pricing\Contracts\DiscountProvider>  $class */
    public function registerDiscountProvider(string $class): void
    {
        app(Pricing\PriceProviders::class)->discount($class);
    }

    /** @param  class-string<Pricing\Contracts\ShippingDiscountProvider>  $class */
    public function registerShippingDiscountProvider(string $class): void
    {
        app(Pricing\PriceProviders::class)->shippingDiscount($class);
    }

    /** @param  class-string<Pricing\Contracts\FeeProvider>  $class */
    public function registerFeeProvider(string $class): void
    {
        app(Pricing\PriceProviders::class)->fee($class);
    }

    /**
     * A step in the calculation pipeline (priorities: lines 10, unit prices 20,
     * subtotals 30, discounts 40, shipping 50, shipping discounts 60, fees 70,
     * taxes 80, totals 90).
     *
     * @param  class-string<Pricing\Contracts\CalculationStage>  $class
     */
    public function registerCalculationStage(string $class, int $priority): void
    {
        app(Pricing\Calculator::class)->registerStage($class, $priority);
    }

    /**
     * A page in My Account's menu (a storefront route of yours, under commerce.auth).
     *
     * @param  string|Closure(): string  $label
     */
    public function registerAccountPage(string $key, string|Closure $label, string $route, ?string $feature = null, int $position = 100): void
    {
        app(Customers\AccountNavigation::class)->register($key, $label, $route, $feature, $position);
    }

    // ---- Checkout -------------------------------------------------------------

    /**
     * Extra checkout fields (stored on the order in `fields`).
     *
     * @param  Closure(Checkout\CheckoutData, Pricing\CalculationState): array<int, array<string, mixed>>  $fields
     */
    public function checkoutFieldsUsing(Closure $fields): void
    {
        app(Checkout\CheckoutFields::class)->add($fields);
    }

    /** @param  class-string<Checkout\Completion\CheckoutCompletion>  $class */
    public function registerCheckoutCompletion(string $class): void
    {
        app(Checkout\Completion\Completions::class)->register($class);
    }

    /**
     * Replace order numbering entirely.
     *
     * @param  Closure(Orders\Models\Order|null): string  $generator
     */
    public function orderNumberUsing(Closure $generator): void
    {
        Orders\Numbering::orderNumbersUsing($generator);
    }

    /**
     * A panel on the admin order page; its bundle renders it with
     * SunriceCommerce.registerOrderPanel(key, Component), receiving `data`.
     *
     * @param  (Closure(Orders\Models\Order): array<string, mixed>)|null  $data
     */
    public function registerOrderPanel(string $key, string $label, ?Closure $data = null, ?string $permission = null, int $position = 100): void
    {
        app(Orders\OrderPanels::class)->register($key, $label, $data, $permission, $position);
    }

    // ---- Payments -------------------------------------------------------------

    /** @param  class-string<Payments\Contracts\PaymentMethod>  $class */
    public function registerPaymentMethod(string $class): void
    {
        app(Payments\PaymentRegistry::class)->register($class);
    }

    // ---- Emails ---------------------------------------------------------------

    /** An email of a package's own, listed in Settings → Emails and sent with Notifier::send(). */
    public function registerEmail(Notifications\EmailDefinition $email): void
    {
        app(Notifications\Emails::class)->register($email);
    }

    // ---- Shipping -------------------------------------------------------------

    /** @param  class-string<Shipping\Contracts\ShippingMethodType>  $class */
    public function registerShippingMethodType(string $class): void
    {
        app(Shipping\ShippingTypes::class)->register($class);
    }

    /** A courier preset for shipments; {tracking} in the URL is replaced with the tracking number. */
    public function registerCourier(string $key, string $name, ?string $trackingUrl = null): void
    {
        app(Shipping\Couriers::class)->register($key, $name, $trackingUrl);
    }

    public function money(int $amount): Money
    {
        return Money::of($amount);
    }
}
