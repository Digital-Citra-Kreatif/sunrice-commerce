<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Commerce\Cart\CartManager;
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
        $this->count = $cart === null ? 0 : (int) $cart->items()->sum('quantity');
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
