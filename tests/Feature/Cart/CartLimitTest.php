<?php

declare(strict_types=1);

use Illuminate\Auth\Events\Login;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\Actions\MergeCarts;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Storefront\Layout;
use Workbench\App\Models\User;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['commerce.cart.max_lines' => 3, 'commerce.cart.per_page' => 2, 'commerce.cart.preview_lines' => 2]);
    $mug = checkoutStore();
    // Five variants of the mug at 10.000, 20.000 … 50.000.
    $this->variants = collect(range(1, 5))->map(fn (int $i) => $i === 1 ? tap($mug)->update(['price' => 10000])
        : Variant::factory()->create(['product_id' => $mug->product_id, 'sku' => "MUG-{$i}", 'title' => "Size {$i}", 'price' => $i * 10000, 'uid' => "v{$i}"]));
});

it('refuses a new line once the cart is full, on every path that adds lines', function () {
    $add = app(AddToCart::class);
    foreach ($this->variants->take(3) as $variant) {
        $add->handle($variant->id);
    }
    expect(fn () => $add->handle($this->variants[3]->id))->toThrow(CartException::class, 'Your cart is full (3 products). Remove one to add another.');
    expect($add->handle($this->variants[0]->id, 2)->quantity)->toBe(3); // more of a line already in it

    $cookie = ['commerce_cart' => app(CartManager::class)->current()->token];
    $full = 'Keranjang sudah penuh (3 produk). Hapus satu untuk menambah yang lain.';
    $this->withCookies($cookie)->post('/cart/items', ['variant' => $this->variants[3]->id])->assertSessionHas('commerce.error', $full);
    $this->withCredentials()->withCookies($cookie)->postJson('/commerce/api/cart/items', ['variant' => $this->variants[3]->id])->assertStatus(422)
        ->assertJsonPath('reason', 'cart_full')->assertJsonPath('message', $full)->assertJsonPath('cart.line_count', 3);
    $this->withCookies($cookie)->postJson('/commerce/api/cart/items', ['variant' => $this->variants[1]->id])->assertOk();
    expect(Cart::query()->sole()->items()->count())->toBe(3);
});

it('merges a guest cart at sign-in up to the limit, adding quantities to lines already there', function () {
    $customer = Customer::forUser(User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']));
    $mine = Cart::query()->create(['token' => str_repeat('a', 64), 'customer_id' => $customer->id, 'status' => 'active']);
    $mine->items()->create(['variant_id' => $this->variants[0]->id, 'quantity' => 1]);
    $mine->items()->create(['variant_id' => $this->variants[1]->id, 'quantity' => 1]);
    $guest = cartWith([[$this->variants[0], 1], [$this->variants[2], 1], [$this->variants[3], 1]]);

    $merge = app(MergeCarts::class);
    $merge->handle($guest, $customer);

    expect($mine->items()->pluck('quantity', 'variant_id')->all())
        ->toBe([$this->variants[0]->id => 2, $this->variants[1]->id => 1, $this->variants[2]->id => 1])
        ->and($merge->left)->toBe(1);
});

it('tells the shopper when lines from before signing in did not fit', function () {
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
    $customer = Customer::forUser($user);
    $mine = Cart::query()->create(['token' => str_repeat('a', 64), 'customer_id' => $customer->id, 'status' => 'active']);
    $mine->items()->create(['variant_id' => $this->variants[0]->id, 'quantity' => 1]);
    $mine->items()->create(['variant_id' => $this->variants[1]->id, 'quantity' => 1]);
    $mine->items()->create(['variant_id' => $this->variants[2]->id, 'quantity' => 1]);
    $guest = cartWith([[$this->variants[3], 1], [$this->variants[4], 1]]);
    request()->cookies->set('commerce_cart', $guest->token);

    event(new Login(CurrentCustomer::guard(), $user, false));

    expect(session('commerce.error'))->toBe('Your cart holds up to 3 products, so 2 from before you signed in were not added.');
});

it('shows the cart page a page of lines at a time, with the whole cart\'s totals', function () {
    config(['commerce.cart.max_lines' => 0]); // no limit
    $cart = cartWith($this->variants->map(fn (Variant $v) => [$v, 1])->all());
    $cookie = ['commerce_cart' => $cart->token];

    $first = $this->withCookies($cookie)->get('/cart')->assertOk()->assertSee('Rp150.000')->assertSee('?page=2', false)->getContent();
    expect(substr_count($first, 'data-commerce-cart-line='))->toBe(2);
    $this->withCookies($cookie)->get('/cart?page=2')->assertSee('Size 3')->assertSee('Size 4')->assertDontSee('Size 5')->assertSee('Rp150.000');

    // Removing the last page's only line comes back to the page, now the last but one.
    $last = $cart->items()->where('variant_id', $this->variants[4]->id)->value('id');
    $this->withCookies($cookie)->from('/cart?page=3')->delete("/cart/items/{$last}")->assertRedirect('/cart?page=3');
    $this->withCookies($cookie)->get('/cart?page=3')->assertSee('Size 3')->assertSee('Size 4')->assertSee('Rp100.000');
});

it('lists the first lines in the drawer and the checkout summary, the rest behind "and X more"', function () {
    config(['commerce.cart.max_lines' => 0]);
    $cart = cartWith($this->variants->map(fn (Variant $v) => [$v, 1])->all());

    $this->withCredentials()->getJson('/commerce/api/cart?lines=2')->assertOk()->assertJsonCount(2, 'cart.lines')
        ->assertJsonPath('cart.line_count', 5)->assertJsonPath('cart.totals.total.amount', 150000);
    $this->getJson('/commerce/api/cart')->assertJsonCount(5, 'cart.lines');
    expect($this->blade('<x-commerce::mini-cart />')->__toString())
        ->toContain('data-commerce-drawer-lines="2"')->toContain('data-commerce-drawer-more="dan :count lainnya"');

    $view = CartView::for($cart);
    $summary = view(Layout::view('partials.checkout-summary'), ['cart' => $view, 'state' => $view->state])->render();
    expect($summary)->toContain('<details class="commerce-summary__more"><summary>dan 3 lainnya</summary>')
        ->and(substr_count($summary, 'commerce-summary__qty'))->toBe(5);
});
