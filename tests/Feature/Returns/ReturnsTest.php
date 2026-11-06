<?php

declare(strict_types=1);

use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Customers\Actions\AnonymizeCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Returns\Actions\RequestReturn;
use Sunrice\Commerce\Returns\Actions\UpdateReturn;
use Sunrice\Commerce\Returns\Models\ReturnRequest;
use Sunrice\Commerce\Returns\Returns;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    app(ToggleFeature::class)->handle('returns', true);
    app(StoreSettings::class)->saveSection('general', ['email' => 'toko@example.com']);
    $this->user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $customer = Customer::forUser($this->user);
    $this->order = makeOrder(['customer_id' => $customer->id, 'user_id' => $this->user->id, 'email' => 'ana@example.com',
        'status' => OrderStatus::COMPLETED, 'payment_status' => OrderStatus::PAID, 'completed_at' => now()->subDays(3)]);
    $this->item = $this->order->items()->create(['name' => 'Mug', 'quantity' => 2]);
    $this->actingAs($this->user, 'commerce');
});

it('lets a customer ask to return items of a completed order, and tells staff', function () {
    Notification::fake();
    $this->get("/account/orders/{$this->order->id}")->assertOk()->assertSee('Kembalikan barang')->assertSee('max="2"', false);

    $this->post("/account/orders/{$this->order->id}/returns", ['items' => [$this->item->id => 3], 'reason' => 'damaged'])->assertSessionHasErrors('items');
    $this->post("/account/orders/{$this->order->id}/returns", ['items' => [$this->item->id => 0], 'reason' => 'damaged'])->assertSessionHasErrors('items');
    $this->post("/account/orders/{$this->order->id}/returns", ['items' => [$this->item->id => 1], 'reason' => 'damaged', 'details' => 'The handle broke.'])
        ->assertSessionHas('commerce.success');

    $return = ReturnRequest::query()->with('items')->sole();
    expect($return)->status->toBe('requested')->reason->toBe('damaged')->details->toBe('The handle broke.')
        ->and($return->items->sole()->quantity)->toBe(1)
        ->and($this->order->events()->where('type', 'return')->exists())->toBeTrue();
    Notification::assertSentOnDemand(StoreEmail::class, fn (StoreEmail $n, array $c, AnonymousNotifiable $to) => $n->key === 'staff_return_requested'
        && $to->routes['mail'] === 'toko@example.com' && $n->toMail($to)->viewData['action']['url'] === url("/admin/commerce/returns/{$return->id}"));

    // One more can still be returned; then nothing.
    $this->get("/account/orders/{$this->order->id}")->assertSee('max="1"', false)->assertSee($return->number());
    $this->post("/account/orders/{$this->order->id}/returns", ['items' => [$this->item->id => 1], 'reason' => 'changed_mind'])->assertSessionHasNoErrors();
    $this->get("/account/orders/{$this->order->id}")->assertDontSee('Kembalikan barang');
});

it('takes returns only within the window, of completed orders, while the module is on', function () {
    $input = ['items' => [$this->item->id => 1], 'reason' => 'other'];
    app(StoreSettings::class)->saveSection('checkout', ['returns_days' => 2]);
    $this->post("/account/orders/{$this->order->id}/returns", $input)->assertSessionHasErrors('return');

    app(StoreSettings::class)->saveSection('checkout', ['returns_days' => 14]);
    $this->order->update(['status' => OrderStatus::PROCESSING]);
    $this->post("/account/orders/{$this->order->id}/returns", $input)->assertSessionHasErrors('return');
    $this->get("/account/orders/{$this->order->id}")->assertDontSee('Kembalikan barang');

    $other = makeOrder(['status' => OrderStatus::COMPLETED, 'completed_at' => now()]);
    $this->post("/account/orders/{$other->id}/returns", $input)->assertNotFound();

    app(ToggleFeature::class)->handle('returns', false);
    $this->post("/account/orders/{$this->order->id}/returns", $input)->assertNotFound();
});

it('moves returns on in Shop → Orders → Returns and emails the customer', function () {
    Notification::fake();
    $return = ReturnRequest::query()->create(['order_id' => $this->order->id, 'customer_id' => $this->order->customer_id, 'reason' => 'wrong_item']);
    $return->items()->create(['order_item_id' => $this->item->id, 'quantity' => 1]);

    actingAsUserWith(['commerce.orders.view']);
    $this->get('/admin/commerce/returns')->assertForbidden();
    actingAsUserWith(['commerce.returns.manage'], 'returns@example.com');
    $this->get('/admin/commerce/returns?filters[status]=requested')->assertOk()->assertInertia(fn ($p) => $p
        ->where('rows.data.0.number', $return->number())->where('rows.data.0.status', 'Requested'));
    $this->get("/admin/commerce/returns/{$return->id}")->assertOk();

    $this->put("/admin/commerce/returns/{$return->id}", ['values' => ['status' => 'approved', 'note' => 'Send it to Jl. Setiabudi 1.']])->assertSessionHas('success');
    expect($return->fresh())->status->toBe('approved')->note->toBe('Send it to Jl. Setiabudi 1.')->resolved_at->toBeNull();
    Notification::assertSentOnDemand(StoreEmail::class, fn (StoreEmail $n, array $c, AnonymousNotifiable $to) => $n->key === 'return_updated'
        && $to->routes['mail'] === 'ana@example.com' && str_contains($n->toMail($to)->render()->toHtml(), 'Send it to Jl. Setiabudi 1.'));

    $this->put("/admin/commerce/returns/{$return->id}", ['values' => ['status' => 'closed']]);
    expect($return->fresh()->resolved_at)->not->toBeNull()
        ->and(Order::query()->find($this->order->id)->events()->where('type', 'return')->count())->toBe(2);

    app(ToggleFeature::class)->handle('returns', false);
    $this->get('/admin/commerce/returns')->assertNotFound();
});

