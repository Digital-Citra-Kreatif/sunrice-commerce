<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

/**
 * Gap-free counters for order, quote and invoice numbers. Each next() is
 * one locked row update, so concurrent checkouts never get the same number.
 */
class Sequences
{
    public function next(string $key): int
    {
        return DB::transaction(function () use ($key): int {
            $row = DB::table('commerce_sequences')->where('key', $key)->lockForUpdate()->first();
            if ($row === null) {
                try {
                    DB::table('commerce_sequences')->insert(['key' => $key, 'value' => 1, 'updated_at' => now()]);

                    return 1;
                } catch (QueryException) {
                    // Another request created it first: lock it and carry on.
                    $row = DB::table('commerce_sequences')->where('key', $key)->lockForUpdate()->first();
                }
            }

            $value = (int) $row->value + 1;
            DB::table('commerce_sequences')->where('key', $key)->update(['value' => $value, 'updated_at' => now()]);

            return $value;
        }, 3);
    }

    /** The last number given out (0 when none). */
    public function current(string $key): int
    {
        return (int) DB::table('commerce_sequences')->where('key', $key)->value('value');
    }
}
