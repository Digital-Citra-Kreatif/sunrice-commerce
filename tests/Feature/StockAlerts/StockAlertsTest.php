<?php

declare(strict_types=1);

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Customers\Actions\AnonymizeCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Inventory\Actions\AdjustStock;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\StockAlerts\Actions\SendStockAlerts;
use Sunrice\Commerce\StockAlerts\Models\StockAlert;
use Workbench\App\Models\User;

beforeEach(function () {
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
    app(AdjustStock::class)->handle($this->mug, 0, set: true);
});

it('asks to be emailed when a sold-out product is back, once per address', function () {
    $this->get('/products/mug')->assertOk()->assertSee('Kabari saya saat tersedia')->assertSee('name="variant" value="'.$this->mug->id.'"', false);

    $this->post('/stock-alerts', ['variant' => $this->mug->id, 'email' => 'Rina@Example.com'])->assertSessionHas('commerce.success');
    $this->post('/stock-alerts', ['variant' => $this->mug->id, 'email' => 'rina@example.com']);
    expect(StockAlert::query()->sole())->email->toBe('rina@example.com')->locale->toBe('id')->notified_at->toBeNull();

    $this->post('/stock-alerts', ['variant' => $this->mug->id])->assertSessionHasErrors('email');
    $this->post('/stock-alerts', ['variant' => 999, 'email' => 'x@example.com'])->assertNotFound();

    app(AdjustStock::class)->handle($this->mug, 3, set: true);
    $this->get('/products/mug')->assertDontSee('Kabari saya saat tersedia');
    $this->post('/stock-alerts', ['variant' => $this->mug->id, 'email' => 'x@example.com'])->assertSessionHasErrors(['variant' => 'Produk ini sudah bisa dipesan.']);
});

it('emails everyone waiting once the variant can be ordered again, and only once', function () {
    Notification::fake();
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'rina@example.com', 'locale' => 'en']);

    $this->artisan('commerce:tick')->assertSuccessful();
    Notification::assertNothingSent();

    app(AdjustStock::class)->handle($this->mug, 5, set: true);
    $this->artisan('commerce:tick')->assertSuccessful();
    $this->artisan('commerce:tick')->assertSuccessful();

    Notification::assertSentOnDemandTimes(StoreEmail::class, 1);
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n, array $channels, AnonymousNotifiable $notifiable) {
        $mail = $n->toMail($notifiable);

        return $n->key === 'back_in_stock' && $notifiable->routes['mail'] === 'rina@example.com' && $n->locale === 'en'
            && $mail->subject === 'Back in stock: Mug' && $mail->viewData['action']['url'] === url('/products/mug');
    });
    expect(StockAlert::query()->sole()->notified_at)->not->toBeNull();
});

it('takes alerts from signed-in customers without asking their email, and shows staff who waits', function () {
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->actingAs($user, 'commerce');
    $this->get('/products/mug')->assertDontSee('name="email"', false);
    $this->post('/stock-alerts', ['variant' => $this->mug->id])->assertSessionHasNoErrors();
    expect(StockAlert::query()->sole())->email->toBe('ana@example.com')->customer_id->toBe(Customer::forUser($user)->id);

    actingAsUserWith(['commerce.inventory.view']);
    $this->get('/admin/commerce/inventory?filters[waiting]=yes')->assertOk()->assertInertia(fn ($page) => $page
        ->where('rows.total', 1)->where('rows.data.0.waiting', 1)->where('columns.4.key', 'waiting'));

    app(AnonymizeCustomer::class)->handle(Customer::forUser($user));
    expect(StockAlert::query()->count())->toBe(0);
});

