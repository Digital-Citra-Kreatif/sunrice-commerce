<?php

declare(strict_types=1);

/*
 * Converts the upstream Indonesian region datasets into the CSV files in
 * database/data/regions (run by maintainers when a new decree is
 * published, not at install):
 *
 *   php bin/build-regions.php path/to/wilayah/db/wilayah.sql path/to/wilayah_kodepos/db/wilayah_kodepos.sql
 *
 * Sources (MIT): https://github.com/cahyadsn/wilayah (names and codes,
 * Kepmendagri 300.2.2-2430/2025) and https://github.com/cahyadsn/wilayah_kodepos
 * (postal codes per village). Output columns: code,parent_code,name,kind,postal_code.
 */

[$script, $wilayahSql, $kodeposSql] = $argv + [null, null, null];
if (! is_file((string) $wilayahSql) || ! is_file((string) $kodeposSql)) {
    fwrite(STDERR, "Usage: php bin/build-regions.php wilayah.sql wilayah_kodepos.sql\n");
    exit(1);
}

/** @return array<string, string> code => value */
function rows(string $file): array
{
    $sql = (string) file_get_contents($file);
    preg_match_all("/\\(\\s*'([0-9.]+)'\\s*,\\s*'((?:[^'\\\\]|\\\\.|'')*)'\\s*\\)/", $sql, $matches, PREG_SET_ORDER);
    $rows = [];
    foreach ($matches as [, $code, $value]) {
        $rows[$code] = trim(str_replace(["''", "\\'"], "'", $value));
    }

    return $rows;
}

$names = rows($wilayahSql);
$postal = rows($kodeposSql);
ksort($names, SORT_STRING);

$out = __DIR__.'/../database/data/regions';
$files = [
    1 => fopen("{$out}/provinces.csv", 'w'),
    2 => fopen("{$out}/cities.csv", 'w'),
    3 => fopen("{$out}/districts.csv", 'w'),
    4 => gzopen("{$out}/villages.csv.gz", 'w9'),
];
$counts = [1 => 0, 2 => 0, 3 => 0, 4 => 0];
$header = "code,parent_code,name,kind,postal_code\n";
foreach ($files as $handle) {
    is_resource($handle) && (get_resource_type($handle) === 'stream' ? fwrite($handle, $header) : gzwrite($handle, $header));
}

foreach ($names as $code => $name) {
    $code = (string) $code;
    $parts = explode('.', $code);
    $level = count($parts);
    if ($level < 1 || $level > 4) {
        continue;
    }
    $kind = match ($level) {
        1 => 'provinsi',
        2 => (int) $parts[1] >= 71 ? 'kota' : 'kabupaten',
        3 => 'kecamatan',
        default => match ($parts[3][0] ?? '') {
            '1' => 'kelurahan',
            '3' => 'desa_adat',
            default => 'desa',
        },
    };
    $parent = $level === 1 ? '' : implode('.', array_slice($parts, 0, -1));
    $line = implode(',', [$code, $parent, '"'.str_replace('"', '""', $name).'"', $kind, $level === 4 ? ($postal[$code] ?? '') : '']).PHP_EOL;
    $level === 4 ? gzwrite($files[4], $line) : fwrite($files[$level], $line);
    $counts[$level]++;
}

fclose($files[1]);
fclose($files[2]);
fclose($files[3]);
gzclose($files[4]);

printf("provinces %d, cities %d, districts %d, villages %d\n", $counts[1], $counts[2], $counts[3], $counts[4]);
