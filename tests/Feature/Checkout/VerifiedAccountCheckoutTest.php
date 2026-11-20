<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Spatie\Honeypot\ProtectAgainstSpam;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Checkout\Notifications\CheckoutCodeNotification;
use Sunrice\Commerce\Checkout\VerifiedAccountCheckout;
use Sunrice\Commerce\Customers\Actions\LinkGuestOrders;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Customers\Notifications\CustomerLoginCode;
use Sunrice\Commerce\Customers\Notifications\VerifyCustomerEmail;
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

    $this->post('/account/logout')->assertRedirect();
    $this->get('/account/login')->assertOk()->assertSee('/account/login/code');
    $this->post('/account/login/code', ['email' => $email])->assertRedirect('/account/code');
    Notification::assertSentTo($user, CustomerLoginCode::class);
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

it('lets guests check out after confirming their email with a code, without making an account', function () {
    Notification::fake();
    app(StoreSettings::class)->saveSection('checkout', ['access' => 'guest_verified']);
    $cart = cartWith([[checkoutStore(), 1]]);
    $email = 'guest-shopper@example.test';

    $this->get('/checkout')->assertRedirect('/checkout/access');
    $this->get('/checkout/access')->assertOk()->assertSee(__('commerce::checkout-access.guest_intro'), false);
    $code = requestVerifiedCheckoutCode($email);
    $this->post('/checkout/access/verify', ['code' => $code])->assertRedirect('/checkout');

    // Confirmed, not signed in, no account.
    $this->assertGuest(CurrentCustomer::guard());
    $this->assertDatabaseMissing('users', ['email' => $email]);
    $this->get('/checkout/access')->assertRedirect('/checkout');
    $this->get('/checkout')->assertOk()->assertSee('value="'.$email.'" readonly', false)->assertSee('change=1', false);

    $input = checkoutInput(['email' => $email]);
    $this->post('/checkout', [...$input, 'totals_hash' => seenHash($cart, $input), 'email' => 'wrong@example.test', 'action' => 'place'])
        ->assertRedirectContains('/order/');
    $order = Order::query()->sole();
    expect($order->email)->toBe($email)->and($order->user_id)->toBeNull()->and($order->wasPlacedAsGuest())->toBeTrue();
    $this->assertDatabaseMissing('users', ['email' => $email]);

    // "Use another email" starts over.
    $this->get('/checkout/access?change=1')->assertOk();
    $this->get('/checkout')->assertRedirect('/checkout/access');
});

it('makes an already verified account when a code-confirmed guest asks for one', function () {
    Notification::fake();
    app(StoreSettings::class)->saveSection('checkout', ['access' => 'guest_verified', 'create_account' => 'offer']);
    $cart = cartWith([[checkoutStore(), 1]]);
    $email = 'joins@example.test';
    $this->post('/checkout/access/verify', ['code' => requestVerifiedCheckoutCode($email)])->assertRedirect('/checkout');

    $input = checkoutInput(['email' => $email, 'create_account' => '1', 'password' => 'secret-pass-1']);
    $this->post('/checkout', [...$input, 'totals_hash' => seenHash($cart, $input), 'action' => 'place'])->assertRedirectContains('/order/');
    $user = User::query()->where('email', $email)->sole();
    expect($user->email_verified_at)->not->toBeNull()
        ->and(Order::query()->sole()->user_id)->toBe($user->id);
    Notification::assertNotSentTo($user, VerifyCustomerEmail::class);
});

it('reads who can check out from the older settings until it is saved', function () {
    $access = app(VerifiedAccountCheckout::class);
    expect($access->mode())->toBe('guest');
    app(StoreSettings::class)->saveSection('checkout', ['guest_checkout' => false]);
    expect($access->mode())->toBe('account');
    app(StoreSettings::class)->saveSection('checkout', ['require_verified_account' => true]);
    expect($access->mode())->toBe('verified_account');
    // The settings page starts from it.
    actingAsUserWith(['commerce.settings.checkout']);
    $this->get('/admin/commerce/settings/checkout')->assertInertia(fn ($p) => $p->where('form.values.access', 'verified_account'));

    app(StoreSettings::class)->saveSection('checkout', ['access' => 'guest']);
    expect($access->mode())->toBe('guest')->and($access->codeRequired())->toBeFalse();
});
