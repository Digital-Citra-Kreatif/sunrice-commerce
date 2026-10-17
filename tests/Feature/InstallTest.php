<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Database\Seeders\CommerceRolesSeeder;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Regions\RegionImporter;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Workbench\App\Models\User;

afterEach(function () {
    // vendor:publish writes into the Testbench skeleton; keep it clean for other tests.
    @unlink(config_path('commerce.php'));
});

it('installs non-interactively, twice, with a demo store whose checkout works', function () {
    (new RegionImporter(__DIR__.'/../Fixtures/regions'))->import(4); // the fixture instead of the full dataset

    $this->artisan('commerce:install', ['--demo' => true, '--no-regions' => true, '--no-interaction' => true])
        ->expectsOutputToContain('Sunrice Commerce is installed')->assertSuccessful();
    $this->artisan('commerce:install', ['--demo' => true, '--no-regions' => true, '--no-interaction' => true])->assertSuccessful();

    expect(Role::query()->where('name', CommerceRolesSeeder::SHOP_MANAGER)->exists())->toBeTrue()
        ->and(Variant::query()->where('sku', 'like', 'DEMO-%')->count())->toBe(7)   // run twice, seeded once
        ->and(Voucher::query()->where('code', 'KOPI10')->count())->toBe(1)
        ->and(FlashSale::query()->count())->toBe(1)
        ->and(Order::query()->count())->toBe(1)
        ->and(app(StoreSettings::class)->get('general.name'))->toBe('Toko Kopi Contoh');

    // A shop manager sees the Shop group.
    $manager = User::query()->create(['name' => 'Manager', 'email' => 'manager@example.com', 'password' => bcrypt('password')]);
    $manager->assignRole(CommerceRolesSeeder::SHOP_MANAGER);
    $this->actingAs($manager)->get('/cms/commerce')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->where('navigation', fn ($groups) => collect($groups)->firstWhere('label', 'Shop') !== null));
    auth()->logout();

    // A customer buys the demo mug with a bank transfer.
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $mug = Variant::query()->where('sku', 'DEMO-MUG')->firstOrFail();
    $this->get('/products/gelas-kopi')->assertOk()->assertSee('Gelas Kopi');
    $cart = cartWith([[$mug, 1]]);
    $method = ShippingMethod::query()->where('type', 'weight')->value('id');
    $input = checkoutInput(['shipping_rate' => "weight:{$method}:default", 'payment_method' => 'bank_transfer']);
    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirect();

    $order = Order::query()->latest('id')->firstOrFail();
    expect($order->channel)->toBe('storefront')->and($order->payment_method)->toBe('bank_transfer')
        ->and($order->shipping_total)->toBe(12000)
        ->and($order->total)->toBeGreaterThan(40000 + 12000);          // flash sale 20% off, plus the unique code
    $this->get($order->url())->assertOk()->assertSee('1234567890');
});
