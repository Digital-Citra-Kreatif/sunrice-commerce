<?php

declare(strict_types=1);

use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Laravel\Socialite\Two\User as GoogleUser;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\CommerceServiceProvider;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Http\Controllers\Account\GoogleController;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    config(['services.google' => ['client_id' => 'id', 'client_secret' => 'secret', 'redirect' => null]]);
    app(ToggleFeature::class)->handle('google_login', true);
});

function fakeGoogle(string $id, string $email, bool $verified = true): void
{
    $user = (new GoogleUser)->setRaw(['email_verified' => $verified])->map(['id' => $id, 'name' => 'Ana G', 'email' => $email, 'avatar' => null]);
    $provider = Mockery::mock(GoogleProvider::class);
    $provider->shouldReceive('redirectUrl')->andReturnSelf();
    $provider->shouldReceive('user')->andReturn($user);
    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);
}

it('links a verified email to the existing account and signs in', function () {
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
    fakeGoogle('g-1', 'ana@example.com');

    $this->get('/account/login/google/callback')->assertRedirect('/account');
    $this->assertAuthenticatedAs($user, 'commerce');
    expect(DB::table('commerce_social_accounts')->where('provider_id', 'g-1')->value('user_id'))->toBe($user->id);

    // The link signs in even when the email changes later.
    $this->post('/account/logout');
    fakeGoogle('g-1', 'other@example.com');
    $this->get('/account/login/google/callback');
    $this->assertAuthenticatedAs($user, 'commerce');
});

it('creates an account only when registration is open', function () {
    fakeGoogle('g-2', 'new@example.com');
    app(StoreSettings::class)->saveSection('accounts', ['registration' => false]);
    $this->get('/account/login/google/callback')->assertRedirect('/account/login');
    expect(User::query()->where('email', 'new@example.com')->exists())->toBeFalse();

    app(StoreSettings::class)->saveSection('accounts', ['registration' => true]);
    $this->get('/account/login/google/callback')->assertRedirect('/account');
    $user = User::query()->where('email', 'new@example.com')->firstOrFail();
    expect($user->hasRole('Customer'))->toBeTrue()->and($user->email_verified_at)->not->toBeNull();
});

it('does not link an unverified Google email', function () {
    User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
    fakeGoogle('g-3', 'ana@example.com', verified: false);

    $this->get('/account/login/google/callback')->assertRedirect('/account/login');
    $this->assertGuest('commerce');
});

it('refuses staff in shared-guard mode', function () {
    config(['commerce.auth.guard' => 'web']);
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
    $user->assignRole(Role::findOrCreate(config('sunrice.super_admin_role'), 'web'));
    fakeGoogle('g-4', 'ana@example.com');

    $this->get('/account/login/google/callback')->assertRedirect('/account/login')->assertSessionHas('commerce.error');
});

it('takes the Google keys from GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET through commerce.google', function () {
    config(['services.google' => null, 'commerce.google' => ['client_id' => 'env-id', 'client_secret' => 'env-secret']]);
    CommerceServiceProvider::mapGoogleConfig();

    expect(config('services.google'))->toMatchArray(['client_id' => 'env-id', 'client_secret' => 'env-secret'])
        ->and(array_key_exists('redirect', config('services.google')))->toBeTrue()
        ->and(GoogleController::configured())->toBeTrue();
});
