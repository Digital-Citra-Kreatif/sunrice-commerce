<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\View\Component;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\Models\CartItem;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Models\Entry;

/**
 * <x-commerce::cart /> — the cart lines, voucher field and totals (the cart
 * page's body). Lines are shown commerce.cart.per_page at a time (?page=);
 * the totals are always the whole cart's.
 */
class Cart extends Component
{
    public CartView $cart;

    /** @var LengthAwarePaginator<int, array{item: CartItem, line: CalcLine, product: ?ProductView, entry: ?Entry}> */
    public LengthAwarePaginator $lines;

    public function __construct(?CartView $cart = null)
    {
        $this->cart = $cart ?? CartView::for(app(CartManager::class)->current());
        $perPage = max(1, (int) config('commerce.cart.per_page', 25));
        $total = count($this->cart->lines);
        // Past the last page (after removing its last line): the last page.
        $page = min(Paginator::resolveCurrentPage(), max(1, (int) ceil($total / $perPage)));
        $this->lines = new LengthAwarePaginator(array_slice($this->cart->lines, ($page - 1) * $perPage, $perPage), $total, $perPage, $page,
            ['path' => Paginator::resolveCurrentPath()]);
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
