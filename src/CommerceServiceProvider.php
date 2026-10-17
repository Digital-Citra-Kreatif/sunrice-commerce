<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Event;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use Sunrice\Facades\Sunrice;

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
        $this->app->singleton(Commerce::class);
        $this->app->singleton(Features\FeatureRegistry::class);
        $this->app->singleton(Settings\SettingsRegistry::class);
        // Per request (and per queued job): settings and module states.
        $this->app->scoped(Settings\StoreSettings::class);
        $this->app->scoped(Features\Features::class);
        $this->app->scoped(Support\MoneyFormatter::class);
    }

    public function packageBooted(): void
    {
        $this->registerCommands();
        $this->registerAdminAssets();
        $this->registerFeatureGates();
        Permissions\CommercePermissions::register();
        Event::listen(JobProcessing::class, function (): void {
            $this->app->forgetScopedInstances();
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
