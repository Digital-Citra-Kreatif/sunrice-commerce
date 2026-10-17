<?php

declare(strict_types=1);

use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Catalog\Models\DownloadFile;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Customers\Events\AccountDeletionRequested;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Inventory\Events\StockLow;
use Sunrice\Commerce\Inventory\Events\StockOut;
use Sunrice\Commerce\Notifications\EmailSettings;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Actions\AddOrderNote;
use Sunrice\Commerce\Orders\Actions\CreateShipment;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actions\RespondToQuote;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderEdited;
use Sunrice\Commerce\Orders\Events\PaymentLinkRequested;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Actions\ReviewPaymentConfirmation;
use Sunrice\Commerce\Payments\Actions\SubmitPaymentConfirmation;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    Storage::fake('local');
    $this->mug = checkoutStore();
    app(StoreSettings::class)->saveSection('general', ['name' => 'Toko Sunrice', 'email' => 'toko@example.com']);
});

/** The store emails sent, as [key, to]. */
function emailsTo(string $key): array
{
    $to = [];
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n, array $channels, AnonymousNotifiable $notifiable) use ($key, &$to) {
        if ($n->key === $key) {
            $to[] = $notifiable->routes['mail'];
        }

        return true;
    });

    return $to;
}

function placeOrderFor(Variant $mug, array $input = []): Order
{
    app()->forgetScopedInstances();
    $cart = cartWith([[$mug, 1]]);

    return app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput($input)), null)->order;
}

it('sends the expected emails through an order\'s life, in order', function () {
    Notification::fake();
    $order = placeOrderFor($this->mug);
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid());
    app(CreateShipment::class)->handle($order->fresh(), ['courier' => 'jne', 'tracking_number' => 'JNE1'], [['order_item_id' => $order->items->sole()->id, 'quantity' => 1]], Actor::admin());
    app(AddOrderNote::class)->handle($order->fresh(), 'Terima kasih!', true, Actor::admin());
    app(AddOrderNote::class)->handle($order->fresh(), 'internal only', false, Actor::admin());
    app(OrderStateMachine::class)->transition($order->fresh(), 'completed', Actor::admin());
    app(RecordRefund::class)->handle($order->fresh(), 10000, [], 'Goodwill', false, Actor::admin());

    $keys = [];
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n) use (&$keys) {
        $keys[] = $n->key;

        return true;
    });
    expect($keys)->toBe(['order_received', 'staff_new_order', 'payment_received', 'order_shipped', 'customer_note', 'order_completed', 'order_refunded'])
        ->and($order->events()->where('type', 'email')->count())->toBe(7);
});

it('does not send switched-off emails, but always sends security ones', function () {
    Notification::fake();
    app(StoreSettings::class)->saveSection('emails', ['order_received' => ['enabled' => false], 'verify_email' => ['enabled' => false]]);
    placeOrderFor($this->mug);
    expect(emailsTo('order_received'))->toBe([])->and(emailsTo('staff_new_order'))->toBe(['toko@example.com']);
    expect(app(EmailSettings::class)->enabled('verify_email'))->toBeTrue();
});

it('sends staff emails to the addresses and to users with the roles, once each', function () {
    Notification::fake();
    $role = Role::findOrCreate('Shop Manager', 'web');
    $ana = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
    $ana->assignRole($role);
    $dup = User::query()->create(['name' => 'Ops', 'email' => 'ops@example.com', 'password' => 'x']);
    $dup->assignRole($role);
    app(StoreSettings::class)->saveSection('emails', ['staff_new_order' => ['addresses' => ['ops@example.com', 'boss@example.com'], 'roles' => ['Shop Manager']]]);
    placeOrderFor($this->mug);
    expect(emailsTo('staff_new_order'))->toEqualCanonicalizing(['ops@example.com', 'boss@example.com', 'ana@example.com']);
});