it('lists only the sold-out variants of a variable product', function () {
    publishProduct(['type' => 'variable', 'options' => [['id' => 'size', 'name' => 'Ukuran', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]]], 'variants' => [
        ['id' => 'v-s', 'options' => ['size' => 's'], 'sku' => 'TS-S', 'price' => 90000, 'track_stock' => true, 'initial_stock' => 0],
        ['id' => 'v-m', 'options' => ['size' => 'm'], 'sku' => 'TS-M', 'price' => 90000, 'track_stock' => true, 'initial_stock' => 4],
    ]], title: 'Tee');
    $small = Variant::query()->where('sku', 'TS-S')->sole();

    $page = $this->get('/products/tee')->assertOk();
    expect($page->getContent())->toContain('<option value="'.$small->id.'"')
        ->not->toContain('<option value="'.Variant::query()->where('sku', 'TS-M')->value('id').'"');
});

it('prunes sent and stale alerts, and takes none while the module is off', function () {
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'old@example.com', 'notified_at' => now()->subDays(31)]);
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'stale@example.com'])->forceFill(['created_at' => now()->subDays(181)])->save();
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'new@example.com']);
    $this->artisan('commerce:prune')->assertSuccessful();
    expect(StockAlert::query()->pluck('email')->all())->toBe(['new@example.com']);

    app(ToggleFeature::class)->handle('stock_alerts', false);
    $this->get('/products/mug')->assertDontSee('Kabari saya saat tersedia');
    $this->post('/stock-alerts', ['variant' => $this->mug->id, 'email' => 'x@example.com'])->assertNotFound();
});

it('sends nothing for an alert another tick has claimed', function () {
    Notification::fake();
    app(AdjustStock::class)->handle($this->mug, 5, set: true);
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'rina@example.com', 'notified_at' => now()]);

    $this->artisan('commerce:tick')->assertSuccessful();
    Notification::assertNothingSent();
});

it('takes alerts for a bundle whose component is sold out, and sends them when it is back', function () {
    Notification::fake();
    $entry = publishProduct(['type' => 'bundle', 'variants' => [['id' => 'gift', 'sku' => 'GIFT', 'price' => 70000]],
        'bundle' => ['pricing' => 'fixed', 'value' => 70000, 'items' => [['variant_id' => $this->mug->id, 'quantity' => 1]]]], title: 'Gift set');
    $gift = Variant::query()->where('sku', 'GIFT')->sole();
    expect($gift->stock_status)->toBe('in_stock');   // its own status: the mug is what's sold out

    $this->get('/products/gift-set')->assertOk()->assertSee('name="variant" value="'.$gift->id.'"', false);
    $this->post('/stock-alerts', ['variant' => $gift->id, 'email' => 'rina@example.com'])->assertSessionHasNoErrors();

    $this->artisan('commerce:tick')->assertSuccessful();
    Notification::assertNothingSent();
    app(AdjustStock::class)->handle($this->mug->fresh(), 3, set: true);
    $this->artisan('commerce:tick')->assertSuccessful();
    Notification::assertSentOnDemandTimes(StoreEmail::class, 1);
});

it('keeps alerts for products that are no longer live, and gives a failed send back', function () {
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'rina@example.com']);
    app(AdjustStock::class)->handle($this->mug, 5, set: true);

    unpublishEntry($this->mug->product->entry_id);
    Notification::fake();
    $this->artisan('commerce:tick')->assertSuccessful();
    Notification::assertNothingSent();
    expect(StockAlert::query()->sole()->notified_at)->toBeNull();

    EntryTranslation::query()->where('entry_id', $this->mug->product->entry_id)->update(['status' => 'published']);
    $this->mock(Notifier::class)->shouldReceive('sendTo')->once()->andThrow(new RuntimeException('Queue down'));
    expect(fn () => app(SendStockAlerts::class)->handle())->toThrow(RuntimeException::class);
    expect(StockAlert::query()->sole()->notified_at)->toBeNull();
});

it('keeps alerts waiting while the Back in stock email is switched off', function () {
    Notification::fake();
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'rina@example.com']);
    app(AdjustStock::class)->handle($this->mug, 5, set: true);

    app(StoreSettings::class)->saveSection('emails', ['back_in_stock' => ['enabled' => false]]);
    $this->artisan('commerce:tick')->assertSuccessful();
    Notification::assertNothingSent();
    expect(StockAlert::query()->sole()->notified_at)->toBeNull();

    app(StoreSettings::class)->saveSection('emails', ['back_in_stock' => ['enabled' => true]]);
    $this->artisan('commerce:tick')->assertSuccessful();
    Notification::assertSentOnDemandTimes(StoreEmail::class, 1);
});

