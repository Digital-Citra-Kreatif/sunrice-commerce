<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart;

use Closure;
use Throwable;

/**
 * Short lines that say what a cart or order line's meta means ("10–12 Dec
 * 2026 · Jakarta" for a rental), from describers extensions register with
 * Commerce::describeLinesUsing(). Shown under the line in the cart, at
 * checkout, on the order page, in emails, on documents and in the admin.
 */
final class LineDetails
{
    /** @var list<Closure(array<string, mixed>): iterable<mixed>> */
    protected array $describers = [];

    /** @param  Closure(array<string, mixed>): iterable<mixed>  $describer */
    public function register(Closure $describer): void
    {
        $this->describers[] = $describer;
    }

    /**
     * @param  array<string, mixed>|null  $meta
     * @return list<string>
     */
    public function for(?array $meta): array
    {
        if ($meta === null || $meta === [] || $this->describers === []) {
            return [];
        }
        $out = [];
        foreach ($this->describers as $describer) {
            try {
                foreach ($describer($meta) as $line) {
                    if (is_string($line) && trim($line) !== '') {
                        $out[] = $line;
                    }
                }
            } catch (Throwable $e) {
                // A describer that fails mustn't take the cart or an email down with it.
                report($e);
            }
        }

        return $out;
    }
}
