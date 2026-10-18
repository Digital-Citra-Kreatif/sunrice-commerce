<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;

class QueueCheck implements HealthCheck
{
    public const HEARTBEAT = 'commerce:queue-heartbeat';

    public function key(): string
    {
        return 'queue';
    }

    public function label(): string
    {
        return 'Queue worker';
    }

    public function run(): HealthResult
    {
        $connection = (string) config('queue.default');
        if ($connection === 'sync') {
            return HealthResult::warning('The queue runs during requests (QUEUE_CONNECTION=sync): checkout waits for emails and PDFs.', 'Use the database or redis queue and run php artisan queue:work.');
        }

        $beat = Cache::get(self::HEARTBEAT);

        return is_int($beat) && $beat > now()->subMinutes(10)->getTimestamp()
            ? HealthResult::ok('The queue worker is running.')
            : HealthResult::error('No queued job has run in the last 10 minutes: emails are not being sent.', 'Run php artisan queue:work (Supervisor, systemd…).');
    }
}