it('writes the subject in the order\'s language and attaches the invoice when set', function () {
    Notification::fake();
    $order = placeOrderFor($this->mug);
    $order->forceFill(['locale' => 'en'])->save();
    app(StoreSettings::class)->saveSection('emails', ['payment_received' => ['subject' => ['id' => 'Lunas: :number']]]);
    app(Notifier::class)->send('payment_received', $order->fresh());

    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n) use ($order) {
        if ($n->key !== 'payment_received') {
            return false;
        }
        $mail = $n->toMail(null);
        expect($mail->subject)->toBe("Payment received for {$order->number}")
            ->and($mail->rawAttachments[0]['name'] ?? null)->toEndWith('-invoice.pdf');

        return true;
    });
    $id = (new StoreEmail('payment_received', $order->fresh(), lang: 'id'))->toMail(null);
    expect($id->subject)->toBe("Lunas: {$order->number}");
});

it('previews and sends a test from Settings → Emails', function () {
    placeOrderFor($this->mug);
    actingAsUserWith(['commerce.settings.emails']);
    $this->get('/cms/commerce/settings/emails')->assertOk()->assertInertia(fn ($p) => $p->component('Commerce/Settings/Emails'));
    $this->get('/cms/commerce/settings/emails/order_received/preview')->assertOk()->assertSee('Terima kasih atas pesanan Anda')->assertSee('Mug');
    $this->put('/cms/commerce/settings/emails/order_received', ['values' => ['enabled' => true, 'subject' => ['id' => 'Pesanan :number diterima']]])->assertRedirect();
    app()->forgetScopedInstances();
    expect(app(StoreSettings::class)->get('emails.order_received.subject.id'))->toBe('Pesanan :number diterima');

    Notification::fake();
    $this->post('/cms/commerce/settings/emails/order_received/test')->assertSessionHas('success');
    Notification::assertSentOnDemand(StoreEmail::class, fn (StoreEmail $n, $c, $notifiable) => $notifiable->routes['mail'] === 'staff@example.com');
    $this->put('/cms/commerce/settings/emails/staff_new_order', ['values' => ['addresses' => 'not-an-email']])->assertSessionHasErrors('values.addresses');
});

it('delivers downloads as attachments when small, links when large, and not by email for account-only products', function () {
    Notification::fake();
    $ebook = Variant::factory()->create(['product_id' => $this->mug->product_id, 'sku' => 'EBOOK', 'price' => 30000, 'uid' => 'ebook', 'requires_shipping' => false, 'downloadable' => true]);
    Storage::disk('local')->put('small.pdf', 'pdf');
    Storage::disk('local')->put('big.zip', 'zip');
    $small = DownloadFile::query()->create(['product_id' => $ebook->product_id, 'variant_id' => $ebook->id, 'type' => 'file', 'name' => 'Small', 'disk' => 'local', 'path' => 'small.pdf', 'filename' => 'small.pdf', 'size' => 1000, 'attached' => true]);
    DownloadFile::query()->create(['product_id' => $ebook->product_id, 'variant_id' => $ebook->id, 'type' => 'file', 'name' => 'Big', 'disk' => 'local', 'path' => 'big.zip', 'filename' => 'big.zip', 'size' => 50 * 1024 * 1024, 'attached' => true]);
    $ebook->product->forceFill(['delivery' => ['modes' => ['attachment', 'link']]])->save();

    $order = placeOrderFor($ebook, ['shipping_rate' => null]);
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid());

    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n) {
        if ($n->key !== 'downloads_ready') {
            return false;
        }
        $mail = $n->toMail(null);
        $html = (string) $mail->render();
        expect(array_column($mail->rawAttachments, 'name'))->toBe(['small.pdf'])
            ->and($html)->toContain('/downloads/')->toContain('Big');

        return true;
    });
    expect($order->events()->where('type', 'email')->where('message', 'like', '%Downloads%')->exists())->toBeTrue();

    // Account-only delivery: no files or links in the email.
    $ebook->product->forceFill(['delivery' => ['modes' => ['account']]])->save();
    $grants = DownloadGrant::query()->with('file', 'item.product')->get()->all();
    $mail = (new StoreEmail('downloads_ready', $order->fresh(), context: ['grants' => $grants], lang: 'id'))->toMail(null);
    app()->setLocale('id');
    expect($mail->rawAttachments)->toBe([])->and((string) $mail->render())->not->toContain('/downloads/')->toContain('Akun Saya');
});