it('follows an external stock source over the stored status', function () {
    Notification::fake();
    app(AdjustStock::class)->handle($this->mug, 5, set: true);
    $external = new class(app(Inventory::class)) implements Inventory
    {
        public int $stock = 0;

        public function __construct(private Inventory $inner) {}

        public function available(Variant $variant): int
        {
            return $this->stock;
        }

        public function reserve(array $lines, ?Model $reference = null, string $reason = 'order'): void {}

        public function release(array $lines, ?Model $reference = null, string $reason = 'cancel'): void {}

        public function adjust(Variant $variant, int $quantity, bool $set = false, string $reason = 'manual', ?string $note = null, ?int $userId = null): Variant
        {
            return $this->inner->adjust($variant, $quantity, $set, $reason, $note, $userId);
        }
    };
    // Scoped like the real binding, so each request keeps it.
    app()->scoped(Inventory::class, fn () => $external);

    // Stored as in stock, sold out at the source: the form shows and takes the alert.
    $this->get('/products/mug')->assertSee('Kabari saya saat tersedia');
    $this->post('/stock-alerts', ['variant' => $this->mug->id, 'email' => 'rina@example.com'])->assertSessionHasNoErrors();
    expect(app(SendStockAlerts::class)->handle())->toBe(0);

    $external->stock = 2;
    expect(app(SendStockAlerts::class)->handle())->toBe(1);
});

it('gives a renewed alert a fresh half-year before it is pruned', function () {
    $this->travelTo(now()->subDays(190));
    $this->post('/stock-alerts', ['variant' => $this->mug->id, 'email' => 'rina@example.com']);
    $this->travelBack();
    StockAlert::query()->update(['notified_at' => now()->subDays(20)]);

    $this->post('/stock-alerts', ['variant' => $this->mug->id, 'email' => 'rina@example.com'])->assertSessionHasNoErrors();
    $this->artisan('commerce:prune')->assertSuccessful();

    expect(StockAlert::query()->sole())->notified_at->toBeNull()->created_at->isToday()->toBeTrue();
});

it('waits until the minimum order quantity can be bought', function () {
    Notification::fake();
    $this->mug->update(['min_qty' => 5]);
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'rina@example.com']);

    app(AdjustStock::class)->handle($this->mug, 1, set: true);
    $this->get('/products/mug')->assertSee('Kabari saya saat tersedia');
    expect(app(SendStockAlerts::class)->handle())->toBe(0);

    app(AdjustStock::class)->handle($this->mug, 5, set: true);
    expect(app(SendStockAlerts::class)->handle())->toBe(1);
});

it('keeps alerts waiting while the product sync has failed', function () {
    Notification::fake();
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'rina@example.com']);
    $this->mug->product->forceFill(['sync_status' => 'failed', 'sync_error' => 'boom'])->save();
    app(AdjustStock::class)->handle($this->mug, 5, set: true);

    expect(app(SendStockAlerts::class)->handle())->toBe(0);

    $this->mug->product->forceFill(['sync_status' => 'ok', 'sync_error' => null])->save();
    expect(app(SendStockAlerts::class)->handle())->toBe(1);
});

it('keeps alerts waiting while the product cannot be bought', function () {
    Notification::fake();
    StockAlert::query()->create(['product_id' => $this->mug->product_id, 'variant_id' => $this->mug->id, 'email' => 'rina@example.com']);
    $this->mug->product->forceFill(['purchase_mode' => 'none'])->save();
    app(AdjustStock::class)->handle($this->mug, 5, set: true);

    expect(app(SendStockAlerts::class)->handle())->toBe(0);

    $this->mug->product->forceFill(['purchase_mode' => 'default'])->save();
    expect(app(SendStockAlerts::class)->handle())->toBe(1);
});
