<?php

declare(strict_types=1);

/*
 * Payment gateway webhooks: stateless (no session, no CSRF), verified by
 * each gateway's signature. Added by the payments phase.
 */

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Http\Controllers\WebhookController;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

Route::post(StorefrontRoutes::path('webhooks').'/{method}', WebhookController::class)
    ->where('method', '[a-z0-9_]+')
    ->middleware(['throttle:commerce-webhooks', 'commerce.feature:payments'])
    ->name('commerce.webhooks');
