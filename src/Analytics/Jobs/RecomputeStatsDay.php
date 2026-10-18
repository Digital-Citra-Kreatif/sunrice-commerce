<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Sunrice\Commerce\Analytics\StatsRecorder;

/** Recomputes one day's stats; queued once per day however many orders change. */
class RecomputeStatsDay implements ShouldBeUniqueUntilProcessing, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries = 3;

    public function __construct(public string $date) {}

    public function uniqueId(): string
    {
        return $this->date;
    }

    public function handle(StatsRecorder $recorder): void
    {
        $recorder->recompute($this->date);
    }
}
