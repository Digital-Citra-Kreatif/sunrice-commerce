<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Health\Checks\QueueCheck;

/** Dispatched by commerce:tick; proves a queue worker is processing jobs. */
class QueueHeartbeat implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Cache::forever(QueueCheck::HEARTBEAT, now()->getTimestamp());
    }
}
