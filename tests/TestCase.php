<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Tests;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\SocialiteServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;
use Spatie\Honeypot\HoneypotServiceProvider;
use Spatie\OneTimePasswords\OneTimePasswordsServiceProvider;
use Sunrice\Admin\AdminServiceProvider;
use Sunrice\Cms\CmsServiceProvider;
use Sunrice\Commerce\CommerceServiceProvider;
use Workbench\App\Models\User;
use Workbench\App\Providers\AdminPanelProvider;

class TestCase extends Orchestra
{
    use RefreshDatabase;

    /**
     * An app folder of its own for tests that write into resources/ or public/ (published
     * templates): with parallel workers sharing testbench's skeleton, another test would
     * otherwise find their files, or lose them mid-render. See isolateAppFolder().
     */
    public static ?string $isolatedBasePath = null;

    protected function getApplicationBasePath()
    {
        return static::$isolatedBasePath ?? parent::getApplicationBasePath();
    }

    /**
     * A copy of testbench's skeleton in which resources/ and public/ are real folders (the
     * rest links to the original): set it before a file's tests and remove it after.
     */
    public static function isolateAppFolder(): string
    {
        $skeleton = static::applicationBasePath();
        $base = sys_get_temp_dir().'/commerce-app-'.getmypid().'-'.bin2hex(random_bytes(4));
        mkdir($base);
        foreach (scandir($skeleton) ?: [] as $entry) {
            if ($entry === '.' || $entry === '..') {
                continue;
            }
            if ($entry === 'resources' || $entry === 'public') {
                mkdir("{$base}/{$entry}");
                foreach (scandir("{$skeleton}/{$entry}") ?: [] as $child) {
                    if ($child !== '.' && $child !== '..') {
                        symlink("{$skeleton}/{$entry}/{$child}", "{$base}/{$entry}/{$child}");
                    }
                }
                // Published views go under resources/views: a real folder too.
                if ($entry === 'resources' && is_link("{$base}/resources/views")) {
                    unlink("{$base}/resources/views");
                    mkdir("{$base}/resources/views");
                }

                continue;
            }
            symlink("{$skeleton}/{$entry}", "{$base}/{$entry}");
        }

        return static::$isolatedBasePath = $base;
    }

    public static function removeIsolatedAppFolder(): void
    {
        if (static::$isolatedBasePath !== null) {
            (new Filesystem)->deleteDirectory(static::$isolatedBasePath);
            static::$isolatedBasePath = null;
        }
    }

    protected function getPackageProviders($app): array
    {
        return [
            AdminServiceProvider::class,
            CmsServiceProvider::class,
            HoneypotServiceProvider::class,
            OneTimePasswordsServiceProvider::class,
            SocialiteServiceProvider::class,
            CommerceServiceProvider::class,
            AdminPanelProvider::class,
        ];
    }

    protected function defineEnvironment($app): void
    {
        $app['config']->set('sunrice-cms.locales', ['id', 'en']);
        $app['config']->set('sunrice-cms.locale_names', ['id' => 'Bahasa Indonesia', 'en' => 'English']);
        // No calls to Have I Been Pwned from the tests.
        $app['config']->set('sunrice-admin.auth.password_uncompromised', false);
        $app['config']->set('auth.providers.users.model', User::class);
        $app['config']->set('app.key', 'base64:2fl+Ktvkfl+Fve4Qp/sF3rJf2fDR2lHo4SY9mZhJb+s=');
        $app['config']->set('inertia.testing.ensure_pages_exist', false);
    }

    /**
     * The workbench's migrations (users, permissions, one-time passwords) run
     * with the packages' once, by RefreshDatabase. Not loadMigrationsFrom():
     * it rolls them back after every test, and on MySQL that DDL commits the
     * test's transaction, so its rows leak into the next test.
     */
    protected function defineDatabaseMigrations(): void
    {
        $this->app->make('migrator')->path(__DIR__.'/../workbench/database/migrations');
    }

    protected function defineRoutes($router): void
    {
        $router->middleware('web')->group(__DIR__.'/../workbench/routes/web.php');
    }

    /** Each request starts with fresh per-request services, as it would in a real request. */
    public function call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
    {
        $this->app->forgetScopedInstances();

        return parent::call($method, $uri, $parameters, $cookies, $files, $server, $content);
    }
}
