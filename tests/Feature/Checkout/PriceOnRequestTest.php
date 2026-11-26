<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Notification;
use Spatie\Honeypot\ProtectAgainstSpam;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;

// Checkout is for accounts: these tests shop signed in (as Rina, unless a test signs someone else in).
beforeEach(fn () => buyer());

beforeEach(function () {
    $this->withoutMiddleware([ValidateCsrfToken::class, ProtectAgainstSpam::class]);
    config(['honeypot.enabled' => false]);
});

function storeSettings(string $section, array $values): void
{
    app(StoreSettings::class)->saveSection($section, $values);
    app()->forgetScopedInstances();
}

it('keeps a product without a price out of a cart that can only become an order', function () {
    $mug = checkoutStore(['price' => null]);
    expect($mug->price)->toBeNull()->and($mug->product->fresh()->min_price)->toBeNull();

    $this->get('/products/mug')->assertOk()->assertSee(__('commerce::storefront.cta.price_on_request'))->assertDontSee('Rp0');
    $this->post('/cart/items', ['variant' => $mug->id])->assertSessionHas('commerce.error', __('commerce::storefront.availability.price_on_request', ['product' => 'Mug']));
});

it('turns a cart with a product without a price into a quote request that staff price', function () {
    Notification::fake();
    $mug = checkoutStore(['price' => null]);
    storeSettings('checkout', ['quote_requests' => 'everyone']);

    $this->post('/cart/items', ['variant' => $mug->id, 'quantity' => 2])->assertSessionMissing('commerce.error');
    cartWith([[$mug, 2]]);
    $this->get('/cart')->assertOk()->assertSee(__('commerce::storefront.cart.on_request_note'))->assertDontSee('Rp0');
    $this->withCredentials()->getJson('/commerce/api/cart')->assertJsonPath('cart.on_request', true)
        ->assertJsonPath('cart.lines.0.total.amount', 0)->assertJsonPath('cart.totals.total.formatted', __('commerce::storefront.cta.price_on_request'));
    // Checkout is a quote request: no payment step, and "Place order" isn't offered.
    $this->get('/checkout')->assertOk()->assertSee(__('commerce::checkout.submit.quote'))->assertDontSee(__('commerce::checkout.submit.order'))
        ->assertDontSee('value="request_quote"', false);

    // Whichever button sent it, it can only be a quote request.
    $this->post('/checkout', [...checkoutInput(), 'shipping_rate' => null, 'action' => 'place'])->assertRedirectContains('/quote/');
    $quote = Order::query()->sole();
    $item = $quote->items->sole();
    expect([$quote->type, $quote->status, $item->unit_price, $item->meta['on_request'] ?? null])->toBe(['quote', 'requested', 0, true])
        ->and($quote->awaitsPrices())->toBeTrue();
    actAsOwnerOf($quote);
    $this->get($quote->url())->assertOk()->assertSee(__('commerce::storefront.quote.to_be_quoted'))->assertDontSee('Rp0');
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n) {
        if ($n->key !== 'quote_received') {
            return false;
        }
        expect((string) $n->toMail(null)->render())->toContain(__('commerce::storefront.quote.to_be_quoted', [], 'id'));

        return true;
    });

    // Staff: the line comes empty and must be priced before sending.
    actingAsUserWith(['commerce.orders.view', 'commerce.quotes.respond']);
    $this->get("/admin/commerce/orders/{$quote->id}/quote")->assertInertia(fn ($p) => $p->where('order.lines.0.unit_price', null)->where('order.lines.0.needs_price', true));
    $line = ['item_id' => $item->id, 'variant_id' => $mug->id, 'quantity' => 2];
    $this->put("/admin/commerce/orders/{$quote->id}/quote", ['lines' => [$line], 'send' => true])->assertSessionHasErrors('lines.0.unit_price');
    $this->put("/admin/commerce/orders/{$quote->id}/quote", ['lines' => [[...$line, 'unit_price' => 75000]], 'send' => true])->assertRedirect();
    $quote = $quote->fresh();
    expect([$quote->status, $quote->subtotal, $quote->awaitsPrices()])->toBe(['quoted', 150000, false]);
    $this->get($quote->url())->assertSee('Rp150.000');
});

it('lets customers who can\'t see prices request a quote, without showing them prices', function () {
    $mug = checkoutStore();
    storeSettings('general', ['selling_mode' => 'quote']);
    storeSettings('catalog', ['price_visibility' => 'nobody']);

    $this->get('/products/mug')->assertOk()->assertDontSee('Rp50.000')->assertSee('name="variant"', false);
    $this->post('/cart/items', ['variant' => $mug->id])->assertSessionMissing('commerce.error');
    $cart = cartWith([[$mug, 1]]);
    $this->get('/cart')->assertOk()->assertDontSee('Rp50.000')->assertDontSee('Rp60.000');
    $this->withCredentials()->getJson('/commerce/api/cart')->assertJsonPath('cart.lines.0.unit_price.amount', 0)->assertJsonPath('cart.totals.subtotal.amount', 0);
    $this->get('/checkout')->assertOk()->assertDontSee('Rp50.000');

    $input = checkoutInput(['payment_method' => null, 'shipping_rate' => null]);
    $this->post('/checkout', [...$input, 'totals_hash' => seenHash($cart, $input), 'action' => 'place'])->assertRedirectContains('/quote/');
    $quote = Order::query()->sole();
    actAsOwnerOf($quote);
    $this->get($quote->url())->assertSee(__('commerce::storefront.quote.to_be_quoted'))->assertDontSee('Rp50.000');

    // Staff start from the catalog price (the product has one); nothing to fill in first.
    actingAsUserWith(['commerce.orders.view', 'commerce.quotes.respond']);
    $this->get("/admin/commerce/orders/{$quote->id}/quote")->assertInertia(fn ($p) => $p->where('order.lines.0.unit_price', 50000)->where('order.lines.0.needs_price', false));
});

it('still refuses hidden prices when no quote can come of the cart', function () {
    $mug = checkoutStore();
    storeSettings('catalog', ['price_visibility' => 'nobody']);
    $this->post('/cart/items', ['variant' => $mug->id])->assertSessionHas('commerce.error');
});
