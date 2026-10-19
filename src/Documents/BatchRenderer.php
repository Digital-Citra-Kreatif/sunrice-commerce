<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Documents;

/**
 * A DocumentRenderer that renders several HTML documents, one after the
 * other, into one PDF (bulk documents, batch by batch, so memory stays flat).
 */
interface BatchRenderer extends DocumentRenderer
{
    /** @param  iterable<int, string>  $documents */
    public function combined(iterable $documents, string $paper = 'a4'): string;
}
