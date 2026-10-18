<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderNoteAdded;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Payments\Models\Payment;

function orderRows($test, string $query = ''): array
{
    $rows = [];
    $test->get('/cms/commerce/orders'.$query)->assertOk()->assertInertia(function ($page) use (&$rows) {
        $rows = $page->toArray()['props']['rows']['data'];
    });

    return $rows;
}

it('lists, searches and filters orders for staff who may view them', function () {
    actingAsUserWith(['commerce.orders.view']);
    $a = makeOrder(['number' => 'ORD-A', 'customer_name' => 'Ani', 'email' => 'ani@example.com', 'status' => 'processing', 'payment_status' => 'paid', 'shipping_method' => ['method' => 'flat', 'label' => 'Reg']]);
    $b = makeOrder(['number' => 'ORD-B', 'customer_name' => 'Budi', 'phone' => '+628111', 'placed_at' => now()->subDays(40)]);
    $q = makeOrder(['type' => 'quote', 'number' => null, 'quote_number' => 'Q-1', 'status' => 'requested']);
    $b->items()->create(['name' => 'Mug', 'sku' => 'MUG-RED', 'quantity' => 1]);

    expect(array_column(orderRows($this), 'number'))->toBe(['Q-1 (quote)', 'ORD-A', 'ORD-B'])
        ->and(array_column(orderRows($this, '?search=mug-red'), 'number'))->toBe(['ORD-B'])
        ->and(array_column(orderRows($this, '?search=ani@'), 'number'))->toBe(['ORD-A'])
        ->and(array_column(orderRows($this, '?filters[payment]=paid'), 'number'))->toBe(['ORD-A'])
        ->and(array_column(orderRows($this, '?filters[type]=quote'), 'number'))->toBe(['Q-1 (quote)'])
        ->and(array_column(orderRows($this, '?filters[shipping_method]=flat'), 'number'))->toBe(['ORD-A'])
        ->and(array_column(orderRows($this, '?filters[date]=30d'), 'number'))->toBe(['Q-1 (quote)', 'ORD-A']);

    $this->get("/cms/commerce/orders/{$a->id}")->assertOk()->assertInertia(fn ($page) => $page->component('Commerce/Orders/Show')
        ->where('order.number', 'ORD-A')->where('can.edit', false)->where('can.cancel', false));
    $this->post("/cms/commerce/orders/{$a->id}/transition", ['to' => 'completed'])->assertForbidden();
    $this->get('/cms/commerce/orders/export')->assertForbidden();
});

it('refuses staff without the orders permission', function () {
    actingAsUserWith(['commerce.customers.view']);
    $this->get('/cms/commerce/orders')->assertForbidden();
});

it('changes status, adds notes and edits addresses with the permissions', function () {
    Event::fake([OrderNoteAdded::class]);
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.edit', 'commerce.orders.cancel']);
    $order = makeOrder(['status' => 'processing', 'payment_status' => 'paid', 'paid_total' => 100000]);

    $this->post("/cms/commerce/orders/{$order->id}/transition", ['to' => 'cancelled'])->assertSessionHas('error', 'This order is paid: refund it before cancelling.');
    $this->post("/cms/commerce/orders/{$order->id}/transition", ['to' => 'completed'])->assertSessionHas('success');
    expect($order->fresh()->status)->toBe('completed')->and($order->events()->latest('id')->first()->source)->toBe('admin');

    $this->post("/cms/commerce/orders/{$order->id}/notes", ['message' => 'Your parcel is packed', 'customer' => true])->assertSessionHas('success');
    Event::assertDispatched(OrderNoteAdded::class, fn ($e) => $e->note->visibility === 'customer' && $e->note->message === 'Your parcel is packed');

    $this->put("/cms/commerce/orders/{$order->id}/addresses", ['values' => ['shipping_address' => ['name' => 'Ani', 'region' => ['country' => 'SG'], 'city' => 'Singapore', 'line1' => '1 Orchard Rd']]])
        ->assertRedirect("/cms/commerce/orders/{$order->id}");
    expect($order->fresh()->shipping_address['line1'])->toBe('1 Orchard Rd')->and($order->fresh()->shipping_address['country'])->toBe('SG');
});

