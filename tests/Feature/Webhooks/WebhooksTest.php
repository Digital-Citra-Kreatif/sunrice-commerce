<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Orders\Actions\MarkOrderPaid;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Webhooks\EndpointUrl;
use Sunrice\Commerce\Webhooks\Jobs\DeliverWebhook;
use Sunrice\Commerce\Webhooks\Models\Webhook;
use Sunrice\Commerce\Webhooks\Models\WebhookDelivery;
use Sunrice\Commerce\Webhooks\Webhooks;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false, 'commerce.webhooks.allow_private' => true]);
    $this->mug = checkoutStore();
    app(ToggleFeature::class)->handle('webhooks', true);
    $this->answer = 200;
    Http::fake(['hooks.example.test/*' => fn () => Http::response('answer', $this->answer)]);
});

function webhookEndpoint(array $events, array $attributes = []): Webhook
{
    $webhook = Webhook::query()->create([
        'name' => 'Accounting', 'url' => 'https://hooks.example.test/orders', 'events' => $events, 'secret' => 'whsec_test', 'active' => true, ...$attributes,
    ]);
    app(Webhooks::class)->flush();

    return $webhook;
}

function placeWebhookOrder(): Order
{
    $cart = cartWith([[test()->mug, 1]]);
    $input = checkoutInput();
    test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirect();

    return Order::query()->latest('id')->firstOrFail();
}

it('sends a signed JSON body for each event an endpoint listens to', function () {
    webhookEndpoint(['order.placed']);
    $order = placeWebhookOrder();

    $delivery = WebhookDelivery::query()->sole();
    expect($delivery->event)->toBe('order.placed')
        ->and($delivery->status)->toBe('delivered')
        ->and($delivery->attempts)->toBe(1)
        ->and($delivery->response_status)->toBe(200);

    Http::assertSent(function (HttpRequest $request) use ($order, $delivery) {
        $body = $request->body();
        preg_match('/^t=(\d+),v1=([0-9a-f]{64})$/', $request->header('X-Sunrice-Signature')[0], $sig);

        return $request->url() === 'https://hooks.example.test/orders'
            && $request->header('X-Sunrice-Event')[0] === 'order.placed'
            && $request->header('X-Sunrice-Delivery')[0] === $delivery->uuid
            && hash_equals(hash_hmac('sha256', $sig[1].'.'.$body, 'whsec_test'), $sig[2])
            && json_decode($body, true)['data']['order']['number'] === $order->displayNumber()
            && json_decode($body, true)['data']['order']['total']['amount'] === $order->total;
    });
});

it('sends nothing to endpoints that are off or listen to other events, or while the module is off', function () {
    webhookEndpoint(['order.completed']);
    webhookEndpoint(['order.placed'], ['active' => false]);
    placeWebhookOrder();
    expect(WebhookDelivery::query()->count())->toBe(0);

    webhookEndpoint(['order.placed']);
    app(ToggleFeature::class)->handle('webhooks', false);
    app()->forgetScopedInstances();
    placeWebhookOrder();
    expect(WebhookDelivery::query()->count())->toBe(0);
    Http::assertNothingSent();
});

it('sends nothing for a change that is rolled back', function () {
    webhookEndpoint(['order.placed']);

    try {
        DB::transaction(function () {
            app(Webhooks::class)->send('order.placed', ['order' => ['id' => 1]]);
            throw new RuntimeException('rolled back');
        });
    } catch (RuntimeException) {
    }

    expect(WebhookDelivery::query()->count())->toBe(0);
    Http::assertNothingSent();
});

it('retries failed deliveries and switches an endpoint off after too many failures', function () {
    config(['commerce.webhooks.disable_after' => 2]);
    $this->answer = 503;
    $webhook = webhookEndpoint(['order.placed', 'order.paid']);
    $order = placeWebhookOrder();

    $delivery = WebhookDelivery::query()->sole();
    expect($delivery->status)->toBe('pending')->and($delivery->attempts)->toBe(1)
        ->and($delivery->response_status)->toBe(503)->and($delivery->error)->toContain('503');

    // The last attempt fails the delivery and counts against the endpoint.
    $delivery->forceFill(['attempts' => DeliverWebhook::ATTEMPTS - 1])->save();
    (new DeliverWebhook($delivery->id))->handle();
    expect($delivery->fresh()->status)->toBe('failed')->and($webhook->fresh()->failures)->toBe(1)->and($webhook->fresh()->active)->toBeTrue();

    app(MarkOrderPaid::class)->handle($order, Actor::system());
    $paid = WebhookDelivery::query()->where('event', 'order.paid')->sole();
    $paid->forceFill(['attempts' => DeliverWebhook::ATTEMPTS - 1])->save();
    (new DeliverWebhook($paid->id))->handle();
    expect($webhook->fresh()->active)->toBeFalse()->and($webhook->fresh()->disabled_at)->not->toBeNull();

    // A success resets the count.
    $this->answer = 200;
    $webhook->refresh()->forceFill(['active' => true, 'failures' => 1])->save();
    $retry = WebhookDelivery::query()->create(['uuid' => (string) Str::uuid(), 'webhook_id' => $webhook->id, 'event' => 'order.paid', 'payload' => ['event' => 'order.paid']]);
    (new DeliverWebhook($retry->id))->handle();
    expect($retry->fresh()->status)->toBe('delivered')->and($webhook->fresh()->failures)->toBe(0);
});

