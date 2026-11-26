<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\File;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\Templates;
use Sunrice\Commerce\Tests\TestCase;
use Workbench\App\Models\User;

// These tests publish templates into resources/ and public/: in a folder of their own, so tests in
// other parallel workers never see (or lose mid-render) them.
beforeAll(fn () => TestCase::isolateAppFolder());
afterAll(fn () => TestCase::removeIsolatedAppFolder());

it('ships templates that compile to valid PHP', function () {
    $dir = __DIR__.'/../../../resources/views/storefront';
    foreach (Templates::files($dir) as $file) {
        $php = Blade::compileString((string) file_get_contents("{$dir}/{$file}"));
        try {
            token_get_all($php, TOKEN_PARSE);
        } catch (ParseError $e) {
            $this->fail("{$file}: {$e->getMessage()}");
        }
    }
    expect(count(Templates::files($dir)))->toBeGreaterThan(40);
});

it('publishes templates that the store then uses, and falls back without them', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    $mug = checkoutStore();
    $published = array_values(Templates::publishable());
    $skin = public_path('test-commerce-skin.css');
    try {
        $this->artisan('vendor:publish', ['--tag' => 'commerce-templates', '--force' => true])->assertSuccessful();
        expect(File::exists(resource_path('views/commerce/cart.blade.php')))->toBeTrue()
            ->and(File::exists(resource_path('views/cms/collections/products/show.blade.php')))->toBeTrue()
            ->and(File::exists(public_path('commerce-theme/commerce.css')))->toBeTrue();

        File::put($skin, ':root { --commerce-accent: #304350; }');
        config(['commerce.storefront.layout' => 'missing.app.layout', 'commerce.storefront.skin' => 'test-commerce-skin.css']);
        foreach ([
            'layouts/store' => ['<main ', '<main data-app-layout '],
            'cart/line' => ['<tr ', '<tr data-app-cart-row '],
            'checkout/contact' => ['<fieldset ', '<fieldset data-app-contact '],
            'checkout/summary' => ['<aside ', '<aside data-app-summary '],
            'account/navigation' => ['<nav ', '<nav data-app-navigation '],
            'account/order-table' => ['<table ', '<table data-app-order-table '],
            'payments/instructions' => ['<div ', '<div data-app-payment '],
            'payments/confirm-link' => ['<a ', '<a data-app-confirmation '],
        ] as $partial => [$from, $to]) {
            $path = resource_path("views/commerce/{$partial}.blade.php");
            File::put($path, str_replace($from, $to, File::get($path)));
        }

        cartWith([[$mug, 1]]);
        $this->get('/cart')->assertOk()->assertSee('data-app-cart-row', false)->assertSee('data-app-layout', false)
            ->assertSeeInOrder(['commerce-theme/commerce.css', 'test-commerce-skin.css'])->assertSee('commerce-theme/commerce.js');
        $this->get('/checkout')->assertOk()->assertSee('data-app-contact', false)->assertSee('data-app-summary', false);
        $summary = $this->withCredentials()->postJson('/checkout/refresh', checkoutInput())->assertOk()->json('summary');
        expect($summary)->toContain('data-app-summary', 'data-commerce-summary');

        $user = User::query()->create(['name' => 'Buyer', 'email' => 'buyer@example.com', 'password' => bcrypt('password'), 'email_verified_at' => now()]);
        app(StoreSettings::class)->saveSection('payments', ['instances' => ['instructions' => ['instructions_qr']]]);
        $order = makeOrder(['user_id' => $user->id, 'payment_method' => 'instructions_qr']);
        $order->payments()->create(['method' => 'instructions_qr', 'amount' => 100000, 'status' => 'pending',
            'instructions' => ['image' => '/proof.png', 'confirmation' => 'optional']]);
        $this->actingAs($user, 'account')->get('/account/orders')->assertOk()
            ->assertSee('data-app-navigation', false)->assertSee('data-app-order-table', false);
        $this->get($order->url())->assertOk()
            ->assertSee('data-app-payment', false)->assertSee('data-app-confirmation', false);
    } finally {
        File::delete($skin);
        foreach ($published as $path) {
            File::isDirectory($path) ? File::deleteDirectory($path) : File::delete($path);
        }
        File::deleteDirectory(resource_path('views/commerce'));
        app('view')->getFinder()->flush();
    }
    $this->get('/cart')->assertOk()->assertDontSee('data-app-cart-row', false)->assertDontSee('data-app-layout', false);
});

