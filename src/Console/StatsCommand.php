<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Analytics\Day;
use Sunrice\Commerce\Analytics\StatsRecorder;

/**
 * commerce:stats — recompute the daily stats. Without options: yesterday
 * and today (the nightly run). --rebuild recomputes from the first order
 * (or --from) to today. Views and clicks are counters and are kept.
 */
class StatsCommand extends Command
{
    protected $signature = 'commerce:stats {--rebuild : Recompute all history} {--from= : First date (Y-m-d) to recompute}';

    protected $description = 'Recompute the store\'s daily sales statistics';

    public function handle(StatsRecorder $recorder): int
    {
        $today = Day::of(now());
        $from = $this->option('from');
        if (is_string($from) && $from !== '') {
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $from) !== 1) {
                $this->components->error('--from must be a date like 2026-01-31.');

                return self::FAILURE;
            }
        } elseif ($this->option('rebuild')) {
            $first = DB::table('commerce_orders')->min('created_at');
            $from = $first !== null ? Day::of((string) $first) : $today;
        } else {
            $from = Day::of(now()->subDay());
        }

        $days = $recorder->rebuild($from, $today);
        $this->components->info("Recomputed {$days} day(s) from {$from}.");

        return self::SUCCESS;
    }
}
