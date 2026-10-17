<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

use Illuminate\Auth\Events\Login;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Database\Eloquent\Builder;
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
use Sunrice\Http\Middleware\SetFrontendLocale;

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
        $this->app->scoped(Cart\CartManager::class);
        $this->app->scoped(Customers\CurrentCustomer::class);
        $this->app->singleton(Customers\AccountNavigation::class);
        $this->app->scoped(Wishlist\WishlistManager::class);
        $this->app->scoped(Cart\CompareList::class);
        // Optional connections, replaced when their module is built (C4.8, C5.3, C13).
        $this->app->scoped(Contracts\Inventory::class, fn ($app) => $app->make(Features\Features::class)->active('inventory')
            ? $app->make(Inventory\DatabaseInventory::class)
            : $app->make(Support\Nulls\NullInventory::class));
        $this->app->singleton(Pricing\Calculator::class);
        $this->app->singleton(Pricing\PriceProviders::class);
        $this->app->bindIf(Documents\DocumentRenderer::class, Documents\DompdfRenderer::class);
        $this->app->singleton(Payments\PaymentRegistry::class);
        $this->app->singleton(Notifications\Emails::class);
        $this->app->singleton(Checkout\CheckoutFields::class);
        $this->app->singleton(Orders\OrderPanels::class);
        $this->app->singleton(Checkout\Completion\Completions::class);
        $this->app->scoped(Payments\PaymentManager::class);
        $this->app->singleton(Shipping\ShippingTypes::class);
        $this->app->singleton(Shipping\Couriers::class);
        $this->app->scoped(Shipping\ZoneMatcher::class);
        $this->app->bind(Contracts\ShippingQuoter::class, fn ($app) => $app->make(Features\Features::class)->active('shipping')
            ? $app->make(Shipping\ShippingManager::class)
            : $app->make(Support\Nulls\NullShippingQuoter::class));
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
        $this->registerCart();
        $this->registerCustomers();
        $this->registerOrders();
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
        $router->aliasMiddleware('commerce.auth', Http\Middleware\AuthenticateCustomer::class);

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
            Route::middleware([...(array) config('sunrice.frontend.middleware', ['web']), SetFrontendLocale::class])->group(__DIR__.'/../routes/oauth.php');
        });

        Blade::component(View\Components\Slot::class, 'commerce::slot');
        Blade::component(View\Components\Product::class, 'commerce::product');
        Blade::component(View\Components\Price::class, 'commerce::price');
        Blade::component(View\Components\Products::class, 'commerce::products');
        Blade::component(View\Components\ProductFilter::class, 'commerce::product-filter');
        Blade::component(View\Components\FlashSale::class, 'commerce::flash-sale');
        Blade::component(View\Components\Cart::class, 'commerce::cart');
        Blade::component(View\Components\MiniCart::class, 'commerce::mini-cart');
        Blade::component(View\Components\WishlistButton::class, 'commerce::wishlist-button');
        Blade::component(View\Components\CompareButton::class, 'commerce::compare-button');

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

    /** Customer accounts: sign-in merges, My Account pages, the Users list scope. */
    protected function registerCustomers(): void
    {
        Event::listen(Login::class, Customers\Listeners\MergeOnSignIn::class);
        $nav = $this->app->make(Customers\AccountNavigation::class);
        $nav->register('overview', fn () => __('commerce::account.overview.title'), 'commerce.account', position: 10);
        $nav->register('profile', fn () => __('commerce::account.profile.title'), 'commerce.account.profile', position: 80);
        $nav->register('orders', fn () => __('commerce::account.orders.title'), 'commerce.account.orders', 'orders', position: 20);
        $nav->register('quotes', fn () => __('commerce::account.orders.quotes'), 'commerce.account.quotes',
            fn (): bool => commerce_feature('orders') && $this->app->make(Settings\StoreSettings::class)->get('general.selling_mode') === 'quote', position: 25);
        $nav->register('downloads', fn () => __('commerce::digital.title'), 'commerce.account.downloads',
            fn (): bool => Digital\Models\DownloadGrant::query()->whereHas('order', fn ($q) => $q->where('user_id', commerce_customer()?->getAuthIdentifier()))->exists(), position: 30);
        $nav->register('addresses', fn () => __('commerce::account.addresses.title'), 'commerce.account.addresses', position: 70);

        // Users lists staff: users whose roles are all customer roles are customers.
        Sunrice::usersQueryUsing(function (Builder $query): Builder {
            $customerRoles = (array) $this->app->make(Settings\StoreSettings::class)->get('accounts.customer_roles', ['Customer']);

            return $query->where(fn ($q) => $q->whereDoesntHave('roles')->orWhereHas('roles', fn ($r) => $r->whereNotIn('name', $customerRoles)));
        });
        $this->app->make(Commerce::class)->registerHealthCheck(Health\Checks\AccountsCheck::class);
    }

    /** Orders: the currency lock, lifecycle listeners and scheduled expiry. */
    protected function registerOrders(): void
    {
        // Amounts are stored in the currency's minor units: changing it would change every order.
        $commerce = $this->app->make(Commerce::class);
        $commerce->registerFeeProvider(Payments\PaymentFeeProvider::class);
        $commerce->registerPaymentMethod(Payments\Methods\BankTransfer::class);
        $commerce->registerPaymentMethod(Payments\Methods\PaymentInstructions::class);
        $commerce->registerPaymentMethod(Payments\Methods\CashOnDelivery::class);
        Event::listen(Orders\Events\OrderCancelled::class, Orders\Listeners\ReleaseReservations::class);
        Event::listen(Orders\Events\OrderPaid::class, Orders\Listeners\AutoCompleteOrder::class);
        Event::listen(Orders\Events\ShipmentCreated::class, Orders\Listeners\AutoCompleteOrder::class);
        foreach ([Orders\Events\OrderPaid::class, Orders\Events\OrderRefunded::class, Orders\Events\OrderCancelled::class] as $event) {
            Event::listen($event, Orders\Listeners\UpdateCustomerStats::class);
        }
        Event::listen(Orders\Events\OrderPaid::class, Orders\Listeners\RecordSalesCount::class);
        Event::listen(Orders\Events\OrderRefunded::class, Orders\Listeners\RecordSalesCount::class);
        $this->app->make(Commerce::class)->onTick('order expiry', fn () => (new Orders\Expiry)());
        RateLimiter::for('commerce-confirm', fn (Request $request) => Limit::perHour(10)->by((string) $request->input('order').'|'.$request->ip()));
        $commerce->onPrune('payment proofs', function (): int {
            $count = 0;
            Payments\Models\PaymentConfirmation::query()->whereNotNull('proof_path')
                ->where('created_at', '<', now()->subDays((int) config('commerce.payments.proof_retention_days', 365)))
                ->each(function (Payments\Models\PaymentConfirmation $c) use (&$count): void {
                    app(Payments\ProofFiles::class)->delete($c->proof_disk, $c->proof_path);
                    $c->forceFill(['proof_path' => null])->save();
                    $count++;
                });

            return $count;
        });
        Event::listen(Orders\Events\OrderPaid::class, Digital\Listeners\GrantDownloads::class);
        Event::subscribe(Notifications\SendStoreEmails::class);
        Event::listen(Orders\Events\OrderPlaced::class, Documents\AssignInvoiceNumber::class);
        Event::listen(Orders\Events\OrderPaid::class, Documents\AssignInvoiceNumber::class);
        $this->publishes([__DIR__.'/../resources/views/documents' => resource_path('views/vendor/commerce/documents')], 'commerce-documents');
        Event::listen(Orders\Events\OrderCompleted::class, Digital\Listeners\GrantDownloads::class);
        RateLimiter::for('commerce-downloads', fn (Request $request) => Limit::perMinute(30)->by($request->ip()));
        RateLimiter::for('commerce-webhooks', fn (Request $request) => Limit::perMinute(300)->by($request->ip()));
        RateLimiter::for('commerce-checkout', fn (Request $request) => Limit::perMinute(20)->by($request->ip()));
        Settings\Actions\SaveStoreSettings::guardUsing(function (string $section, array $values, Settings\StoreSettings $settings): array {
            $code = $values['currency']['code'] ?? null;
            if ($section !== 'general' || $code === null || $code === $settings->get('general.currency.code')) {
                return [];
            }

            return Orders\Models\Order::withTrashed()->exists() ? ['currency.code' => __('commerce::orders.currency_locked')] : [];
        }, 'currency');
    }

    /** Carts: pruning abandoned ones. */
    protected function registerCart(): void
    {
        $this->app->make(Commerce::class)->onPrune('abandoned carts', function (): int {
            $days = (int) config('commerce.cart.prune_days', 30);
            $marked = Cart\Models\Cart::query()->where('status', 'active')->where('last_activity_at', '<', now()->subDays($days))->update(['status' => 'abandoned']);
            $deleted = Cart\Models\Cart::query()->whereIn('status', ['abandoned', 'merged'])->where('last_activity_at', '<', now()->subDays($days * 2))->delete();

            return $marked + $deleted;
        });
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
        RateLimiter::for('commerce-cart', fn (Request $request) => Limit::perMinute(120)->by($request->ip()));
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
        foreach ([Health\Checks\MailCheck::class, Health\Checks\QueueCheck::class, Health\Checks\SchedulerCheck::class, Health\Checks\FullPageCacheCheck::class] as $check) {
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
        $this->publishes(Storefront\Templates::publishable(), 'commerce-templates');
        $this->publishes([__DIR__.'/../resources/lang' => $this->app->langPath('vendor/commerce')], 'commerce-translations');

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
