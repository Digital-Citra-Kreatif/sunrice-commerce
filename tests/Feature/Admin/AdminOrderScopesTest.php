<?php

declare(strict_types=1);

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Commerce;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    $this->mine = makeOrder(['customer_name' => 'Mine', 'meta' => ['branch' => 'JKT']]);
    $this->theirs = makeOrder(['customer_name' => 'Theirs', 'meta' => ['branch' => 'BDG']]);
    // A branch's staff see their branch's orders; the super admin sees all.
    app(Commerce::class)->scopeAdminOrders(function (Builder $orders, Authenticatable $user): void {
        if ($user->getAttribute('email') === 'staff@example.com') {
            $orders->where('meta->branch', 'JKT');
        }
    });
});

it('lists only the orders in the staff member\'s scope and hides the others', function () {
    actingAsUserWith(['commerce.orders.view', 'commerce.orders.edit', 'commerce.dashboard.view']);

    $this->get('/admin/commerce/orders')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->where('rows.data', fn ($rows) => collect($rows)->pluck('id')->all() === [$this->mine->id]));
    $this->get("/admin/commerce/orders/{$this->mine->id}")->assertOk();
    $this->get("/admin/commerce/orders/{$this->theirs->id}")->assertNotFound();
    $this->post("/admin/commerce/orders/{$this->theirs->id}/notes", ['message' => 'x'])->assertNotFound();
});

it('leaves everyone else unscoped', function () {
    actingAsSuperAdmin();

    $this->get("/admin/commerce/orders/{$this->theirs->id}")->assertOk();
});
