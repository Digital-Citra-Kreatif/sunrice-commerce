<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Events\PaymentConfirmationSubmitted;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Payments\ProofFiles;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    Storage::fake('local');
    $this->mug = checkoutStore();
    app(StoreSettings::class)->saveSection('payments', ['methods' => ['bank_transfer' => ['active' => true, 'confirmation' => 'required', 'deadline_hours' => 24,
        'accounts' => [['bank' => 'bca', 'number' => '123', 'holder' => 'PT Toko']]]]]);
    app()->forgetScopedInstances();
    $cart = cartWith([[$this->mug, 1]]);
    $this->order = app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput(['payment_method' => 'bank_transfer'])), null)->order;
});

function confirmPayment(Order $order, array $overrides = [], ?UploadedFile $proof = null): TestResponse
{
    return test()->post('/confirm-payment', ['order' => $order->order_key, 'sender_name' => 'Rina', 'amount' => $order->total, 'transferred_at' => now()->toDateString(),
        'account' => 0, 'proof' => $proof ?? UploadedFile::fake()->create('proof.pdf', 100, 'application/pdf'), ...$overrides]);
}

it('submits, pauses the deadline, and approving pays the order', function () {
    Event::fake([PaymentConfirmationSubmitted::class, OrderPaid::class]);
    $this->get($this->order->url())->assertSee('confirm-payment?order='.$this->order->order_key, false);
    $this->get('/confirm-payment?order='.$this->order->order_key)->assertOk()->assertSee('BCA');

    confirmPayment($this->order)->assertRedirect($this->order->url());
    $confirmation = PaymentConfirmation::query()->sole();
    expect($this->order->fresh()->payment_status)->toBe('awaiting_confirmation')
        ->and($confirmation->destination['number'])->toBe('123')
        ->and(Storage::disk('local')->exists($confirmation->proof_path))->toBeTrue()
        ->and($confirmation->proof_path)->toStartWith("commerce/proofs/{$this->order->id}/");
    Event::assertDispatched(PaymentConfirmationSubmitted::class);

    // The deadline is paused while it waits.
    $this->travel(30)->hours();
    $this->artisan('commerce:tick');
    expect($this->order->fresh()->status)->toBe('pending');

    actingAsUserWith(['commerce.payments.verify']);
    $this->get('/cms/commerce/confirmations')->assertOk()->assertInertia(fn ($p) => $p->where('confirmations.0.id', $confirmation->id));
    $this->post("/cms/commerce/confirmations/{$confirmation->id}/approve")->assertSessionHas('success');
    $order = $this->order->fresh();
    expect([$order->status, $order->payment_status, $order->paid_total])->toBe(['processing', 'paid', $order->total])
        ->and($confirmation->fresh()->status)->toBe('approved');
    Event::assertDispatched(OrderPaid::class);
});

it('needs "approve anyway" for less than expected, and rejecting resumes the deadline', function () {
    confirmPayment($this->order, ['amount' => 10000]);
    $confirmation = PaymentConfirmation::query()->sole();
    $deadline = $this->order->payments->sole()->expires_at;
    actingAsUserWith(['commerce.payments.verify']);

    $this->post("/cms/commerce/confirmations/{$confirmation->id}/approve")->assertSessionHas('error');
    expect($this->order->fresh()->payment_status)->toBe('awaiting_confirmation');

    $this->travel(2)->hours();
    $this->post("/cms/commerce/confirmations/{$confirmation->id}/reject", ['reason' => 'Belum masuk'])->assertSessionHas('success');
    $payment = $this->order->payments()->sole();
    expect($this->order->fresh()->payment_status)->toBe('unpaid')
        ->and($payment->status)->toBe('pending')
        ->and($payment->expires_at->diffInMinutes($deadline->copy()->addHours(2)))->toBeLessThan(1.0)
        ->and($confirmation->fresh()->review_note)->toBe('Belum masuk');

    // A new confirmation, approved anyway.
    confirmPayment($this->order, ['amount' => 10000]);
    $again = PaymentConfirmation::query()->latest('id')->first();
    $this->post("/cms/commerce/confirmations/{$again->id}/approve", ['anyway' => true])->assertSessionHas('success');
    expect($this->order->fresh()->payment_status)->toBe('paid');
});

it('keeps proofs private and lets only verifiers see them', function () {
    confirmPayment($this->order);
    $confirmation = PaymentConfirmation::query()->sole();
    $this->get('/storage/'.$confirmation->proof_path)->assertNotFound();

    actingAsUserWith(['commerce.orders.view']);
    $this->get("/cms/commerce/confirmations/{$confirmation->id}/proof")->assertForbidden();
    $this->post("/cms/commerce/confirmations/{$confirmation->id}/approve")->assertForbidden();
    actingAsUserWith(['commerce.payments.verify'], 'verifier@example.com');
    $this->get("/cms/commerce/confirmations/{$confirmation->id}/proof")->assertOk()->assertHeader('X-Content-Type-Options', 'nosniff');
});

it('validates the confirmation and refuses orders not waiting for one', function () {
    confirmPayment($this->order, ['sender_name' => '', 'proof' => UploadedFile::fake()->create('x.exe', 10)])->assertSessionHasErrors(['sender_name', 'proof']);
    $this->post('/confirm-payment', ['order' => $this->order->order_key, 'sender_name' => 'Rina', 'amount' => 1, 'transferred_at' => now()->toDateString(), 'account' => 0])
        ->assertSessionHasErrors('proof');  // required by the setting

    $this->post('/confirm-payment/lookup', ['number' => $this->order->number, 'email' => 'rina@example.com'])
        ->assertRedirect('/confirm-payment?order='.$this->order->order_key);
});

it('re-encodes images, dropping what they carried', function () {
    if (! extension_loaded('gd') && ! extension_loaded('imagick')) {
        $this->markTestSkipped('Needs GD or Imagick.');
    }
    $file = UploadedFile::fake()->image('proof.jpg', 40, 40);
    file_put_contents($file->getRealPath(), file_get_contents($file->getRealPath()).'<?php echo "hidden"; ?>');
    $stored = app(ProofFiles::class)->store($file, 1);
    expect(Storage::disk($stored['disk'])->get($stored['path']))->not->toContain('<?php');
});
