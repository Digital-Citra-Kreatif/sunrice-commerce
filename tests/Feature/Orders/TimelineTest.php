<?php

declare(strict_types=1);

use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\OrderEvent;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Orders\TimelineText;

/*
 * Timeline entries read in the reader's language, whatever language they
 * were recorded in: what commerce says is kept as a translation key and
 * its values; text people wrote is kept as it is.
 */

it('reads an entry recorded in the store\'s language in the reader\'s', function () {
    $order = makeOrder(['status' => OrderStatus::PROCESSING, 'payment_status' => 'paid', 'paid_total' => 1000]);

    app()->setLocale('id');
    app(OrderStateMachine::class)->transition($order, OrderStatus::COMPLETED, Actor::system(), 'all sent');
    $event = OrderEvent::query()->where('order_id', $order->id)->where('type', 'status')->latest('id')->firstOrFail();
    expect($event->message)->toBe(__('commerce::orders.timeline.status', ['from' => __('commerce::orders.status.processing'), 'to' => __('commerce::orders.status.completed')]).' — all sent');

    app()->setLocale('en');
    expect($event->fresh()->text())->toBe('Status changed from Processing to Completed — all sent')
        ->and($event->fresh()->text('id'))->toBe($event->message);
});

it('shows the admin the timeline in the admin\'s language', function () {
    $order = makeOrder(['status' => OrderStatus::PROCESSING, 'payment_status' => 'paid', 'paid_total' => 1000]);
    app()->setLocale('id');
    app(Timeline::class)->record($order, 'shipment', Timeline::text('commerce::orders.timeline.shipment', ['courier' => 'JNE'])->then(' (JNE123)'));
    app(Timeline::class)->note($order, 'Catatan dari staf', false, Actor::system());
    app()->setLocale('en');

    actingAsSuperAdmin();
    $this->get("/admin/commerce/orders/{$order->id}")->assertOk()->assertInertia(fn ($page) => $page
        ->where('order.timeline.0.message', 'Catatan dari staf')
        ->where('order.timeline.1.message', 'Shipped with JNE (JNE123)'));
});

it('keeps entries recorded before there were keys, and humanises a status with no label', function () {
    $order = makeOrder();
    $old = OrderEvent::query()->create(['order_id' => $order->id, 'type' => 'status', 'visibility' => 'internal', 'message' => 'Status berubah', 'created_at' => now()]);

    expect($old->text())->toBe('Status berubah')
        ->and(TimelineText::status('awaiting_pickup')->in('en'))->toBe('Awaiting pickup')
        ->and(TimelineText::fromArray(TimelineText::make('commerce::orders.timeline.status', ['from' => TimelineText::status('pending'), 'to' => 'X'])->then('!')->toArray())?->in('en'))
        ->toBe('Status changed from '.__('commerce::orders.status.pending', [], 'en').' to X!');
});
