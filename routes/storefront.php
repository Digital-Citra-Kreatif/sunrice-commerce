<?php

declare(strict_types=1);

/*
 * Store pages (cart, checkout, order, wishlist…), in the visitor's language.
 * Registered by StorefrontRoutes::localized(); $suffix is '' or '.locale'.
 */

use Illuminate\Support\Facades\Route;
use Spatie\Honeypot\ProtectAgainstSpam;
use Sunrice\Commerce\Http\Controllers\Storefront;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/** @var string $suffix */
Route::get(StorefrontRoutes::path('go').'/{type}/{entry}', Storefront\GoController::class)
    ->whereIn('type', ['whatsapp', 'external', 'inquiry'])->whereNumber('entry')
    ->middleware('commerce.noindex')->name('commerce.go'.$suffix);

Route::get(StorefrontRoutes::path('brands'), Storefront\BrandsController::class)->name('commerce.brands'.$suffix);

Route::get(StorefrontRoutes::path('flash_sale'), [Storefront\FlashSaleController::class, 'index'])->name('commerce.flash-sale'.$suffix);
Route::get(StorefrontRoutes::path('flash_sale').'/{sale}', [Storefront\FlashSaleController::class, 'show'])->name('commerce.flash-sale.show'.$suffix);

Route::middleware(['commerce.feature:cart', 'commerce.noindex'])->prefix(StorefrontRoutes::path('cart'))->group(function () use ($suffix): void {
    Route::get('/', [Storefront\CartController::class, 'show'])->name('commerce.cart'.$suffix);
    Route::post('items', [Storefront\CartController::class, 'add'])->middleware(ProtectAgainstSpam::class)->name('commerce.cart.add'.$suffix);
    Route::patch('items/{item}', [Storefront\CartController::class, 'update'])->whereNumber('item')->name('commerce.cart.update'.$suffix);
    Route::delete('items/{item}', [Storefront\CartController::class, 'remove'])->whereNumber('item')->name('commerce.cart.remove'.$suffix);
    Route::post('vouchers', [Storefront\CartController::class, 'applyVoucher'])->middleware(['commerce.feature:vouchers', 'throttle:commerce-voucher'])->name('commerce.cart.voucher'.$suffix);
    Route::delete('vouchers/{code}', [Storefront\CartController::class, 'removeVoucher'])->name('commerce.cart.voucher.remove'.$suffix);
});

Route::middleware(['commerce.feature:wishlist', 'commerce.noindex'])->prefix(StorefrontRoutes::path('wishlist'))->group(function () use ($suffix): void {
    Route::get('/', [Storefront\WishlistController::class, 'show'])->name('commerce.wishlist'.$suffix);
    Route::post('items', [Storefront\WishlistController::class, 'add'])->middleware('throttle:commerce-cart')->name('commerce.wishlist.add'.$suffix);
    Route::delete('items/{product}', [Storefront\WishlistController::class, 'remove'])->whereNumber('product')->name('commerce.wishlist.remove'.$suffix);
    Route::post('share', [Storefront\WishlistController::class, 'share'])->name('commerce.wishlist.share'.$suffix);
    Route::get('shared/{token}', [Storefront\WishlistController::class, 'shared'])->name('commerce.wishlist.shared'.$suffix);
});

Route::middleware(['commerce.feature:compare', 'commerce.noindex'])->prefix(StorefrontRoutes::path('compare'))->group(function () use ($suffix): void {
    Route::get('/', [Storefront\CompareController::class, 'show'])->name('commerce.compare'.$suffix);
    Route::post('items', [Storefront\CompareController::class, 'add'])->name('commerce.compare.add'.$suffix);
    Route::delete('items/{product}', [Storefront\CompareController::class, 'remove'])->whereNumber('product')->name('commerce.compare.remove'.$suffix);
});

Route::middleware(['commerce.feature:checkout', 'commerce.noindex'])->prefix(StorefrontRoutes::path('checkout'))->group(function () use ($suffix): void {
    Route::get('/', [Storefront\CheckoutController::class, 'show'])->name('commerce.checkout'.$suffix);
    Route::post('/', [Storefront\CheckoutController::class, 'submit'])->middleware('throttle:commerce-checkout')->name('commerce.checkout.submit'.$suffix);
    Route::post('refresh', [Storefront\CheckoutController::class, 'refresh'])->middleware('throttle:commerce-cart')->name('commerce.checkout.refresh'.$suffix);
});

Route::middleware(['commerce.feature:orders', 'commerce.noindex'])->group(function () use ($suffix): void {
    Route::get(StorefrontRoutes::path('order').'/{key}', [Storefront\OrderController::class, 'show'])->name('commerce.order'.$suffix);
    Route::get(StorefrontRoutes::path('order').'/{key}/pay', [Storefront\PayController::class, 'show'])->middleware('commerce.feature:payments')->name('commerce.order.pay'.$suffix);
    Route::post(StorefrontRoutes::path('order').'/{key}/pay', [Storefront\PayController::class, 'pay'])->middleware(['commerce.feature:payments', 'throttle:commerce-checkout'])->name('commerce.order.pay.submit'.$suffix);
    Route::get(StorefrontRoutes::path('order').'/{key}/payment/return', [Storefront\PayController::class, 'return'])->middleware('commerce.feature:payments')->name('commerce.order.payment-return'.$suffix);
    Route::post(StorefrontRoutes::path('order').'/{key}/cancel', [Storefront\OrderController::class, 'cancel'])->middleware('throttle:commerce-cart')->name('commerce.order.cancel'.$suffix);
    Route::get(StorefrontRoutes::path('quote').'/{key}', [Storefront\QuoteController::class, 'show'])->name('commerce.quote'.$suffix);
    Route::post(StorefrontRoutes::path('quote').'/{key}/accept', [Storefront\QuoteController::class, 'accept'])->middleware('throttle:commerce-cart')->name('commerce.quote.accept'.$suffix);
    Route::post(StorefrontRoutes::path('quote').'/{key}/decline', [Storefront\QuoteController::class, 'decline'])->middleware('throttle:commerce-cart')->name('commerce.quote.decline'.$suffix);
    Route::get(StorefrontRoutes::path('track_order'), [Storefront\OrderController::class, 'trackForm'])->name('commerce.track-order'.$suffix);
    Route::post(StorefrontRoutes::path('track_order'), [Storefront\OrderController::class, 'track'])->middleware(ProtectAgainstSpam::class)->name('commerce.track-order.submit'.$suffix);
});

Route::middleware(['commerce.feature:manual_payments', 'commerce.noindex'])->prefix(StorefrontRoutes::path('confirm_payment'))->group(function () use ($suffix): void {
    Route::get('/', [Storefront\ConfirmPaymentController::class, 'show'])->name('commerce.confirm-payment'.$suffix);
    Route::post('lookup', [Storefront\ConfirmPaymentController::class, 'lookup'])->middleware(ProtectAgainstSpam::class)->name('commerce.confirm-payment.lookup'.$suffix);
    Route::post('/', [Storefront\ConfirmPaymentController::class, 'submit'])->middleware([ProtectAgainstSpam::class, 'throttle:commerce-confirm'])->name('commerce.confirm-payment.submit'.$suffix);
});
