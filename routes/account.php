<?php

declare(strict_types=1);

/*
 * My Account pages (/account/…), in the visitor's language.
 * Registered by StorefrontRoutes::localized(); $suffix is '' or '.locale'.
 */

use Illuminate\Support\Facades\Route;
use Spatie\Honeypot\ProtectAgainstSpam;
use Sunrice\Commerce\Http\Controllers\Account;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/** @var string $suffix */
Route::middleware(['commerce.feature:accounts', 'commerce.noindex'])->prefix(StorefrontRoutes::path('account'))->group(function () use ($suffix): void {
    Route::get('login', [Account\AuthController::class, 'showLogin'])->name('commerce.account.login'.$suffix);
    Route::post('login', [Account\AuthController::class, 'login'])->middleware(ProtectAgainstSpam::class)->name('commerce.account.login.attempt'.$suffix);
    Route::post('logout', [Account\AuthController::class, 'logout'])->name('commerce.account.logout'.$suffix);
    Route::get('register', [Account\AuthController::class, 'showRegister'])->name('commerce.account.register'.$suffix);
    Route::post('register', [Account\AuthController::class, 'register'])->middleware(ProtectAgainstSpam::class)->name('commerce.account.register.store'.$suffix);
    Route::get('forgot-password', [Account\AuthController::class, 'showForgot'])->name('commerce.account.password.request'.$suffix);
    Route::post('forgot-password', [Account\AuthController::class, 'sendResetLink'])->middleware(ProtectAgainstSpam::class)->name('commerce.account.password.email'.$suffix);
    Route::get('reset-password/{token}', [Account\AuthController::class, 'showReset'])->name('commerce.account.password.reset'.$suffix);
    Route::post('reset-password', [Account\AuthController::class, 'reset'])->name('commerce.account.password.update'.$suffix);
    Route::post('login/code', [Account\LoginCodeController::class, 'send'])->middleware(ProtectAgainstSpam::class)->name('commerce.account.code.send'.$suffix);
    Route::get('code', [Account\LoginCodeController::class, 'show'])->name('commerce.account.code'.$suffix);
    Route::post('code', [Account\LoginCodeController::class, 'consume'])->name('commerce.account.code.consume'.$suffix);
    Route::get('login/google', [Account\GoogleController::class, 'redirect'])->name('commerce.account.google'.$suffix);

    Route::middleware('commerce.auth')->group(function () use ($suffix): void {
        Route::get('/', [Account\AccountController::class, 'overview'])->name('commerce.account'.$suffix);
        Route::get('profile', [Account\AccountController::class, 'profile'])->name('commerce.account.profile'.$suffix);
        Route::put('profile', [Account\AccountController::class, 'updateProfile'])->name('commerce.account.profile.update'.$suffix);
        Route::put('password', [Account\AccountController::class, 'updatePassword'])->name('commerce.account.password'.$suffix);
        Route::get('addresses', [Account\AccountController::class, 'addresses'])->name('commerce.account.addresses'.$suffix);
        Route::post('addresses', [Account\AccountController::class, 'storeAddress'])->name('commerce.account.addresses.store'.$suffix);
        Route::put('addresses/{address}', [Account\AccountController::class, 'updateAddress'])->whereNumber('address')->name('commerce.account.addresses.update'.$suffix);
        Route::delete('addresses/{address}', [Account\AccountController::class, 'deleteAddress'])->whereNumber('address')->name('commerce.account.addresses.delete'.$suffix);
        Route::post('delete', [Account\AccountController::class, 'requestDeletion'])->name('commerce.account.delete'.$suffix);
    });
});
