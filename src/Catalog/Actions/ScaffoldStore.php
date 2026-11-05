<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Sunrice\Cms\Models\Blueprint;
use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Models\Menu;
use Sunrice\Cms\Structure\ImportReport;
use Sunrice\Cms\Structure\StructureImporter;
use Sunrice\Cms\Support\Locales;

/**
 * Creates the store structure in Sunrice (resources/structure/commerce.php):
 * the product blueprint and collection, the product taxonomies, the
 * inquiry form, legal pages (when a `pages` collection exists) and the
 * `shop` menu, legal pages as drafts. Safe to run again: what exists is
 * kept as it is (reported as KEPT) and only replaced with $force.
 */
class ScaffoldStore
{
    public const LEGAL_PAGES = [
        'privacy' => ['en' => ['privacy-policy', 'Privacy Policy'], 'id' => ['kebijakan-privasi', 'Kebijakan Privasi']],
        'terms' => ['en' => ['terms-and-conditions', 'Terms & Conditions'], 'id' => ['syarat-dan-ketentuan', 'Syarat & Ketentuan']],
        'returns' => ['en' => ['returns-and-refunds', 'Returns & Refunds'], 'id' => ['pengembalian-dan-refund', 'Pengembalian & Refund']],
        'shipping' => ['en' => ['shipping-policy', 'Shipping Policy'], 'id' => ['kebijakan-pengiriman', 'Kebijakan Pengiriman']],
    ];

    /** Items left as they are because they exist (run with $force to replace them). */
    public const KEPT = 'kept';

    /** The tables of what the definition makes, by section. */
    private const TABLES = ['blueprints' => 'sunrice_blueprints', 'collections' => 'sunrice_collections', 'taxonomies' => 'sunrice_taxonomies', 'forms' => 'sunrice_forms'];

    public function handle(bool $dryRun = false, bool $force = false): ImportReport
    {
        $definition = $this->definition();
        $kept = [];
        if (! $force) {
            // What exists stays as the store's staff left it.
            foreach (self::TABLES as $section => $table) {
                $existing = DB::table($table)->whereIn('handle', array_column($definition[$section] ?? [], 'handle'))->pluck('handle')->all();
                foreach ($existing as $handle) {
                    $kept[] = [rtrim($section === 'taxonomies' ? 'taxonomy' : $section, 's'), (string) $handle];
                }
                $definition[$section] = array_values(array_filter($definition[$section] ?? [], fn (array $item): bool => ! in_array($item['handle'], $existing, true)));
            }
        }
        $report = app(StructureImporter::class)->import($definition, $dryRun, $force);
        foreach ($kept as [$type, $handle]) {
            $report->add($type, $handle, self::KEPT, ['Exists: kept as it is.']);
        }

        return $report;
    }

    /** @return array<string, mixed> */
    public function definition(): array
    {
        $definition = require __DIR__.'/../../../resources/structure/commerce.php';
        $definition['entries'] = $this->legalPages();
        if (! Menu::query()->where('handle', 'shop')->exists()) {
            $definition['menus'] = [$this->menu()];
        }

        return $definition;
    }

    /** @return array<int, array<string, mixed>> */
    protected function legalPages(): array
    {
        $pages = Collection::query()->where('handle', 'pages')->first();
        if ($pages === null) {
            return [];
        }
        // The text goes into the page blueprint's first rich text (or textarea) field.
        $fields = (array) (Blueprint::query()->where('handle', $pages->blueprint)->value('fields') ?? []);
        $body = collect($fields)->firstWhere('type', 'rich_text') ?? collect($fields)->firstWhere('type', 'textarea');
        $language = Locales::default() === 'id' ? 'id' : 'en';

        $entries = [];
        foreach (self::LEGAL_PAGES as $key => $titles) {
            [$slug, $title] = $titles[$language];
            $markdown = (string) file_get_contents(__DIR__."/../../../resources/structure/pages/{$key}.{$language}.md");
            $entries[] = [
                'collection' => 'pages',
                'slug' => $slug,
                'translations' => [Locales::default() => [
                    'title' => $title,
                    'slug' => $slug,
                    'data' => $body === null ? [] : [$body['handle'] => ($body['type'] === 'rich_text' ? Str::markdown($markdown) : $markdown)],
                    'published' => false,
                ]],
            ];
        }

        return $entries;
    }

    /** @return array<string, mixed> */
    protected function menu(): array
    {
        $prefix = fn (string $path) => '/'.ltrim((string) config("commerce.storefront.paths.{$path}", $path), '/');
        // Only the site's languages: the importer refuses texts in others.
        $labels = fn (array $texts): array => array_intersect_key($texts, array_flip(Locales::all()));

        return ['handle' => 'shop', 'title' => 'Shop', 'items' => [
            ['collection' => 'products', 'labels' => $labels(['id' => 'Belanja', 'en' => 'Shop'])],
            ['url' => $prefix('brands'), 'labels' => $labels(['id' => 'Merek', 'en' => 'Brands'])],
            ['url' => $prefix('cart'), 'labels' => $labels(['id' => 'Keranjang', 'en' => 'Cart'])],
            ['url' => $prefix('account'), 'labels' => $labels(['id' => 'Akun', 'en' => 'Account'])],
        ]];
    }
}
