<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Models\Entry;

/** <x-commerce::price :entry="$entry" /> — the product's price (or "Sign in to see prices"). */
class Price extends Component
{
    public ?ProductView $product;

    public function __construct(?Entry $entry = null, ?ProductView $product = null)
    {
        $this->product = $product ?? ($entry !== null ? commerce_product($entry) : null);
    }

    public function shouldRender(): bool
    {
        return $this->product !== null;
    }

    public function render(): View
    {
        return view(Layout::view('partials.price'));
    }
}
