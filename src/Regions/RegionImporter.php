<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Regions;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

/**
 * Loads the bundled region files (database/data/regions) down to a level.
 * Re-importing updates names, adds new codes and marks codes that are no
 * longer in the data inactive; nothing is deleted, so saved addresses keep
 * working.
 */
class RegionImporter
{
    public const DATASET = 'Kepmendagri 300.2.2-2430/2025';

    public const FILES = [1 => 'provinces.csv', 2 => 'cities.csv', 3 => 'districts.csv', 4 => 'villages.csv.gz'];

    public function __construct(protected ?string $directory = null) {}

    /** @return array<int, int> level => rows imported */
    public function import(int $level = 3): array
    {
        if ($level < 1 || $level > 4) {
            throw new InvalidArgumentException('The level is 1 (province) to 4 (village).');
        }

        $counts = [];
        DB::transaction(function () use ($level, &$counts): void {
            $now = now();
            for ($l = 1; $l <= $level; $l++) {
                $seen = [];
                $batch = [];
                foreach ($this->rows($l) as $row) {
                    $seen[$row['code']] = true;
                    $batch[] = [...$row, 'level' => $l, 'active' => true, 'dataset' => self::DATASET, 'updated_at' => $now];
                    if (count($batch) === 1000) {
                        $this->upsert($batch);
                        $batch = [];
                    }
                }
                $this->upsert($batch);
                $counts[$l] = count($seen);

                // Codes of this level no longer in the data.
                Region::query()->where('level', $l)->where('active', true)->pluck('code')
                    ->reject(fn (string $code) => isset($seen[$code]))
                    ->chunk(500)
                    ->each(fn ($codes) => Region::query()->whereIn('code', $codes->all())->update(['active' => false, 'updated_at' => $now]));
            }
        });

        Cache::forget(self::cacheKey());

        return $counts;
    }

    /** Bumps whenever regions are imported, for the JSON endpoint's cache. */
    public static function cacheKey(): string
    {
        return 'commerce:regions:version';
    }

    /** @param  array<int, array<string, mixed>>  $batch */
    protected function upsert(array $batch): void
    {
        if ($batch !== []) {
            Region::query()->upsert($batch, ['code'], ['parent_code', 'level', 'name', 'kind', 'postal_code', 'active', 'dataset', 'updated_at']);
        }
    }

    /** @return iterable<array{code: string, parent_code: ?string, name: string, kind: string, postal_code: ?string}> */
    protected function rows(int $level): iterable
    {
        $path = rtrim($this->directory ?? __DIR__.'/../../database/data/regions', '/').'/'.self::FILES[$level];
        $handle = str_ends_with($path, '.gz') ? @gzopen($path, 'r') : @fopen($path, 'r');
        if ($handle === false) {
            throw new RuntimeException("Region file not found: {$path}");
        }

        $read = str_ends_with($path, '.gz')
            ? fn () => ($line = gzgets($handle)) === false ? false : str_getcsv($line, ',', '"', '')
            : fn () => fgetcsv($handle, null, ',', '"', '');
        $read(); // header
        while (($row = $read()) !== false) {
            if (count($row) < 4 || $row[0] === null || $row[0] === '') {
                continue;
            }
            yield [
                'code' => (string) $row[0],
                'parent_code' => $row[1] === '' ? null : (string) $row[1],
                'name' => trim((string) $row[2]),
                'kind' => (string) $row[3],
                'postal_code' => ($row[4] ?? '') === '' ? null : trim((string) $row[4]),
            ];
        }
        str_ends_with($path, '.gz') ? gzclose($handle) : fclose($handle);
    }
}
