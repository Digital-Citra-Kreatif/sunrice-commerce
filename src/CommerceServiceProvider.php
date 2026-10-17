<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

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
    }

    public function packageBooted(): void
    {
        $this->registerCommands();
        $this->registerAdminAssets();
    }

    protected function registerCommands(): void
    {
        if (! $this->app->runningInConsole()) {
            return;
        }

        $this->commands([
            Console\PublishAssetsCommand::class,
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
