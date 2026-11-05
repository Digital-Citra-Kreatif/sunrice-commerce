<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Cart\CompareList;
use Sunrice\Commerce\Catalog\LiveEntries;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Storefront\Layout;

/** <x-commerce::compare-button :entry="$entry" /> — add to / remove from the comparison. */
class CompareButton extends Component
{
    public ?int $productId;

    public bool $added;

    public function __construct(Entry|EntryTranslation $entry)
    {
        $this->productId = Product::query()->where('entry_id', LiveEntries::id($entry))->value('id');
        $this->added = $this->productId !== null && app(CompareList::class)->has($this->productId);
    }

    public function shouldRender(): bool
    {
        return $this->productId !== null && commerce_feature('compare');
    }

    public function render(): View
    {
        return view(Layout::view('partials.compare-button'));
    }
}
