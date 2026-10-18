<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Testing\TestResponse;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\Models\WebhookCall;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Commerce\FakeGateway;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
    app(Commerce::class)->registerPaymentMethod(FakeGateway::class);
    $stored = (array) app(StoreSettings::class)->get('payments.methods');
    app(StoreSettings::class)->saveSection('payments', ['methods' => [...$stored, 'fake_gateway' => ['active' => true, 'title' => ['id' => 'Kartu', 'en' => 'Card'], 'secret' => 's3cret', 'fee_percent' => 2]]]);
    app()->forgetScopedInstances();
});

function webhook(array $payload, ?string $secret = 's3cret'): TestResponse
{
    $body = json_encode($payload);

    return test()->call('POST', '/commerce/webhooks/fake_gateway', [], [], [], [
        'CONTENT_TYPE' => 'application/json', 'HTTP_X_SIGNATURE' => hash_hmac('sha256', (string) $body, (string) $secret),
    ], $body);
}

function placeWithGateway(Variant $mug): Order
{
    $cart = cartWith([[$mug, 1]]);
    $input = checkoutInput(['payment_method' => 'fake_gateway']);
    $response = test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)]);
    $order = Order::query()->sole();
    // The fake gateway's reference is FAKE-{payment id} (ids keep counting between tests on MySQL and PostgreSQL).
    $response->assertRedirect('https://pay.example/checkout/'.fakeReference($order));

    return $order;
}

function fakeReference(Order $order, int $nth = 0): string
{
    return 'FAKE-'.($order->payments()->reorder('id')->value('id') + $nth);
}

it('adds the method fee to the totals and sends the customer to the gateway', function () {
    $order = placeWithGateway($this->mug);
    expect($order->fee_total)->toBe(1200)  // 2% of 60.000
        ->and($order->total)->toBe(61200)
        ->and($order->adjustments->firstWhere('kind', 'fee')->source_type)->toBe('payment_fee')
        ->and($order->payments->sole()->reference)->toBe(fakeReference($order));
});

it('completes by webhook, ignoring duplicates, stale results and bad signatures', function () {
    $order = placeWithGateway($this->mug);
    $ref = fakeReference($order);

    webhook(['event_id' => 'evt-1', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200], 'wrong')->assertStatus(400);
    expect($order->fresh()->payment_status)->toBe('unpaid')->and(WebhookCall::query()->sole()->status)->toBe('failed');

    webhook(['event_id' => 'evt-1', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200])->assertOk();
    $order->refresh();
    expect([$order->status, $order->payment_status, $order->paid_total])->toBe(['processing', 'paid', 61200]);

    webhook(['event_id' => 'evt-1', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200])->assertOk()->assertJson(['duplicate' => true]);
    webhook(['event_id' => 'evt-2', 'reference' => $ref, 'status' => 'pending'])->assertOk();
    $order->refresh();
    expect([$order->payment_status, $order->paid_total])->toBe(['paid', 61200])
        ->and(WebhookCall::query()->orderBy('id')->pluck('status')->all())->toBe(['failed', 'processed', 'ignored', 'ignored']);
});

it('records the gateway return and checks status once before expiring', function () {
    $order = placeWithGateway($this->mug);
    $ref = fakeReference($order);
    $this->get("/order/{$order->order_key}/payment/return?status=failed")->assertRedirect($order->url());
    expect($order->fresh()->status)->toBe('failed');

    // Paid at the gateway though we never heard: the check before expiry finds it.
    Cache::put('fake-gateway:'.$ref, 'paid');
    $this->travel(25)->hours();
    $this->artisan('commerce:tick');
    expect($order->fresh()->payment_status)->toBe('paid');
});

it('lets the customer switch methods on the pay page, the fee following', function () {
    $order = placeWithGateway($this->mug);
    $this->get("/order/{$order->order_key}/pay")->assertOk()->assertSee('Kartu')->assertSee('Transfer');

    $this->post("/order/{$order->order_key}/pay", ['payment_method' => 'test_transfer'])->assertRedirect($order->url());
    $order->refresh();
    expect($order->payment_method)->toBe('test_transfer')->and($order->fee_total)->toBe(0)->and($order->total)->toBe(60000)
        ->and($order->payments->pluck('status', 'method')->all())->toBe(['fake_gateway' => 'cancelled', 'test_transfer' => 'pending'])
        ->and($order->payments->last()->amount)->toBe(60000);

    $this->post("/order/{$order->order_key}/pay", ['payment_method' => 'fake_gateway'])->assertRedirect('https://pay.example/checkout/'.fakeReference($order, 2));
    expect($order->fresh()->total)->toBe(61200);

    $this->post("/order/{$order->order_key}/pay", ['payment_method' => 'nope'])->assertSessionHas('commerce.error');
});

it('manages methods in Settings → Payments', function () {
    actingAsUserWith(['commerce.settings.payments']);
    $this->get('/cms/commerce/settings/payments')->assertOk()->assertInertia(fn ($p) => $p->component('Commerce/Settings/Payments')
        ->where('methods', fn ($m) => collect($m)->pluck('key')->all() === ['bank_transfer', 'cod', 'fake_gateway', 'test_transfer']));
    $this->post('/cms/commerce/settings/payments/move', ['key' => 'test_transfer', 'direction' => 'up']);
    $this->put('/cms/commerce/settings/payments/fake_gateway/active', ['active' => false]);
    $this->put('/cms/commerce/settings/payments/test_transfer', ['values' => ['active' => true, 'title' => ['id' => 'Transfer BCA'], 'countries' => 'id, sg', 'account' => '777']])
        ->assertRedirect('/cms/commerce/settings/payments');
    app()->forgetScopedInstances();
    expect(app(StoreSettings::class)->get('payments.order'))->toBe(['bank_transfer', 'cod', 'test_transfer', 'fake_gateway'])
        ->and(app(StoreSettings::class)->get('payments.methods.fake_gateway.active'))->toBeFalse()
        ->and(app(StoreSettings::class)->get('payments.methods.test_transfer.countries'))->toBe(['ID', 'SG'])
        ->and(app(StoreSettings::class)->get('payments.methods.test_transfer.account'))->toBe('777');
});

