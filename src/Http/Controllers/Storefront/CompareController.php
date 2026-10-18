<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CompareList;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\Layout;

/**
 * The compare page: chosen products side by side, with the Catalog
 * settings' compare fields and their specifications matched by label.
 */
class CompareController
{
    public function show(CompareList $list, StoreSettings $settings): View
    {
        $entryIds = Product::query()->whereIn('id', $list->ids())->pluck('entry_id', 'id');
        $entries = $entryIds->isEmpty() ? collect() : ProductQuery::make()->entries($entryIds->values()->all())->get($list->max());
        // In the order they were added.
        $order = array_flip(array_map(fn (int $id) => (int) ($entryIds[$id] ?? 0), $list->ids()));
        $entries = $entries->sortBy(fn ($e) => $order[$e->id] ?? 99)->values();

        $labels = [];
        foreach ($entries as $entry) {
            foreach ($entry->get('specifications') ?? [] as $row) {
                $label = trim((string) data_get($row, 'label', ''));
                if ($label !== '' && ! in_array(mb_strtolower($label), array_map('mb_strtolower', $labels), true)) {
                    $labels[] = $label;
                }
            }
        }

        return view(Layout::view('compare'), [
            'entries' => $entries,
            'fields' => (array) $settings->get('catalog.compare_fields', []),
            'specLabels' => $labels,
            'seoTitle' => __('commerce::storefront.compare.title'),
        ]);
    }

    public function add(Request $request, CompareList $list): RedirectResponse|JsonResponse
    {
        $data = $request->validate(['product' => ['required', 'integer']]);
        try {
            $list->add((int) $data['product']);
        } catch (CartException $e) {
            return $this->respond($request, $e->getMessage(), false, $list);
        }

        return $this->respond($request, __('commerce::storefront.compare.added'), true, $list);
    }

    public function remove(Request $request, int $product, CompareList $list): RedirectResponse|JsonResponse
    {
        $list->remove($product);

        return $this->respond($request, __('commerce::storefront.compare.removed'), true, $list);
    }

    protected function respond(Request $request, string $message, bool $ok, CompareList $list): RedirectResponse|JsonResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => $message, 'count' => count($list->ids())], $ok ? 200 : 422);
        }

        return back()->with($ok ? 'commerce.success' : 'commerce.error', $message);
    }
}
