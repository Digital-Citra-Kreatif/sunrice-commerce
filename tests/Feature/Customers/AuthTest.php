<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Customers\Notifications\CustomerResetPassword;
use Sunrice\Commerce\Customers\Notifications\VerifyCustomerEmail;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

function customerUser(array $attributes = []): User
{
    $user = User::query()->create([...['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()], ...$attributes]);
    $user->assignRole(Role::findOrCreate('Customer', 'web'));

    return $user;
}

it('signs customers in on the commerce guard without opening the admin', function () {
    customerUser();

    $this->post('/account/login', ['email' => 'ana@example.com', 'password' => 'secret-pass'])->assertRedirect('/account');
    $this->assertAuthenticated('commerce');
    $this->assertGuest('web');
    $this->get('/account')->assertOk()->assertSee('Halo, Ana');
    $this->get('/cms')->assertRedirect(); // to the admin login
    expect(Customer::query()->where('email', 'ana@example.com')->exists())->toBeTrue();
});

it('keeps an admin sign-in out of the storefront, and the admin session after a storefront sign-out', function () {
    $admin = actingAsSuperAdmin();
    $this->get('/account')->assertRedirect('/account/login');

    $this->actingAs(customerUser(), 'commerce');
    $this->post('/account/logout')->assertRedirect();
    $this->assertGuest('commerce');
    $this->assertAuthenticatedAs($admin, 'web');
});

it('refuses wrong passwords and throttles', function () {
    customerUser();
    foreach (range(1, 5) as $i) {
        $this->post('/account/login', ['email' => 'ana@example.com', 'password' => 'nope'])->assertSessionHasErrors(['email' => 'Email atau kata sandi salah.']);
    }
    $this->post('/account/login', ['email' => 'ana@example.com', 'password' => 'secret-pass'])->assertSessionHasErrors('email');
    $this->assertGuest('commerce');
});

it('registers with verification and without enumeration', function () {
    Notification::fake();
    $this->post('/account/register', ['name' => 'Budi', 'email' => 'Budi@Example.com', 'phone' => '0812 3456 7890', 'password' => 'long-enough', 'password_confirmation' => 'long-enough'])
        ->assertRedirect('/account/login')->assertSessionHas('commerce.success');
    $budi = User::query()->where('email', 'budi@example.com')->firstOrFail();
    expect($budi->hasRole('Customer'))->toBeTrue()->and(Customer::query()->where('email', 'budi@example.com')->value('phone'))->toBe('+6281234567890');
    Notification::assertSentTo($budi, VerifyCustomerEmail::class);
    $this->assertGuest('commerce');

    // Unverified: sign-in refused (a new link is sent).
    $this->post('/account/login', ['email' => 'budi@example.com', 'password' => 'long-enough'])->assertSessionHasErrors('email');

    // The same answer for an email that exists.
    $this->post('/account/register', ['name' => 'X', 'email' => 'budi@example.com', 'password' => 'long-enough', 'password_confirmation' => 'long-enough'])
        ->assertRedirect('/account/login')->assertSessionHas('commerce.success');
    expect(User::query()->where('email', 'budi@example.com')->count())->toBe(1);

    $link = VerifyCustomerEmail::url($budi, 'id');
    $this->get($link)->assertRedirect('/account');
    expect($budi->fresh()->email_verified_at)->not->toBeNull();
    $this->assertAuthenticated('commerce');
});

it('asks new customers to agree to the terms and pass the captcha', function () {
    Notification::fake();
    app(ScaffoldStore::class)->handle();
    $page = publishProduct(['variants' => [['id' => 'v', 'sku' => 'T', 'price' => 1000]]], title: 'Syarat');
    app(StoreSettings::class)->saveSection('checkout', ['terms_page' => $page->id]);
    config(['sunrice.forms.captcha' => ['provider' => 'turnstile', 'site_key' => 'site', 'secret_key' => 'secret']]);
    Http::fake(['*' => Http::response(['success' => true])]);
    $input = ['name' => 'Budi', 'email' => 'budi@example.com', 'password' => 'long-enough', 'password_confirmation' => 'long-enough'];

    $this->get('/account/register')->assertOk()->assertSee('name="terms"', false)->assertSee('data-sitekey="site"', false);
    $this->post('/account/register', $input)->assertSessionHasErrors('terms');
    $this->post('/account/register', [...$input, 'terms' => 1])->assertSessionHasErrors('captcha');
    expect(User::query()->where('email', 'budi@example.com')->exists())->toBeFalse();

    $this->post('/account/register', [...$input, 'terms' => 1, 'cf-turnstile-response' => 'token'])->assertSessionHasNoErrors();
    expect(User::query()->where('email', 'budi@example.com')->exists())->toBeTrue();
});

it('closes registration when switched off', function () {
    app(StoreSettings::class)->saveSection('accounts', ['registration' => false]);

    $this->get('/account/register')->assertNotFound();
});

it('resets passwords by email without telling who has an account', function () {
    Notification::fake();
    $user = customerUser();

    $this->post('/account/forgot-password', ['email' => 'nobody@example.com'])->assertSessionHas('commerce.success');
    $this->post('/account/forgot-password', ['email' => 'ana@example.com'])->assertSessionHas('commerce.success');
    $token = null;
    Notification::assertSentTo($user, CustomerResetPassword::class, function (CustomerResetPassword $n) use (&$token) {
        $token = $n->token;

        return true;
    });

    $this->post('/account/reset-password', ['token' => $token, 'email' => 'ana@example.com', 'password' => 'brand-new-1', 'password_confirmation' => 'brand-new-1'])
        ->assertRedirect('/account/login');
    $this->post('/account/login', ['email' => 'ana@example.com', 'password' => 'brand-new-1'])->assertRedirect('/account');
});

it('merges the guest cart at sign-in', function () {
    app(ScaffoldStore::class)->handle();
    publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000]]], title: 'Mug');
    customerUser();
    $this->post('/cart/items', ['variant' => Variant::query()->value('id'), 'quantity' => 2]);
    $guest = Cart::query()->firstOrFail();

    $this->withCookies(['commerce_cart' => $guest->token])->post('/account/login', ['email' => 'ana@example.com', 'password' => 'secret-pass']);

    expect($guest->fresh()->customer_id)->toBe(Customer::query()->where('email', 'ana@example.com')->value('id'));
});

it('uses the customer roles with can() under the commerce guard', function () {
    Role::findOrCreate('Customer', 'web')->givePermissionTo(Permission::findOrCreate('commerce.demo', 'web'));
    $user = customerUser();
    // As the storefront signs in: the commerce guard, the default guard unchanged.
    Auth::guard('commerce')->login($user);

    expect(commerce_customer()->can('commerce.demo'))->toBeTrue();
});

it('sends staff to the admin login when the storefront shares its guard and two-factor is on', function () {
    config(['commerce.auth.guard' => 'web', 'sunrice.auth.two_factor' => true]);
    $staff = customerUser();
    $staff->assignRole(Role::findOrCreate(config('sunrice.super_admin_role'), 'web'));

    $this->post('/account/login', ['email' => 'ana@example.com', 'password' => 'secret-pass'])->assertSessionHasErrors('email');
    $this->assertGuest('web');

    // Customers still sign in there.
    customerUser(['email' => 'budi@example.com']);
    $this->post('/account/login', ['email' => 'budi@example.com', 'password' => 'secret-pass'])->assertRedirect('/account');
    $this->assertAuthenticated('web');
});