it('adds and removes payment instruction methods', function () {
    actingAsUserWith(['commerce.settings.payments']);
    $this->post('/cms/commerce/settings/payments/instances', ['type' => 'instructions'])->assertRedirect();
    app()->forgetScopedInstances();
    $key = app(StoreSettings::class)->get('payments.instances.instructions')[0];
    expect($key)->toStartWith('instructions_');
    $this->put("/cms/commerce/settings/payments/{$key}", ['values' => ['active' => true, 'title' => ['id' => 'QRIS'], 'instructions' => ['id' => 'Pindai kode QR.']]])->assertRedirect();
    app()->forgetScopedInstances();
    expect(PaymentManager::titleOf(app(PaymentManager::class)->get($key)))->toBe('QRIS');
    $this->delete("/cms/commerce/settings/payments/{$key}")->assertRedirect();
    app()->forgetScopedInstances();
    expect(app(PaymentManager::class)->get($key))->toBeNull();
});

/** RecordPaymentResult failing for the given payment ids (a broken listener, a lost database connection…). */
function failRecordingFor(array $paymentIds): void
{
    app()->bind(RecordPaymentResult::class, fn ($app) => new class($paymentIds, $app->make(OrderStateMachine::class), $app->make(Timeline::class)) extends RecordPaymentResult
    {
        /** @param  array<int, int>  $failing */
        public function __construct(public array $failing, $states, $timeline)
        {
            parent::__construct($states, $timeline);
        }

        public function handle(Payment $payment, PaymentResult $result, ?Actor $actor = null): bool
        {
            if (in_array($payment->id, $this->failing, true)) {
                throw new RuntimeException('Recording failed.');
            }

            return parent::handle($payment, $result, $actor);
        }
    });
}

it('processes the gateway\'s retry of a webhook that failed while recording', function () {
    $order = placeWithGateway($this->mug);
    $ref = fakeReference($order);

    failRecordingFor([$order->payments()->value('id')]);
    webhook(['event_id' => 'evt-9', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200])->assertStatus(500);
    expect($order->fresh()->payment_status)->toBe('unpaid');

    app()->offsetUnset(RecordPaymentResult::class);
    webhook(['event_id' => 'evt-9', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200])->assertOk()->assertJsonMissing(['duplicate' => true]);
    expect($order->fresh()->payment_status)->toBe('paid')
        ->and(WebhookCall::query()->orderBy('id')->get(['status', 'event_id', 'error'])->map(fn ($c) => [$c->status, $c->event_id])->all())
        ->toBe([['failed', null], ['processed', 'evt-9']])
        ->and(WebhookCall::query()->orderBy('id')->value('error'))->toStartWith('event evt-9: ');
});

it('doesn\'t settle a payment the gateway reports as less than due', function () {
    $order = placeWithGateway($this->mug);

    webhook(['event_id' => 'evt-short', 'reference' => fakeReference($order), 'status' => 'paid', 'amount' => 1000])->assertOk();
    $order->refresh();
    expect([$order->status, $order->payment_status, $order->paid_total])->toBe(['pending', 'unpaid', 0])
        ->and($order->payments->sole()->status)->toBe('pending')
        ->and(WebhookCall::query()->sole()->status)->toBe('ignored')
        ->and($order->events()->where('type', 'note')->latest('id')->value('message'))->toContain('1.000');
});

it('flags a payment that arrives after the deadline cancelled the order, without fulfilling it', function () {
    app(StoreSettings::class)->saveSection('general', ['name' => 'Toko Sunrice', 'email' => 'toko@example.com']);
    $order = placeWithGateway($this->mug);
    $ref = fakeReference($order);
    $this->travel(25)->hours();
    $this->artisan('commerce:tick');
    expect($order->fresh()->status)->toBe('cancelled')
        ->and($this->mug->fresh()->stock_quantity)->toBe(5);

    Notification::fake();
    Event::fake([OrderPaid::class]);
    webhook(['event_id' => 'evt-late', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200])->assertOk();

    $order->refresh();
    expect([$order->status, $order->payment_status, $order->paid_total])->toBe(['cancelled', 'paid', 61200])
        ->and($this->mug->fresh()->stock_quantity)->toBe(5)
        ->and($order->events()->where('type', 'note')->latest('id')->value('message'))->toContain('setelah pesanan dibatalkan');
    Event::assertNotDispatched(OrderPaid::class);
    Notification::assertSentOnDemand(StoreEmail::class, fn (StoreEmail $n, array $c, $notifiable) => $n->key === 'staff_paid_after_cancel' && $notifiable->routes['mail'] === 'toko@example.com');
});

it('keeps expiring other payments when one of them fails', function () {
    $orders = [];
    foreach (['a@example.com', 'b@example.com'] as $email) {
        $cart = cartWith([[$this->mug, 1]]);
        $input = checkoutInput(['email' => $email, 'payment_method' => 'test_transfer']);
        $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)]);
        $orders[] = Order::query()->where('email', $email)->sole();
    }

    failRecordingFor([$orders[0]->payments()->value('id')]);
    $this->travel(25)->hours();
    $this->artisan('commerce:tick');

    expect($orders[0]->fresh()->status)->toBe('pending')
        ->and($orders[1]->fresh()->status)->toBe('cancelled');
});
