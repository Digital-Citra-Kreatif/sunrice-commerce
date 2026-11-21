<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Notification;
use Sunrice\Cms\Models\Entry;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Loyalty\GiftCards;
use Sunrice\Commerce\Loyalty\Loyalty;
use Sunrice\Commerce\Loyalty\Models\GiftCard;
use Sunrice\Commerce\Loyalty\Models\LoyaltyTransaction;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Actions\MarkOrderPaid;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->card = checkoutStore(['price' => 100000]);
    // The mug becomes a gift card product (a code by email, not shipped).
    publishProduct(['gift_card' => true, 'variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 100000]]], Entry::query()->findOrFail($this->card->product->entry_id), 'Mug');
    $this->card = $this->card->fresh();
    app(ToggleFeature::class)->handle('loyalty', true);
    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 5]);
    $this->user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->customer = Customer::forUser($this->user);
    $this->customer->save();
});

function buyGiftCards(int $quantity): Order
{
    $cart = cartWith([[test()->card, $quantity]]);
    $input = checkoutInput(['shipping_rate' => null]);
    test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirect();

    return Order::query()->latest('id')->firstOrFail();
}

it('issues a code per gift card bought once paid, emails them, and earns no points for them', function () {
    Notification::fake();
    expect($this->card->product->gift_card)->toBeTrue()->and($this->card->product->requires_shipping)->toBeFalse();
    $order = buyGiftCards(2);
    expect(GiftCard::query()->count())->toBe(0);

    app(MarkOrderPaid::class)->handle($order, Actor::system());
    $cards = GiftCard::query()->orderBy('id')->get();
    expect($cards)->toHaveCount(2)
        ->and($cards->pluck('value')->all())->toBe([100000, 100000])
        ->and($cards->pluck('status')->unique()->all())->toBe([GiftCard::ACTIVE])
        ->and($cards[0]->code)->toMatch('/^[A-HJ-NP-Z2-9]{12}$/')
        ->and($cards[0]->order_id)->toBe($order->id);
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n) use ($cards) {
        if ($n->key !== 'gift_card_issued') {
            return false;
        }
        expect((string) $n->toMail(null)->render())->toContain($cards[0]->formatted())->toContain($cards[1]->formatted());

        return true;
    });

    // Once per line, and a gift card earns no points.
    expect(app(GiftCards::class)->issueFor($order))->toBe([]);
    if ($order->fresh()->status !== OrderStatus::COMPLETED) {
        app(OrderStateMachine::class)->transition($order->fresh(), OrderStatus::COMPLETED, Actor::admin());
    }
    expect(app(Loyalty::class)->earnable($order->fresh()))->toBe(0)
        ->and(LoyaltyTransaction::query()->where('kind', 'earn')->count())->toBe(0);
});

it('redeems a code for points once, with its own expiry, in My Account', function () {
    $card = app(GiftCards::class)->make(250000);
    $this->actingAs($this->user, 'commerce');
    $this->get('/account/points')->assertOk()->assertSee(__('commerce::account.points.gift_card.title'));

    // Typed loosely: lower case, with spaces.
    $this->post('/account/points/gift-card', ['code' => strtolower(implode(' ', str_split($card->code, 4)))])
        ->assertRedirect('/account/points')->assertSessionHas('commerce.success');
    $card->refresh();
    expect([$card->status, $card->redeemed_by])->toBe([GiftCard::REDEEMED, $this->customer->id])
        ->and($this->customer->fresh()->loyalty_points)->toBe(250000);
    $lot = LoyaltyTransaction::query()->where('kind', 'gift_card')->sole();
    expect($lot->expires_at)->toBeNull()->and($lot->note)->toBe($card->formatted());

    $this->from('/account/points')->post('/account/points/gift-card', ['code' => $card->code])->assertSessionHasErrors(['code' => __('commerce::account.points.gift_card.used')]);
    $this->from('/account/points')->post('/account/points/gift-card', ['code' => 'NOPE-NOPE-NOPE'])->assertSessionHasErrors(['code' => __('commerce::account.points.gift_card.unknown')]);
    expect($this->customer->fresh()->loyalty_points)->toBe(250000);

    // Gift card points follow their own setting, not the earned points'.
    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 5, 'expiry_days' => 30, 'gift_card_points_expiry_days' => 365, 'gift_card_valid_days' => 10]);
    $second = app(GiftCards::class)->make(50000);
    expect($second->expires_at?->toDateString())->toBe(now()->addDays(10)->toDateString());
    $this->post('/account/points/gift-card', ['code' => $second->code])->assertSessionHas('commerce.success');
    expect(LoyaltyTransaction::query()->where('kind', 'gift_card')->latest('id')->first()->expires_at->toDateString())->toBe(now()->addDays(365)->toDateString());

    $this->travel(11)->days();
    $late = GiftCard::query()->create(['code' => 'LATEAAAABBBB', 'value' => 1000, 'expires_at' => now()->subDay()]);
    $this->from('/account/points')->post('/account/points/gift-card', ['code' => $late->code])->assertSessionHasErrors(['code' => __('commerce::account.points.gift_card.expired')]);
});

it('disables the codes an order refunded in full bought, unless already redeemed', function () {
    $order = buyGiftCards(2);
    app(MarkOrderPaid::class)->handle($order, Actor::system());
    [$used, $unused] = GiftCard::query()->orderBy('id')->get()->all();
    app(GiftCards::class)->redeem($this->customer, $used->code);

    // A part refund leaves them; a full one disables what isn't redeemed.
    app(RecordRefund::class)->handle($order->fresh(), 50000, [], null, false, Actor::system());
    expect($unused->fresh()->status)->toBe(GiftCard::ACTIVE);
    app(RecordRefund::class)->handle($order->fresh(), $order->fresh()->total - 50000, [], null, false, Actor::system());
    expect([$used->fresh()->status, $unused->fresh()->status])->toBe([GiftCard::REDEEMED, GiftCard::DISABLED]);
});

it('lets staff make, see and disable codes', function () {
    actingAsUserWith(['commerce.gift-cards.manage']);
    $this->get('/admin/commerce/gift-cards/create')->assertOk();
    $this->post('/admin/commerce/gift-cards', ['values' => ['value' => 75000, 'quantity' => 3, 'note' => 'Giveaway']])->assertRedirect('/admin/commerce/gift-cards');
    expect(GiftCard::query()->where('note', 'Giveaway')->count())->toBe(3);
    $card = GiftCard::query()->firstOrFail();
    $this->get('/admin/commerce/gift-cards')->assertOk()->assertInertia(fn ($p) => $p->where('rows.data.0.code', fn ($code) => strlen($code) === 14));

    $this->put("/admin/commerce/gift-cards/{$card->id}", ['values' => ['disabled' => true, 'note' => 'Lost']])->assertRedirect();
    expect($card->fresh()->status)->toBe(GiftCard::DISABLED);
    $this->from('/account/points')->actingAs($this->user, 'commerce')->post('/account/points/gift-card', ['code' => $card->code])
        ->assertSessionHasErrors(['code' => __('commerce::account.points.gift_card.disabled')]);
});

it('keeps gift cards from staff without the permission', function () {
    actingAsUserWith(['commerce.orders.view']);
    $this->get('/admin/commerce/gift-cards')->assertForbidden();
    $this->post('/admin/commerce/gift-cards', ['values' => ['value' => 1000, 'quantity' => 1]])->assertForbidden();
});
