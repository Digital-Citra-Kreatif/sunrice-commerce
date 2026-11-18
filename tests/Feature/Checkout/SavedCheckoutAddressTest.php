<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Sunrice\Commerce\Customers\Actions\SaveAddress;
use Sunrice\Commerce\Customers\Models\Customer;
use Workbench\App\Models\User;

it('renders the saved address with canonical region codes and saves a sparse replacement', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    $mug = checkoutStore();
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->actingAs($user, 'commerce');
    $customer = Customer::forUser($user);
    $address = checkoutInput()['shipping_address'];
    $save = app(SaveAddress::class);
    $original = $save->handle($customer, [...$address, 'label' => 'Rumah', 'line2' => 'Apartment 2', 'notes' => 'Old note', 'postal_code' => '40151']);
    $replacement = $save->handle($customer, [...$address, 'label' => 'Kantor', 'line1' => 'Jl. Sarijadi 2']);

    $cart = cartWith([[$mug, 1]]);
    $cart->update(['customer_id' => $customer->id, 'checkout' => checkoutInput(['shipping_address' => $original->toAddress()])]);

    $this->get('/checkout')->assertOk()
        ->assertSee('Rumah')->assertSee('Kantor')
        ->assertSee('"city_code":"32.73"', false)
        ->assertSee('"district_code":"32.73.01"', false)
        ->assertSee('"line2":null', false);

    $this->withCredentials()->postJson('/checkout/refresh', [
        'address_id' => $replacement->id,
        'shipping_address' => $replacement->toAddress(),
    ])->assertOk();

    expect($cart->fresh()->checkout)->toMatchArray(['address_id' => $replacement->id])
        ->and($cart->fresh()->checkout['shipping_address'])->toMatchArray([
            'line1' => 'Jl. Sarijadi 2',
            'line2' => null,
            'notes' => null,
            'postal_code' => null,
            'city_code' => '32.73',
            'district_code' => '32.73.01',
        ]);
});
