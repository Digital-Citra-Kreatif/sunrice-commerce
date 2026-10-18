<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Spatie\OneTimePasswords\Models\Concerns\HasOneTimePasswords;
use Sunrice\Commerce\Database\Seeders\DemoStoreSeeder;
use Sunrice\Commerce\Support\UserModelTraits;

/**
 * commerce:install — sets up the store after `composer require` (EXECUTION_PLAN.md C16.1):
 * config and assets, the sign-in code table, migrations, the user model
 * trait, the store structure, permissions and roles, regions, and on
 * request the templates and a demo store. Safe to run again.
 */
class InstallCommand extends Command
{
    protected $signature = 'commerce:install
        {--templates : Publish the storefront templates (resources/views/sunrice and resources/views/commerce) and theme (public/commerce-theme)}
        {--demo : Add a demo store (products, payments, shipping, a voucher, a flash sale and an order)}
        {--no-regions : Skip importing Indonesian regions}
        {--regions=district : How deep to import regions: province, city, district or village}
        {--force : Overwrite published config and templates}';

    protected $description = 'Install Sunrice Commerce: config, assets, migrations, store structure, roles and regions';

    public function handle(): int
    {
        $force = (bool) $this->option('force');

        $this->components->task('Config and admin assets', function () use ($force) {
            $this->callSilently('vendor:publish', ['--tag' => 'commerce-config', '--force' => $force]);

            return $this->callSilently('commerce:publish-assets') === self::SUCCESS;
        });

        if (! Schema::hasTable('one_time_passwords')) {
            $this->components->task('Sign-in code table (spatie/laravel-one-time-passwords)', fn () => $this->callSilently('vendor:publish', ['--tag' => 'one-time-passwords-migrations']) === self::SUCCESS);
        }

        $this->components->task('Migrations', fn () => $this->callSilently('migrate', ['--force' => true]) === self::SUCCESS);

        $this->userModel();

        $this->components->task('Store structure (products, categories, brands, pages)', fn () => $this->callSilently('commerce:scaffold') === self::SUCCESS);
        $this->components->task('Permissions and roles', fn () => $this->callSilently('sunrice:sync-permissions') === self::SUCCESS
            && $this->callSilently('commerce:seed-roles') === self::SUCCESS);

        if (! $this->option('no-regions') && $this->confirm('Import Indonesian regions for addresses and shipping zones?', true)) {
            $level = (string) $this->option('regions');
            $this->components->task("Regions (down to {$level})", fn () => $this->callSilently('commerce:regions:import', ['--level' => $level]) === self::SUCCESS);
        }

        if ($this->option('templates')) {
            $this->components->task('Storefront templates', fn () => $this->callSilently('vendor:publish', ['--tag' => 'commerce-templates', '--force' => $force]) === self::SUCCESS);
        }

        if ($this->option('demo')) {
            $this->components->task('Demo store', function () {
                app(DemoStoreSeeder::class)->run();

                return true;
            });
        }

        $this->nextSteps();

        return self::SUCCESS;
    }

    /** Sign-in with an emailed code needs HasOneTimePasswords on the user model. */
    protected function userModel(): void
    {
        $model = config('sunrice.auth.user_model');
        if (! is_string($model) || ! class_exists($model)) {
            $this->components->warn('No user model configured (sunrice.auth.user_model).');

            return;
        }
        match (UserModelTraits::ensure($model, HasOneTimePasswords::class)) {
            true => $this->components->twoColumnDetail('User model', "HasOneTimePasswords trait added to {$model}"),
            null => null,
            false => $this->components->warn('Add `use \\'.HasOneTimePasswords::class."`; to {$model} for sign-in with an emailed code."),
        };
    }

    protected function nextSteps(): void
    {
        $this->newLine();
        $this->components->info('Sunrice Commerce is installed. Next:');
        $this->components->bulletList([
            'Run the scheduler every minute (* * * * * php artisan schedule:run): orders expire, flash sales start and end, payments are checked.',
            'Run a queue worker (php artisan queue:work): order emails and statistics are queued.',
            'Set up mail in .env so customers get order emails and sign-in codes.',
            'For "Sign in with Google", set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
            'Open the admin → Shop → Dashboard: the setup checklist shows what is left.',
            'Check everything with php artisan commerce:doctor.',
        ]);
    }
}
