<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Storefront\Layout;

/**
 * <x-commerce::mini-cart /> — the header cart link with its count;
 * commerce.js keeps it current after AJAX adds.
 */
class MiniCart extends Component
{
    public int $count;

    public function __construct()
    {
        $cart = commerce_feature('cart') ? app(CartManager::class)->current() : null;
        // What the cart page and drawer show: lines that can't be bought now (out of stock, a product
        // whose button is no longer Add to cart…) stay saved but don't count. An empty cart skips pricing.
        $this->count = $cart === null || $cart->items()->doesntExist() ? 0 : CartView::for($cart)->count();
    }

    public function shouldRender(): bool
    {
        return commerce_feature('cart');
    }

    public function render(): View
    {
        return view(Layout::view('partials.mini-cart'));
    }
}
