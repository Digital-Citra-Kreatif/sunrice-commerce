<?php

declare(strict_types=1);

/*
 * Marketing email links: tracking image, tracked links and unsubscribe.
 * Stateless (no session, no CSRF): the email's token is the secret.
 */

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Http\Controllers\MarketingTrackingController;

Route::prefix(trim((string) config('commerce.marketing.path', 'mail'), '/'))->middleware('throttle:commerce-tracking')->group(function (): void {
    Route::get('o/{token}.gif', [MarketingTrackingController::class, 'open'])->where('token', '[A-Za-z0-9]{40}')->name('commerce.marketing.open');
    Route::get('c/{token}/{link}', [MarketingTrackingController::class, 'click'])->where(['token' => '[A-Za-z0-9]{40}', 'link' => '[a-f0-9]{16}'])->name('commerce.marketing.click');
    Route::get('u/{token}', [MarketingTrackingController::class, 'unsubscribeForm'])->where('token', '[A-Za-z0-9]{40}')->name('commerce.marketing.unsubscribe');
    Route::post('u/{token}', [MarketingTrackingController::class, 'unsubscribe'])->where('token', '[A-Za-z0-9]{40}');
});
