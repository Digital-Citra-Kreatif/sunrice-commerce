<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Listeners\ReleaseReservations;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    $this->mug = checkoutStore();
});

/** Place an order for these lines with the test transfer. */
function placedOrder(array $lines, array $input = [], array $vouchers = []): Order
{
    $cart = cartWith($lines);
    $cart->update(['vouchers' => $vouchers ?: null]);
    $data = CheckoutData::fromCart($cart)->merge(checkoutInput($input));

    return app(PlaceOrder::class)->handle($cart->fresh(), $data, null)->order;
}

it('expires unpaid orders past the deadline and releases everything once', function () {
    $sale = FlashSale::query()->create(['name' => 'Payday', 'slug' => 'payday', 'starts_at' => now()->subHour(), 'ends_at' => now()->addDays(3)]);
    $item = $sale->items()->create(['product_id' => $this->mug->product_id, 'discount_type' => 'percent_off', 'discount_value' => 1000]);
    Voucher::query()->create(['name' => 'Hemat', 'code' => 'HEMAT', 'type' => 'fixed_cart', 'value' => 5000]);
    $order = placedOrder([[$this->mug, 2]], vouchers: ['HEMAT']);
    expect($this->mug->fresh()->stock_quantity)->toBe(3)->and($item->fresh()->sold_quantity)->toBe(2)->and(Voucher::query()->value('times_used'))->toBe(1);

    $this->travel(23)->hours();
    $this->artisan('commerce:tick');
    expect($order->fresh()->status)->toBe('pending');

    $this->travel(2)->hours();
    $this->artisan('commerce:tick');
    $this->artisan('commerce:tick');
    $order->refresh();
    expect($order->status)->toBe('cancelled')
        ->and($order->payments->sole()->status)->toBe('expired')
        ->and($this->mug->fresh()->stock_quantity)->toBe(5)
        ->and($item->fresh()->sold_quantity)->toBe(0)
        ->and(Voucher::query()->value('times_used'))->toBe(0)
        ->and($order->meta('released'))->toEqual(['stock' => true, 'flash' => true, 'vouchers' => true]);

    // A repeated release (a retried listener) gives nothing back twice.
    app(ReleaseReservations::class)->release($order);
    expect($this->mug->fresh()->stock_quantity)->toBe(5);
});

it('pauses expiry while a payment confirmation awaits review', function () {
    $order = placedOrder([[$this->mug, 1]]);
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::awaitingConfirmation());

    $this->travel(2)->days();
    $this->artisan('commerce:tick');
    expect($order->fresh()->status)->toBe('pending')->and($order->fresh()->payment_status)->toBe('awaiting_confirmation');
});

it('lets customers cancel only while unpaid, with the setting on', function () {
    $order = placedOrder([[$this->mug, 1]]);
    $paid = placedOrder([[$this->mug, 1]], ['email' => 'budi@example.com']);
    app(RecordPaymentResult::class)->handle($paid->payments->sole(), PaymentResult::paid(), Actor::admin());

    $this->get($order->url())->assertSee('commerce-order__cancel', false);
    $this->get($paid->fresh()->url())->assertDontSee('commerce-order__cancel', false);
    $this->post("/order/{$paid->order_key}/cancel")->assertSessionHas('commerce.error');
    expect($paid->fresh()->status)->toBe('processing');

    app(StoreSettings::class)->saveSection('checkout', ['customer_cancel' => false]);
    $this->post("/order/{$order->order_key}/cancel")->assertSessionHas('commerce.error');
    app(StoreSettings::class)->saveSection('checkout', ['customer_cancel' => true]);
    $this->post("/order/{$order->order_key}/cancel")->assertSessionHas('commerce.success');
    expect($order->fresh()->status)->toBe('cancelled')
        ->and($order->events()->latest('id')->first()->source)->toBe('storefront')
        ->and($this->mug->fresh()->stock_quantity)->toBe(4);
});

it('completes paid digital-only orders and counts sales and customer spend', function () {
    $ebook = Variant::factory()->create(['product_id' => $this->mug->product_id, 'sku' => 'EBOOK', 'price' => 30000, 'uid' => 'ebook', 'requires_shipping' => false, 'downloadable' => true]);
    $order = placedOrder([[$ebook, 1]], ['shipping_rate' => null]);
    expect($order->fulfillment_status)->toBe('not_required')->and($order->total)->toBe(30000);

    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid(30000, 'TRX-1'));
    $order->refresh();
    expect($order->status)->toBe('completed')->and($order->payment_status)->toBe('paid')->and($order->paid_total)->toBe(30000)
        ->and($this->mug->product->fresh()->sales_count)->toBe(1)
        ->and($order->customer->fresh()->orders_count)->toBe(1)
        ->and($order->customer->fresh()->total_spent)->toBe(30000);

    // The same result twice is a no-op.
    expect(app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid(30000, 'TRX-1')))->toBeFalse();
    expect($order->fresh()->paid_total)->toBe(30000)->and($this->mug->product->fresh()->sales_count)->toBe(1);

    // A physical order stays Processing once paid.
    $mug = placedOrder([[$this->mug, 1]], ['email' => 'x@example.com']);
    app(RecordPaymentResult::class)->handle($mug->payments->sole(), PaymentResult::paid());
    expect($mug->fresh()->status)->toBe('processing');
    expect(fn () => app(OrderStateMachine::class)->transition($mug, 'completed'))->not->toThrow(Throwable::class);
});
