<?php

declare(strict_types=1);

/*
 * Store pages (cart, checkout, order, wishlist…), in the visitor's language.
 * Registered by StorefrontRoutes::localized(); $suffix is '' or '.locale'.
 */

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Http\Controllers\Storefront;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/** @var string $suffix */
Route::get(StorefrontRoutes::path('go').'/{type}/{entry}', Storefront\GoController::class)
    ->whereIn('type', ['whatsapp', 'external', 'inquiry'])->whereNumber('entry')
    ->middleware('commerce.noindex')->name('commerce.go'.$suffix);

Route::get(StorefrontRoutes::path('brands'), Storefront\BrandsController::class)->name('commerce.brands'.$suffix);

Route::get(StorefrontRoutes::path('flash_sale'), [Storefront\FlashSaleController::class, 'index'])->name('commerce.flash-sale'.$suffix);
Route::get(StorefrontRoutes::path('flash_sale').'/{sale}', [Storefront\FlashSaleController::class, 'show'])->name('commerce.flash-sale.show'.$suffix);
