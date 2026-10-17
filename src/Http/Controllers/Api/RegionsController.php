<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Regions\Region;
use Sunrice\Commerce\Regions\RegionImporter;

/**
 * GET {api}/regions?parent=32.73 — the active children of a region (the
 * provinces without a parent), for cascading address selects.
 */
class RegionsController
{
    public function __invoke(Request $request): JsonResponse
    {
        $parent = $request->query('parent');
        $parent = is_string($parent) && preg_match('/^\d{2}(\.\d{2}(\.\d{2})?)?$/', $parent) ? $parent : null;
        $version = (int) Cache::rememberForever(RegionImporter::cacheKey(), fn () => time());

        $regions = Cache::remember("commerce:regions:{$version}:".($parent ?? 'root'), 86400, fn () => Region::query()
            ->active()
            ->when($parent === null, fn ($q) => $q->where('level', 1), fn ($q) => $q->where('parent_code', $parent))
            ->orderBy('name')
            ->get(['code', 'name', 'kind', 'postal_code'])
            ->map(fn (Region $r) => array_filter(['code' => $r->code, 'name' => $r->name, 'kind' => $r->kind, 'postal_code' => $r->postal_code], fn ($v) => $v !== null))
            ->all());

        return response()->json(['data' => $regions])
            ->setPublic()->setMaxAge(86400);
    }
}
