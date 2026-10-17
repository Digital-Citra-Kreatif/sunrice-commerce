<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;

class SchedulerCheck implements HealthCheck
{
    public const HEARTBEAT = 'commerce:tick-heartbeat';

    public function key(): string
    {
        return 'scheduler';
    }

    public function label(): string
    {
        return 'Scheduler';
    }

    public function run(): HealthResult
    {
        $beat = Cache::get(self::HEARTBEAT);

        return is_int($beat) && $beat > now()->subMinutes(5)->getTimestamp()
            ? HealthResult::ok('The scheduler is running.')
            : HealthResult::error('commerce:tick hasn\'t run in the last 5 minutes: unpaid orders don\'t expire and flash sales don\'t start or end.', 'Add * * * * * php artisan schedule:run to cron.');
    }
}
