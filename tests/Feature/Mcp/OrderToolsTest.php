<?php

declare(strict_types=1);

use Sunrice\Activity\ActivityLogger;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Mcp\Tools;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderEvent;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;

beforeEach(function () {
    $this->mug = checkoutStore();
    $this->admin = actingAsSuperAdmin();
    app(ActivityLogger::class)->actingVia('ai', 'Claude'); // what the token middleware does
});

function paidMugOrder(): Order
{
    $order = makeOrder(['status' => 'processing', 'payment_status' => 'paid', 'paid_total' => 100000, 'number' => 'ORD-MCP-1']);
    $order->items()->create(['product_id' => test()->mug->product_id, 'variant_id' => test()->mug->id, 'name' => 'Mug', 'quantity' => 2, 'unit_price' => 50000, 'subtotal' => 100000, 'total' => 100000]);

    return $order;
}

it('starts with the store info', function () {
    $info = mcpTool(Tools\GetStoreInfoTool::class);

    expect($info['selling_mode'])->toBe('shop')
        ->and($info['currency']['code'])->toBe('IDR')
        ->and($info['tools'])->toContain('get_store_info', 'list_orders', 'update_order', 'refund_order')
        ->and(collect($info['modules'])->firstWhere('key', 'orders')['on'])->toBeTrue();
});

it('lists and reads orders', function () {
    $order = paidMugOrder();
    makeOrder(['email' => 'other@example.com']);

    $list = mcpTool(Tools\ListOrdersTool::class, ['payment_status' => 'paid']);
    expect($list['total'])->toBe(1)->and($list['orders'][0]['number'])->toBe('ORD-MCP-1')
        ->and($list['orders'][0]['total'])->toBe(['amount' => 100000, 'formatted' => 'Rp100.000'])
        ->and(mcpTool(Tools\ListOrdersTool::class, ['search' => 'other@'])['total'])->toBe(1);

    $detail = mcpTool(Tools\GetOrderTool::class, ['order' => 'ORD-MCP-1']);
    expect($detail['id'])->toBe($order->id)->and($detail['items'][0])->toMatchArray(['name' => 'Mug', 'quantity' => 2])
        ->and($detail['next_statuses'])->toContain('completed', 'on_hold')
        ->and(mcpTool(Tools\GetOrderTool::class, ['order' => 'nope']))->toHaveKey('error');
});

it('updates orders through the admin actions, as the AI', function () {
    $order = paidMugOrder();

    $result = mcpTool(Tools\UpdateOrderTool::class, ['order' => $order->id, 'note' => 'Packed with bubble wrap', 'shipment' => ['courier' => 'JNE', 'tracking_number' => 'JNE123']]);
    expect($result['changed'])->toBe(['shipment', 'note'])
        ->and($result['order']['fulfillment_status'])->toBe('shipped')
        ->and($result['order']['shipments'][0])->toMatchArray(['courier' => 'JNE', 'tracking_number' => 'JNE123'])
        ->and(OrderEvent::query()->where('order_id', $order->id)->where('message', 'Packed with bubble wrap')->value('source'))->toBe('ai');

    // Cancelling needs the user's go-ahead (and a paid order needs a refund first).
    $pending = makeOrder();
    expect(mcpTool(Tools\UpdateOrderTool::class, ['order' => $pending->id, 'status' => 'cancelled'])['error'])->toContain('confirm: true')
        ->and($pending->refresh()->status)->toBe('pending');
    expect(mcpTool(Tools\UpdateOrderTool::class, ['order' => $pending->id, 'status' => 'cancelled', 'reason' => 'Asked by phone', 'confirm' => true])['order']['status'])->toBe('cancelled');
    expect(mcpTool(Tools\UpdateOrderTool::class, ['order' => $pending->id, 'status' => 'completed']))->toHaveKey('error');
});

it('creates manual orders and records refunds with confirmation', function () {
    $created = mcpTool(Tools\CreateOrderTool::class, ['email' => 'ani@example.com', 'name' => 'Ani', 'lines' => [['variant_id' => $this->mug->id, 'quantity' => 2]],
        'shipping' => ['label' => 'Kurir toko', 'cost' => 10000], 'payment_status' => 'paid']);
    expect($created['order'])->toMatchArray(['channel' => 'admin', 'payment_status' => 'paid', 'customer' => 'Ani'])
        ->and($created['order']['total']['amount'])->toBe(110000);

    $id = $created['order']['id'];
    expect(mcpTool(Tools\RefundOrderTool::class, ['order' => $id, 'amount' => 10000])['error'])->toContain('confirm: true');
    $refund = mcpTool(Tools\RefundOrderTool::class, ['order' => $id, 'amount' => 10000, 'reason' => 'Late delivery', 'confirm' => true]);
    expect($refund['order']['refunded']['amount'])->toBe(10000)
        ->and(mcpTool(Tools\RefundOrderTool::class, ['order' => $id, 'amount' => 999999, 'confirm' => true]))->toHaveKey('error');
});

it('reviews payment confirmations with confirmation', function () {
    $order = makeOrder(['payment_method' => 'test_transfer', 'number' => 'ORD-MCP-2']);
    $payment = $order->payments()->create(['method' => 'test_transfer', 'amount' => 100000, 'status' => 'pending', 'currency' => 'IDR']);
    $confirmation = PaymentConfirmation::query()->create(['order_id' => $order->id, 'payment_id' => $payment->id, 'sender_name' => 'Ani', 'amount' => 100000, 'status' => 'submitted']);

    $list = mcpTool(Tools\ListPaymentConfirmationsTool::class);
    expect($list['confirmations'][0])->toMatchArray(['id' => $confirmation->id, 'order' => 'ORD-MCP-2', 'sender' => 'Ani']);
    expect(mcpTool(Tools\ReviewPaymentConfirmationTool::class, ['id' => $confirmation->id, 'decision' => 'approve'])['error'])->toContain('confirm: true');
    $approved = mcpTool(Tools\ReviewPaymentConfirmationTool::class, ['id' => $confirmation->id, 'decision' => 'approve', 'confirm' => true]);
    expect($approved['status'])->toBe('approved')->and($approved['order']['payment_status'])->toBe('paid');
});

it('hides tools without the permission or the module', function () {
    $clerk = actingAsUserWith(['commerce.orders.view'], 'clerk@example.com');

    expect((new Tools\ListOrdersTool)->shouldRegister())->toBeTrue()
        ->and((new Tools\RefundOrderTool)->shouldRegister())->toBeFalse()
        ->and(mcpTool(Tools\RefundOrderTool::class, ['order' => 1, 'amount' => 1, 'confirm' => true], $clerk)['error'])->toContain('not found'); // not even listed

    $this->actingAs($this->admin);
    app(ToggleFeature::class)->handle('ai_tools', false);
    expect((new Tools\GetStoreInfoTool)->shouldRegister())->toBeFalse();
    app(ToggleFeature::class)->handle('ai_tools', true);
    app(ToggleFeature::class)->handle('manual_payments', false);
    expect((new Tools\ListPaymentConfirmationsTool)->shouldRegister())->toBeFalse()
        ->and((new Tools\GetStoreInfoTool)->shouldRegister())->toBeTrue();
});
