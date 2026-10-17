<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Sunrice\Commerce\Health\HealthRegistry;
use Sunrice\Commerce\Health\HealthResult;

/** commerce:doctor — prints the store health checks; fails when one is an error. */
class DoctorCommand extends Command
{
    protected $signature = 'commerce:doctor';

    protected $description = 'Check the store setup (payments, shipping, mail, queue, scheduler…)';

    public function handle(HealthRegistry $health): int
    {
        $errors = 0;
        foreach ($health->run() as ['label' => $label, 'result' => $result]) {
            $mark = match ($result->status) {
                HealthResult::OK => '<fg=green>ok</>',
                HealthResult::WARNING => '<fg=yellow>warning</>',
                default => '<fg=red>error</>',
            };
            $this->components->twoColumnDetail($label, $mark);
            if ($result->message !== '') {
                $this->line("    {$result->message}");
            }
            if ($result->fix !== null && $result->status !== HealthResult::OK) {
                $this->line("    <fg=gray>{$result->fix}</>");
            }
            $errors += $result->status === HealthResult::ERROR ? 1 : 0;
        }

        return $errors > 0 ? self::FAILURE : self::SUCCESS;
    }
}
