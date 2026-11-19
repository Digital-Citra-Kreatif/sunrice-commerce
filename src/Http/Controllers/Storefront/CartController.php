<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\Actions\ApplyVoucher;
use Sunrice\Commerce\Cart\Actions\RemoveCartItem;
use Sunrice\Commerce\Cart\Actions\RemoveVoucher;
use Sunrice\Commerce\Cart\Actions\UpdateCartItem;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\VariantFromOptions;
use Sunrice\Commerce\Catalog\LiveEntries;
use Sunrice\Commerce\Loyalty\Actions\UsePoints;
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
        $title = (string) ((($e = $item->variant->product->entry()) !== null ? LiveEntries::translation($e)?->title : null) ?? '');

        return ($request->boolean('buy_now') && Route::has('commerce.checkout')
            ? redirect(StorefrontRoutes::url('commerce.checkout'))
            : back())->with('commerce.success', __('commerce::storefront.cart.added', ['product' => $title]));
    }

    public function update(Request $request, int $item, UpdateCartItem $update): RedirectResponse
    {
        $cart = $this->cartUrl($request);
        try {
            $data = $request->validate(['quantity' => ['required', 'integer', 'min:1', 'max:100000']], [
                'quantity.min' => __('commerce::storefront.cart.quantity_positive'),
            ]);
        } catch (ValidationException $e) {
            throw $e->redirectTo($cart);
        }

        return $this->attempt(fn () => $update->handle($item, (int) $data['quantity']), __('commerce::storefront.cart.updated'), $cart);
    }

    public function remove(Request $request, int $item, RemoveCartItem $remove): RedirectResponse
    {
        return $this->attempt(fn () => $remove->handle($item), __('commerce::storefront.cart.removed'), $this->cartUrl($request));
    }

    /** Pay with loyalty points, or not (signed-in customers). */
    public function usePoints(Request $request, UsePoints $use): RedirectResponse
    {
        return $this->attempt(fn () => $use->handle($request->boolean('use')), __('commerce::storefront.cart.points_saved'));
    }

    public function applyVoucher(Request $request, ApplyVoucher $apply): RedirectResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:64']]);

        return $this->attempt(fn () => $apply->handle($data['code']), fn (string $code) => __('commerce::storefront.cart.voucher_applied', ['code' => $code]));
    }

    public function removeVoucher(string $code, RemoveVoucher $remove): RedirectResponse
    {
        $remove->handle($code);

        return redirect($this->cartUrl())->with('commerce.success', __('commerce::storefront.cart.voucher_removed'));
    }

    /** @param  string|\Closure(mixed): string  $success */
    protected function attempt(\Closure $action, string|\Closure $success, ?string $destination = null): RedirectResponse
    {
        $redirect = redirect($destination ?? $this->cartUrl());
        try {
            $result = $action();
        } catch (CartException $e) {
            return $redirect->with('commerce.error', $e->getMessage());
        }

        return $redirect->with('commerce.success', is_string($success) ? $success : $success($result));
    }

    protected function cartUrl(?Request $request = null): string
    {
        $cart = StorefrontRoutes::url('commerce.cart');
        $page = $request?->integer('page') ?? 0;
        $referer = $request?->headers->get('referer', '') ?? '';
        if ($page === 0 && parse_url($referer, PHP_URL_PATH) === parse_url($cart, PHP_URL_PATH)) {
            // Older cart templates carry the page in the referrer rather than a form field.
            parse_str((string) parse_url($referer, PHP_URL_QUERY), $query);
            $page = filter_var($query['page'] ?? 1, FILTER_VALIDATE_INT) ?: 1;
        }

        return $page > 1 ? StorefrontRoutes::url('commerce.cart', ['page' => $page]) : $cart;
    }
}
