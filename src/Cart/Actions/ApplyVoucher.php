<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Illuminate\Support\Str;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\Events\VoucherApplied;
use Sunrice\Commerce\Features\Features;

/** Adds a voucher code to the cart when it applies; otherwise says why. */
class ApplyVoucher
{
    public function __construct(protected CartManager $carts, protected Features $features) {}

    public function handle(string $code): string
    {
        $code = Str::upper(trim($code));
        if ($code === '' || ! $this->features->active('vouchers')) {
            throw new CartException(__('commerce::validation.voucher.not_found', ['code' => $code]), 'voucher_invalid');
        }
        $cart = $this->carts->current();
        if ($cart === null || $cart->items()->doesntExist()) {
            throw new CartException(__('commerce::storefront.cart.empty'), 'empty');
        }
        $codes = array_values(array_unique([...(array) $cart->vouchers, $code]));
        $cart->vouchers = $codes;
        $view = CartView::for($cart);
        if (! in_array($code, $view->state->appliedCodes, true)) {
            $notice = collect($view->state->notices)->firstWhere('voucher', $code);
            throw new CartException((string) ($notice['message'] ?? __('commerce::validation.voucher.not_found', ['code' => $code])), (string) ($notice['code'] ?? 'voucher_invalid'));
        }
        $cart->save();
        $cart->touchActivity();
        VoucherApplied::dispatch($cart, $code);

        return $code;
    }
}
