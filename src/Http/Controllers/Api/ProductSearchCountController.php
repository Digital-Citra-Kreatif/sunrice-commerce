<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Catalog\ProductQuery;

final class ProductSearchCountController
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate(['q' => ['required', 'string', 'max:100']]);
        $count = ProductQuery::make()->search($data['q'])->count();

        return response()->json([
            'count' => $count,
            'message' => trans_choice('commerce::storefront.theme.search_matches', $count),
        ]);
    }
}
