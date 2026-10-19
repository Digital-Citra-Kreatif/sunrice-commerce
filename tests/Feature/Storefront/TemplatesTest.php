<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\File;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Storefront\Templates;

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
    checkoutStore();
    $published = array_values(Templates::publishable());
    try {
        $this->artisan('vendor:publish', ['--tag' => 'commerce-templates', '--force' => true])->assertSuccessful();
        expect(File::exists(resource_path('views/commerce/cart.blade.php')))->toBeTrue()
            ->and(File::exists(resource_path('views/sunrice/products/show.blade.php')))->toBeTrue()
            ->and(File::exists(public_path('commerce-theme/commerce.css')))->toBeTrue();

        File::put(resource_path('views/commerce/cart.blade.php'), File::get(resource_path('views/commerce/cart.blade.php')).'{{-- marker --}}<p>APP CART COPY</p>');
        File::append(resource_path('views/commerce/partials/price.blade.php'), '<span>APP PRICE PARTIAL</span>');
        $this->get('/cart')->assertOk()->assertSee('APP CART COPY');
        $this->get('/products/mug')->assertOk()->assertSee('APP PRICE PARTIAL')->assertSee('commerce-theme/commerce.css');
    } finally {
        foreach ($published as $path) {
            File::isDirectory($path) ? File::deleteDirectory($path) : File::delete($path);
        }
        File::deleteDirectory(resource_path('views/commerce'));
        app('view')->getFinder()->flush();
    }
    $this->get('/cart')->assertOk()->assertDontSee('APP CART COPY');
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
