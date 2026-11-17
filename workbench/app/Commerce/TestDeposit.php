<?php

declare(strict_types=1);

namespace Workbench\App\Commerce;

use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

/** Tests: asks a deposit of TestDeposit::$percent % of the total, the balance due in 7 days. */
class TestDeposit implements CalculationStage
{
    public static int $percent = 30;

    public function run(CalculationState $state): void
    {
        $state->deposit = ['amount' => intdiv($state->totals['total'] * self::$percent, 100), 'balance_due_at' => now()->addDays(7)->startOfDay()->toIso8601String(), 'label' => null];
    }
}
