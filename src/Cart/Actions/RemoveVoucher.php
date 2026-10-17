<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Illuminate\Support\Str;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\Events\VoucherRemoved;

class RemoveVoucher
{
    public function __construct(protected CartManager $carts) {}

    public function handle(string $code): void
    {
        $cart = $this->carts->current();
        if ($cart === null) {
            return;
        }
        $code = Str::upper(trim($code));
        $cart->vouchers = array_values(array_diff((array) $cart->vouchers, [$code]));
        $cart->save();
        VoucherRemoved::dispatch($cart, $code);
    }
}
