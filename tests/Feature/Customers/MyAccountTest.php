<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Sunrice\Account\Profiles\Actions\RequestDeletion;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\Models\Address;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Facades\Commerce;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Regions\RegionImporter;
use Workbench\App\Models\User;

beforeEach(function () {
    (new RegionImporter(__DIR__.'/../../Fixtures/regions'))->import(4);
    $this->user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->actingAs($this->user, 'account');
    $this->customer = Customer::forUser($this->user);
});

$address = ['name' => 'Ana', 'phone' => '081234567890', 'country' => 'ID', 'province_code' => '32', 'city_code' => '32.73', 'district_code' => '32.73.01', 'line1' => 'Jl. Sarijadi 1'];

it('opens the address form on demand and returns to the address book after saving', function () use ($address) {
    $this->get('/account/addresses')->assertOk()
        ->assertSee('Belum ada alamat tersimpan.')
        ->assertSee('?add=1#address-form', false)
        ->assertDontSee('id="address-form"', false);

    $addUrl = '/account/addresses?add=1';
    $this->get($addUrl)->assertOk()
        ->assertSee('id="address-form"', false)
        ->assertSee('Batal');

    $this->from($addUrl)->post('/account/addresses', ['address' => ['label' => 'Rumah']])
        ->assertRedirect($addUrl)
        ->assertSessionHasErrors('address.name');
    $this->get($addUrl)->assertOk()->assertSee('value="Rumah"', false);

    $this->from($addUrl)->post('/account/addresses', ['address' => [...$address, 'label' => 'Rumah']])
        ->assertRedirect('/account/addresses')
        ->assertSessionHasNoErrors();

    $first = $this->customer->addresses()->firstOrFail();
    $this->get('/account/addresses')->assertOk()->assertSee('commerce-address-card"  open', false);

    $this->from($addUrl)->post('/account/addresses', ['address' => [...$address, 'line1' => 'Jl. Kantor 2']])
        ->assertRedirect('/account/addresses');
    $this->get('/account/addresses')->assertOk()
        ->assertSee('<summary class="commerce-address-card__summary">', false)
        ->assertSee('Rumah')->assertSee('Jl. Kantor 2')->assertSee('Kota Bandung')
        ->assertDontSee('commerce-address-card"  open', false)
        ->assertDontSee('id="address-form"', false);

    $editUrl = "/account/addresses?edit={$first->id}";
    $this->get($editUrl)->assertOk()
        ->assertSee('id="address-form"', false)
        ->assertSee('value="Rumah"', false);
    $this->from($editUrl)->put("/account/addresses/{$first->id}", ['address' => [...$address, 'label' => 'Rumah baru']])
        ->assertRedirect('/account/addresses')
        ->assertSessionHasNoErrors();
});

it('adds, edits and deletes addresses with defaults and region validation', function () use ($address) {
    $this->post('/account/addresses', ['address' => $address])->assertSessionHasNoErrors();
    $first = Address::query()->firstOrFail();
    expect($first->default_shipping)->toBeTrue()->and($first->city)->toBe('Kota Bandung');

    $this->post('/account/addresses', ['address' => [...$address, 'line1' => 'Kantor', 'default_shipping' => 1]])->assertSessionHasNoErrors();
    expect($first->fresh()->default_shipping)->toBeFalse();

    $this->post('/account/addresses', ['address' => [...$address, 'city_code' => '32.04']])->assertSessionHasErrors('address.district_code');
    $this->put("/account/addresses/{$first->id}", ['address' => [...$address, 'line1' => 'Rumah baru']])->assertSessionHasNoErrors();
    expect($first->fresh()->line1)->toBe('Rumah baru');

    $this->get('/account/addresses')->assertOk()->assertSee('Rumah baru')->assertSee('Kota Bandung');
    $this->delete("/account/addresses/{$first->id}")->assertSessionHas('commerce.success');
    expect(Address::query()->count())->toBe(1);
});

it('can\'t touch another customer\'s address', function () use ($address) {
    $other = Customer::query()->create(['email' => 'other@example.com']);
    $theirs = Address::query()->create(['customer_id' => $other->id, 'name' => 'X', 'line1' => 'Y', 'country' => 'ID']);

    $this->put("/account/addresses/{$theirs->id}", ['address' => $address])->assertNotFound();
    $this->delete("/account/addresses/{$theirs->id}")->assertNotFound();
});

