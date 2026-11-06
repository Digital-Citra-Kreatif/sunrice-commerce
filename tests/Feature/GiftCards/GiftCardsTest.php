<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Illuminate\Testing\TestResponse;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Reports\CustomersReport;
use Sunrice\Commerce\Analytics\Stats;
use Sunrice\Commerce\Analytics\StatsRecorder;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Customers\Actions\AnonymizeCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\GiftCards\Actions\IssueGiftCard;
use Sunrice\Commerce\GiftCards\GiftCards;
use Sunrice\Commerce\GiftCards\Models\GiftCard;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Actions\EditOrder;
use Sunrice\Commerce\Orders\Listeners\ReleaseReservations;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
    app(ToggleFeature::class)->handle('gift_cards', true);
    app(ToggleFeature::class)->handle('vouchers', false);
});

function giftCard(int $balance, array $attributes = []): GiftCard
{
    return GiftCard::query()->create(['code' => 'GIFT-0001', 'initial_amount' => $balance, 'balance' => $balance, 'currency' => 'IDR', ...$attributes]);
}

function placeWithCard(Cart $cart): TestResponse
{
    $input = checkoutInput();

    return test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)]);
}

it('pays part of an order after tax, takes it from the card, and gives it back when the order is cancelled', function () {
    $card = giftCard(30000);
    $cart = cartWith([[$this->mug, 2]]);

    // The code box works with only gift cards on.
    $this->post('/cart/vouchers', ['code' => 'gift-0001'])->assertSessionHas('commerce.success');
    $this->get('/cart')->assertSee('Gift card '.$card->masked())->assertSee('-Rp30.000');

    placeWithCard($cart->fresh());
    $order = Order::query()->sole();
    expect($order->total)->toBe(110000 - 30000)
        ->and($order->payments->sole()->amount)->toBe(80000)
        ->and($order->adjustments->where('kind', 'gift_card')->sole()->amount)->toBe(-30000)
        ->and($card->fresh()->balance)->toBe(0)
        ->and($card->transactions()->where('kind', 'redeem')->sole()->amount)->toBe(-30000)
        ->and(app(EditOrder::class)->editable($order))->toBeFalse();
    $this->get($order->url())->assertSee('Gift card '.$card->masked());

    app(ReleaseReservations::class)->release($order->fresh());
    app(ReleaseReservations::class)->release($order->fresh());
    expect($card->fresh()->balance)->toBe(30000)
        ->and($card->transactions()->where('kind', 'release')->count())->toBe(1);
});

it('pays a whole order, leaving the rest on the card', function () {
    $card = giftCard(200000);
    $cart = cartWith([[$this->mug, 2]]);
    $cart->update(['vouchers' => ['GIFT-0001']]);

    placeWithCard($cart->fresh());
    $order = Order::query()->sole();
    expect($order->total)->toBe(0)
        ->and($order->payment_status)->toBe(OrderStatus::PAID)
        ->and($card->fresh()->balance)->toBe(200000 - 110000);

    // Reports count what the card paid as a sale.
    app(StatsRecorder::class)->recompute(now()->toDateString());
    expect(app(Stats::class)->totals(now()->toDateString(), now()->toDateString())['total_sales'])->toBe(110000)
        ->and(app(CustomersReport::class)->run(Period::preset('today'))->rows[0]['spent'])->toBe(110000);
});

it('refuses a card that is used up, expired or switched off, and an order once a card can no longer give its amount', function () {
    $card = giftCard(0);
    cartWith([[$this->mug, 1]]);
    $this->post('/cart/vouchers', ['code' => 'GIFT-0001'])->assertSessionHas('commerce.error', __('commerce::validation.gift_card.unusable', ['code' => $card->masked()]));
    $card->update(['balance' => 5000, 'expires_at' => now()->subDay()]);
    $this->post('/cart/vouchers', ['code' => 'GIFT-0001'])->assertSessionHas('commerce.error');
    // Issued in another currency (before the store's changed): never spent as this one.
    $card->update(['expires_at' => null, 'currency' => 'USD']);
    $this->post('/cart/vouchers', ['code' => 'GIFT-0001'])->assertSessionHas('commerce.error');
    $card->update(['currency' => 'IDR']);

    // Spent elsewhere between the calculation and placing: the order is refused.
    $card->update(['balance' => 1000, 'expires_at' => null]);
    $state = new CalculationState(new PricingContext);
    $state->addAdjustment(new Adjustment("gift_card:{$card->id}", Adjustment::GIFT_CARD, 'Gift card', 5000, ['type' => 'gift_card', 'id' => $card->id, 'code' => 'GIFT-0001']));
    expect(fn () => app(GiftCards::class)->commit(makeOrder(), $state))->toThrow(CheckoutRefused::class);
    expect($card->fresh()->balance)->toBe(1000);
});

