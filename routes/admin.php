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
    Route::get('api/targets', Admin\TargetsApiController::class)->name('api.targets');
    Route::get('api/variants', [Admin\ProductApiController::class, 'variants'])->name('api.variants');

    Route::get('products', [Admin\ProductsController::class, 'index'])->name('products');
    Route::post('products/bulk', [Admin\ProductsController::class, 'bulk'])->name('products.bulk');

    Route::get('inventory', [Admin\InventoryController::class, 'index'])->name('inventory');
    Route::post('inventory/{variant}/adjust', [Admin\InventoryController::class, 'adjust'])->name('inventory.adjust');
    Route::get('inventory/{variant}/history', [Admin\InventoryController::class, 'history'])->name('inventory.history');

    Route::get('pricing-rules', [Admin\PricingRulesController::class, 'index'])->name('pricing-rules');
    Route::get('pricing-rules/create', [Admin\PricingRulesController::class, 'create'])->name('pricing-rules.create');
    Route::post('pricing-rules', [Admin\PricingRulesController::class, 'store'])->name('pricing-rules.store');
    Route::get('pricing-rules/{rule}/edit', [Admin\PricingRulesController::class, 'edit'])->name('pricing-rules.edit');
    Route::put('pricing-rules/{rule}', [Admin\PricingRulesController::class, 'update'])->name('pricing-rules.update');
    Route::delete('pricing-rules/{rule}', [Admin\PricingRulesController::class, 'destroy'])->name('pricing-rules.destroy');

    Route::get('flash-sales', [Admin\FlashSalesController::class, 'index'])->name('flash-sales');
    Route::get('flash-sales/create', [Admin\FlashSalesController::class, 'create'])->name('flash-sales.create');
    Route::post('flash-sales', [Admin\FlashSalesController::class, 'store'])->name('flash-sales.store');
    Route::get('flash-sales/{sale}/edit', [Admin\FlashSalesController::class, 'edit'])->name('flash-sales.edit');
    Route::put('flash-sales/{sale}', [Admin\FlashSalesController::class, 'update'])->name('flash-sales.update');
    Route::delete('flash-sales/{sale}', [Admin\FlashSalesController::class, 'destroy'])->name('flash-sales.destroy');

    Route::get('vouchers', [Admin\VouchersController::class, 'index'])->name('vouchers');
    Route::get('vouchers/create', [Admin\VouchersController::class, 'create'])->name('vouchers.create');
    Route::post('vouchers', [Admin\VouchersController::class, 'store'])->name('vouchers.store');
    Route::get('vouchers/{voucher}/edit', [Admin\VouchersController::class, 'edit'])->name('vouchers.edit');
    Route::put('vouchers/{voucher}', [Admin\VouchersController::class, 'update'])->name('vouchers.update');
    Route::delete('vouchers/{voucher}', [Admin\VouchersController::class, 'destroy'])->name('vouchers.destroy');

    Route::get('customers', [Admin\CustomersController::class, 'index'])->name('customers');
    Route::get('customers/{customer}', [Admin\CustomersController::class, 'show'])->name('customers.show');
    Route::put('customers/{customer}', [Admin\CustomersController::class, 'update'])->name('customers.update');
    Route::post('customers/{customer}/password-reset', [Admin\CustomersController::class, 'sendPasswordReset'])->name('customers.password-reset');
    Route::post('customers/{customer}/verify', [Admin\CustomersController::class, 'markVerified'])->name('customers.verify');
    Route::post('customers/{customer}/anonymize', [Admin\CustomersController::class, 'anonymize'])->name('customers.anonymize');

    Route::get('settings', [Admin\SettingsController::class, 'index'])->name('settings');
    Route::get('settings/features', [Admin\FeaturesController::class, 'index'])->name('settings.features');
    Route::put('settings/features/{feature}', [Admin\FeaturesController::class, 'update'])->name('settings.features.update');
    Route::get('settings/tax-rates', [Admin\TaxRatesController::class, 'edit'])->name('settings.tax-rates');
    Route::put('settings/tax-rates', [Admin\TaxRatesController::class, 'update'])->name('settings.tax-rates.update');
    Route::get('settings/shipping', [Admin\ShippingController::class, 'index'])->name('settings.shipping');
    Route::post('settings/shipping/move', [Admin\ShippingController::class, 'move'])->name('settings.shipping.move');
    Route::get('settings/shipping/zones/create', [Admin\ShippingController::class, 'createZone'])->name('settings.shipping.zones.create');
    Route::post('settings/shipping/zones', [Admin\ShippingController::class, 'storeZone'])->name('settings.shipping.zones.store');
    Route::get('settings/shipping/zones/{zone}/edit', [Admin\ShippingController::class, 'editZone'])->name('settings.shipping.zones.edit');
    Route::put('settings/shipping/zones/{zone}', [Admin\ShippingController::class, 'updateZone'])->name('settings.shipping.zones.update');
    Route::delete('settings/shipping/zones/{zone}', [Admin\ShippingController::class, 'destroyZone'])->name('settings.shipping.zones.destroy');
    Route::get('settings/shipping/zones/{zone}/methods/create', [Admin\ShippingController::class, 'createMethod'])->name('settings.shipping.methods.create');
    Route::post('settings/shipping/zones/{zone}/methods', [Admin\ShippingController::class, 'storeMethod'])->name('settings.shipping.methods.store');
    Route::get('settings/shipping/methods/{method}/edit', [Admin\ShippingController::class, 'editMethod'])->name('settings.shipping.methods.edit');
    Route::put('settings/shipping/methods/{method}', [Admin\ShippingController::class, 'updateMethod'])->name('settings.shipping.methods.update');
    Route::delete('settings/shipping/methods/{method}', [Admin\ShippingController::class, 'destroyMethod'])->name('settings.shipping.methods.destroy');
    Route::get('settings/{section}', [Admin\SettingsController::class, 'show'])->name('settings.show');
    Route::put('settings/{section}', [Admin\SettingsController::class, 'update'])->name('settings.update');
});