it('lists pages registered by extensions', function () {
    Route::middleware(['web', 'sunrice.account.auth'])->get('account/points', fn () => 'points')->name('loyalty.points');
    Commerce::registerAccountPage('points', 'Poin saya', 'loyalty.points', position: 50);

    $this->get('/account')->assertRedirect('/account/orders');
    $this->get('/account/orders')->assertOk()->assertSee('Poin saya');
});

it('opens orders by default and links from a detail to all orders', function () {
    $order = makeOrder(['number' => 'ORD-ACCOUNT', 'user_id' => $this->user->id, 'customer_id' => $this->customer->id]);
    makeOrder(['number' => 'ORD-OTHER']);

    $this->get('/account')->assertRedirect('/account/orders');
    $this->get('/account/orders')->assertOk()->assertSee('ORD-ACCOUNT')->assertDontSee('ORD-OTHER')
        ->assertDontSee('Tautan cepat')->assertDontSee('Pesanan terbaru');
    $this->get("/account/orders/{$order->id}")->assertOk()
        ->assertSee('Kembali ke semua pesanan')
        ->assertSee('aria-current="page"', false);
});

it('shows a points summary and history', function () {
    app(ToggleFeature::class)->handle('loyalty', true);
    $this->customer->update(['loyalty_points' => 12500]);

    $this->get('/account/points')->assertOk()->assertSeeInOrder(['Poin tersedia', '12.500', 'Riwayat poin']);
});

it('combines customer order search, status and an inclusive date range', function () {
    $owner = ['user_id' => $this->user->id, 'customer_id' => $this->customer->id];
    $match = makeOrder([...$owner, 'number' => 'ORD-MATCH', 'status' => 'completed', 'placed_at' => '2026-04-30 23:59:59']);
    $match->items()->create(['name' => 'KAIN Lookbook 100%', 'quantity' => 1]);
    makeOrder([...$owner, 'number' => 'ORD-MATCH-OLD', 'status' => 'completed', 'placed_at' => '2026-03-31 23:59:59']);
    makeOrder([...$owner, 'number' => 'ORD-MATCH-NEW', 'status' => 'completed', 'placed_at' => '2026-05-01 00:00:00']);
    makeOrder([...$owner, 'number' => 'ORD-MATCH-PENDING', 'placed_at' => '2026-04-15 12:00:00']);
    makeOrder([...$owner, 'number' => 'ORD-MATCH-QUOTE', 'type' => 'quote', 'status' => 'completed', 'placed_at' => '2026-04-15 12:00:00']);
    $unowned = makeOrder(['number' => 'ORD-MATCH-OTHER', 'status' => 'completed', 'placed_at' => '2026-04-15 12:00:00']);
    $unowned->items()->create(['name' => 'KAIN Lookbook 100%', 'quantity' => 1]);

    $this->get('/account/orders?q=ord-match&status=completed&date_from=2026-04-01&date_to=2026-04-30')->assertOk()
        ->assertSee('ORD-MATCH')->assertDontSee('ORD-MATCH-OLD')->assertDontSee('ORD-MATCH-NEW')
        ->assertDontSee('ORD-MATCH-PENDING')->assertDontSee('ORD-MATCH-QUOTE')->assertDontSee('ORD-MATCH-OTHER')
        ->assertSee('Reset filter')
        ->assertSee('name="date_from" value="2026-04-01"', false)
        ->assertSee('name="date_to" value="2026-04-30"', false)
        ->assertDontSee('commerce-order-filters__dates', false);
    $this->get('/account/orders?q=lookbook%20100%25')->assertOk()->assertSee('ORD-MATCH')->assertDontSee('ORD-MATCH-OTHER');
    $this->get('/account/orders?q=%25%25')->assertOk()->assertSee('Tidak ada pesanan yang cocok.');
    $this->get('/account/orders?date_to=2026-04-30')->assertOk()->assertSee('ORD-MATCH-OLD')->assertDontSee('ORD-MATCH-NEW');

    $this->get('/account/orders?date_from=2026-04-30&date_to=2026-04-01')->assertOk()
        ->assertSee('Tanggal akhir harus sama dengan atau setelah tanggal mulai.');
    $this->get('/account/orders?status%5B%5D=completed&date_to=2026-02-30')->assertOk()
        ->assertSee('Pilih status pesanan dari daftar.')->assertSee('Masukkan tanggal akhir yang valid.');
});

