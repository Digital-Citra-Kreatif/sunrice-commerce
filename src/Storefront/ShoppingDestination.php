<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Settings\StoreSettings;

/** The shared destination of the storefront's Continue shopping links. */
final class ShoppingDestination
{
    public function __construct(private StoreSettings $settings) {}

    public function url(): string
    {
        $locale = Locales::current();
        if ($this->settings->get('catalog.continue_shopping_mode') === 'page' && ($selected = $this->selectedUrl($locale)) !== null) {
            return $selected;
        }

        $handles = (array) config('commerce.catalog.collections', ['products']);
        $collections = Collection::query()->whereIn('handle', $handles)->get()->keyBy('handle');
        foreach ($handles as $handle) {
            if (($listing = $collections->get($handle)?->listingUrl($locale)) !== null) {
                return $listing;
            }
        }

        return url(Locales::prefix($locale) ?: '/');
    }

    private function selectedUrl(string $locale): ?string
    {
        if ($this->settings->get('catalog.continue_shopping_target') === 'collection') {
            $handle = $this->settings->get('catalog.continue_shopping_collection');

            return is_string($handle) ? Collection::query()->where('handle', $handle)->first()?->listingUrl($locale) : null;
        }

        $id = $this->settings->get('catalog.continue_shopping_page');

        return is_numeric($id) ? Entry::query()->with(['translations', 'collection'])->find((int) $id)?->shownIn($locale)?->url() : null;
    }
}
