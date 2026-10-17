<?php

declare(strict_types=1);

/*
 * Account links that come from outside (email verification, Google's
 * callback): one fixed URL each, without a language prefix.
 */

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Http\Controllers\Account;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

Route::middleware('commerce.noindex')->prefix(StorefrontRoutes::path('account'))->group(function (): void {
    Route::get('verify/{id}/{hash}', [Account\AuthController::class, 'verify'])->whereNumber('id')->name('commerce.account.verify');
    Route::get('login/google/callback', [Account\GoogleController::class, 'callback'])->name('commerce.account.google.callback');
});