it('filters the customer’s orders by product category and its descendants', function () {
    $clothing = term('product_categories', 'Pakaian');
    $shirts = term('product_categories', 'Kaos', $clothing);
    $shoes = term('product_categories', 'Sepatu');
    $private = term('product_categories', 'Kategori Lain');
    $owner = ['user_id' => $this->user->id, 'customer_id' => $this->customer->id];
    foreach ([
        [$shirts, 'ORD-SHIRT', $owner],
        [$clothing, 'ORD-CLOTH', $owner],
        [$shoes, 'ORD-SHOES', $owner],
        [$private, 'ORD-OTHER', []],
    ] as [$category, $number, $attributes]) {
        $entry = publishProduct(['variants' => [['price' => 50000, 'sku' => $number]]], title: $number);
        $entry->terms()->attach($category);
        $reference = $number === 'ORD-SHIRT'
            ? ['product_id' => Product::query()->where('entry_id', $entry->id)->value('id')]
            : ['entry_id' => $entry->id];
        makeOrder([...$attributes, 'number' => $number, 'status' => 'completed'])
            ->items()->create([...$reference, 'name' => $number, 'quantity' => 1]);
    }

    $this->get("/account/orders?status=completed&category={$clothing->id}")->assertOk()
        ->assertSee('Pakaian › Kaos')->assertSee('ORD-SHIRT')->assertSee('ORD-CLOTH')
        ->assertDontSee('ORD-SHOES')->assertDontSee('ORD-OTHER')->assertDontSee('Kategori Lain');
    $this->get("/account/orders?category={$shirts->id}")->assertOk()
        ->assertSee('ORD-SHIRT')->assertDontSee('ORD-CLOTH')->assertDontSee('ORD-SHOES');
    $this->get("/account/orders?category={$private->id}")->assertOk()
        ->assertSee('Pilih kategori produk dari daftar.')->assertDontSee('ORD-OTHER');
});

it('keeps order filters across pages and paginates ten results at a time', function () {
    foreach (range(1, 11) as $number) {
        makeOrder([
            'number' => sprintf('ORD-PAGED-%02d', $number),
            'user_id' => $this->user->id,
            'status' => 'completed',
            'placed_at' => '2026-04-15 12:00:00',
        ]);
    }
    $filters = '/account/orders?q=ORD-PAGED&status=completed&date_from=2026-04-15&date_to=2026-04-15';
    $this->get($filters)->assertOk()
        ->assertSeeInOrder(['ORD-PAGED-11', 'ORD-PAGED-10', 'ORD-PAGED-02'])
        ->assertDontSee('ORD-PAGED-01')
        ->assertSee('q=ORD-PAGED&amp;status=completed&amp;date_from=2026-04-15&amp;date_to=2026-04-15&amp;page=2', false);

    $this->get($filters.'&page=2')->assertOk()
        ->assertSee('ORD-PAGED-01')->assertDontSee('ORD-PAGED-02')
        ->assertSee('aria-current="page">2', false);
});

it('keeps the customer record in step with the account\'s profile', function () {
    // The profile page is the Accounts plugin's: name, phone and consent change there.
    $this->put('/account/profile', ['name' => 'Ana Putri', 'email' => 'ana@example.com', 'phone' => '0811111111', 'accepts_marketing' => '1'])
        ->assertSessionHasNoErrors();

    $customer = $this->customer->fresh();
    expect([$customer->name, $customer->phone, $customer->accepts_marketing])->toBe(['Ana Putri', '+62811111111', true])
        ->and($customer->marketing_consent_at)->not->toBeNull();

    $this->put('/account/profile', ['name' => 'Ana Putri', 'email' => 'ana@example.com', 'phone' => '0811111111'])->assertSessionHasNoErrors();
    expect($this->customer->fresh()->accepts_marketing)->toBeFalse()->and($this->customer->fresh()->marketing_consent_at)->toBeNull();

    // Asking to be deleted shows in Shop → Customers.
    app(RequestDeletion::class)->handle($this->user);
    expect($this->customer->fresh()->deletion_requested_at)->not->toBeNull();
});
