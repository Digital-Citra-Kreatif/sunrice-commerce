<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Sunrice\Admin\Support\Csv;

/**
 * Rows written as CSV to a stream (php://output in a streamed download),
 * the first row's keys as the header. Cells go through the panel's Csv,
 * so customer-typed text never runs as a spreadsheet formula.
 */
final class CsvExport
{
    private bool $header = false;

    /** @param resource $stream */
    private function __construct(private $stream) {}

    public static function toOutput(): self
    {
        $stream = fopen('php://output', 'w');
        if ($stream === false) {
            throw new \RuntimeException('Could not open the output for the CSV.');
        }

        return new self($stream);
    }

    /** @param array<string|int, string|int|float|bool|null> $row */
    public function addRow(array $row): void
    {
        if (! $this->header) {
            $this->header = true;
            if (! array_is_list($row)) {
                Csv::write($this->stream, array_map('strval', array_keys($row)));
            }
        }
        Csv::write($this->stream, array_values($row));
    }

    public function close(): void
    {
        fflush($this->stream);
    }
}
