<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\Request;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use Sunrice\Events\EntryDeleted;
use Sunrice\Events\EntryPublished;
use Sunrice\Facades\Sunrice;
use Sunrice\Frontend\TemplateContext;

class CommerceServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package
            ->name('commerce')
            ->hasConfigFile()
            ->hasViews()
            ->hasTranslations()
            ->discoversMigrations()
            ->runsMigrations();
    }

    public function packageRegistered(): void
    {
        $this->registerCustomerGuard();
        $this->app->singleton(Commerce::class);
        $this->app->singleton(Features\FeatureRegistry::class);
        $this->app->singleton(Settings\SettingsRegistry::class);
        // Per request (and per queued job): settings and module states.
        $this->app->scoped(Settings\StoreSettings::class);
        $this->app->scoped(Features\Features::class);
        $this->app->scoped(Support\MoneyFormatter::class);
        $this->app->singleton(Storefront\Slots::class);
        $this->app->singleton(Health\HealthRegistry::class);
        $this->app->singleton(Admin\Setup\SetupChecklist::class);
        $this->app->singleton(Admin\Dashboard\DashboardCards::class);
        $this->app->singleton(Catalog\PriceIndex::class);
        $this->app->scoped(Catalog\Catalog::class);
        $this->app->scoped(Catalog\ProductViewFactory::class);
        $this->app->singleton(Catalog\ProductViewHooks::class);
        $this->app->scoped(Promotions\PriceRules\RuleMatcher::class);
        $this->app->scoped(Promotions\FlashSales\ActiveSales::class);
        $this->app->scoped(Promotions\TargetMatcher::class);
        // Optional connections, replaced when their module is built (C4.8, C5.3, C13).
        $this->app->scoped(Contracts\Inventory::class, fn ($app) => $app->make(Features\Features::class)->active('inventory')
            ? $app->make(Inventory\DatabaseInventory::class)
            : $app->make(Support\Nulls\NullInventory::class));
        $this->app->singleton(Pricing\Calculator::class);
        $this->app->singleton(Pricing\PriceProviders::class);
        $this->app->singletonIf(Contracts\ShippingQuoter::class, Support\Nulls\NullShippingQuoter::class);
        $this->app->scoped(Contracts\TaxCalculator::class, fn ($app) => $app->make(Features\Features::class)->active('taxes')
            ? $app->make(Taxes\TableRateTaxCalculator::class)
            : $app->make(Support\Nulls\NullTaxCalculator::class));
        $this->app->singletonIf(Contracts\Tracking::class, Support\Nulls\NullTracking::class);
        $this->app->singletonIf(Contracts\SaleLimits::class, Support\Nulls\NullSaleLimits::class);
    }

    public function packageBooted(): void
    {
        $this->registerCommands();
        $this->registerAdminAssets();
        $this->registerFeatureGates();
        Permissions\CommercePermissions::register();
        $this->registerStorefront();
        $this->registerHealthAndSchedule();
        $this->registerAdmin();
        $this->registerCatalog();
        $this->registerPromotions();
        Event::listen(JobProcessing::class, function (): void {
            $this->app->forgetScopedInstances();
        });
    }

    /**
     * Store routes in every language (registered after the app has booted,
     * once Sunrice's saved languages apply; Sunrice's catch-all is a
     * fallback route, so these always win), Blade components and body
     * classes.
     */
    protected function registerStorefront(): void
    {
        $router = $this->app['router'];
        $router->aliasMiddleware('commerce.noindex', Http\Middleware\NoIndex::class);

        $this->app->booted(function (): void {
            if ($this->app->routesAreCached()) {
                return;
            }
            Storefront\StorefrontRoutes::localized(function (string $suffix): void {
                require __DIR__.'/../routes/api.php';
                require __DIR__.'/../routes/storefront.php';
                require __DIR__.'/../routes/account.php';
            });
            Route::group([], __DIR__.'/../routes/webhooks.php');
        });

        Blade::component(View\Components\Slot::class, 'commerce::slot');
        Blade::component(View\Components\Product::class, 'commerce::product');
        Blade::component(View\Components\Price::class, 'commerce::price');
        Blade::component(View\Components\Products::class, 'commerce::products');
        Blade::component(View\Components\ProductFilter::class, 'commerce::product-filter');
        Blade::component(View\Components\FlashSale::class, 'commerce::flash-sale');

        // Product pages (and the shop's listings) when the app has no template of its own.
        Sunrice::resolveTemplateUsing(fn (string $view, TemplateContext $context): ?string => Storefront\TemplateFallback::resolve($view, $context));

        Sunrice::bodyClassUsing(function (array $classes): array {
            $name = (string) request()->route()?->getName();
            if (str_starts_with($name, 'commerce.') && ! str_starts_with($name, 'commerce.api.')) {
                $page = str_replace('.', '-', substr(preg_replace('/\.locale$/', '', $name) ?? $name, strlen('commerce.')));
                array_push($classes, 'page-commerce', 'commerce-'.$page);
            }

            return $classes;
        });
    }

    /**
     * The storefront's own session guard (customers), on the same user
     * provider as the admin, so signing in to the shop never opens the admin.
     */
    protected function registerCustomerGuard(): void
    {
        $guard = (string) config('commerce.auth.guard', 'commerce');
        if (config("auth.guards.{$guard}") === null) {
            $adminGuard = (string) config('sunrice.auth.guard', 'web');
            config(["auth.guards.{$guard}" => ['driver' => 'session', 'provider' => config("auth.guards.{$adminGuard}.provider", 'users')]]);
        }
    }

    /** Pricing rules, flash sales and vouchers. */
    protected function registerPromotions(): void
    {
        $commerce = $this->app->make(Commerce::class);
        $commerce->registerPriceCandidateProvider(Pricing\Providers\ProductTierPrice::class, 10);
        $commerce->registerPriceCandidateProvider(Pricing\Providers\PriceRulePrice::class, 20);
        $commerce->registerPriceCandidateProvider(Pricing\Providers\FlashSalePrice::class, 5);

        // Running flash sales lower everyone's price on listings and product pages.
        $flashPrice = function (Catalog\Models\Variant $variant, int $price): int {
            $item = $this->app->make(Promotions\FlashSales\ActiveSales::class)->for($variant);

            return $item !== null && ($item->remaining() ?? 1) > 0 ? min($price, $item->priceFor($variant->price)) : $price;
        };
        $this->app->make(Catalog\PriceIndex::class)->adjustUsing(fn (Catalog\Models\Product $product, Catalog\Models\Variant $variant, int $price) => $flashPrice($variant, $price));
        Catalog\ProductViewFactory::adjustPricesUsing($flashPrice);
        Catalog\ProductViewFactory::extendUsing(fn (Catalog\ProductView $view) => Promotions\FlashSales\FlashSaleView::extend($view));
        $commerce->registerDiscountProvider(Promotions\Vouchers\AutomaticDiscountProvider::class);
        $commerce->registerDiscountProvider(Promotions\Vouchers\VoucherDiscountProvider::class);
        $commerce->registerShippingDiscountProvider(Promotions\Vouchers\FreeShippingProvider::class);
        // Voucher code attempts: 10 a minute per cart and IP address.
        RateLimiter::for('commerce-voucher', fn (Request $request) => Limit::perMinute(10)
            ->by((string) $request->cookie((string) config('commerce.cart.cookie', 'commerce_cart')).'|'.$request->ip()));
        $commerce->onTick('flash sales', fn () => (new Promotions\FlashSales\FlashSaleBoundaries)());
    }

    /** Product projection on publish. */
    protected function registerCatalog(): void
    {
        Event::listen(EntryPublished::class, [Catalog\Listeners\ProjectProducts::class, 'published']);
        Event::listen(EntryDeleted::class, [Catalog\Listeners\ProjectProducts::class, 'deleted']);

        // Uploaded digital files never attached to a published product.
        $this->app->make(Commerce::class)->onPrune('unattached downloads', function (): int {
            $count = 0;
            Catalog\Models\DownloadFile::query()->whereNull('product_id')->where('attached', false)->where('created_at', '<', now()->subDays(7))
                ->each(function (Catalog\Models\DownloadFile $file) use (&$count): void {
                    if ($file->disk !== null && $file->path !== null) {
                        Storage::disk($file->disk)->delete($file->path);
                    }
                    $file->forceDelete();
                    $count++;
                });

            return $count;
        });
    }

    /** Shop navigation, Settings → Store, admin routes and field types. */
    protected function registerAdmin(): void
    {
        foreach ([Admin\Fields\MoneyField::class, Admin\Fields\DateTimeRangeField::class, Admin\Fields\RegionField::class, Admin\Fields\TargetsField::class, Catalog\ProductField::class] as $field) {
            Sunrice::registerField($field);
        }
        Admin\ShopNavigation::register();
        Settings\Sections\BuiltinSections::register($this->app->make(Settings\SettingsRegistry::class));
        Admin\Setup\SetupChecklist::registerBuiltin($this->app->make(Admin\Setup\SetupChecklist::class));

        // The store's money format, for the admin's money inputs and figures.
        Inertia::share('commerce', fn (): array => ['currency' => (array) $this->app->make(Settings\StoreSettings::class)->get('general.currency', [])]);

        Sunrice::addSettingsTab('store', 'Store', 'commerce/settings', fn (mixed $user): bool => Http\Controllers\Admin\SettingsController::menu($user) !== []);
        Sunrice::adminRoutes(function (): void {
            require __DIR__.'/../routes/admin.php';
        });
    }

    protected function registerHealthAndSchedule(): void
    {
        $health = $this->app->make(Health\HealthRegistry::class);
        foreach ([Health\Checks\MailCheck::class, Health\Checks\QueueCheck::class, Health\Checks\SchedulerCheck::class] as $check) {
            $health->register($check);
        }

        $this->callAfterResolving(Schedule::class, function (Schedule $schedule): void {
            $schedule->command('commerce:tick')->everyMinute()->withoutOverlapping();
            $schedule->command('commerce:prune')->daily();
        });
    }

    /** `commerce.feature:<key>` route middleware and @commerceFeature('<key>') … @endcommerceFeature. */
    protected function registerFeatureGates(): void
    {
        $this->app['router']->aliasMiddleware('commerce.feature', Features\Http\EnsureFeatureActive::class);
        Blade::if('commerceFeature', fn (string $feature) => $this->app->make(Features\Features::class)->active($feature));
        Event::listen(Events\StoreSettingsSaved::class, fn () => $this->app->make(Features\Features::class)->flush());
    }

    protected function registerCommands(): void
    {
        if (! $this->app->runningInConsole()) {
            return;
        }

        $this->commands([
            Console\PublishAssetsCommand::class,
            Console\SeedRolesCommand::class,
            Console\ImportRegionsCommand::class,
            Console\TickCommand::class,
            Console\PruneCommand::class,
            Console\DoctorCommand::class,
            Console\SyncProductsCommand::class,
            Console\ScaffoldCommand::class,
        ]);
    }

    /**
     * The prebuilt admin bundle (dist/), published to public/vendor/commerce
     * and loaded on every admin page after Sunrice's own.
     */
    protected function registerAdminAssets(): void
    {
        $this->publishes([__DIR__.'/../dist' => public_path('vendor/commerce')], 'commerce-assets');

        $version = static::assetVersion();
        Sunrice::registerAdminScript('vendor/commerce/admin.js?v='.$version);
        Sunrice::registerAdminStyle('vendor/commerce/admin.css?v='.$version);
    }

    /** Changes with every build, so editors get the new bundle after an upgrade. */
    public static function assetVersion(): string
    {
        $manifest = __DIR__.'/../dist/manifest.json';

        return substr(md5(Commerce::VERSION.'|'.(is_file($manifest) ? (string) filemtime($manifest) : '')), 0, 12);
    }
}
