<?php

declare(strict_types=1);

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Support\MoneyFormatter;

/*
 * Global helpers for templates. Each is wrapped in function_exists().
 */

if (! function_exists('commerce_money')) {
    /** An amount in minor units, formatted in the store currency: 150000 → "Rp150.000". */
    function commerce_money(int $amount, bool $withSymbol = true): string
    {
        return app(MoneyFormatter::class)->format($amount, $withSymbol);
    }
}

if (! function_exists('commerce_feature')) {
    /** Whether a store module is active (Settings → Store → Features). */
    function commerce_feature(string $feature): bool
    {
        return app(Features::class)->active($feature);
    }
}
