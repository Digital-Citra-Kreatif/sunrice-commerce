<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Orders\Actions\CreateShipment;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actions\UpdateShipment;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderRefunded;
use Sunrice\Commerce\Orders\Events\ShipmentCreated;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    $this->mug = checkoutStore();
    $cart = cartWith([[$this->mug, 3]]);
    $this->order = app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput()), null)->order;
    app(RecordPaymentResult::class)->handle($this->order->payments->sole(), PaymentResult::paid());
    $this->order->refresh();
    $this->item = $this->order->items->sole();
});

it('ships in parts, refuses over-fulfilment and links tracking from presets', function () {
    Event::fake([ShipmentCreated::class]);
    $create = app(CreateShipment::class);
    $actor = Actor::admin();

    $first = $create->handle($this->order, ['courier' => 'jne', 'service' => 'REG', 'tracking_number' => 'JNE123'], [['order_item_id' => $this->item->id, 'quantity' => 2]], $actor);
    expect($first->tracking_url)->toBe('https://www.jne.co.id/tracking-package?awb=JNE123')->and($first->courier_name)->toBe('JNE')
        ->and($this->order->fresh()->fulfillment_status)->toBe('partially_shipped');
    Event::assertDispatched(ShipmentCreated::class);

    expect(fn () => $create->handle($this->order, ['courier' => 'jne'], [['order_item_id' => $this->item->id, 'quantity' => 2]], $actor))
        ->toThrow(ValidationException::class);

    $second = $create->handle($this->order, ['courier' => null, 'courier_name' => 'Kurir toko', 'tracking_number' => 'K1'], [['order_item_id' => $this->item->id, 'quantity' => 1]], $actor);
    expect($second->tracking_url)->toBeNull()->and($this->order->fresh()->fulfillment_status)->toBe('shipped')
        ->and($this->item->fresh()->fulfilled_quantity)->toBe(3);

    app(UpdateShipment::class)->delivered($first, $actor);
    expect($first->fresh()->status)->toBe('delivered');
    $this->get($this->order->url())->assertSee('JNE123')->assertSee('jne.co.id', false);
});

it('completes when fully shipped with the setting on', function () {
    app(StoreSettings::class)->saveSection('checkout', ['auto_complete_shipped' => true]);
    app(CreateShipment::class)->handle($this->order, ['courier' => 'jne', 'tracking_number' => 'X'], [['order_item_id' => $this->item->id, 'quantity' => 3]], Actor::admin());
    expect($this->order->fresh()->status)->toBe('completed');
});

it('refunds partly, then fully, with restock movements, and refuses more than was paid', function () {
    Event::fake([OrderRefunded::class]);
    $refunds = app(RecordRefund::class);
    expect($this->order->paid_total)->toBe(160000)->and($this->mug->fresh()->stock_quantity)->toBe(2);

    $refunds->handle($this->order, 50000, [['order_item_id' => $this->item->id, 'quantity' => 1]], 'Pecah', true, Actor::admin());
    $order = $this->order->fresh();
    expect($order->refunded_total)->toBe(50000)->and($order->payment_status)->toBe('partially_refunded')->and($order->status)->toBe('processing')
        ->and($this->mug->fresh()->stock_quantity)->toBe(3)
        ->and($this->item->fresh()->refunded_quantity)->toBe(1)
        ->and($this->mug->movements()->latest('id')->first()->reason)->toBe('refund');
    Event::assertDispatched(OrderRefunded::class);

    expect(fn () => $refunds->handle($order, 110001, [], null, false, Actor::admin()))->toThrow(ValidationException::class);

    $refunds->handle($order, 110000, [], null, false, Actor::admin());
    $order->refresh();
    expect($order->status)->toBe('refunded')->and($order->payment_status)->toBe('refunded')->and($order->payments->sole()->status)->toBe('refunded')
        ->and($this->mug->fresh()->stock_quantity)->toBe(3);

    // A cancelled-after-refund order doesn't give back the restocked unit twice.
    expect(Order::query()->count())->toBe(1);
});

it('records refunds from the admin with the refund permission', function () {
    actingAsUserWith(['commerce.orders.view']);
    $this->post("/cms/commerce/orders/{$this->order->id}/refunds", ['amount' => 1000])->assertForbidden();
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.refund'], 'refunder@example.com');
    $this->post("/cms/commerce/orders/{$this->order->id}/refunds", ['amount' => 200000])->assertSessionHasErrors('amount');
    $this->post("/cms/commerce/orders/{$this->order->id}/refunds", ['amount' => 10000, 'reason' => 'Goodwill'])->assertSessionHas('success');
    expect($this->order->fresh()->refunded_total)->toBe(10000);
});
