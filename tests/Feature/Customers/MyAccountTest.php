<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Customers\Models\Address;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Customers\Notifications\VerifyCustomerEmail;
use Sunrice\Commerce\Facades\Commerce;
use Sunrice\Commerce\Regions\RegionImporter;
use Workbench\App\Models\User;

beforeEach(function () {
    (new RegionImporter(__DIR__.'/../../Fixtures/regions'))->import(4);
    $this->user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->actingAs($this->user, 'commerce');
    $this->customer = Customer::forUser($this->user);
});

$address = ['name' => 'Ana', 'phone' => '081234567890', 'country' => 'ID', 'province_code' => '32', 'city_code' => '32.73', 'district_code' => '32.73.01', 'line1' => 'Jl. Sarijadi 1'];

it('adds, edits and deletes addresses with defaults and region validation', function () use ($address) {
    $this->post('/account/addresses', ['address' => $address])->assertSessionHasNoErrors();
    $first = Address::query()->firstOrFail();
    expect($first->default_shipping)->toBeTrue()->and($first->city)->toBe('Kota Bandung');

    $this->post('/account/addresses', ['address' => [...$address, 'line1' => 'Kantor', 'default_shipping' => 1]])->assertSessionHasNoErrors();
    expect($first->fresh()->default_shipping)->toBeFalse();

    $this->post('/account/addresses', ['address' => [...$address, 'city_code' => '32.04']])->assertSessionHasErrors('address.district_code');
    $this->put("/account/addresses/{$first->id}", ['address' => [...$address, 'line1' => 'Rumah baru']])->assertSessionHasNoErrors();
    expect($first->fresh()->line1)->toBe('Rumah baru');

    $this->get('/account/addresses')->assertOk()->assertSee('Rumah baru')->assertSee('Kota Bandung');
    $this->delete("/account/addresses/{$first->id}")->assertSessionHas('commerce.success');
    expect(Address::query()->count())->toBe(1);
});

it('can\'t touch another customer\'s address', function () use ($address) {
    $other = Customer::query()->create(['email' => 'other@example.com']);
    $theirs = Address::query()->create(['customer_id' => $other->id, 'name' => 'X', 'line1' => 'Y', 'country' => 'ID']);

    $this->put("/account/addresses/{$theirs->id}", ['address' => $address])->assertNotFound();
    $this->delete("/account/addresses/{$theirs->id}")->assertNotFound();
});

it('changes the profile; a new email must be verified again', function () {
    Notification::fake();
    $this->put('/account/profile', ['name' => 'Ana Putri', 'email' => 'ana@example.com', 'phone' => '0811111111', 'accepts_marketing' => 1])
        ->assertSessionHas('commerce.success', 'Profil disimpan.');
    expect($this->customer->fresh()->phone)->toBe('+62811111111')->and($this->customer->fresh()->accepts_marketing)->toBeTrue();

    $this->put('/account/profile', ['name' => 'Ana Putri', 'email' => 'new@example.com'])->assertSessionHas('commerce.success');
    expect($this->user->fresh()->email_verified_at)->toBeNull();
    Notification::assertSentTo($this->user->fresh(), VerifyCustomerEmail::class);
});

it('changes the password with the current one, and asks for deletion', function () {
    $this->put('/account/password', ['current_password' => 'wrong', 'password' => 'new-password-1', 'password_confirmation' => 'new-password-1'])->assertSessionHasErrors('current_password');
    $this->put('/account/password', ['current_password' => 'secret-pass', 'password' => 'new-password-1', 'password_confirmation' => 'new-password-1'])->assertSessionHasNoErrors();

    $this->post('/account/delete', ['confirm' => 1])->assertSessionHas('commerce.success');
    expect($this->customer->fresh()->deletion_requested_at)->not->toBeNull();
});

it('lists pages registered by extensions', function () {
    Route::middleware(['web', 'commerce.auth'])->get('account/points', fn () => 'points')->name('loyalty.points');
    Commerce::registerAccountPage('points', 'Poin saya', 'loyalty.points', position: 50);

    $this->get('/account')->assertOk()->assertSee('Poin saya');
});
