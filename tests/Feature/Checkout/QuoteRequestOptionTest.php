<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Checkout\CheckoutMode;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
});

function offerQuotes(array $values): void
{
    app(StoreSettings::class)->saveSection('checkout', $values);
    app()->forgetScopedInstances();
}

it('sends the cart as a quote request from an Online store checkout when offered', function () {
    offerQuotes(['quote_requests' => 'everyone']);
    $cart = cartWith([[$this->mug, 2]]);
    $this->get('/checkout')->assertOk()->assertSee('value="request_quote"', false)->assertSee(__('commerce::checkout.quote_instead.button'));

    // The payment method chosen and any totals seen don't matter: nothing is paid.
    $this->post('/checkout', [...checkoutInput(), 'totals_hash' => 'stale', 'action' => 'request_quote'])->assertRedirectContains('/quote/');
    $quote = Order::query()->sole();
    expect([$quote->type, $quote->status, $quote->number, $quote->payment_method])->toBe(['quote', 'requested', null, null])
        ->and($quote->quote_number)->toStartWith('Q-')
        ->and($quote->payments()->count())->toBe(0)
        ->and($this->mug->fresh()->stock_quantity)->toBe(5)
        ->and($cart->fresh()->status)->toBe('converted');

    // Place order still places an order.
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput();
    $this->post('/checkout', [...$input, 'totals_hash' => seenHash($cart, $input), 'action' => 'place'])->assertRedirectContains('/order/');
    expect(Order::query()->where('type', 'order')->count())->toBe(1);
});

it('offers quote requests only when switched on, and with roles only to those customers', function () {
    $cart = cartWith([[$this->mug, 1]]);
    $this->get('/checkout')->assertOk()->assertDontSee('value="request_quote"', false);
    // Not offered: the button's action is refused (nothing placed).
    $this->post('/checkout', [...checkoutInput(), 'action' => 'request_quote'])->assertRedirect('/checkout#shipping');
    expect(Order::query()->count())->toBe(0);

    offerQuotes(['quote_requests' => 'roles', 'quote_request_roles' => ['Wholesale']]);
    $this->get('/checkout')->assertDontSee('value="request_quote"', false);

    Role::findOrCreate('Wholesale', 'web');
    $buyer = User::query()->create(['name' => 'Toko Grosir', 'email' => 'grosir@example.com', 'password' => bcrypt('password'), 'email_verified_at' => now()]);
    $buyer->assignRole('Wholesale');
    $this->actingAs($buyer, 'account');
    app()->forgetScopedInstances();
    expect(app(CheckoutMode::class)->quoteOffered())->toBeTrue();

    // In Quotation mode every checkout is a quote already: no second button.
    app(StoreSettings::class)->saveSection('general', ['selling_mode' => 'quote']);
    app()->forgetScopedInstances();
    expect(app(CheckoutMode::class)->quoteOffered())->toBeFalse()
        ->and(app(CheckoutMode::class)->quotesPossible())->toBeTrue();
});
