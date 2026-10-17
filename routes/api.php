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
});
