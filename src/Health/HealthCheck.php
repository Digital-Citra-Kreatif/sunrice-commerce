<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health;

/**
 * Something that can stop the store from working (no payment method, mail
 * not delivering, scheduler not running…), shown on the store dashboard
 * and by `php artisan commerce:doctor`.
 */
interface HealthCheck
{
    public function key(): string;

    public function label(): string;

    public function run(): HealthResult;
}
