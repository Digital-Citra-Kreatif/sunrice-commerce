<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Http\Controllers\Admin;

/*
| Shop admin pages, under Sunrice's admin path and middleware
| (names sunrice.admin.commerce.*).
*/

Route::prefix('commerce')->name('commerce.')->group(function (): void {
    Route::get('/', Admin\DashboardController::class)->name('dashboard');

    Route::get('api/sku-check', [Admin\ProductApiController::class, 'skuCheck'])->name('api.sku-check');
    Route::get('api/products/{entry}', [Admin\ProductApiController::class, 'show'])->whereNumber('entry')->name('api.products.show');
    Route::post('api/downloads', Admin\DownloadUploadController::class)->name('api.downloads.store');
    Route::get('api/variants', [Admin\ProductApiController::class, 'variants'])->name('api.variants');

    Route::get('settings', [Admin\SettingsController::class, 'index'])->name('settings');
    Route::get('settings/features', [Admin\FeaturesController::class, 'index'])->name('settings.features');
    Route::put('settings/features/{feature}', [Admin\FeaturesController::class, 'update'])->name('settings.features.update');
    Route::get('settings/{section}', [Admin\SettingsController::class, 'show'])->name('settings.show');
    Route::put('settings/{section}', [Admin\SettingsController::class, 'update'])->name('settings.update');
});
