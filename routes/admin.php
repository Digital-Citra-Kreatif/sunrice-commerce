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

    Route::get('orders', [Admin\OrdersController::class, 'index'])->name('orders');
    Route::get('orders/export', [Admin\OrdersController::class, 'export'])->name('orders.export');
    Route::post('orders/bulk', [Admin\OrdersController::class, 'bulk'])->name('orders.bulk');
    Route::get('orders/create', [Admin\OrdersController::class, 'create'])->name('orders.create');
    Route::post('orders', [Admin\OrdersController::class, 'store'])->name('orders.store');
    Route::post('orders/preview', [Admin\OrdersController::class, 'preview'])->name('orders.preview');
    Route::get('orders/{order}/edit', [Admin\OrdersController::class, 'edit'])->whereNumber('order')->name('orders.edit');
    Route::put('orders/{order}', [Admin\OrdersController::class, 'update'])->whereNumber('order')->name('orders.update');
    Route::get('orders/{order}/quote', [Admin\OrdersController::class, 'editQuote'])->whereNumber('order')->name('orders.quote');
    Route::put('orders/{order}/quote', [Admin\OrdersController::class, 'updateQuote'])->whereNumber('order')->name('orders.quote.update');
    Route::post('orders/{order}/payment-link', [Admin\OrdersController::class, 'sendLink'])->whereNumber('order')->name('orders.payment-link');
    Route::get('orders/{order}', [Admin\OrdersController::class, 'show'])->whereNumber('order')->withTrashed()->name('orders.show');
    Route::post('orders/{order}/transition', [Admin\OrdersController::class, 'transition'])->whereNumber('order')->name('orders.transition');
    Route::post('orders/{order}/notes', [Admin\OrdersController::class, 'note'])->whereNumber('order')->name('orders.notes');
    Route::get('orders/{order}/addresses', [Admin\OrdersController::class, 'editAddresses'])->whereNumber('order')->name('orders.addresses.edit');
    Route::put('orders/{order}/addresses', [Admin\OrdersController::class, 'addresses'])->whereNumber('order')->name('orders.addresses');
    Route::post('orders/{order}/mark-paid', [Admin\OrdersController::class, 'markPaid'])->whereNumber('order')->name('orders.mark-paid');
    Route::post('orders/{order}/shipments', [Admin\OrdersController::class, 'storeShipment'])->whereNumber('order')->name('orders.shipments.store');
    Route::put('orders/{order}/shipments/{shipment}', [Admin\OrdersController::class, 'updateShipment'])->whereNumber('order')->name('orders.shipments.update');
    Route::post('orders/{order}/shipments/{shipment}/delivered', [Admin\OrdersController::class, 'deliveredShipment'])->whereNumber('order')->name('orders.shipments.delivered');
    Route::post('orders/{order}/refunds', [Admin\OrdersController::class, 'storeRefund'])->whereNumber('order')->name('orders.refunds.store');
    Route::delete('orders/{order}', [Admin\OrdersController::class, 'destroy'])->whereNumber('order')->name('orders.destroy');
    Route::post('orders/{order}/restore', [Admin\OrdersController::class, 'restore'])->whereNumber('order')->name('orders.restore');
    Route::delete('orders/{order}/force', [Admin\OrdersController::class, 'forceDelete'])->whereNumber('order')->name('orders.force-delete');

    Route::get('confirmations', [Admin\ConfirmationsController::class, 'index'])->name('confirmations');
    Route::get('confirmations/{confirmation}/proof', [Admin\ConfirmationsController::class, 'proof'])->name('confirmations.proof');
    Route::post('confirmations/{confirmation}/approve', [Admin\ConfirmationsController::class, 'approve'])->name('confirmations.approve');
    Route::post('confirmations/{confirmation}/reject', [Admin\ConfirmationsController::class, 'reject'])->name('confirmations.reject');

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
    Route::get('settings/payments', [Admin\PaymentsSettingsController::class, 'index'])->name('settings.payments');
    Route::post('settings/payments/move', [Admin\PaymentsSettingsController::class, 'move'])->name('settings.payments.move');
    Route::post('settings/payments/instances', [Admin\PaymentsSettingsController::class, 'addInstance'])->name('settings.payments.instances.store');
    Route::get('settings/payments/{method}', [Admin\PaymentsSettingsController::class, 'edit'])->name('settings.payments.edit');
    Route::put('settings/payments/{method}', [Admin\PaymentsSettingsController::class, 'update'])->name('settings.payments.update');
    Route::put('settings/payments/{method}/active', [Admin\PaymentsSettingsController::class, 'toggle'])->name('settings.payments.toggle');
    Route::delete('settings/payments/{method}', [Admin\PaymentsSettingsController::class, 'destroyInstance'])->name('settings.payments.destroy');
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
