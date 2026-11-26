<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Sunrice\Commerce\Customers\Actions\SaveAddress;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;
use Workbench\App\Models\User;

it('saves and selects an opted-in address immediately without placing an order', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    $mug = checkoutStore();
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->actingAs($user, 'account');
    $customer = Customer::forUser($user);
    $cart = cartWith([[$mug, 1]]);
    $input = [
        'action' => 'apply_address',
        'save_address' => true,
        'shipping_address' => [...checkoutInput()['shipping_address'], 'line1' => 'Jl. Sarijadi No. 2'],
    ];

    $this->get('/checkout')->assertOk()->assertSee('name="save_address" value="1" checked', false);
    $invalid = array_replace_recursive($input, ['shipping_address' => ['district_code' => '32.75.01']]);
    $this->withCredentials()->postJson('/checkout/refresh', $invalid)
        ->assertUnprocessable()->assertJsonValidationErrors('address.district_code');
    $this->withCredentials()->postJson('/checkout/refresh', [...$input, 'save_address' => false])
        ->assertOk()->assertJsonPath('saved_address', null);
    expect($customer->addresses()->count())->toBe(0);

    $response = $this->withCredentials()->postJson('/checkout/refresh', $input)->assertOk();
    $address = $customer->addresses()->sole();
    $response->assertJsonPath('saved_address.id', $address->id)
        ->assertJsonPath('saved_address.address.city_code', '32.73');
    expect($address->label)->toBe('Jl. Sarijadi No. 2')
        ->and($cart->fresh()->checkout)->toMatchArray(['address_id' => $address->id, 'save_address' => false])
        ->and(Order::query()->count())->toBe(0);

    $this->withCredentials()->postJson('/checkout/refresh', $input)->assertOk()->assertJsonPath('saved_address.id', $address->id);
    expect($customer->addresses()->count())->toBe(1);
    $this->get('/checkout')->assertOk()->assertSee('value="'.$address->id.'" data-address=', false);
    $this->get('/account/addresses')->assertOk()->assertSee('Jl. Sarijadi No. 2');
});

it('renders the saved address with canonical region codes and saves a sparse replacement', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    $mug = checkoutStore();
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->actingAs($user, 'account');
    $customer = Customer::forUser($user);
    $address = checkoutInput()['shipping_address'];
    $save = app(SaveAddress::class);
    $original = $save->handle($customer, [...$address, 'label' => 'Rumah', 'line2' => 'Apartment 2', 'notes' => 'Old note', 'postal_code' => '40151']);
    $replacement = $save->handle($customer, [...$address, 'label' => 'Kantor', 'line1' => 'Jl. Sarijadi 2']);

    $cart = cartWith([[$mug, 1]]);
    $this->get('/checkout')->assertOk()
        ->assertSee('value="'.$original->id.'" data-address=', false)
        ->assertSee('id="checkout-address-dialog"', false)
        ->assertSee('Tambah alamat');

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

    $this->post('/checkout', ['action' => 'use_saved_address', 'address_id' => $original->id, 'save_address' => '1'])
        ->assertRedirect('/checkout#shipping');
    expect($cart->fresh()->checkout)->toMatchArray(['address_id' => $original->id, 'save_address' => false])
        ->and($cart->fresh()->checkout['shipping_address']['line2'])->toBe('Apartment 2');

    $this->post('/checkout', ['action' => 'use_saved_address', 'address_id' => 9999])
        ->assertRedirect('/checkout#shipping')->assertSessionHas('commerce.error');
    expect($cart->fresh()->checkout['address_id'])->toBe($original->id);
});

it('keeps the title when a checkout address is renamed and saved to the account', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $mug = checkoutStore();
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->actingAs($user, 'account');
    $customer = Customer::forUser($user);
    $input = checkoutInput(['address_id' => '', 'save_address' => 1, 'shipping_address' => ['label' => 'Rumah']]);
    app(SaveAddress::class)->handle($customer, [...checkoutInput()['shipping_address'], 'label' => 'Alamat lama']);
    $cart = cartWith([[$mug, 1]]);

    $this->post('/checkout', $input)->assertRedirect('/checkout#shipping');
    $this->get('/checkout')->assertOk()->assertSee('name="shipping_address[label]" value="Rumah"', false)
        ->assertSee('data-placeholder="Alamat baru">Rumah</option>', false);
    $this->withCredentials()->postJson('/checkout/refresh', $input)->assertOk();
    $hash = seenHash($cart, $input);

    $input['shipping_address']['label'] = 'Kantor Bandung';
    $this->withCredentials()->postJson('/checkout/refresh', $input)->assertOk()->assertJsonPath('hash', $hash);
    $this->get('/checkout')->assertOk()->assertSee('data-placeholder="Alamat baru">Kantor Bandung</option>', false);

    $tooLong = array_replace_recursive($input, ['shipping_address' => ['label' => str_repeat('X', 61)]]);
    $this->post('/checkout', [...$tooLong, 'action' => 'place', 'totals_hash' => $hash])->assertSessionHasErrors('shipping_address.label');
    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => $hash])->assertSessionHasNoErrors()->assertRedirect();
    $address = $customer->addresses()->where('label', 'Kantor Bandung')->sole();
    expect(Order::query()->sole()->shipping_address)->not->toHaveKey('label');

    $this->put("/account/addresses/{$address->id}", ['address' => [...$input['shipping_address'], 'label' => 'Kantor baru']])
        ->assertSessionHasNoErrors()->assertRedirect('/account/addresses');
    expect($address->fresh()->label)->toBe('Kantor baru');
});

it('names an address saved at checkout from the street when the title is blank', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $mug = checkoutStore();
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->actingAs($user, 'account');
    $customer = Customer::forUser($user);
    $input = checkoutInput(['address_id' => '', 'save_address' => 1, 'shipping_address' => [
        'label' => ' ', 'line1' => 'Jl. Sarijadi No. 2',
    ]]);
    $cart = cartWith([[$mug, 1]]);

    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])
        ->assertSessionHasNoErrors()->assertRedirect();
    expect($customer->addresses()->sole()->label)->toBe('Jl. Sarijadi No. 2')
        ->and(Order::query()->sole()->shipping_address)->not->toHaveKey('label');
    $this->get('/account/addresses')->assertOk()->assertSee('Jl. Sarijadi No. 2');
});
