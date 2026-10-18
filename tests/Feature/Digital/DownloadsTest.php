<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Sunrice\Commerce\Catalog\Models\DownloadFile;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Customers\Actions\LinkGuestOrders;
use Sunrice\Commerce\Digital\Events\DownloadsGranted;
use Sunrice\Commerce\Digital\Listeners\GrantDownloads;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Digital\Models\DownloadLog;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    Storage::fake('local');
    checkoutStore();
    $this->ebook = Variant::factory()->create(['product_id' => Variant::query()->value('product_id'), 'sku' => 'EBOOK', 'price' => 30000, 'uid' => 'ebook',
        'requires_shipping' => false, 'downloadable' => true]);
    Storage::disk('local')->put('commerce/downloads/ebook.pdf', '%PDF-1.4 ebook');
    $this->file = DownloadFile::query()->create(['product_id' => $this->ebook->product_id, 'variant_id' => $this->ebook->id, 'type' => 'file', 'name' => 'E-book',
        'disk' => 'local', 'path' => 'commerce/downloads/ebook.pdf', 'filename' => 'ebook.pdf', 'attached' => true]);
    app(StoreSettings::class)->saveSection('digital', ['download_limit' => 2, 'expiry_days' => 7]);
});

function paidEbookOrder(Variant $ebook): Order
{
    app()->forgetScopedInstances();
    $cart = cartWith([[$ebook, 1]]);
    $order = app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput(['shipping_rate' => null])), null)->order;
    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid());

    return $order->refresh();
}

it('grants once when paid and counts downloads to the limit', function () {
    Event::fake([DownloadsGranted::class]);
    $order = paidEbookOrder($this->ebook);
    $grant = DownloadGrant::query()->sole();
    expect($grant->downloads_remaining)->toBe(2)->and($grant->expires_at->isFuture())->toBeTrue()->and($grant->email)->toBe('rina@example.com');
    Event::assertDispatchedTimes(DownloadsGranted::class, 1);

    // Granting again (a repeated event) adds nothing.
    app(GrantDownloads::class)->grant($order);
    expect(DownloadGrant::query()->count())->toBe(1);

    // A guest downloads by token, without an account.
    $this->get("/downloads/{$grant->token}")->assertOk()->assertDownload('ebook.pdf');
    $this->get("/downloads/{$grant->token}")->assertOk();
    $this->get("/downloads/{$grant->token}")->assertStatus(410);
    expect($grant->fresh()->download_count)->toBe(2)->and($grant->fresh()->downloads_remaining)->toBe(0)
        ->and(DownloadLog::query()->count())->toBe(2);
    $this->get($order->url())->assertSee('E-book');
});

it('refuses expired and revoked grants, and keeps working with the module off', function () {
    paidEbookOrder($this->ebook);
    $grant = DownloadGrant::query()->sole();
    app(ToggleFeature::class)->handle('digital', false);
    $this->get("/downloads/{$grant->token}")->assertOk();

    $this->travel(8)->days();
    $this->get("/downloads/{$grant->token}")->assertStatus(410);
    $this->travelBack();
    $grant->update(['revoked_at' => now()]);
    $this->get("/downloads/{$grant->token}")->assertStatus(410);
    $this->get('/downloads/'.str_repeat('x', 64))->assertNotFound();
});

it('redirects to external links and to temporary URLs on cloud disks', function () {
    $this->file->update(['type' => 'url', 'url' => 'https://files.example/ebook.pdf', 'disk' => null, 'path' => null]);
    paidEbookOrder($this->ebook);
    $this->get('/downloads/'.DownloadGrant::query()->sole()->token)->assertRedirect('https://files.example/ebook.pdf');

    config(['filesystems.disks.s3' => ['driver' => 's3']]);
    Storage::fake('s3');
    Storage::disk('s3')->put('ebook.pdf', 'x');
    Storage::disk('s3')->buildTemporaryUrlsUsing(fn (string $path) => "https://s3.example/{$path}?signed=1");
    $this->file->update(['type' => 'file', 'url' => null, 'disk' => 's3', 'path' => 'ebook.pdf']);
    $this->get('/downloads/'.DownloadGrant::query()->sole()->token)->assertRedirect('https://s3.example/ebook.pdf?signed=1');
});

it('lists downloads in My Account and lets staff manage grants', function () {
    $order = paidEbookOrder($this->ebook);
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => bcrypt('x'), 'email_verified_at' => now()]);
    app(LinkGuestOrders::class)->handle($user);
    Auth::guard('commerce')->login($user);
    $this->get('/account/downloads')->assertOk()->assertSee('E-book')->assertSee(DownloadGrant::query()->sole()->token);

    $grant = DownloadGrant::query()->sole();
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.edit']);
    $this->post("/cms/commerce/orders/{$order->id}/downloads/{$grant->id}", ['action' => 'revoke'])->assertSessionHas('success');
    expect($grant->fresh()->revoked_at)->not->toBeNull();
    $this->post("/cms/commerce/orders/{$order->id}/downloads/{$grant->id}", ['action' => 'reset', 'limit' => 5]);
    expect($grant->fresh()->downloads_remaining)->toBe(5)->and($grant->fresh()->revoked_at)->toBeNull();
    $this->post("/cms/commerce/orders/{$order->id}/downloads/{$grant->id}", ['action' => 'extend', 'days' => 30]);
    expect((int) round(now()->diffInDays($grant->fresh()->expires_at)))->toBe(37);
});
