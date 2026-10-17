<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Sunrice\Commerce\Commerce;
use Throwable;

/** commerce:prune — daily clean-up: abandoned carts, unattached uploads, old payment proofs and IPs. */
class PruneCommand extends Command
{
    protected $signature = 'commerce:prune';

    protected $description = 'Delete abandoned carts, unattached uploads and expired personal data';

    public function handle(Commerce $commerce): int
    {
        $failed = false;
        foreach ($commerce->pruneSteps() as $name => $step) {
            try {
                $count = $step();
                $this->components->twoColumnDetail($name, is_int($count) ? (string) $count : 'done');
            } catch (Throwable $e) {
                report($e);
                $this->components->error("{$name}: {$e->getMessage()}");
                $failed = true;
            }
        }

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