it('moves a return only forward: rejected and closed are final', function () {
    $return = ReturnRequest::query()->create(['order_id' => $this->order->id, 'customer_id' => $this->order->customer_id, 'reason' => 'other']);
    $return->items()->create(['order_item_id' => $this->item->id, 'quantity' => 2]);
    actingAsUserWith(['commerce.returns.manage'], 'returns@example.com');

    $this->put("/admin/commerce/returns/{$return->id}", ['values' => ['status' => 'received']])->assertSessionHasErrors('values.status');
    $this->put("/admin/commerce/returns/{$return->id}", ['values' => ['status' => 'rejected']])->assertSessionHasNoErrors();
    expect(app(Returns::class)->returnable($this->order->fresh()))->toBe([$this->item->id => 2]);

    // The customer asks again for both; the rejected return can't come back and take them a second time.
    ReturnRequest::query()->create(['order_id' => $this->order->id, 'customer_id' => $this->order->customer_id, 'reason' => 'other'])
        ->items()->create(['order_item_id' => $this->item->id, 'quantity' => 2]);
    $this->put("/admin/commerce/returns/{$return->id}", ['values' => ['status' => 'approved']])->assertSessionHasErrors('values.status');
    expect($return->fresh()->status)->toBe('rejected');
    $this->get("/admin/commerce/returns/{$return->id}")->assertInertia(fn ($p) => $p->where('form.fields.0.config.options', [['value' => 'rejected', 'label' => 'Rejected']]));
});

it('checks a move against the return as it is now, not as the page loaded it', function () {
    $return = ReturnRequest::query()->create(['order_id' => $this->order->id, 'customer_id' => $this->order->customer_id, 'reason' => 'other']);
    $return->items()->create(['order_item_id' => $this->item->id, 'quantity' => 1]);
    $stale = $return->fresh();
    ReturnRequest::query()->whereKey($return->id)->update(['status' => 'rejected']);

    expect(fn () => app(UpdateReturn::class)->handle($stale, 'approved', null, Actor::system()))->toThrow(ValidationException::class);
    expect($return->fresh()->status)->toBe('rejected');
});

it('writes the emailed status in the customer\'s language, and forgets return text on anonymising', function () {
    Notification::fake();
    $this->order->update(['locale' => 'id']);
    $return = ReturnRequest::query()->create(['order_id' => $this->order->id, 'customer_id' => $this->order->customer_id, 'reason' => 'other', 'details' => 'Call me on 0812…']);
    $return->items()->create(['order_item_id' => $this->item->id, 'quantity' => 1]);

    app()->setLocale('en');
    app(UpdateReturn::class)->handle($return, 'approved', 'Send it to Jl. Setiabudi 1.', Actor::system());
    // Rendered as a real send renders it: in the notification's locale (the order's).
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $n, array $c, AnonymousNotifiable $to): bool {
        app()->setLocale((string) $n->locale);

        return $n->key === 'return_updated' && $n->locale === 'id' && str_contains($n->toMail($to)->render()->toHtml(), 'Disetujui: kirim kembali barangnya');
    });

    app(AnonymizeCustomer::class)->handle(Customer::query()->findOrFail($this->order->customer_id));
    expect($return->fresh())->details->toBeNull()->note->toBeNull();
});

it('checks the order as it is when the return is written, and keeps notes off the timeline', function () {
    $stale = $this->order->fresh();
    Order::query()->whereKey($this->order->id)->update(['status' => OrderStatus::REFUNDED]);
    expect(fn () => app(RequestReturn::class)->handle($stale, [$this->item->id => 1], 'other', null, Actor::system()))->toThrow(ValidationException::class);
    expect(ReturnRequest::query()->count())->toBe(0);

    Order::query()->whereKey($this->order->id)->update(['status' => OrderStatus::COMPLETED]);
    $return = app(RequestReturn::class)->handle($this->order->fresh(), [$this->item->id => 1], 'other', null, Actor::system());
    app(UpdateReturn::class)->handle($return, 'approved', 'Ring 0812 3456 7890 first.', Actor::system());
    expect($this->order->events()->where('type', 'return')->pluck('message')->implode(' '))->not->toContain('0812');
});
