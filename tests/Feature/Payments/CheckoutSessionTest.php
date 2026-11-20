<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Event;
use Sunrice\Commerce\Checkout\Actions\ResolveCheckoutSession;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Orders\Expiry;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Contracts\StartsCheckoutSession;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Commerce\FakeRedirectGateway;

class CheckoutSessionGateway extends FakeRedirectGateway implements StartsCheckoutSession
{
    public static ?string $checkoutStatus = null;

    public static bool $cancelled = true;

    public static int $cancellations = 0;

    public function checkoutStatus(Payment $payment): ?PaymentResult
    {
        return static::$checkoutStatus === null ? null : new PaymentResult(static::$checkoutStatus, null, $payment->reference);
    }

    public function cancelCheckoutSession(Payment $payment): bool
    {
        static::$cancellations++;

        return static::$cancelled;
    }
}

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
    CheckoutSessionGateway::$checkoutStatus = null;
    CheckoutSessionGateway::$cancelled = true;
    CheckoutSessionGateway::$cancellations = 0;
    app(Commerce::class)->registerPaymentMethod(CheckoutSessionGateway::class);
    $settings = app(StoreSettings::class);
    $settings->saveSection('payments', ['methods' => [...(array) $settings->get('payments.methods'), 'fake_redirect' => ['active' => true]]]);

    $this->voucher = Voucher::query()->create(['name' => 'Hemat', 'code' => 'HEMAT', 'type' => 'fixed_cart', 'value' => 5000, 'usage_limit' => 1]);
    $this->cart = cartWith([[$this->mug, 1]]);
    $this->cart->update(['vouchers' => ['HEMAT']]);
    $this->input = checkoutInput(['payment_method' => 'fake_redirect']);
    Event::fake([OrderPlaced::class]);
    $this->post('/checkout', [...$this->input, 'action' => 'place', 'totals_hash' => seenHash($this->cart, $this->input)])
        ->assertRedirectContains('https://redirect.example/');
    $this->draft = Order::onlyTrashed()->where('type', ResolveCheckoutSession::TYPE)->sole();
});

it('preserves checkout until Midtrans can confirm the unused payment session was cancelled', function () {
    expect(Order::query()->count())->toBe(0)
        ->and($this->draft->number)->toBeNull()
        ->and($this->draft->placed_at)->toBeNull()
        ->and($this->cart->fresh()->status)->toBe('active')
        ->and($this->mug->fresh()->stock_quantity)->toBe(4)
        ->and($this->voucher->fresh()->times_used)->toBe(1);
    Event::assertNotDispatched(OrderPlaced::class);

    $this->get('/cart')->assertRedirect('/checkout');
    $this->get('/checkout')->assertOk()->assertSee('Jl. Sarijadi 1');
    expect(Order::withTrashed()->count())->toBe(0)
        ->and($this->cart->fresh()->checkout)->toMatchArray(['payment_method' => 'fake_redirect', 'shipping_rate' => $this->input['shipping_rate']])
        ->and($this->cart->fresh()->items()->count())->toBe(1)
        ->and($this->cart->fresh()->vouchers)->toBe(['HEMAT'])
        ->and($this->mug->fresh()->stock_quantity)->toBe(5)
        ->and($this->voucher->fresh()->times_used)->toBe(0)
        ->and(CheckoutSessionGateway::$cancellations)->toBe(1);

    $changed = checkoutInput(['shipping_address' => ['line1' => 'Jl. Baru 2']]);
    $this->post('/checkout', [...$changed, 'action' => 'place', 'totals_hash' => seenHash($this->cart, $changed)])->assertRedirect();
    expect(Order::query()->sole()->shipping_address['line1'])->toBe('Jl. Baru 2');
    Event::assertDispatchedTimes(OrderPlaced::class, 1);
});

it('keeps a pending payment with the original order snapshot', function () {
    CheckoutSessionGateway::$checkoutStatus = 'pending';

    $this->get('/checkout')->assertRedirect($this->draft->url());
    $order = Order::query()->sole();
    expect($order->id)->toBe($this->draft->id)
        ->and($order->total)->toBe($this->draft->total)
        ->and($order->number)->not->toBeNull()
        ->and($order->placed_at)->not->toBeNull()
        ->and($order->payment()->reference)->toBe($this->draft->payment()->reference)
        ->and($this->cart->fresh()->status)->toBe('converted')
        ->and(CheckoutSessionGateway::$cancellations)->toBe(0);
    $this->get($order->url())->assertOk()->assertSee($order->payment()->instructions['url'], false);
    $this->get($order->url().'/pay')->assertRedirect($order->url());
    $this->from($order->url())->post($order->url().'/pay', ['payment_method' => 'test_transfer'])
        ->assertRedirect($order->url())->assertSessionHas('commerce.error');
    expect($order->payments()->count())->toBe(1);

    Event::assertDispatchedTimes(OrderPlaced::class, 1);
});

it('protects the checkout while the gateway cannot confirm that editing is safe', function () {
    CheckoutSessionGateway::$cancelled = false;

    $this->get('/checkout')->assertOk()->assertSee(__('commerce::checkout.retry_payment_status'));
    expect(Order::query()->count())->toBe(0)
        ->and($this->cart->fresh()->status)->toBe('active');
    Event::assertNotDispatched(OrderPlaced::class);

    CheckoutSessionGateway::$cancelled = true;
    $this->get('/checkout')->assertOk()->assertSee('Jl. Sarijadi 1');
    expect(Order::withTrashed()->count())->toBe(0);
});

it('places a paid draft once when Midtrans confirms the webhook before browser return', function () {
    CheckoutSessionGateway::$checkoutStatus = 'paid';
    $payment = $this->draft->payment();
    $hook = ['reference' => $payment->reference, 'paid' => $payment->amount];

    $this->postJson('/commerce/webhooks/fake_redirect', $hook)->assertOk();
    $this->postJson('/commerce/webhooks/fake_redirect', $hook)->assertOk()->assertJson(['duplicate' => true]);
    $this->get('/checkout')->assertRedirect($this->draft->url());

    expect(Order::query()->sole()->payment_status)->toBe('paid')
        ->and(CheckoutSessionGateway::$cancellations)->toBe(0);
    Event::assertDispatchedTimes(OrderPlaced::class, 1);
});

it('keeps an overdue order pending while the gateway still accepts its payment', function () {
    CheckoutSessionGateway::$checkoutStatus = 'pending';

    $this->get("/order/{$this->draft->order_key}/payment/return")->assertRedirect($this->draft->url());
    $order = Order::query()->sole();
    $order->payment()->update(['expires_at' => now()->subMinute()]);
    app(Expiry::class)->payments();

    expect($order->fresh()->status)->toBe('pending')
        ->and($order->payment()->status)->toBe('pending')
        ->and(CheckoutSessionGateway::$cancellations)->toBe(0);
});
