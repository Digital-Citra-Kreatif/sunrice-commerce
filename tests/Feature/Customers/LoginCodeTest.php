<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Notification;
use Spatie\OneTimePasswords\Models\OneTimePassword;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Customers\Notifications\CustomerLoginCode;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Workbench\App\Models\User;

beforeEach(function () {
    app(ToggleFeature::class)->handle('passwordless_login', true);
    Notification::fake();
    $this->user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
});

function sentCode(User $user): string
{
    $code = null;
    Notification::assertSentTo($user, CustomerLoginCode::class, function (CustomerLoginCode $n) use (&$code) {
        $code = $n->code->password;

        return true;
    });

    return $code;
}

it('signs in with an emailed code on the commerce guard only', function () {
    $this->post('/account/login/code', ['email' => 'ana@example.com'])->assertRedirect('/account/code');
    $this->post('/account/code', ['code' => sentCode($this->user)])->assertRedirect('/account');

    $this->assertAuthenticatedAs($this->user, 'commerce');
    $this->assertGuest('web');
    expect($this->user->fresh()->email_verified_at)->not->toBeNull();
});

it('answers unknown emails like known ones', function () {
    $this->post('/account/login/code', ['email' => 'nobody@example.com'])->assertRedirect('/account/code')->assertSessionHas('commerce.success');
    Notification::assertNothingSent();
});

it('gives a message for wrong and expired codes, and a new request cancels the old code', function () {
    $this->post('/account/login/code', ['email' => 'ana@example.com']);
    $first = sentCode($this->user);
    $this->post('/account/code', ['code' => '000000'.($first === '000000' ? '1' : '')])->assertSessionHasErrors(['code' => 'Kode salah.']);

    $this->travel(61)->seconds();
    $this->post('/account/login/code', ['email' => 'ana@example.com']);
    expect(OneTimePassword::query()->count())->toBe(1);
    $this->post('/account/code', ['code' => $first])->assertSessionHasErrors('code');

    OneTimePassword::query()->update(['expires_at' => now()->subMinute()]);
    $second = OneTimePassword::query()->value('password');
    $this->post('/account/code', ['code' => $second])->assertSessionHasErrors(['code' => 'Kode sudah kedaluwarsa. Minta kode baru.']);
    $this->assertGuest('commerce');
});

it('rejects a code from another browser and rate-limits requests', function () {
    $this->post('/account/login/code', ['email' => 'ana@example.com']);
    $code = sentCode($this->user);
    $this->withHeader('User-Agent', 'Other browser')->post('/account/code', ['code' => $code])
        ->assertSessionHasErrors(['code' => 'Pakai kode di perangkat dan browser tempat Anda memintanya.']);

    $this->post('/account/login/code', ['email' => 'ana@example.com'])->assertSessionHasErrors('email'); // 1 a minute
});

it('refuses staff when the storefront shares the admin guard', function () {
    config(['commerce.auth.guard' => 'web']);
    $this->user->assignRole(Role::findOrCreate(config('sunrice.super_admin_role'), 'web'));
    $this->post('/account/login/code', ['email' => 'ana@example.com']);
    Notification::assertNothingSent();
});
