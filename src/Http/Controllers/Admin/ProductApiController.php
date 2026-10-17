<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Models\Entry;
use Sunrice\Models\EntryTranslation;
use Sunrice\Support\Locales;

/** JSON for the product editor control. */
class ProductApiController extends Controller
{
    /** GET commerce/api/sku-check?sku=…&entry=… — whether another product uses the SKU. */
    public function skuCheck(Request $request): JsonResponse
    {
        $sku = trim((string) $request->query('sku', ''));
        if ($sku === '') {
            return response()->json(['available' => true]);
        }
        $entryId = (int) $request->query('entry', 0);
        $taken = Variant::query()->with('product:id,entry_id')
            ->where(DB::raw('lower(sku)'), mb_strtolower($sku))
            ->whereHas('product', fn ($q) => $q->where('entry_id', '!=', $entryId))
            ->first();
        if ($taken === null) {
            return response()->json(['available' => true]);
        }
        $title = EntryTranslation::query()->where('entry_id', $taken->product->entry_id)->where('locale', Locales::main())->value('title');

        return response()->json(['available' => false, 'product' => $title]);
    }

    /** GET commerce/api/products/{entry} — sync state and live stock of the entry's product. */
    public function show(Request $request, int $entry): JsonResponse
    {
        $model = Entry::query()->findOrFail($entry);
        $this->authorize('view', $model);
        $product = Product::query()->where('entry_id', $entry)->first();
        if ($product === null) {
            return response()->json(['data' => null]);
        }

        return response()->json(['data' => [
            'id' => $product->id,
            'sync_status' => $product->sync_status,
            'sync_error' => $product->sync_error,
            'synced_at' => $product->synced_at?->toIso8601String(),
            'sales_count' => $product->sales_count,
            'variants' => $product->variants()->get()->mapWithKeys(fn (Variant $v) => [$v->uid => [
                'id' => $v->id,
                'stock_quantity' => $v->stock_quantity,
                'stock_status' => $v->stock_status,
                'track_stock' => $v->track_stock,
            ]]),
        ]]);
    }

    /** GET commerce/api/variants?q=…&ids[]=… — sellable variants for bundle components. */
    public function variants(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        $ids = array_filter(array_map('intval', (array) $request->query('ids', [])));
        $variants = Variant::query()
            ->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')
            ->join('sunrice_entry_translations as t', fn ($join) => $join->on('t.entry_id', '=', 'commerce_products.entry_id')->where('t.locale', Locales::main()))
            ->where('commerce_products.type', '!=', 'bundle')
            ->whereNull('commerce_products.removed_at')
            ->when($ids !== [], fn ($query) => $query->whereIn('commerce_variants.id', $ids))
            ->when($q !== '', fn ($query) => $query->where(fn ($w) => $w->whereLike('t.title', "%{$q}%")->orWhereLike('commerce_variants.sku', "%{$q}%")))
            ->orderBy('t.title')->orderBy('commerce_variants.position')
            ->limit(30)
            ->get(['commerce_variants.id', 'commerce_variants.sku', 'commerce_variants.title as variant', 'commerce_variants.price', 't.title as product']);

        return response()->json(['data' => $variants->map(fn ($v) => [
            'id' => $v->id,
            'label' => trim($v->getAttribute('product').($v->getAttribute('variant') ? ' — '.$v->getAttribute('variant') : '')),
            'sku' => $v->sku,
            'price' => (int) $v->price,
        ])]);
    }
}
