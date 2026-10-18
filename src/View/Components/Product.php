<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Models\Entry;

/**
 * <x-commerce::product :entry="$entry" /> — the buying block of a product:
 * price, variant picker, quantity and the button (add to cart, inquiry,
 * WhatsApp or shop links), stock and bulk prices.
 */
class Product extends Component
{
    public ?ProductView $product;

    public function __construct(public Entry $entry)
    {
        $this->product = commerce_product($entry);
    }

    public function shouldRender(): bool
    {
        return $this->product !== null;
    }

    public function render(): View
    {
        return view(Layout::view('partials.buy'));
    }
}
