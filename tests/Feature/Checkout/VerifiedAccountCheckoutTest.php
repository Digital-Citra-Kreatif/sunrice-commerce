<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Spatie\Honeypot\ProtectAgainstSpam;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Checkout\Notifications\CheckoutCodeNotification;
use Sunrice\Commerce\Customers\Actions\LinkGuestOrders;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

function requireVerifiedCheckout(): void
{
    app(StoreSettings::class)->saveSection('checkout', ['require_verified_account' => true]);
}

function requestVerifiedCheckoutCode(string $email): string
{
    test()->withoutMiddleware(ProtectAgainstSpam::class)
        ->post('/checkout/access/code', ['email' => strtoupper($email)])
        ->assertRedirect('/checkout/access/code');

    $code = '';
    Notification::assertSentOnDemand(CheckoutCodeNotification::class, function ($notification, $channels, $recipient) use ($email, &$code): bool {
        if ($recipient->routes['mail'] !== $email) {
            return false;
        }

        $code = $notification->code;

        return true;
    });

    return $code;
}

it('leaves guest checkout available by default', function () {
    $cart = cartWith([[checkoutStore(), 1]]);
    $this->get('/checkout')->assertOk();
    $this->get('/checkout/access')->assertNotFound();
    $this->post('/checkout', [...checkoutInput(), 'totals_hash' => seenHash($cart, checkoutInput()), 'action' => 'place'])->assertRedirect();
    expect(Order::query()->sole()->wasPlacedAsGuest())->toBeTrue();
});

it('requires verification across checkout routes and through the order action', function () {
    requireVerifiedCheckout();
    $cart = cartWith([[checkoutStore(), 1]]);
    $this->get('/checkout')->assertRedirect('/checkout/access');
    $this->post('/checkout', ['action' => 'place'])->assertRedirect('/checkout/access');
    $this->postJson('/checkout/refresh')->assertUnauthorized()->assertJsonPath('redirect', url('/checkout/access'));
    $this->post('/checkout/voucher')->assertRedirect('/checkout/access');
    $this->get('/checkout/access')->assertOk()->assertSee('/checkout/access/password');

    $unverified = User::query()->create(['name' => 'Buyer', 'email' => 'unverified@example.test', 'password' => Hash::make('password')]);
    $this->actingAs($unverified, CurrentCustomer::guard())->get('/checkout')->assertRedirect('/checkout/access');
    expect(fn () => app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart), null))->toThrow(CheckoutRefused::class);
});

it('creates an account only after proof, preserves the cart and places the order with the verified email', function () {
    Notification::fake();
    requireVerifiedCheckout();
    $cart = cartWith([[checkoutStore(), 2]]);
    $email = 'new-shopper@example.test';
    $code = requestVerifiedCheckoutCode($email);
    $this->assertDatabaseMissing('users', ['email' => $email]);
    $wrong = $code === '10000000' ? '10000001' : '10000000';

    $this->from('/checkout/access/code')->post('/checkout/access/verify', ['code' => $wrong])->assertSessionHasErrors('code');
    $this->assertDatabaseMissing('users', ['email' => $email]);
    $this->post('/checkout/access/verify', ['code' => $code])->assertRedirect('/checkout');

    $user = User::query()->where('email', $email)->sole();
    $this->assertAuthenticatedAs($user, CurrentCustomer::guard());
    $customer = Customer::forUser($user);
    expect($user->email_verified_at)->not->toBeNull()
        ->and($customer->meta['password_set'])->toBeFalse()
        ->and($cart->refresh()->customer_id)->toBe($customer->id)
        ->and($cart->items()->sole()->quantity)->toBe(2);
    $this->get('/checkout')->assertOk()->assertSee('value="'.$email.'" readonly', false);

    $input = checkoutInput(['email' => $email]);
    $this->post('/checkout', [...$input, 'totals_hash' => seenHash($cart, $input), 'email' => 'wrong@example.test', 'action' => 'place'])
        ->assertRedirectContains('/order/');
    $order = Order::query()->sole();
    expect($order->email)->toBe($email)
        ->and($order->user_id)->toBe($user->id)
        ->and($order->wasPlacedAsGuest())->toBeFalse()
        ->and($user->refresh()->name)->toBe('Rina');
});

it('signs in to the existing account without linking older guest orders', function () {
    Notification::fake();
    requireVerifiedCheckout();
    $email = 'existing@example.test';
    $user = User::query()->create(['name' => 'Buyer', 'email' => $email, 'password' => Hash::make('password')]);
    $order = makeOrder(['email' => $email, 'meta' => ['placed_as_guest' => true]]);

    $this->post('/checkout/access/verify', ['code' => requestVerifiedCheckoutCode($email)])->assertRedirect('/checkout');
    $this->assertAuthenticatedAs($user, CurrentCustomer::guard());
    expect($user->refresh()->email_verified_at)->not->toBeNull()
        ->and(app(LinkGuestOrders::class)->handle($user))->toBe(0)
        ->and($order->refresh()->user_id)->toBeNull();
    $this->get('/track-order')->assertOk();
});

it('returns password sign-in to checkout with the existing cart', function () {
    requireVerifiedCheckout();
    $cart = cartWith([[checkoutStore(), 2]]);
    $user = User::query()->create([
        'name' => 'Buyer', 'email' => 'returning@example.test', 'password' => Hash::make('password'), 'email_verified_at' => now(),
    ]);

    $this->get('/checkout/access/password')->assertOk()->assertSee('current-password');
    $this->withoutMiddleware(ProtectAgainstSpam::class)
        ->post('/account/login', ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect('/checkout');
    $this->assertAuthenticatedAs($user, CurrentCustomer::guard());
    expect($cart->refresh()->customer_id)->toBe(Customer::forUser($user)->id)
        ->and($cart->items()->sole()->quantity)->toBe(2);
});

it('replaces the code when the email changes and expires codes after ten minutes', function () {
    Notification::fake();
    requireVerifiedCheckout();
    $oldEmail = 'mistyped@example.test';
    $newEmail = 'corrected@example.test';
    $oldCode = requestVerifiedCheckoutCode($oldEmail);
    $newCode = requestVerifiedCheckoutCode($newEmail);

    $this->get('/checkout/access/code')->assertOk()->assertSee($newEmail)->assertDontSee($oldEmail);
    if ($oldCode !== $newCode) {
        $this->from('/checkout/access/code')->post('/checkout/access/verify', ['code' => $oldCode])->assertSessionHasErrors('code');
    }
    $this->travel(11)->minutes();
    $this->from('/checkout/access/code')->post('/checkout/access/verify', ['code' => $newCode])->assertSessionHasErrors('code');
    $this->assertDatabaseMissing('users', ['email' => $oldEmail]);
    $this->assertDatabaseMissing('users', ['email' => $newEmail]);
});
