<?php

declare(strict_types=1);

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Event;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\Events\OrderCompleted;
use Sunrice\Commerce\Orders\Events\OrderStatusChanged;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Numbering;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Settings\Actions\SaveStoreSettings;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

/** Every (type, from, to) pair with whether the table allows it. */
function transitionCases(): array
{
    $cases = [];
    foreach (['order' => OrderStatus::ORDER_STATUSES, 'quote' => OrderStatus::QUOTE_STATUSES] as $type => $statuses) {
        foreach ($statuses as $from) {
            foreach ($statuses as $to) {
                if ($from === $to) {
                    continue;
                }
                $cases["{$type} {$from} → {$to}"] = [$type, $from, $to, in_array($to, OrderStateMachine::TRANSITIONS[$type][$from] ?? [], true)];
            }
        }
    }

    return $cases;
}

it('allows exactly the transitions of the table', function (string $type, string $from, string $to, bool $allowed) {
    // Paid and fully refunded, so the money guards don't get in the way; on hold came from Processing.
    $order = makeOrder(['type' => $type, 'status' => $from, 'payment_status' => 'paid', 'paid_total' => 1000, 'refunded_total' => 1000,
        'meta' => ['hold_from' => $to === OrderStatus::PENDING ? 'pending' : 'processing']]);

    $machine = app(OrderStateMachine::class);
    if ($allowed) {
        $machine->transition($order, $to);
        expect($order->status)->toBe($to)->and($order->version)->toBe(2);
    } else {
        expect(fn () => $machine->transition($order, $to))->toThrow(InvalidTransition::class);
        expect($order->fresh()->status)->toBe($from);
    }
})->with(transitionCases());

it('applies the money guards', function () {
    $machine = app(OrderStateMachine::class);

    $paid = makeOrder(['status' => 'processing', 'payment_status' => 'paid', 'paid_total' => 100000]);
    expect(fn () => $machine->transition($paid, 'cancelled'))->toThrow(InvalidTransition::class, 'refund it before cancelling');
    expect(fn () => $machine->transition($paid, 'refunded'))->toThrow(InvalidTransition::class, 'don\'t reach');

    $unpaid = makeOrder(['status' => 'processing', 'payment_status' => 'unpaid']);
    expect(fn () => $machine->transition($unpaid, 'completed'))->toThrow(InvalidTransition::class, 'unpaid order');
    $cod = makeOrder(['status' => 'processing', 'payment_status' => 'unpaid', 'payment_method' => 'cod']);
    expect($machine->transition($cod, 'completed')->completed_at)->not->toBeNull();

    $held = makeOrder(['status' => 'pending']);
    $machine->transition($held, 'on_hold');
    expect($held->meta('hold_from'))->toBe('pending');
    expect(fn () => $machine->transition($held, 'processing'))->toThrow(InvalidTransition::class, 'only go back to Pending payment');
    $machine->transition($held, 'pending');
    expect($held->meta('hold_from'))->toBeNull();
});

it('writes the timeline with actor and source and dispatches events after commit', function () {
    Event::fake([OrderStatusChanged::class, OrderCancelled::class, OrderCompleted::class]);
    $staff = User::query()->create(['name' => 'Sari', 'email' => 'sari@example.com', 'password' => 'x']);
    $order = makeOrder();

    app(OrderStateMachine::class)->transition($order, 'cancelled', Actor::admin($staff), 'Customer asked');

    $event = $order->events()->first();
    expect($event->type)->toBe('status')
        ->and($event->source)->toBe('admin')
        ->and($event->user_id)->toBe($staff->id)
        ->and($event->data)->toMatchArray(['from' => 'pending', 'to' => 'cancelled', 'reason' => 'Customer asked', 'actor' => 'Sari'])
        ->and($event->message)->toBe('Status changed from Pending payment to Cancelled — Customer asked')
        ->and($order->cancelled_at)->not->toBeNull()
        ->and($order->cancel_reason)->toBe('Customer asked');
    Event::assertDispatched(OrderStatusChanged::class, fn ($e) => $e->from === 'pending' && $e->to === 'cancelled' && $e->actor->source === 'admin');
    Event::assertDispatched(OrderCancelled::class);
    Event::assertNotDispatched(OrderCompleted::class);
});

it('numbers orders, quotes and invoices by their formats and resets', function () {
    Carbon::setTestNow('2026-10-17 10:00:00');
    $numbering = app(Numbering::class);
    expect($numbering->next('order'))->toBe('ORD-20261017-0001')
        ->and($numbering->next('order'))->toBe('ORD-20261017-0002')
        ->and($numbering->next('quote'))->toBe('Q-202610-0001')
        ->and($numbering->next('invoice'))->toBe('INV/2026/10/0001');

    Carbon::setTestNow('2026-10-18 09:00:00');
    expect($numbering->next('order'))->toBe('ORD-20261018-0001'); // daily reset
    expect($numbering->next('quote'))->toBe('Q-202610-0002'); // monthly

    app(StoreSettings::class)->saveSection('checkout', ['order_number_format' => '{y}{seq:6}', 'order_number_reset' => 'never']);
    expect($numbering->next('order'))->toBe('26000001');

    Numbering::orderNumbersUsing(fn () => 'CUSTOM-1');
    expect($numbering->next('order'))->toBe('CUSTOM-1');
    Numbering::orderNumbersUsing(null);
});

it('locks the currency once an order exists', function () {
    $currency = app(StoreSettings::class)->get('general.currency');
    $save = fn (string $code) => app(SaveStoreSettings::class)->handle('general', [...app(StoreSettings::class)->section('general'), 'name' => 'Toko', 'email' => 'shop@example.com', 'currency' => [...$currency, 'code' => $code]]);

    $save('USD');
    expect(app(StoreSettings::class)->get('general.currency.code'))->toBe('USD');

    makeOrder();
    expect(fn () => $save('IDR'))->toThrow(ValidationException::class, 'can\'t be changed once the store has orders');
    $save('USD'); // unchanged is fine
});