it('sends the remaining emails from their triggers', function () {
    Notification::fake();
    $keys = function (): array {
        $out = [];
        Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n, $c, $notifiable) use (&$out) {
            $out[] = $n->key.' → '.$notifiable->routes['mail'];

            return true;
        });

        return $out;
    };

    // Cancellation by the customer.
    $order = placeOrderFor($this->mug);
    app(OrderStateMachine::class)->transition($order, 'cancelled', Actor::customer(), 'Salah pesan');
    expect($keys())->toContain('order_cancelled → rina@example.com', 'staff_order_cancelled → toko@example.com');

    // Payment link and an edit the customer is told about.
    PaymentLinkRequested::dispatch($order);
    OrderEdited::dispatch($order, ['Mug: 1 → 2'], true);
    OrderEdited::dispatch($order, ['quiet'], false);
    expect(array_filter($keys(), fn ($k) => str_starts_with($k, 'order_updated')))->toHaveCount(1)
        ->and($keys())->toContain('payment_link → rina@example.com');

    // Stock and account deletion go to staff.
    StockLow::dispatch($this->mug, 6, 2);
    StockOut::dispatch($this->mug, 1, 0);
    AccountDeletionRequested::dispatch($order->customer);
    expect($keys())->toContain('staff_low_stock → toko@example.com', 'staff_out_of_stock → toko@example.com', 'staff_deletion_request → toko@example.com');

    // Quotes.
    app(StoreSettings::class)->saveSection('general', ['selling_mode' => 'quote']);
    $quote = placeOrderFor($this->mug, ['payment_method' => null, 'shipping_rate' => null]);
    expect($keys())->toContain('quote_received → rina@example.com', 'staff_new_quote → toko@example.com');
    app(RespondToQuote::class)->handle($quote, [['item_id' => $quote->items->sole()->id, 'variant_id' => $this->mug->id, 'quantity' => 1]], null, null, null, Actor::admin(), null);
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n) {
        if ($n->key === 'quote_ready') {
            expect($n->toMail(null)->rawAttachments[0]['name'])->toEndWith('-quotation.pdf');
        }

        return true;
    });
    expect($keys())->toContain('quote_ready → rina@example.com');
});

it('emails the customer about a confirmation and its rejection, and staff to verify', function () {
    Notification::fake();
    app(StoreSettings::class)->saveSection('payments', ['methods' => ['bank_transfer' => ['active' => true, 'confirmation' => 'optional', 'accounts' => [['bank' => 'bca', 'number' => '1', 'holder' => 'X']]]]]);
    $order = placeOrderFor($this->mug, ['payment_method' => 'bank_transfer']);
    $confirmation = app(SubmitPaymentConfirmation::class)->handle($order, ['sender_name' => 'Rina', 'amount' => $order->total, 'transferred_at' => now()->toDateString(), 'account' => 0], null);
    app(ReviewPaymentConfirmation::class)->reject($confirmation, 'Belum masuk', Actor::admin());

    $sent = [];
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n, $c, $notifiable) use (&$sent) {
        $sent[] = $n->key.' → '.$notifiable->routes['mail'];
        if ($n->key === 'payment_rejected') {
            app()->setLocale('id');
            expect((string) $n->toMail(null)->render())->toContain('Belum masuk')->toContain('/confirm-payment?order=');
        }

        return true;
    });
    expect($sent)->toContain('payment_confirmation_received → rina@example.com', 'staff_payment_confirmation → toko@example.com', 'payment_rejected → rina@example.com');
});
