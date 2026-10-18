<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Actions;

use Illuminate\Support\Str;
use Sunrice\Facades\Sunrice;
use Sunrice\Models\Collection;
use Sunrice\Models\Menu;
use Sunrice\Structure\ImportReport;
use Sunrice\Support\Locales;

/**
 * Creates the store structure in Sunrice (resources/structure/commerce.php):
 * the product blueprint and collection, the product taxonomies, the
 * inquiry form, legal pages (when a `pages` collection exists) and the
 * `shop` menu. Safe to run again; changed items are reported and only
 * overwritten with $force.
 */
class ScaffoldStore
{
    public const LEGAL_PAGES = [
        'privacy' => ['en' => ['privacy-policy', 'Privacy Policy'], 'id' => ['kebijakan-privasi', 'Kebijakan Privasi']],
        'terms' => ['en' => ['terms-and-conditions', 'Terms & Conditions'], 'id' => ['syarat-dan-ketentuan', 'Syarat & Ketentuan']],
        'returns' => ['en' => ['returns-and-refunds', 'Returns & Refunds'], 'id' => ['pengembalian-dan-refund', 'Pengembalian & Refund']],
        'shipping' => ['en' => ['shipping-policy', 'Shipping Policy'], 'id' => ['kebijakan-pengiriman', 'Kebijakan Pengiriman']],
    ];

    public function handle(bool $dryRun = false, bool $force = false): ImportReport
    {
        return Sunrice::importStructure($this->definition(), $dryRun, $force);
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
        $pages = Collection::query()->with('blueprint')->where('handle', 'pages')->first();
        if ($pages === null) {
            return [];
        }
        // The text goes into the page blueprint's first rich text (or textarea) field.
        $fields = (array) ($pages->blueprint->fields ?? []);
        $body = collect($fields)->firstWhere('type', 'rich_text') ?? collect($fields)->firstWhere('type', 'textarea');
        $language = Locales::main() === 'id' ? 'id' : 'en';

        $entries = [];
        foreach (self::LEGAL_PAGES as $key => $titles) {
            [$slug, $title] = $titles[$language];
            $markdown = (string) file_get_contents(__DIR__."/../../../resources/structure/pages/{$key}.{$language}.md");
            $entries[] = [
                'collection' => 'pages',
                'slug' => $slug,
                'title' => $title,
                'data' => $body === null ? [] : [$body['handle'] => ($body['type'] === 'rich_text' ? Str::markdown($markdown) : $markdown)],
            ];
        }

        return $entries;
    }

    /** @return array<string, mixed> */
    protected function menu(): array
    {
        $prefix = fn (string $path) => '/'.ltrim((string) config("commerce.storefront.paths.{$path}", $path), '/');

        return ['handle' => 'shop', 'title' => 'Shop', 'items' => [
            ['type' => 'collection', 'target' => 'products', 'labels' => ['id' => 'Belanja', 'en' => 'Shop']],
            ['type' => 'url', 'url' => $prefix('brands'), 'labels' => ['id' => 'Merek', 'en' => 'Brands']],
            ['type' => 'url', 'url' => $prefix('cart'), 'labels' => ['id' => 'Keranjang', 'en' => 'Cart']],
            ['type' => 'url', 'url' => $prefix('account'), 'labels' => ['id' => 'Akun', 'en' => 'Account']],
        ]];
    }
}
