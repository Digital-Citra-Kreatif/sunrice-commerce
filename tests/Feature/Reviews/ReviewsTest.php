<?php

declare(strict_types=1);

use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\Actions\AnonymizeCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    config(['honeypot.enabled' => false]);
    checkoutStore(['price' => 50000]);
    $this->product = Product::query()->sole();
});

/** A signed-in customer, with a completed order for the mug when $bought. */
function reviewer(bool $bought = false): Customer
{
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    test()->actingAs($user, 'commerce');
    $customer = Customer::forUser($user);
    if ($bought) {
        $order = makeOrder(['customer_id' => $customer->id, 'user_id' => $user->id, 'status' => OrderStatus::COMPLETED, 'payment_status' => OrderStatus::PAID]);
        $order->items()->create(['product_id' => test()->product->id, 'name' => 'Mug', 'quantity' => 1]);
    }

    return $customer;
}

it('keeps a guest review until it is approved, then shows it with the rating', function () {
    $this->post("/reviews/{$this->product->id}", ['rating' => 4, 'title' => 'Nice mug', 'body' => 'Holds my coffee well.', 'name' => 'Budi', 'email' => 'Budi@Example.com'])
        ->assertRedirect()->assertSessionHas('commerce.success', 'Terima kasih! Ulasan Anda akan tampil setelah diperiksa.');
    $review = Review::query()->sole();
    expect($review->email)->toBe('budi@example.com')->and($review->status)->toBe('pending')->and($this->product->fresh()->rating_count)->toBe(0);
    $this->get('/products/mug')->assertOk()->assertDontSee('Holds my coffee well.')->assertSee('Belum ada ulasan');

    actingAsUserWith(['commerce.reviews.manage']);
    $this->post('/admin/commerce/reviews/bulk', ['action' => 'approved', 'ids' => [$review->id]])->assertSessionHas('success', '1 review updated.');
    expect($this->product->fresh())->rating_count->toBe(1)->rating_average->toBe(4.0);

    $page = $this->get('/products/mug')->assertOk()->assertSee('Nice mug')->assertSee('Holds my coffee well.')->assertSee('Budi')->assertDontSee('budi@example.com');
    preg_match_all('#<script type="application/ld\+json"[^>]*>(.*?)</script>#s', $page->getContent(), $scripts);
    $product = json_decode(collect($scripts[1])->first(fn (string $json) => str_contains($json, '"@type":"Product"')), true);
    expect($product['aggregateRating'])->toBe(['@type' => 'AggregateRating', 'ratingValue' => '4.0', 'reviewCount' => 1, 'bestRating' => '5', 'worstRating' => '1']);
});

it('shows buyers\' reviews at once as verified purchases, and replaces a customer\'s earlier review', function () {
    app(StoreSettings::class)->saveSection('catalog', ['reviews_approval' => 'buyers']);
    reviewer(bought: true);

    $this->post("/reviews/{$this->product->id}", ['rating' => 5, 'body' => 'Best mug I have owned.'])->assertSessionHasNoErrors();
    Review::query()->sole()->update(['reply' => 'Thank you, Ana!', 'replied_at' => now()]);
    $this->post("/reviews/{$this->product->id}", ['rating' => 3, 'body' => 'It chipped after a month.'])->assertSessionHasNoErrors();

    $review = Review::query()->sole();
    expect($review)->status->toBe('approved')->rating->toBe(3)->name->toBe('Ana')->order_id->not->toBeNull()->reply->toBeNull()->replied_at->toBeNull()
        ->and($this->product->fresh()->rating_average)->toBe(3.0);
    $this->get('/products/mug')->assertSee('It chipped after a month.')->assertSee('Pembelian terverifikasi')->assertDontSee('Best mug');
});

it('lets only the customers the settings name write reviews', function () {
    app(StoreSettings::class)->saveSection('catalog', ['reviews_who' => 'customers']);
    $input = ['rating' => 5, 'body' => 'Lovely glaze and colour.', 'name' => 'Budi', 'email' => 'budi@example.com'];
    $this->post("/reviews/{$this->product->id}", $input)->assertSessionHasErrors('review');
    $this->get('/products/mug')->assertSee('untuk menulis ulasan')->assertDontSee('name="rating"', false);

    app(StoreSettings::class)->saveSection('catalog', ['reviews_who' => 'buyers']);
    reviewer();
    $this->post("/reviews/{$this->product->id}", $input)->assertSessionHasErrors(['review' => 'Hanya pembeli produk ini yang dapat menulis ulasan.']);
    expect(Review::query()->count())->toBe(0);
});

