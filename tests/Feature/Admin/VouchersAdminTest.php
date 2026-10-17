<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Workbench\App\Models\User;

it('creates and edits vouchers with conditions and targets', function () {
    actingAsSuperAdmin();
    $variant = Variant::factory()->create();
    User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);

    $this->get('/cms/commerce/vouchers/create')->assertOk();
    $this->post('/cms/commerce/vouchers', ['values' => [
        'name' => 'Gajian', 'code' => 'gajian25', 'active' => true, 'type' => 'percent', 'percent' => 25, 'max_discount' => 50000,
        'include' => [['type' => 'product', 'id' => $variant->product_id, 'label' => 'x']], 'min_subtotal' => 100000, 'subtotal_basis' => 'cart',
        'audience' => 'customers', 'emails' => "Ana@example.com\nnot-an-email\nbudi@example.com", 'payment_methods' => 'bank_transfer, qris',
        'usage_limit' => 100, 'usage_limit_per_customer' => 1, 'combinable' => false,
    ]])->assertSessionHasNoErrors()->assertRedirect();

    $voucher = Voucher::query()->firstOrFail();
    expect($voucher->code)->toBe('GAJIAN25')->and($voucher->value)->toBe(2500)->and($voucher->max_discount)->toBe(50000)
        ->and($voucher->payment_methods)->toBe(['bank_transfer', 'qris'])->and($voucher->combinable)->toBeFalse()
        ->and($voucher->targets->pluck('mode')->all())->toBe(['include'])
        ->and($voucher->customers->pluck('email')->all())->toBe(['ana@example.com', 'budi@example.com'])
        ->and($voucher->customers->first()->customer_id)->not->toBeNull();

    $this->get('/cms/commerce/vouchers')->assertOk()->assertSee('GAJIAN25');
    $this->get("/cms/commerce/vouchers/{$voucher->id}/edit")->assertOk();
    $this->put("/cms/commerce/vouchers/{$voucher->id}", ['values' => ['name' => 'B2G1', 'code' => 'GAJIAN25', 'active' => true, 'type' => 'buy_x_get_y',
        'bxgy' => ['buy_qty' => 2, 'get_qty' => 1, 'get_type' => 'free'], 'audience' => 'everyone']])->assertSessionHasNoErrors();
    expect($voucher->fresh()->bxgy)->toBe(['buy_qty' => 2, 'get_qty' => 1, 'get_type' => 'free', 'get_value' => 0]);
});

it('requires a unique code unless automatic', function () {
    actingAsSuperAdmin();
    Voucher::query()->create(['name' => 'X', 'code' => 'TAKEN', 'type' => 'percent', 'value' => 100]);

    $this->post('/cms/commerce/vouchers', ['values' => ['name' => 'Y', 'code' => 'taken', 'type' => 'percent', 'percent' => 5, 'audience' => 'everyone']])
        ->assertSessionHasErrors('values.code');
    $this->post('/cms/commerce/vouchers', ['values' => ['name' => 'Y', 'code' => '', 'type' => 'percent', 'percent' => 5, 'audience' => 'everyone']])
        ->assertSessionHasErrors('values.code');
    $this->post('/cms/commerce/vouchers', ['values' => ['name' => 'Auto', 'automatic' => true, 'type' => 'fixed_cart', 'amount' => 10000, 'audience' => 'everyone']])
        ->assertSessionHasNoErrors();
    expect(Voucher::query()->where('name', 'Auto')->value('code'))->toBeNull();
});
