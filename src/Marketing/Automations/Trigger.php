<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

use Carbon\CarbonInterface;
use Sunrice\Commerce\Marketing\Recipient;

/**
 * What starts an automation. recipients() returns everyone whose moment
 * (a cart left alone for N hours, N days since the last order…) fell in
 * ($from, $to]; each automation asks once a minute for the time since it
 * last asked, so nobody is missed or asked twice. Who already got the
 * email (same dedupe key) is skipped by the caller.
 */
interface Trigger
{
    public function key(): string;

    public function label(): string;

    public function description(): string;

    /**
     * The delay's unit (hours or days), its label and default.
     *
     * @return array{unit: string, label: string, default: int}
     */
    public function delay(): array;

    /** The starting template (commerce::marketing.templates.{key}). */
    public function template(): string;

    /** @return iterable<Recipient> */
    public function recipients(int $delay, CarbonInterface $from, CarbonInterface $to): iterable;
}
