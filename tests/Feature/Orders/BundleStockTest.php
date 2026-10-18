<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Models\BundleItem;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Orders\Actions\EditOrder;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;

beforeEach(function () {
    $this->mug = checkoutStore(['initial_stock' => 10]);
    publishProduct(['variants' => [['id' => 'tea', 'sku' => 'TEA', 'price' => 25000, 'weight' => 100, 'track_stock' => true, 'initial_stock' => 10]]], title: 'Tea');
    publishProduct(['variants' => [['id' => 'cup', 'sku' => 'CUP', 'price' => 15000, 'weight' => 100, 'track_stock' => true, 'initial_stock' => 10]]], title: 'Cup');
    $this->tea = Variant::query()->where('sku', 'TEA')->firstOrFail();
    $this->cup = Variant::query()->where('sku', 'CUP')->firstOrFail();
    $entry = publishProduct(['type' => 'bundle', 'variants' => [['id' => 'gift', 'sku' => 'GIFT', 'price' => 90000]],
        'bundle' => ['pricing' => 'fixed', 'value' => 0, 'items' => [['variant_id' => $this->mug->id, 'quantity' => 1], ['variant_id' => $this->tea->id, 'quantity' => 2]]]], title: 'Gift set');
    $this->bundle = Product::query()->where('entry_id', $entry->id)->firstOrFail();
    $this->gift = $this->bundle->variants->sole();
});

/** A gift set order of $qty, then the bundle changed to a cup instead of the tea. */
function giftOrderThenRecompose(int $qty): Order
{
    app()->forgetScopedInstances();
    $cart = cartWith([[test()->gift, $qty]]);
    $order = app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput()), null)->order;
    expect(test()->mug->fresh()->stock_quantity)->toBe(10 - $qty)
        ->and(test()->tea->fresh()->stock_quantity)->toBe(10 - 2 * $qty);

    BundleItem::query()->where('product_id', test()->bundle->id)->where('variant_id', test()->tea->id)->update(['variant_id' => test()->cup->id, 'quantity' => 1]);

    return $order->fresh();
}

/** @return array<string, int> */
function stockLevels(): array
{
    return ['mug' => test()->mug->fresh()->stock_quantity, 'tea' => test()->tea->fresh()->stock_quantity, 'cup' => test()->cup->fresh()->stock_quantity];
}

it('gives back the components a bundle was sold with when the order is cancelled', function () {
    $order = giftOrderThenRecompose(2);
    app(OrderStateMachine::class)->transition($order, 'cancelled', Actor::admin());

    expect(stockLevels())->toBe(['mug' => 10, 'tea' => 10, 'cup' => 10]);
});

it('restocks a refunded bundle with the components it was sold with', function () {
    $order = giftOrderThenRecompose(2);
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid());
    $line = $order->items()->whereNull('parent_id')->sole();
    app(RecordRefund::class)->handle($order->fresh(), 90000, [['order_item_id' => $line->id, 'quantity' => 1]], 'Returned', true, Actor::admin());

    expect(stockLevels())->toBe(['mug' => 9, 'tea' => 8, 'cup' => 10]);
});

it('trades a bundle\'s old components for its new ones when an order is edited', function () {
    $order = giftOrderThenRecompose(2);
    $line = $order->items()->whereNull('parent_id')->sole();
    app(EditOrder::class)->handle($order, [['item_id' => $line->id, 'variant_id' => $this->gift->id, 'quantity' => 1]], null, null, Actor::admin(), null);

    // The two sold sets are back (2 mugs, 4 teas); one set as it is now is held (1 mug, 1 cup).
    expect(stockLevels())->toBe(['mug' => 9, 'tea' => 10, 'cup' => 9]);
});