it('bulk-marks orders and skips those that can\'t move', function () {
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.edit']);
    $paid = makeOrder(['status' => 'processing', 'payment_status' => 'paid']);
    $unpaid = makeOrder(['status' => 'processing', 'payment_status' => 'unpaid']);
    $this->post('/cms/commerce/orders/bulk', ['action' => 'completed', 'ids' => [$paid->id, $unpaid->id]])
        ->assertSessionHas('success', '1 order updated. 1 skipped (not allowed from their status).');
    expect($paid->fresh()->status)->toBe('completed')->and($unpaid->fresh()->status)->toBe('processing');
});

it('exports the filtered orders as CSV', function () {
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.export']);
    $order = makeOrder(['number' => 'ORD-X', 'customer_name' => 'Ani', 'total' => 125000]);
    $order->items()->create(['name' => 'Mug', 'sku' => 'MUG', 'quantity' => 2]);

    $csv = $this->get('/cms/commerce/orders/export')->assertOk()->streamedContent();
    // A byte order mark first, so Excel reads UTF-8.
    expect(str_starts_with($csv, "\u{FEFF}"))->toBeTrue();
    $lines = array_map('str_getcsv', array_filter(explode("\n", substr($csv, 3))));
    expect($lines[0])->toBe(['number', 'type', 'date', 'status', 'payment_status', 'fulfillment_status', 'customer', 'email', 'phone', 'items',
        'subtotal', 'discount', 'shipping', 'fees', 'tax', 'total', 'paid', 'refunded', 'payment_method', 'shipping_method', 'city', 'province', 'channel', 'currency'])
        ->and($lines[1][0])->toBe('ORD-X')->and($lines[1][9])->toBe('2 × MUG')->and($lines[1][15])->toBe('125000');
});

it('exports what customers typed as text, never as a spreadsheet formula', function () {
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.export', 'commerce.customers.view', 'commerce.customers.export']);
    makeOrder(['number' => 'ORD-F', 'customer_name' => '=HYPERLINK("https://evil.example","Click")', 'phone' => '+62 812', 'total' => 1000]);
    Customer::query()->create(['email' => 'f@example.com', 'name' => '@SUM(1+1)']);

    $orders = array_map('str_getcsv', array_filter(explode("\n", substr($this->get('/cms/commerce/orders/export')->streamedContent(), 3))));
    $customers = array_map('str_getcsv', array_filter(explode("\n", substr($this->get('/cms/commerce/customers/export')->streamedContent(), 3))));

    expect($orders[1][6])->toBe('\'=HYPERLINK("https://evil.example","Click")')
        ->and($orders[1][15])->toBe('1000')                 // numbers stay numbers
        ->and(collect($customers)->pluck(0)->contains('\'@SUM(1+1)'))->toBeTrue();
});

it('trashes orders and refuses to delete paid ones for good', function () {
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.delete']);
    $paid = makeOrder(['paid_total' => 100000, 'payment_status' => 'paid', 'status' => 'processing']);
    Payment::query()->create(['order_id' => $paid->id, 'method' => 'x', 'amount' => 100000, 'status' => 'paid']);
    $unpaid = makeOrder();

    $this->delete("/cms/commerce/orders/{$paid->id}")->assertRedirect('/cms/commerce/orders');
    expect(Order::query()->find($paid->id))->toBeNull()->and(Order::withTrashed()->find($paid->id))->not->toBeNull();
    $this->delete("/cms/commerce/orders/{$paid->id}/force")->assertSessionHasErrors('order');
    expect(Order::withTrashed()->find($paid->id))->not->toBeNull();

    $this->delete("/cms/commerce/orders/{$unpaid->id}");
    $this->delete("/cms/commerce/orders/{$unpaid->id}/force")->assertRedirect('/cms/commerce/orders');
    expect(Order::withTrashed()->find($unpaid->id))->toBeNull();

    $this->post("/cms/commerce/orders/{$paid->id}/restore");
    expect(Order::query()->find($paid->id))->not->toBeNull();
});

it('marks orders paid with the payments permission', function () {
    actingAsUserWith(['commerce.orders.view', 'commerce.payments.verify']);
    $order = makeOrder(['payment_method' => 'whatsapp', 'payment_method_title' => 'WhatsApp']);
    $this->post("/cms/commerce/orders/{$order->id}/mark-paid", ['reference' => 'BCA 17/10'])->assertSessionHas('success');
    $order->refresh();
    expect($order->payment_status)->toBe('paid')->and($order->status)->toBe('processing')->and($order->paid_total)->toBe(100000)
        ->and($order->payments->sole()->reference)->toBe('BCA 17/10');
    expect(app(OrderStateMachine::class)->can($order, 'completed'))->toBeTrue();
    expect(Actor::admin()->source)->toBe('admin');
});
