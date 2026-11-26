<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Orders\Actions\MarkOrderPaid;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\BalanceOverdue;
use Sunrice\Commerce\Orders\Events\DepositPaid;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Payments\Actions\PayWithMethod;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;
use Workbench\App\Commerce\TestDeposit;

beforeEach(function () {
    $this->mug = checkoutStore(['initial_stock' => 50]);
    TestDeposit::$percent = 30;
    app(Commerce::class)->registerCalculationStage(TestDeposit::class, 95);
});

function placeDeposit(Variant $mug): Order
{
    app()->forgetScopedInstances();
    $cart = cartWith([[$mug, 1]]);

    return app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput()), null)->order->fresh();
}

it('asks the deposit at checkout and the balance by its due date', function () {
    $cart = cartWith([[$this->mug, 1]]);
    $this->get('/checkout')->assertOk()->assertSee(__('commerce::payments.deposit_now'));

    $order = placeDeposit($this->mug);

    expect($order->total)->toBe(60000)
        ->and($order->deposit_total)->toBe(18000)
        ->and($order->balance_due_at->toDateString())->toBe(now()->addDays(7)->toDateString())
        ->and($order->payments->sole()->amount)->toBe(18000)
        ->and($order->payments->sole()->meta)->toBe(['part' => 'deposit'])
        ->and($order->payment_status)->toBe(OrderStatus::UNPAID);
});

it('is partially paid after the deposit, paid after the balance', function () {
    Event::fake([DepositPaid::class, OrderPaid::class]);
    $order = placeDeposit($this->mug);

    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid(18000, 'dp'));
    $order->refresh();
    expect($order->payment_status)->toBe(OrderStatus::PARTIALLY_PAID)
        ->and($order->status)->toBe(OrderStatus::PROCESSING)
        ->and($order->paid_total)->toBe(18000)
        ->and($order->balanceDue())->toBe(42000)
        ->and($order->paid_at)->toBeNull();
    Event::assertDispatched(DepositPaid::class);
    Event::assertNotDispatched(OrderPaid::class);

    // The balance, on the pay page.
    $pay = app(PayWithMethod::class);
    expect($pay->payable($order))->toBeTrue();
    actAsOwnerOf($order);
    $this->get($order->url())->assertSee(__('commerce::payments.pay_balance'))->assertSee('42.000');
    $pay->handle($order, 'test_transfer');
    $balance = $order->payments()->get()->last();
    expect($balance->amount)->toBe(42000)->and($balance->meta)->toBe(['part' => 'balance'])
        ->and($order->fresh()->total)->toBe(60000);

    app(RecordPaymentResult::class)->handle($balance, PaymentResult::paid(42000, 'lunas'));
    $order->refresh();
    expect($order->payment_status)->toBe(OrderStatus::PAID)
        ->and($order->paid_total)->toBe(60000)
        ->and($order->paid_at)->not->toBeNull()
        ->and($pay->payable($order))->toBeFalse();
    Event::assertDispatched(OrderPaid::class);
});

it('refunds the balance payment first, newest first', function () {
    $order = placeDeposit($this->mug);
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid(18000, 'dp'));
    app(PayWithMethod::class)->handle($order->fresh(), 'test_transfer');
    [$deposit, $balance] = $order->payments()->get()->all();
    app(RecordPaymentResult::class)->handle($balance, PaymentResult::paid(42000, 'lunas'));

    app(RecordRefund::class)->handle($order->fresh(), 10000, [], 'Damaged', false, Actor::system());

    expect([$deposit->fresh()->refunded_amount, $balance->fresh()->refunded_amount])->toBe([0, 10000]);
});

it('stays partially paid when the balance payment expires, without cancelling', function () {
    $order = placeDeposit($this->mug);
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid(18000));
    app(PayWithMethod::class)->handle($order->fresh(), 'test_transfer');
    expect($order->payments()->count())->toBe(2);

    $this->travel(25)->hours();
    $this->artisan('commerce:tick');

    $order->refresh();
    expect($order->payments()->get()->last()->status)->toBe('expired')
        ->and($order->payment_status)->toBe(OrderStatus::PARTIALLY_PAID)
        ->and($order->status)->toBe(OrderStatus::PROCESSING);
});

it('cancels the order when the deposit is not paid in time', function () {
    $order = placeDeposit($this->mug);

    $this->travel(25)->hours();
    $this->artisan('commerce:tick');

    expect($order->fresh()->status)->toBe(OrderStatus::CANCELLED);
});

it('reminds the customer before the balance is due, then tells staff once it is overdue', function () {
    Notification::fake();
    Event::fake([BalanceOverdue::class]);
    $order = placeDeposit($this->mug);
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid(18000));

    $this->artisan('commerce:tick');
    expect($order->fresh()->meta('balance_reminded_at'))->toBeNull(); // 7 days to go, reminder at 2

    $this->travel(5)->days();
    $this->artisan('commerce:tick');
    $this->artisan('commerce:tick');
    expect($order->fresh()->meta('balance_reminded_at'))->not->toBeNull();
    Event::assertNotDispatched(BalanceOverdue::class);

    $this->travel(3)->days();
    $this->artisan('commerce:tick');
    $this->artisan('commerce:tick');
    Event::assertDispatchedTimes(BalanceOverdue::class, 1);
    expect($order->fresh()->status)->toBe(OrderStatus::PROCESSING)
        ->and($order->events()->where('type', 'note')->pluck('message')->implode(' '))->toContain('42.000');
});

it('lets staff mark the balance paid', function () {
    $order = placeDeposit($this->mug);
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid(18000));

    $payment = app(MarkOrderPaid::class)->handle($order->fresh(), Actor::system(), 'cash');

    expect($payment->amount)->toBe(42000)->and($order->fresh()->payment_status)->toBe(OrderStatus::PAID);
});

it('ignores a deposit that is not less than the total', function () {
    TestDeposit::$percent = 100;
    $order = placeDeposit($this->mug);

    expect($order->deposit_total)->toBe(0)->and($order->payments->sole()->amount)->toBe(60000);
});
