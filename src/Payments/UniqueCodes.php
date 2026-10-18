<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\OrderStatus;

/**
 * Picks a unique transfer code (ARCHITECTURE.md §11.3 step 8): a random
 * value in the range such that the amount to pay isn't the amount of
 * another open order of the same method from the last 7 days (up to 20
 * tries, then any value).
 */
class UniqueCodes
{
    /** @param  array{min: int, max: int, direction: 'add'|'subtract'}  $range  @return int the signed change of the total */
    public function pick(int $total, array $range, string $method): int
    {
        $min = max(1, $range['min']);
        $max = max($min, $range['max']);
        if ($range['direction'] === 'subtract') {
            $max = min($max, max(0, $total - 1));
            if ($max < $min) {
                return 0;
            }
        }
        $sign = $range['direction'] === 'subtract' ? -1 : 1;
        $taken = DB::table('commerce_orders')->where('payment_method', $method)
            ->whereIn('payment_status', [OrderStatus::UNPAID, OrderStatus::AWAITING_CONFIRMATION])
            ->where('placed_at', '>=', now()->subDays(7))->pluck('total')->map(fn ($t) => (int) $t)->flip();

        $code = random_int($min, $max);
        for ($try = 0; $try < 20 && isset($taken[$total + $sign * $code]); $try++) {
            $code = random_int($min, $max);
        }

        return $sign * $code;
    }
}
