<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics;

use Illuminate\Support\Facades\DB;
use Sunrice\Support\Locales;

/** Product titles (main language) and admin editor links, in one query. */
final class ProductTitles
{
    /**
     * @param  array<int, int>  $productIds
     * @return array<int, array{title: string, href: string|null}>
     */
    public static function for(array $productIds): array
    {
        if ($productIds === []) {
            return [];
        }
        $rows = DB::table('commerce_products as p')
            ->leftJoin('sunrice_entries as e', 'e.id', '=', 'p.entry_id')
            ->leftJoin('sunrice_collections as c', 'c.id', '=', 'e.collection_id')
            ->leftJoin('sunrice_entry_translations as t', fn ($j) => $j->on('t.entry_id', '=', 'p.entry_id')->where('t.locale', Locales::main()))
            ->whereIn('p.id', array_values(array_unique($productIds)))
            ->get(['p.id', 'p.entry_id', 't.title', 'c.handle']);

        $out = [];
        foreach ($rows as $row) {
            $out[(int) $row->id] = [
                'title' => (string) ($row->title ?? "Product #{$row->id}"),
                'href' => $row->handle !== null ? "collections/{$row->handle}/entries/{$row->entry_id}/edit" : null,
            ];
        }

        return $out;
    }
}
