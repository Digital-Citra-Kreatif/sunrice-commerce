<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\Actions\ApplyVoucher;
use Sunrice\Commerce\Cart\Actions\RemoveCartItem;
use Sunrice\Commerce\Cart\Actions\RemoveVoucher;
use Sunrice\Commerce\Cart\Actions\UpdateCartItem;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\VariantFromOptions;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/** The cart page and its forms (work without JavaScript: redirects with flash messages). */
class CartController
{
    public function show(CartManager $carts): View
    {
        $view = CartView::for($carts->current());

        return tap(view(Layout::view('cart'), ['cart' => $view, 'seoTitle' => __('commerce::storefront.cart.title')]), fn () => $view->acknowledgePrices());
    }

    public function add(Request $request, AddToCart $add): RedirectResponse
    {
        $data = $request->validate(['variant' => ['required_without:options', 'nullable', 'integer'], 'product' => ['nullable', 'integer'], 'options' => ['nullable', 'array'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:100000']]);
        $variant = VariantFromOptions::fromRequest($data);
        if ($variant === null) {
            return back()->with('commerce.error', __('commerce::storefront.product.unavailable'));
        }
        try {
            $item = $add->handle($variant, (int) ($data['quantity'] ?? 1));
        } catch (CartException $e) {
            return back()->with('commerce.error', $e->getMessage());
        }
        $title = (string) ($item->variant->product->entry()?->resolveFor(app()->getLocale())->title ?? '');

        return ($request->boolean('buy_now') && Route::has('commerce.checkout')
            ? redirect(StorefrontRoutes::url('commerce.checkout'))
            : back())->with('commerce.success', __('commerce::storefront.cart.added', ['product' => $title]));
    }

    public function update(Request $request, int $item, UpdateCartItem $update): RedirectResponse
    {
        $data = $request->validate(['quantity' => ['required', 'integer', 'min:0', 'max:100000']]);

        return $this->attempt(fn () => $update->handle($item, (int) $data['quantity']), __('commerce::storefront.cart.updated'));
    }

    public function remove(int $item, RemoveCartItem $remove): RedirectResponse
    {
        return $this->attempt(fn () => $remove->handle($item), __('commerce::storefront.cart.removed'));
    }

    public function applyVoucher(Request $request, ApplyVoucher $apply): RedirectResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:64']]);

        return $this->attempt(fn () => $apply->handle($data['code']), fn (string $code) => __('commerce::storefront.cart.voucher_applied', ['code' => $code]));
    }

    public function removeVoucher(string $code, RemoveVoucher $remove): RedirectResponse
    {
        $remove->handle($code);

        return back()->with('commerce.success', __('commerce::storefront.cart.voucher_removed'));
    }

    /** @param  string|\Closure(mixed): string  $success */
    protected function attempt(\Closure $action, string|\Closure $success): RedirectResponse
    {
        try {
            $result = $action();
        } catch (CartException $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return back()->with('commerce.success', is_string($success) ? $success : $success($result));
    }
}
