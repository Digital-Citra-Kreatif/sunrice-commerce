<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Customers\Models\Address;
use Sunrice\Commerce\Customers\Models\Customer;
use Workbench\App\Models\User;

it('lists staff only under Users', function () {
    $admin = actingAsSuperAdmin();
    $customer = User::query()->create(['name' => 'Budi', 'email' => 'budi@example.com', 'password' => 'x']);
    $customer->assignRole(Role::findOrCreate('Customer', 'web'));

    $this->get('/cms/users')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->where('rows.data', fn ($rows) => collect($rows)->pluck('email')->all() === [$admin->email]));
});

it('lists, filters, edits and anonymizes customers', function () {
    actingAsSuperAdmin();
    $user = User::query()->create(['name' => 'Budi', 'email' => 'budi@example.com', 'password' => 'x']);
    $user->assignRole(Role::findOrCreate('Customer', 'web'));
    $registered = Customer::forUser($user);
    $guest = Customer::query()->create(['email' => 'guest@example.com', 'name' => 'Guest']);
    Address::query()->create(['customer_id' => $registered->id, 'name' => 'Budi', 'line1' => 'Jl. A', 'country' => 'ID']);

    $this->get('/cms/commerce/customers?filters[account]=guest')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->where('rows.data', fn ($rows) => collect($rows)->pluck('email')->all() === ['guest@example.com']));
    $this->get("/cms/commerce/customers/{$registered->id}")->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Commerce/Customers/Show', false)->where('account.roles', ['Customer']));

    Role::findOrCreate('Reseller', 'web');
    $this->put("/cms/commerce/customers/{$registered->id}", ['name' => 'Budi S', 'phone' => '0812 1111 2222', 'accepts_marketing' => true, 'roles' => ['Customer', 'Reseller']])
        ->assertSessionHasNoErrors();
    expect($registered->fresh()->phone)->toBe('+6281211112222')->and($user->fresh()->getRoleNames()->sort()->values()->all())->toBe(['Customer', 'Reseller']);

    $this->post("/cms/commerce/customers/{$registered->id}/anonymize")->assertRedirect('/cms/commerce/customers');
    $registered->refresh();
    expect($registered->anonymized_at)->not->toBeNull()
        ->and($registered->name)->toBeNull()->and($registered->phone)->toBeNull()->and($registered->email)->toStartWith('deleted-')
        ->and($user->fresh()->email)->toBe($registered->email)
        ->and(Address::query()->count())->toBe(0);
    $this->post('/account/login', ['email' => 'budi@example.com', 'password' => 'x']);
    $this->assertGuest('commerce');
});

it('filters by role, orders, spending and sign-up date, and exports the filtered list', function () {
    actingAsSuperAdmin();
    $user = User::query()->create(['name' => 'Budi', 'email' => 'budi@example.com', 'password' => 'x']);
    $user->assignRole(Role::findOrCreate('Customer', 'web'));
    $budi = Customer::forUser($user);
    $budi->forceFill(['orders_count' => 6, 'total_spent' => 7_500_000, 'accepts_marketing' => true])->save();
    $old = Customer::query()->create(['email' => 'old@example.com', 'name' => 'Old', 'orders_count' => 1, 'total_spent' => 50_000]);
    $old->forceFill(['created_at' => now()->subYears(2)])->save();
    Customer::query()->create(['email' => 'new@example.com', 'name' => 'New']);
    $emails = fn (string $query) => fn (AssertableInertia $page) => $page->where('rows.data', fn ($rows) => collect($rows)->pluck('email')->sort()->values()->all() === explode(',', $query));

    $this->get('/cms/commerce/customers?filters[role]=Customer')->assertInertia($emails('budi@example.com'));
    $this->get('/cms/commerce/customers?filters[orders]=loyal')->assertInertia($emails('budi@example.com'));
    $this->get('/cms/commerce/customers?filters[orders]=none')->assertInertia($emails('new@example.com'));
    $this->get('/cms/commerce/customers?filters[spent]=under_1m')->assertInertia($emails('old@example.com'));
    $this->get('/cms/commerce/customers?filters[spent]=5m')->assertInertia($emails('budi@example.com'));
    $this->get('/cms/commerce/customers?filters[joined]=30d')->assertInertia($emails('budi@example.com,new@example.com'));
    $this->get('/cms/commerce/customers')->assertInertia(fn (AssertableInertia $page) => $page->where('exportUrl', '/cms/commerce/customers/export'));

    $csv = $this->get('/cms/commerce/customers/export?filters[joined]=30d')->assertOk()->streamedContent();
    expect($csv)->toContain('budi@example.com')->toContain('new@example.com')->not->toContain('old@example.com')
        ->and(str($csv)->before("\n")->toString())->toContain('accepts_marketing');
});

it('needs customer permissions', function () {
    $customer = Customer::query()->create(['email' => 'guest@example.com']);
    actingAsUserWith(['commerce.customers.view']);

    $this->get('/cms/commerce/customers')->assertOk();
    $this->put("/cms/commerce/customers/{$customer->id}", ['name' => 'X'])->assertForbidden();
    $this->post("/cms/commerce/customers/{$customer->id}/anonymize")->assertForbidden();
    $this->get('/cms/commerce/customers/export')->assertForbidden();
});
