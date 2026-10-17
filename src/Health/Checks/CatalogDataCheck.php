<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Data the store relies on: products whose Product data couldn't be
 * synced (ARCHITECTURE.md §7.2) and the Indonesian regions addresses use.
 */
class CatalogDataCheck implements HealthCheck
{
    public function key(): string
    {
        return 'catalog_data';
    }

    public function label(): string
    {
        return 'Products and regions';
    }

    public function run(): HealthResult
    {
        $failed = DB::table('commerce_products')->where('sync_status', 'failed')->whereNull('removed_at')->count();
        if ($failed > 0) {
            return HealthResult::warning("{$failed} product(s) couldn't be saved to the store and show old data.", 'Open them in Shop → Products (the error is shown there), or run php artisan commerce:sync-products.');
        }
        if (DB::table('commerce_regions')->doesntExist()) {
            return HealthResult::warning('Indonesian regions aren\'t imported: addresses and shipping zones can\'t use them.', 'Run php artisan commerce:regions:import.');
        }
        if (app(StoreSettings::class)->get('checkout.village_level') && DB::table('commerce_regions')->where('level', 4)->doesntExist()) {
            return HealthResult::error('Checkout asks for the village, but villages aren\'t imported: Indonesian addresses can\'t be completed.', 'Run php artisan commerce:regions:import --level=village, or switch off "Ask for the village" in Settings → Store → Checkout.');
        }

        return HealthResult::ok('Products are in sync and regions are imported.');
    }
}
