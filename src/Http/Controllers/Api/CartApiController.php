<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\Actions\ApplyVoucher;
use Sunrice\Commerce\Cart\Actions\RemoveCartItem;
use Sunrice\Commerce\Cart\Actions\RemoveVoucher;
use Sunrice\Commerce\Cart\Actions\UpdateCartItem;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;

/**
 * {api}/cart — the cart as JSON for themes (mini cart, AJAX add to cart):
 * GET; POST items; PATCH/DELETE items/{id}; POST vouchers; DELETE vouchers/{code}.
 * Errors are 422 with {message, reason}.
 */
class CartApiController
{
    public function __construct(protected CartManager $carts) {}

    public function show(): JsonResponse
    {
        return $this->cart();
    }

    public function add(Request $request, AddToCart $add): JsonResponse
    {
        $data = $request->validate(['variant' => ['required', 'integer'], 'quantity' => ['nullable', 'integer', 'min:1', 'max:100000']]);

        return $this->attempt(function () use ($add, $data) {
            $item = $add->handle((int) $data['variant'], (int) ($data['quantity'] ?? 1));

            return __('commerce::storefront.cart.added', ['product' => (string) ($item->variant->product->entry()?->resolveFor(app()->getLocale())->title ?? '')]);
        });
    }

    public function update(Request $request, int $item, UpdateCartItem $update): JsonResponse
    {
        $data = $request->validate(['quantity' => ['required', 'integer', 'min:0', 'max:100000']]);

        return $this->attempt(fn () => tap(__('commerce::storefront.cart.updated'), fn () => $update->handle($item, (int) $data['quantity'])));
    }

    public function remove(int $item, RemoveCartItem $remove): JsonResponse
    {
        return $this->attempt(fn () => tap(__('commerce::storefront.cart.removed'), fn () => $remove->handle($item)));
    }

    public function applyVoucher(Request $request, ApplyVoucher $apply): JsonResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:64']]);

        return $this->attempt(fn () => __('commerce::storefront.cart.voucher_applied', ['code' => $apply->handle($data['code'])]));
    }

    public function removeVoucher(string $code, RemoveVoucher $remove): JsonResponse
    {
        $remove->handle($code);

        return $this->cart(__('commerce::storefront.cart.voucher_removed'));
    }

    /** @param  \Closure(): string  $action */
    protected function attempt(\Closure $action): JsonResponse
    {
        try {
            $message = $action();
        } catch (CartException $e) {
            return response()->json(['message' => $e->getMessage(), 'reason' => $e->reason, 'cart' => CartView::for($this->carts->current())], 422);
        }

        return $this->cart($message);
    }

    protected function cart(?string $message = null): JsonResponse
    {
        return response()->json(array_filter(['message' => $message, 'cart' => CartView::for($this->carts->current())]))->header('Cache-Control', 'no-store');
    }
}
