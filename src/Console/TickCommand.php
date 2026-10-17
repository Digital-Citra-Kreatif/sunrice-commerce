<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Health\Checks\SchedulerCheck;
use Sunrice\Commerce\Jobs\QueueHeartbeat;
use Throwable;

/**
 * commerce:tick — run every minute by the scheduler: expires unpaid
 * orders and quotes, starts and ends flash sales, and records the
 * scheduler and queue heartbeats.
 */
class TickCommand extends Command
{
    protected $signature = 'commerce:tick';

    protected $description = 'Run the store\'s every-minute work (expiries, flash sales, heartbeats)';

    public function handle(Commerce $commerce): int
    {
        Cache::forever(SchedulerCheck::HEARTBEAT, now()->getTimestamp());
        if (config('queue.default') !== 'sync') {
            QueueHeartbeat::dispatch();
        }

        $failed = false;
        foreach ($commerce->tickSteps() as $name => $step) {
            try {
                $step();
            } catch (Throwable $e) {
                report($e);
                $this->components->error("{$name}: {$e->getMessage()}");
                $failed = true;
            }
        }

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
