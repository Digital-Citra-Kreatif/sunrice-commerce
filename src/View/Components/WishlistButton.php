<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Wishlist\WishlistManager;
use Sunrice\Models\Entry;

/** <x-commerce::wishlist-button :entry="$entry" /> — add to / remove from the wishlist. */
class WishlistButton extends Component
{
    public ?int $productId;

    public bool $saved;

    public function __construct(Entry $entry)
    {
        $this->productId = Product::query()->where('entry_id', $entry->id)->value('id');
        $this->saved = $this->productId !== null && app(WishlistManager::class)->has($this->productId);
    }

    public function shouldRender(): bool
    {
        return $this->productId !== null && commerce_feature('wishlist');
    }

    public function render(): View
    {
        return view(Layout::view('partials.wishlist-button'));
    }
}
