<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Orders\Events\PaymentLinkRequested;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;

beforeEach(function () {
    $this->mug = checkoutStore();
    $this->tea = Variant::factory()->create(['product_id' => $this->mug->product_id, 'sku' => 'TEA', 'price' => 20000, 'uid' => 'tea', 'track_stock' => true, 'stock_quantity' => 10]);
});

$address = ['name' => 'Rina', 'phone' => '0812', 'country' => 'ID', 'province_code' => '32', 'city_code' => '32.73', 'district_code' => '32.73.01', 'line1' => 'Jl. Sarijadi 1'];

it('creates unpaid and paid manual orders', function () use ($address) {
    Event::fake([PaymentLinkRequested::class]);
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.create']);

    $this->post('/cms/commerce/orders', [
        'email' => 'Rina@Example.com', 'name' => 'Rina', 'phone' => '0812 3456 7890',
        'lines' => [['variant_id' => $this->mug->id, 'quantity' => 2]],
        'shipping_address' => $address, 'shipping' => ['label' => 'JNE REG', 'cost' => 12000], 'discount' => ['label' => 'Langganan', 'amount' => 5000],
        'payment_status' => 'unpaid', 'payment_method' => 'test_transfer', 'send_link' => true,
    ])->assertRedirect();
    $order = Order::query()->sole();
    expect([$order->channel, $order->status, $order->payment_status])->toBe(['admin', 'pending', 'unpaid'])
        ->and($order->total)->toBe(100000 - 5000 + 12000)
        ->and($order->shipping_method['label'])->toBe('JNE REG')
        ->and($order->shipping_address['city'])->toBe('Kota Bandung')
        ->and($order->payments->sole()->amount)->toBe(107000)
        ->and($this->mug->fresh()->stock_quantity)->toBe(3)
        ->and($order->events->first()->source)->toBe('admin');
    Event::assertDispatched(PaymentLinkRequested::class);

    $this->post('/cms/commerce/orders', [
        'email' => 'budi@example.com', 'lines' => [['variant_id' => $this->tea->id, 'quantity' => 1]], 'shipping_address' => $address,
        'payment_status' => 'paid', 'reference' => 'Cash',
    ])->assertRedirect();
    $paid = Order::query()->latest('id')->first();
    expect([$paid->status, $paid->payment_status, $paid->paid_total])->toBe(['processing', 'paid', 20000])
        ->and($paid->payments->sole()->reference)->toBe('Cash');
});

it('refuses price overrides without the permission', function () use ($address) {
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.create']);
    $input = ['email' => 'rina@example.com', 'lines' => [['variant_id' => $this->mug->id, 'quantity' => 1, 'unit_price' => 30000]], 'shipping_address' => $address, 'payment_status' => 'unpaid'];
    $this->post('/cms/commerce/orders', $input)->assertSessionHasErrors('lines');
    expect(Order::query()->count())->toBe(0);

    actingAsUserWith(['commerce.orders.view', 'commerce.orders.create', 'commerce.orders.override-prices'], 'boss@example.com');
    $this->post('/cms/commerce/orders', $input)->assertRedirect();
    $item = Order::query()->sole()->items->sole();
    expect($item->unit_price)->toBe(30000)->and($item->price_source['type'])->toBe('manual');
});

it('edits unpaid orders with frozen prices and the stock difference', function () use ($address) {
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.create', 'commerce.orders.edit']);
    $this->post('/cms/commerce/orders', ['email' => 'rina@example.com', 'lines' => [['variant_id' => $this->mug->id, 'quantity' => 2]], 'shipping_address' => $address,
        'shipping' => ['label' => 'Kurir', 'cost' => 10000], 'payment_status' => 'unpaid', 'payment_method' => 'test_transfer']);
    $order = Order::query()->sole();
    $mugItem = $order->items->sole();
    Variant::query()->whereKey($this->mug->id)->update(['price' => 60000]); // a later price change doesn't touch the order

    $this->put("/cms/commerce/orders/{$order->id}", ['lines' => [
        ['item_id' => $mugItem->id, 'variant_id' => $this->mug->id, 'quantity' => 1],
        ['variant_id' => $this->tea->id, 'quantity' => 3],
    ]])->assertRedirect();
    $order->refresh();
    expect($order->items->pluck('unit_price', 'sku')->all())->toBe(['MUG' => 50000, 'TEA' => 20000])
        ->and($order->total)->toBe(50000 + 60000 + 10000)
        ->and($order->payments->sole()->amount)->toBe(120000)
        ->and($this->mug->fresh()->stock_quantity)->toBe(4)   // 5 − 2 + 1
        ->and($this->tea->fresh()->stock_quantity)->toBe(7)   // 10 − 3
        ->and($order->version)->toBeGreaterThan(1)
        ->and($order->events->last()->type)->toBe('edit');

    // Override without the permission is refused.
    $this->put("/cms/commerce/orders/{$order->id}", ['lines' => [['variant_id' => $this->tea->id, 'quantity' => 1, 'unit_price' => 1]]])->assertSessionHasErrors('lines');

    // Paid orders can't be edited.
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid());
    $this->get("/cms/commerce/orders/{$order->id}/edit")->assertRedirect("/cms/commerce/orders/{$order->id}");
    $this->put("/cms/commerce/orders/{$order->id}", ['lines' => [['variant_id' => $this->tea->id, 'quantity' => 1]]])->assertSessionHasErrors('lines');
});

it('previews totals for the editor', function () {
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.create']);
    $json = $this->postJson('/cms/commerce/orders/preview', ['lines' => [['variant_id' => $this->mug->id, 'quantity' => 2]], 'shipping' => ['label' => 'X', 'cost' => 5000]])->assertOk()->json();
    expect($json['totals']['total'])->toBe('Rp105.000')->and($json['lines'][0]['unit_price_formatted'])->toBe('Rp50.000');
});
