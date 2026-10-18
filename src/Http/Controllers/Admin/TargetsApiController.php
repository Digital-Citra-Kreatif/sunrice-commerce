<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Models\Taxonomy;
use Sunrice\Models\Term;
use Sunrice\Support\Locales;

/** GET commerce/api/targets?q=…&types[]=product&taxonomies[]=brands — choices for the targets picker. */
class TargetsApiController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // The pickers of vouchers, flash sales, pricing rules and marketing audiences.
        $this->authorizeAny($request->user(), ['commerce.vouchers.manage', 'commerce.flash-sales.manage', 'commerce.pricing-rules.manage', 'commerce.marketing.manage']);
        $q = trim((string) $request->query('q', ''));
        $types = array_intersect((array) $request->query('types', ['product', 'variant', 'term']), ['product', 'variant', 'term']);
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $q).'%';
        $results = [];

        if (in_array('product', $types, true)) {
            Product::query()->join('sunrice_entry_translations as t', fn ($j) => $j->on('t.entry_id', '=', 'commerce_products.entry_id')->where('t.locale', Locales::main()))
                ->whereNull('commerce_products.removed_at')
                ->when($q !== '', fn ($query) => $query->whereLike('t.title', $like))
                ->orderBy('t.title')->limit(15)->get(['commerce_products.id', 't.title'])
                ->each(function ($p) use (&$results) {
                    $results[] = ['type' => 'product', 'id' => $p->id, 'label' => (string) $p->getAttribute('title'), 'group' => 'Products'];
                });
        }
        if (in_array('variant', $types, true) && $q !== '') {
            Variant::query()->join('commerce_products as p', 'p.id', '=', 'commerce_variants.product_id')
                ->join('sunrice_entry_translations as t', fn ($j) => $j->on('t.entry_id', '=', 'p.entry_id')->where('t.locale', Locales::main()))
                ->whereNull('p.removed_at')
                ->where(fn ($w) => $w->whereLike('commerce_variants.sku', $like)->orWhereLike('t.title', $like))
                ->orderBy('t.title')->orderBy('commerce_variants.position')->limit(15)
                ->get(['commerce_variants.id', 'commerce_variants.sku', 'commerce_variants.title', 't.title as product'])
                ->each(function ($v) use (&$results) {
                    $label = trim($v->getAttribute('product').($v->title !== '' ? ' — '.$v->title : '').($v->sku ? " ({$v->sku})" : ''));
                    $results[] = ['type' => 'variant', 'id' => $v->id, 'label' => $label, 'group' => 'Variants'];
                });
        }
        if (in_array('term', $types, true)) {
            $handles = (array) $request->query('taxonomies', [config('commerce.catalog.category_taxonomy'), config('commerce.catalog.brand_taxonomy')]);
            foreach (Taxonomy::query()->whereIn('handle', $handles)->get() as $taxonomy) {
                Term::query()->where('taxonomy_id', $taxonomy->id)->with('translations')
                    ->when($q !== '', fn ($query) => $query->whereHas('translations', fn ($t) => $t->whereLike('name', $like)))
                    ->limit(15)->get()
                    ->each(function (Term $term) use (&$results, $taxonomy) {
                        $results[] = ['type' => 'term', 'id' => $term->id, 'label' => (string) ($term->translations->firstWhere('locale', Locales::main())->name ?? $term->id), 'group' => $taxonomy->title];
                    });
            }
        }

        return response()->json(['data' => $results]);
    }
}
