<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Models\Term;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;

/** Labels of stored targets for the targets picker. */
final class TargetLabels
{
    /**
     * @param  array<int, array{type: string, id: int}>  $targets
     * @return array<int, array{type: string, id: int, label: string}>
     */
    public static function for(array $targets): array
    {
        $ids = fn (string $type) => array_column(array_filter($targets, fn ($t) => $t['type'] === $type), 'id');
        $products = Product::query()->whereIn('id', $ids('product'))->get();
        $variants = Variant::withTrashed()->with('product')->whereIn('id', $ids('variant'))->get();
        // Every product's title in one query.
        $titles = EntryTranslation::query()->where('locale', Locales::default())
            ->whereIn('entry_id', $products->pluck('entry_id')->merge($variants->pluck('product.entry_id'))->filter()->unique()->all())
            ->pluck('title', 'entry_id');
        $title = fn (?int $entryId) => (string) ($titles[$entryId] ?? '');
        $products = $products->mapWithKeys(fn (Product $p) => [$p->id => $title($p->entry_id)]);
        $variants = $variants
            ->mapWithKeys(fn (Variant $v) => [$v->id => trim($title($v->product->entry_id).($v->title !== '' ? ' — '.$v->title : '').($v->sku ? " ({$v->sku})" : ''))]);
        $terms = Term::query()->with('translations')->whereIn('id', $ids('term'))->get()
            ->mapWithKeys(fn (Term $t) => [$t->id => (string) ($t->translations->firstWhere('locale', Locales::default())->title ?? $t->id)]);

        return array_map(fn (array $t) => [...$t, 'label' => match ($t['type']) {
            'product' => $products[$t['id']] ?? "#{$t['id']}",
            'variant' => $variants[$t['id']] ?? "#{$t['id']}",
            default => $terms[$t['id']] ?? "#{$t['id']}",
        }], $targets);
    }
}