it('shares the box with vouchers without calling a gift card an unknown voucher', function () {
    app(ToggleFeature::class)->handle('vouchers', true);
    giftCard(10000);
    Voucher::query()->create(['name' => 'Hemat', 'code' => 'HEMAT', 'type' => 'fixed_cart', 'value' => 5000]);
    $cart = cartWith([[$this->mug, 1]]);
    $cart->update(['vouchers' => ['HEMAT', 'GIFT-0001']]);

    $this->get('/cart')->assertSee(__('commerce::storefront.cart.voucher_or_gift_card'))->assertDontSee(__('commerce::validation.voucher.not_found', ['code' => 'GIFT-0001']));
    placeWithCard($cart->fresh());
    $order = Order::query()->sole();
    // 50000 − 5000 voucher + 10000 shipping − 10000 gift card.
    expect($order->total)->toBe(45000);
});

it('lets staff issue, email, adjust and switch off gift cards', function () {
    Notification::fake();
    actingAsUserWith(['commerce.orders.view']);
    $this->get('/admin/commerce/gift-cards')->assertForbidden();
    actingAsUserWith(['commerce.gift_cards.manage'], 'cards@example.com');

    $this->post('/admin/commerce/gift-cards', ['values' => ['amount' => 100000, 'recipient_email' => 'Ana@Example.com']])->assertRedirect();
    $card = GiftCard::query()->sole();
    expect($card->code)->toMatch('/^[A-HJ-KM-NP-Z2-9]{4}(-[A-HJ-KM-NP-Z2-9]{4}){3}$/')
        ->and($card->balance)->toBe(100000)->and($card->recipient_email)->toBe('ana@example.com');
    Notification::assertSentOnDemand(StoreEmail::class, fn (StoreEmail $n, array $c, AnonymousNotifiable $to) => $n->key === 'gift_card_issued'
        && $to->routes['mail'] === 'ana@example.com' && str_contains($n->toMail($to)->render()->toHtml(), $card->code));
    $this->get('/admin/commerce/gift-cards')->assertOk()->assertInertia(fn ($p) => $p->where('rows.data.0.code', $card->code)->where('rows.data.0.status', 'Active'));

    $this->put("/admin/commerce/gift-cards/{$card->id}", ['values' => ['adjust' => -150000]])->assertSessionHasErrors('values.adjust');
    $this->put("/admin/commerce/gift-cards/{$card->id}", ['values' => ['adjust' => -25000, 'disabled' => true]])->assertSessionHasNoErrors();
    expect($card->fresh())->balance->toBe(75000)->disabled_at->not->toBeNull()
        ->and($card->transactions()->where('kind', 'adjust')->sole()->amount)->toBe(-25000);

    $this->post('/admin/commerce/gift-cards', ['values' => ['amount' => 5000, 'code' => mb_strtolower($card->code)]])->assertSessionHasErrors('values.code');
    expect(GiftCard::query()->count())->toBe(1);

    app(ToggleFeature::class)->handle('gift_cards', false);
    $this->get('/admin/commerce/gift-cards')->assertNotFound();
});

it('forgets the recipient when the customer is anonymized', function () {
    $card = app(IssueGiftCard::class)->handle(10000, recipient: 'ana@example.com');
    $customer = Customer::query()->create(['email' => 'ana@example.com', 'name' => 'Ana']);

    app(AnonymizeCustomer::class)->handle($customer);
    expect($card->fresh()->recipient_email)->toBeNull();
});