it('sends a refund once, whether staff record it or the payment provider reports it', function () {
    webhookEndpoint(['order.refunded']);
    $order = placeWebhookOrder();
    app(MarkOrderPaid::class)->handle($order, Actor::system());

    app(RecordRefund::class)->handle($order->fresh(), 10000, [], 'damaged', false, Actor::system());
    expect(WebhookDelivery::query()->where('event', 'order.refunded')->count())->toBe(1);

    app(RecordPaymentResult::class)->handle($order->payments()->sole(), PaymentResult::refunded(5000, 'gw-refund-9'));
    $refunds = WebhookDelivery::query()->where('event', 'order.refunded')->orderBy('id')->get();
    expect($refunds)->toHaveCount(2)
        ->and($refunds[0]->payload['data']['refund']['amount'])->toBe(10000)
        ->and($refunds[1]->payload['data']['refund']['amount'])->toBe(5000);
});

it('sends stock changes with the variant', function () {
    webhookEndpoint(['stock.out']);
    app(Inventory::class)->adjust($this->mug, 0, set: true);

    $payload = WebhookDelivery::query()->where('event', 'stock.out')->sole()->payload;
    expect($payload['data']['variant'])->toMatchArray(['id' => $this->mug->id, 'sku' => $this->mug->sku, 'stock' => 0]);
});

it('refuses endpoints that are not public https addresses', function () {
    config(['commerce.webhooks.allow_private' => false]);

    foreach (['http://hooks.example.com/x', 'https://localhost/x', 'https://127.0.0.1/x', 'https://10.0.0.5/x', 'https://169.254.169.254/latest', 'https://[::1]/x', 'https://user:pass@93.184.216.34/x', 'not a url'] as $url) {
        expect(EndpointUrl::problem($url))->not->toBeNull($url);
    }
    expect(EndpointUrl::problem('https://93.184.216.34/hooks'))->toBeNull();
});

it('lets staff with the permission manage endpoints, with a generated secret', function () {
    actingAsUserWith(['commerce.dashboard.view']);
    $this->get('/admin/commerce/settings/webhooks')->assertForbidden();

    actingAsSuperAdmin();
    $this->get('/admin/commerce/settings/webhooks')->assertOk();
    $this->post('/admin/commerce/settings/webhooks', ['values' => ['name' => 'Warehouse', 'url' => 'https://hooks.example.test/w', 'events' => ['shipment.created', 'nope'], 'active' => true]])
        ->assertSessionHasErrors();

    $this->post('/admin/commerce/settings/webhooks', ['values' => ['name' => 'Warehouse', 'url' => 'https://hooks.example.test/w', 'events' => ['shipment.created'], 'active' => true]])->assertRedirect();
    $webhook = Webhook::query()->sole();
    expect($webhook->secret)->toStartWith('whsec_')->and($webhook->events)->toBe(['shipment.created']);
    $this->get("/admin/commerce/settings/webhooks/{$webhook->id}/edit")->assertOk()->assertSee($webhook->secret);

    $secret = $webhook->secret;
    $this->put("/admin/commerce/settings/webhooks/{$webhook->id}", ['values' => ['name' => 'Warehouse', 'url' => 'https://hooks.example.test/w', 'events' => ['shipment.created'], 'active' => true, 'rotate_secret' => true]])->assertRedirect();
    expect($webhook->fresh()->secret)->not->toBe($secret);

    config(['commerce.webhooks.allow_private' => false]);
    $this->put("/admin/commerce/settings/webhooks/{$webhook->id}", ['values' => ['name' => 'Warehouse', 'url' => 'https://10.0.0.5/w', 'events' => ['shipment.created'], 'active' => true]])
        ->assertSessionHasErrors('values.url');

    $this->delete("/admin/commerce/settings/webhooks/{$webhook->id}")->assertRedirect();
    expect(Webhook::query()->count())->toBe(0);
});

it('prunes old deliveries', function () {
    $webhook = webhookEndpoint(['order.placed']);
    WebhookDelivery::query()->create(['uuid' => (string) Str::uuid(), 'webhook_id' => $webhook->id, 'event' => 'order.placed', 'payload' => [], 'created_at' => now()->subDays(40)]);
    $recent = WebhookDelivery::query()->create(['uuid' => (string) Str::uuid(), 'webhook_id' => $webhook->id, 'event' => 'order.placed', 'payload' => []]);

    $this->artisan('commerce:prune')->assertSuccessful();
    expect(WebhookDelivery::query()->pluck('id')->all())->toBe([$recent->id]);
});
