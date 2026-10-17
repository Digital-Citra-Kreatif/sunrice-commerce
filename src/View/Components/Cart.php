<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Storefront\Layout;

/** <x-commerce::cart /> — the cart lines, voucher field and totals (the cart page's body). */
class Cart extends Component
{
    public CartView $cart;

    public function __construct(?CartView $cart = null)
    {
        $this->cart = $cart ?? CartView::for(app(CartManager::class)->current());
    }

    public function shouldRender(): bool
    {
        return commerce_feature('cart');
    }

    public function render(): View
    {
        return view(Layout::view('partials.cart'));
    }
}