it('validates reviews and takes none while the module is off', function () {
    $this->post("/reviews/{$this->product->id}", ['rating' => 6, 'body' => 'short'])->assertSessionHasErrors(['rating', 'body', 'name', 'email']);
    $this->post('/reviews/999', ['rating' => 5, 'body' => 'Lovely glaze and colour.', 'name' => 'B', 'email' => 'b@example.com'])->assertNotFound();

    app(ToggleFeature::class)->handle('reviews', false);
    $this->post("/reviews/{$this->product->id}", ['rating' => 5, 'body' => 'Lovely glaze and colour.', 'name' => 'B', 'email' => 'b@example.com'])->assertNotFound();
    $this->get('/products/mug')->assertOk()->assertDontSee('id="reviews"', false);
});

it('moderates reviews in Shop → Reviews for staff who may', function () {
    $review = Review::query()->create(['product_id' => $this->product->id, 'name' => 'Budi', 'rating' => 2, 'body' => 'Arrived broken.', 'status' => 'pending']);
    actingAsUserWith(['commerce.orders.view']);
    $this->get('/admin/commerce/reviews')->assertForbidden();
    $this->put("/admin/commerce/reviews/{$review->id}", ['values' => ['status' => 'approved']])->assertForbidden();

    actingAsUserWith(['commerce.reviews.manage'], 'reviews@example.com');
    $this->get('/admin/commerce/reviews?filters[status]=pending')->assertOk()->assertInertia(fn ($page) => $page
        ->component('Commerce/Shared/ResourceIndex')->where('rows.data.0.product', 'Mug')->where('rows.data.0.status', 'Waiting'));
    $this->get("/admin/commerce/reviews/{$review->id}")->assertOk();
    $this->put("/admin/commerce/reviews/{$review->id}", ['values' => ['status' => 'approved', 'reply' => 'Sorry! We sent a new one.']])->assertSessionHas('success');
    expect($review->fresh())->status->toBe('approved')->reply->toBe('Sorry! We sent a new one.')->replied_at->not->toBeNull();
    $this->get('/products/mug')->assertSee('Sorry! We sent a new one.');

    $this->delete("/admin/commerce/reviews/{$review->id}")->assertRedirect('/admin/commerce/reviews');
    expect(Review::query()->count())->toBe(0)->and($this->product->fresh()->rating_count)->toBe(0);

    app(ToggleFeature::class)->handle('reviews', false);
    $this->get('/admin/commerce/reviews')->assertNotFound();
});

it('forgets who wrote a review when the customer is anonymised', function () {
    $customer = reviewer(bought: true);
    $this->post("/reviews/{$this->product->id}", ['rating' => 5, 'body' => 'Best mug I have owned.']);
    Review::query()->create(['product_id' => $this->product->id, 'name' => 'Ana as guest', 'email' => 'Ana@Example.com', 'rating' => 4, 'body' => 'Written before signing up.', 'ip_address' => '10.0.0.1']);

    app(AnonymizeCustomer::class)->handle($customer->fresh());

    expect(Review::query()->get(['name', 'email', 'customer_id', 'ip_address'])->toArray())
        ->each->toBe(['name' => 'Deleted customer', 'email' => null, 'customer_id' => null, 'ip_address' => null]);
});

it('keeps one review per customer and product in the database', function () {
    $customer = reviewer();
    Review::query()->create(['product_id' => $this->product->id, 'customer_id' => $customer->id, 'name' => 'Ana', 'rating' => 5, 'body' => 'First one.']);

    expect(fn () => DB::transaction(fn () => Review::query()->create(['product_id' => $this->product->id, 'customer_id' => $customer->id, 'name' => 'Ana', 'rating' => 1, 'body' => 'Second one.'])))
        ->toThrow(UniqueConstraintViolationException::class);
    Review::query()->create(['product_id' => $this->product->id, 'name' => 'Guest', 'rating' => 3, 'body' => 'A guest.']);
    Review::query()->create(['product_id' => $this->product->id, 'name' => 'Guest 2', 'rating' => 4, 'body' => 'Another guest.']);
    expect(Review::query()->count())->toBe(3);
});

it('takes reviews from customers with names as long as their profile allows', function () {
    $customer = reviewer();
    $customer->update(['name' => str_repeat('A', 120)]);

    $this->post("/reviews/{$this->product->id}", ['rating' => 5, 'body' => 'Long name, good mug.'])->assertSessionHasNoErrors();
    expect(Review::query()->sole()->name)->toHaveLength(120);
});