it('publishes the starter theme with the templates', function () {
    $published = array_values(Templates::starter());
    expect(count($published))->toBeGreaterThan(count(Templates::publishable()));
    try {
        $this->artisan('vendor:publish', ['--tag' => 'commerce-starter', '--force' => true])->assertSuccessful();
        foreach (['views/cms/layout.blade.php', 'views/cms/partials/store-header.blade.php', 'views/cms/home.blade.php',
            'views/errors/404.blade.php', 'views/commerce/cart.blade.php', 'views/cms/collections/products/show.blade.php'] as $path) {
            expect(File::exists(resource_path($path)))->toBeTrue($path);
        }
        expect(File::exists(public_path('commerce-theme/commerce.css')))->toBeTrue();
    } finally {
        foreach ($published as $path) {
            File::isDirectory($path) ? File::deleteDirectory($path) : File::delete($path);
        }
        foreach (['views/commerce', 'views/cms', 'views/errors'] as $dir) {
            File::deleteDirectory(resource_path($dir));
        }
        app('view')->getFinder()->flush();
    }
});

it('renders the cart link for both successful and unconfirmed add-to-cart requests', function () {
    checkoutStore();

    $this->get('/products/mug')->assertOk()
        ->assertSee('data-commerce-add-recovery hidden', false)
        ->assertSee(trans('commerce::storefront.cart.add_unconfirmed'))
        ->assertSee('data-commerce-buy-controls', false)
        ->assertSee('<template data-commerce-add-success-action>', false)
        ->assertSee('class="commerce-toast__cart" href="'.commerce_url('commerce.cart').'"', false)
        ->assertSee('aria-label="'.trans('commerce::storefront.cart.view_cart').'"', false);
});

it('buys a variable product with plain form posts, no JavaScript', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    checkoutStore();
    publishProduct(['type' => 'variable', 'options' => [['id' => 'size', 'name' => 'Size', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]]],
        'variants' => [
            ['id' => 'tee-s', 'sku' => 'TEE-S', 'price' => 80000, 'options' => ['size' => 's'], 'track_stock' => true, 'initial_stock' => 0],
            ['id' => 'tee-m', 'sku' => 'TEE-M', 'price' => 85000, 'options' => ['size' => 'm'], 'track_stock' => true, 'initial_stock' => 3],
        ]], title: 'Kaos');

    $page = $this->get('/products/kaos')->assertOk();
    $page->assertSee('<legend>Size</legend>', false)
        ->assertSee('name="options[size]"', false)
        ->assertSee('aria-describedby="opt-', false)       // S is sold out, and says so
        ->assertSee('role="status" aria-live="polite"', false);
    expect(Blade::render('<x-commerce::mini-cart />'))->toContain('aria-haspopup="dialog"')
        ->toContain('<dialog class="commerce-drawer" data-commerce-drawer aria-labelledby="commerce-drawer-title"')
        ->toContain('data-commerce-drawer-close aria-label=');
    $productId = Variant::query()->where('sku', 'TEE-M')->value('product_id');

    $this->post('/cart/items', ['product' => $productId, 'options' => ['size' => 'm'], 'quantity' => 1])->assertRedirect();
    $cart = Cart::query()->latest('id')->first();
    expect($cart->items->sole()->variant->sku)->toBe('TEE-M');
    $this->withCookie('commerce_cart', $cart->token);

    $input = checkoutInput();
    $this->post('/checkout', [...$input, 'action' => 'update'])->assertRedirect('/checkout#shipping');
    $html = $this->get('/checkout')->assertOk()->getContent();
    preg_match('/name="totals_hash" value="([a-f0-9]+)"/', (string) $html, $m);
    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => $m[1]])->assertRedirect();
    $order = Order::query()->sole();
    expect($order->items->sole()->sku)->toBe('TEE-M')->and($order->total)->toBe(95000);
    $this->get($order->url())->assertOk()->assertSee($order->number);

    // An unknown combination is refused.
    $this->post('/cart/items', ['product' => $productId, 'options' => ['size' => 'xl']])->assertSessionHas('commerce.error');
});
