<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Http\Controllers\Api;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/*
 * JSON endpoints for commerce.js, in the visitor's language (web group:
 * session + CSRF). Registered by StorefrontRoutes::localized(); $suffix is
 * '' or '.locale'.
 */

/** @var string $suffix */
Route::prefix(StorefrontRoutes::path('api'))->group(function () use ($suffix): void {
    Route::get('regions', Api\RegionsController::class)->name('commerce.api.regions'.$suffix);

    Route::middleware(['commerce.feature:cart', 'throttle:commerce-cart', 'commerce.noindex'])->group(function () use ($suffix): void {
        Route::get('cart', [Api\CartApiController::class, 'show'])->name('commerce.api.cart'.$suffix);
        Route::post('cart/items', [Api\CartApiController::class, 'add'])->name('commerce.api.cart.add'.$suffix);
        Route::patch('cart/items/{item}', [Api\CartApiController::class, 'update'])->whereNumber('item')->name('commerce.api.cart.update'.$suffix);
        Route::delete('cart/items/{item}', [Api\CartApiController::class, 'remove'])->whereNumber('item')->name('commerce.api.cart.remove'.$suffix);
        Route::post('cart/vouchers', [Api\CartApiController::class, 'applyVoucher'])->middleware(['commerce.feature:vouchers', 'throttle:commerce-voucher'])->name('commerce.api.cart.voucher'.$suffix);
        Route::delete('cart/vouchers/{code}', [Api\CartApiController::class, 'removeVoucher'])->name('commerce.api.cart.voucher.remove'.$suffix);
    });
});
