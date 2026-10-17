<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart;

use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Settings\StoreSettings;

/** Products to compare, in the session (commerce.compare); at most Settings → Catalog → compare_max. */
class CompareList
{
    public const KEY = 'commerce.compare';

    /** @return array<int, int> product ids */
    public function ids(): array
    {
        return array_values(array_map('intval', (array) session(self::KEY, [])));
    }

    public function max(): int
    {
        return max(2, min(6, (int) app(StoreSettings::class)->get('catalog.compare_max', 4)));
    }

    public function add(int $productId): void
    {
        if (Product::query()->whereKey($productId)->whereNull('removed_at')->doesntExist()) {
            throw new CartException(__('commerce::storefront.availability.not_published'), 'not_published');
        }
        $ids = $this->ids();
        if (in_array($productId, $ids, true)) {
            return;
        }
        if (count($ids) >= $this->max()) {
            throw new CartException(__('commerce::storefront.compare.full', ['count' => $this->max()]), 'limit');
        }
        session()->put(self::KEY, [...$ids, $productId]);
    }

    public function remove(int $productId): void
    {
        session()->put(self::KEY, array_values(array_diff($this->ids(), [$productId])));
    }

    public function has(int $productId): bool
    {
        return in_array($productId, $this->ids(), true);
    }

    public function clear(): void
    {
        session()->forget(self::KEY);
    }
}
