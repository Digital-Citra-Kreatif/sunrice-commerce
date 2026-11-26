<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Http\Controllers\Account;
use Sunrice\Commerce\Http\Middleware\SetStoreLocale;

/*
 * The store's pages in My Account (/account/orders…), under the account
 * package's prefix, in the visitor's language, for signed-in accounts:
 * registered with Account::routes(); $suffix is '' or '.locale'. The
 * sign-in pages, the profile and the menu are the account package's.
 */

/** @var string $suffix */
Route::middleware([SetStoreLocale::class, 'commerce.feature:accounts'])->group(function () use ($suffix): void {
    Route::get('addresses', [Account\AccountController::class, 'addresses'])->name('commerce.account.addresses'.$suffix);
    Route::post('addresses', [Account\AccountController::class, 'storeAddress'])->name('commerce.account.addresses.store'.$suffix);
    Route::put('addresses/{address}', [Account\AccountController::class, 'updateAddress'])->whereNumber('address')->name('commerce.account.addresses.update'.$suffix);
    Route::delete('addresses/{address}', [Account\AccountController::class, 'deleteAddress'])->whereNumber('address')->name('commerce.account.addresses.delete'.$suffix);
    Route::get('orders', [Account\OrdersController::class, 'index'])->middleware('commerce.feature:orders')->name('commerce.account.orders'.$suffix);
    Route::get('quotes', [Account\OrdersController::class, 'quotes'])->middleware('commerce.feature:orders')->name('commerce.account.quotes'.$suffix);
    Route::get('orders/{order}', [Account\OrdersController::class, 'show'])->whereNumber('order')->middleware('commerce.feature:orders')->name('commerce.account.orders.show'.$suffix);
    Route::post('orders/{order}/again', [Account\OrdersController::class, 'buyAgain'])->whereNumber('order')->middleware('commerce.feature:cart')->name('commerce.account.orders.again'.$suffix);
    Route::post('orders/{order}/returns', [Account\OrdersController::class, 'requestReturn'])->whereNumber('order')->middleware(['commerce.feature:returns', 'throttle:commerce-cart'])->name('commerce.account.orders.return'.$suffix);
    Route::post('orders/{order}/cancel', [Account\OrdersController::class, 'cancel'])->whereNumber('order')->middleware('commerce.feature:orders')->name('commerce.account.orders.cancel'.$suffix);
    Route::get('downloads', [Account\OrdersController::class, 'downloads'])->name('commerce.account.downloads'.$suffix);
    Route::get('points', [Account\PointsController::class, 'index'])->middleware('commerce.feature:loyalty')->name('commerce.account.points'.$suffix);
    Route::post('points/gift-card', [Account\PointsController::class, 'redeem'])->middleware(['commerce.feature:loyalty', 'throttle:commerce-gift-card'])->name('commerce.account.points.redeem'.$suffix);
});
