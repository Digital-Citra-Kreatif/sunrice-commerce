<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\Actions\AnonymizeCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Marketing\Actions\LaunchCampaign;
use Sunrice\Commerce\Marketing\Actions\SaveCampaign;
use Sunrice\Commerce\Marketing\Audience;
use Sunrice\Commerce\Marketing\Jobs\RunAutomations;
use Sunrice\Commerce\Marketing\Jobs\SendMarketingEmails;
use Sunrice\Commerce\Marketing\Jobs\StartCampaign;
use Sunrice\Commerce\Marketing\MarketingMail;
use Sunrice\Commerce\Marketing\MessageBuilder;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Commerce\Marketing\Models\CampaignLink;
use Sunrice\Commerce\Marketing\Models\CampaignSend;
use Sunrice\Commerce\Marketing\SmartTags;
use Sunrice\Support\Locales;

use function Pest\Laravel\get;
use function Pest\Laravel\post;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    app(ToggleFeature::class)->handle('marketing', true);
    Mail::fake();
});

function marketingCustomer(string $email, array $attributes = []): Customer
{
    return Customer::query()->create(['email' => $email, 'name' => ucfirst(strtok($email, '@')).' Example', 'accepts_marketing' => true, 'marketing_consent_at' => now(), ...$attributes]);
}

function marketingCampaign(array $attributes = []): Campaign
{
    return Campaign::query()->create([
        'type' => 'campaign', 'name' => 'Spring sale', 'status' => 'draft',
        'audience' => ['match' => 'all', 'rules' => []],
        'content' => ['id' => ['subject' => 'Halo {first_name|Kak}', 'preheader' => '', 'body' => '<p>Hai {first_name}, cek <a href="https://shop.test/sale">promo</a>.</p>',
            'button_label' => 'Belanja', 'button_url' => '{store_url}']],
        ...$attributes,
    ]);
}

it('finds the audience by rules, only among customers who accept marketing', function () {
    marketingCustomer('lapsed@example.com', ['orders_count' => 2, 'total_spent' => 300_000, 'last_order_at' => now()->subDays(100)]);
    marketingCustomer('recent@example.com', ['orders_count' => 1, 'total_spent' => 50_000, 'last_order_at' => now()->subDays(3)]);
    marketingCustomer('new@example.com', ['created_at' => now()->subDays(2)]);
    marketingCustomer('old@example.com', ['created_at' => now()->subDays(400)]);
    Customer::query()->create(['email' => 'no-consent@example.com', 'orders_count' => 0]);
    marketingCustomer('gone@example.com', ['anonymized_at' => now()]);

    $emails = fn (array $rules, string $match = 'all') => app(Audience::class)->query(['match' => $match, 'rules' => $rules])->orderBy('email')->pluck('email')->all();

    expect($emails([]))->toBe(['lapsed@example.com', 'new@example.com', 'old@example.com', 'recent@example.com'])
        ->and($emails([['rule' => 'no_order_for_days', 'value' => 60]]))->toBe(['lapsed@example.com'])
        ->and($emails([['rule' => 'ordered_within_days', 'value' => 7]]))->toBe(['recent@example.com'])
        ->and($emails([['rule' => 'never_ordered']]))->toBe(['new@example.com', 'old@example.com'])
        ->and($emails([['rule' => 'signed_up_within_days', 'value' => 7]]))->toBe(['lapsed@example.com', 'new@example.com', 'recent@example.com'])
        ->and($emails([['rule' => 'spent_at_least', 'value' => 100_000]]))->toBe(['lapsed@example.com'])
        ->and($emails([['rule' => 'never_ordered'], ['rule' => 'signed_up_within_days', 'value' => 7]]))->toBe(['new@example.com'])
        ->and($emails([['rule' => 'no_order_for_days', 'value' => 60], ['rule' => 'ordered_within_days', 'value' => 7]], 'any'))->toBe(['lapsed@example.com', 'recent@example.com']);

    expect(fn () => Audience::clean(['rules' => [['rule' => 'no_order_for_days', 'value' => 'soon']]]))->toThrow(ValidationException::class)
        ->and(fn () => Audience::clean(['rules' => [['rule' => 'drop table']]]))->toThrow(ValidationException::class);
});

it('finds buyers of a product', function () {
    $buyer = marketingCustomer('buyer@example.com', ['orders_count' => 1]);
    marketingCustomer('other@example.com');
    $order = makeOrder(['customer_id' => $buyer->id, 'status' => 'processing']);
    publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000]]], title: 'Mug');
    $mug = Variant::query()->where('sku', 'MUG')->firstOrFail();
    $order->items()->create(['product_id' => $mug->product_id, 'variant_id' => $mug->id, 'name' => 'Mug', 'quantity' => 1, 'unit_price' => 50000, 'subtotal' => 50000, 'total' => 50000]);

    expect(app(Audience::class)->query(['rules' => [['rule' => 'bought_product', 'value' => [['id' => $mug->product_id, 'label' => 'Mug']]]]])->pluck('email')->all())
        ->toBe(['buyer@example.com']);
});

it('replaces smart tags, with fallbacks, escaped in HTML', function () {
    $tags = app(SmartTags::class);
    $values = ['first_name' => 'Ana <b>', 'store_name' => 'Toko', 'cart_items' => '<ul><li>1 × Mug</li></ul>', 'name' => ''];

    expect($tags->render('Hi {first_name}, {name|friend} at {store_name}. {unknown}', $values))->toBe('Hi Ana <b>, friend at Toko. {unknown}')
        ->and($tags->render('<p>{first_name}</p>{cart_items}', $values, html: true))->toBe('<p>Ana &lt;b&gt;</p><ul><li>1 × Mug</li></ul>')
        ->and($tags->render('<a href="%7Bstore_name%7D">x</a>', $values, html: true))->toBe('<a href="Toko">x</a>');
});

it('sends a campaign through the queue to its audience, with tracking and one-click unsubscribe', function () {
    marketingCustomer('ana@example.com', ['name' => 'Ana Putri']);
    marketingCustomer('budi@example.com', ['name' => 'Budi', 'locale' => 'en']);
    Customer::query()->create(['email' => 'nope@example.com']);
    $campaign = marketingCampaign(['content' => [
        'id' => ['subject' => 'Halo {first_name|Kak}', 'body' => '<p>Hai {first_name}, cek <a href="https://shop.test/sale">promo</a>.</p>', 'button_label' => '', 'button_url' => ''],
        'en' => ['subject' => 'Hello {first_name}', 'body' => '', 'button_label' => '', 'button_url' => ''],
    ]]);

    app(LaunchCampaign::class)->handle($campaign);

    $campaign->refresh();
    expect($campaign->status)->toBe('sent')
        ->and($campaign->recipients_count)->toBe(2)
        ->and($campaign->sent_count)->toBe(2);
    Mail::assertSent(MarketingMail::class, 2);
    Mail::assertSent(MarketingMail::class, function (MarketingMail $mail) {
        $mail->build();
        $html = $mail->render();
        $send = CampaignSend::query()->where('email', 'ana@example.com')->firstOrFail();

        return $mail->hasTo('ana@example.com') && $mail->subject === 'Halo Ana'
            && str_contains($html, 'Hai Ana')
            && str_contains($html, '/mail/c/'.$send->token.'/'.CampaignLink::hashFor('https://shop.test/sale'))
            && str_contains($html, '/mail/o/'.$send->token.'.gif')
            && str_contains($html, '/mail/u/'.$send->token)
            && ! str_contains($html, 'href="https://shop.test/sale"');
    });
    // English subject, the body falls back to the main language's.
    Mail::assertSent(MarketingMail::class, fn (MarketingMail $mail) => $mail->hasTo('budi@example.com') && $mail->subject === 'Hello Budi');
    Mail::assertNotSent(MarketingMail::class, fn (MarketingMail $mail) => $mail->hasTo('nope@example.com'));

    // Sending again never emails anyone twice.
    expect(fn () => app(LaunchCampaign::class)->handle($campaign))->toThrow(ValidationException::class);
});

it('counts opens and clicks once each, and redirects only to the email\'s own links', function () {
    marketingCustomer('ana@example.com');
    $campaign = marketingCampaign();
    app(LaunchCampaign::class)->handle($campaign);
    $send = CampaignSend::query()->firstOrFail();
    $hash = CampaignLink::hashFor('https://shop.test/sale');

    get("/mail/o/{$send->token}.gif")->assertOk()->assertHeader('Content-Type', 'image/gif');
    get("/mail/o/{$send->token}.gif")->assertOk();
    get("/mail/c/{$send->token}/{$hash}")->assertRedirect('https://shop.test/sale');
    get("/mail/c/{$send->token}/{$hash}")->assertRedirect('https://shop.test/sale');
    get("/mail/c/{$send->token}/".str_repeat('a', 16))->assertRedirect(url('/'));
    get('/mail/c/'.str_repeat('x', 40)."/{$hash}")->assertRedirect(url('/'));

    $campaign->refresh();
    $send->refresh();
    expect($campaign->opened_count)->toBe(1)->and($campaign->clicked_count)->toBe(1)
        ->and($send->open_count)->toBe(4)->and($send->click_count)->toBe(2) // a click is also an open
        ->and(CampaignLink::query()->where('hash', $hash)->first()?->only(['clicks', 'unique_clicks']))->toBe(['clicks' => 2, 'unique_clicks' => 1]);
});

it('unsubscribes with the email\'s link, and leaves them out of the next campaign', function () {
    $ana = marketingCustomer('ana@example.com');
    marketingCustomer('budi@example.com');
    app(LaunchCampaign::class)->handle(marketingCampaign());
    $send = CampaignSend::query()->where('email', 'ana@example.com')->firstOrFail();

    get("/mail/u/{$send->token}")->assertOk()->assertSee('ana@example.com');
    expect($ana->fresh()->accepts_marketing)->toBeTrue(); // a link checker opening the page changes nothing
    post("/mail/u/{$send->token}")->assertOk();
    expect($ana->fresh()->accepts_marketing)->toBeFalse()
        ->and($ana->fresh()->meta['marketing_unsubscribed_at'] ?? null)->not->toBeNull()
        ->and(Campaign::query()->first()->unsubscribed_count)->toBe(1);
    post('/mail/u/'.str_repeat('x', 40))->assertNotFound();

    Mail::fake();
    app(LaunchCampaign::class)->handle(marketingCampaign(['name' => 'Next']));
    Mail::assertSent(MarketingMail::class, 1);
    Mail::assertNotSent(MarketingMail::class, fn (MarketingMail $mail) => $mail->hasTo('ana@example.com'));
});

it('skips someone who unsubscribed after the email was queued', function () {
    Queue::fake();
    $ana = marketingCustomer('ana@example.com');
    $campaign = marketingCampaign();
    app(LaunchCampaign::class)->handle($campaign);
    Queue::assertPushed(StartCampaign::class);
    app()->call([new StartCampaign($campaign->id), 'handle']);
    $batch = Queue::pushed(SendMarketingEmails::class)->first();

    $ana->forceFill(['accepts_marketing' => false])->save();
    app()->call([$batch, 'handle']);

    expect(CampaignSend::query()->first()->status)->toBe('skipped')
        ->and($campaign->fresh()->status)->toBe('sent');
    Mail::assertNothingSent();
});

it('sends scheduled campaigns when they are due', function () {
    marketingCustomer('ana@example.com');
    $campaign = marketingCampaign();
    app(LaunchCampaign::class)->handle($campaign, now()->addHour());
    expect($campaign->fresh()->status)->toBe('scheduled');

    $this->artisan('commerce:tick');
    Mail::assertNothingSent();

    $this->travel(61)->minutes();
    $this->artisan('commerce:tick');
    expect($campaign->fresh()->status)->toBe('sent');
    Mail::assertSent(MarketingMail::class, 1);
});

it('emails abandoned carts once, to customers and to guests who agreed at checkout', function () {
    publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000]]], title: 'Mug');
    $mug = Variant::query()->where('sku', 'MUG')->firstOrFail();
    $ana = marketingCustomer('ana@example.com');
    $cart = function (array $attributes) use ($mug) {
        $cart = Cart::query()->create(['token' => Str::random(64), 'status' => 'active', 'last_activity_at' => now()->subHours(3)->subMinutes(5), ...$attributes]);
        $cart->items()->create(['variant_id' => $mug->id, 'quantity' => 2, 'unit_price_seen' => 50000]);

        return $cart;
    };
    $customerCart = $cart(['customer_id' => $ana->id]);
    $cart(['checkout' => ['email' => 'guest@example.com', 'accepts_marketing' => true]]);
    $cart(['checkout' => ['email' => 'quiet@example.com', 'accepts_marketing' => false]]);
    $cart(['customer_id' => $ana->id, 'last_activity_at' => now()->subMinutes(30)]); // not yet

    $automation = Campaign::query()->create(['type' => 'automation', 'name' => 'Abandoned cart', 'status' => 'active', 'trigger' => 'abandoned_cart',
        'trigger_config' => ['delay' => 3], 'last_run_at' => now()->subMinutes(10), 'audience' => ['match' => 'all', 'rules' => []],
        'content' => ['id' => ['subject' => 'Keranjang Anda', 'body' => '<p>{cart_items}</p>', 'button_label' => 'Lanjut', 'button_url' => '{cart_url}']]]);

    RunAutomations::dispatchSync();
    RunAutomations::dispatchSync();

    Mail::assertSent(MarketingMail::class, 2);
    Mail::assertSent(MarketingMail::class, function (MarketingMail $mail) {
        $mail->build();

        return $mail->hasTo('ana@example.com') && str_contains($mail->render(), '2 × Mug');
    });
    Mail::assertSent(MarketingMail::class, fn (MarketingMail $mail) => $mail->hasTo('guest@example.com'));
    expect($automation->fresh()->sent_count)->toBe(2);

    // {cart_url} brings a guest's cart back on their browser.
    $guestSend = CampaignSend::query()->where('email', 'guest@example.com')->firstOrFail();
    $guestCart = Cart::query()->findOrFail($guestSend->context['cart_id']);
    get("/cart/restore/{$guestSend->token}")->assertRedirect()->assertCookie('commerce_cart', $guestCart->token);
    expect($customerCart->id)->not->toBe($guestCart->id);
});

it('emails customers who stopped ordering, once per last order, within the automation\'s audience', function () {
    marketingCustomer('lapsed@example.com', ['orders_count' => 3, 'last_order_at' => now()->subDays(60)->subMinutes(5)]);
    marketingCustomer('lapsed-once@example.com', ['orders_count' => 1, 'last_order_at' => now()->subDays(60)->subMinutes(5)]);
    marketingCustomer('active@example.com', ['orders_count' => 3, 'last_order_at' => now()->subDays(5)]);
    Campaign::query()->create(['type' => 'automation', 'name' => 'Win back', 'status' => 'active', 'trigger' => 'win_back',
        'trigger_config' => ['delay' => 60], 'last_run_at' => now()->subMinutes(10),
        'audience' => ['match' => 'all', 'rules' => [['rule' => 'orders_at_least', 'value' => 2]]],
        'content' => ['id' => ['subject' => 'Kangen', 'body' => '<p>{days_since_last_order} hari</p>']]]);

    RunAutomations::dispatchSync();

    Mail::assertSent(MarketingMail::class, 1);
    Mail::assertSent(MarketingMail::class, fn (MarketingMail $mail) => $mail->hasTo('lapsed@example.com'));
});

it('lets staff with the permission build, preview, test and send campaigns', function () {
    marketingCustomer('ana@example.com', ['name' => 'Ana Putri', 'orders_count' => 0]);
    actingAsUserWith(['commerce.customers.view'], 'helper@example.com');
    get('/cms/commerce/marketing/campaigns')->assertForbidden();

    actingAsUserWith(['commerce.marketing.manage'], 'marketer@example.com');
    get('/cms/commerce/marketing/campaigns')->assertOk();
    get('/cms/commerce/marketing/campaigns/create?template=first_order')->assertOk()
        ->assertInertia(fn ($page) => $page->component('Commerce/Marketing/Editor')
            ->where('campaign.audience.rules.1.rule', 'never_ordered')
            ->where('campaign.content.id.subject', 'Siap untuk pesanan pertama, {first_name|Kak}?'));

    $audience = ['match' => 'all', 'rules' => [['rule' => 'never_ordered']]];
    $this->postJson('/cms/commerce/marketing/audience', ['audience' => $audience])->assertOk()->assertJson(['count' => 1, 'sample' => [['email' => 'ana@example.com']]]);

    $content = ['id' => ['subject' => 'Halo {first_name}', 'body' => '<p>Hai {first_name|Kak}!</p>', 'button_label' => 'Lihat', 'button_url' => '{store_url}']];
    post('/cms/commerce/marketing/preview', ['content' => $content, 'audience' => $audience])->assertOk()->assertSee('Hai Ana!', false);
    post('/cms/commerce/marketing/test', ['content' => $content, 'audience' => $audience])->assertRedirect();
    Mail::assertSent(MarketingMail::class, fn (MarketingMail $mail) => $mail->hasTo('marketer@example.com') && $mail->subject === '[Test] Halo Ana');

    post('/cms/commerce/marketing/campaigns', ['name' => 'Hello', 'audience' => $audience, 'content' => ['id' => ['subject' => '']]])
        ->assertSessionHasErrors('content.id.subject');
    post('/cms/commerce/marketing/campaigns', ['name' => 'Hello', 'audience' => $audience, 'content' => $content])->assertRedirect();
    $campaign = Campaign::query()->where('name', 'Hello')->firstOrFail();

    post("/cms/commerce/marketing/{$campaign->id}/send")->assertRedirect("/cms/commerce/marketing/{$campaign->id}");
    expect($campaign->fresh()->status)->toBe('sent');
    get("/cms/commerce/marketing/{$campaign->id}")->assertOk()->assertInertia(fn ($page) => $page->component('Commerce/Marketing/Report')->where('stats.sent', 1));
    $this->put("/cms/commerce/marketing/{$campaign->id}", ['name' => 'Changed', 'content' => $content])->assertSessionHasErrors('name');
});

it('turns automations on from now, without emailing who was already due', function () {
    marketingCustomer('lapsed@example.com', ['orders_count' => 3, 'last_order_at' => now()->subDays(90)]);
    actingAsUserWith(['commerce.marketing.manage']);
    post('/cms/commerce/marketing/automations', ['name' => 'Win back', 'trigger' => 'win_back', 'delay' => 60,
        'content' => ['id' => ['subject' => 'Kangen', 'body' => '<p>Hai</p>']]])->assertRedirect();
    $automation = Campaign::query()->where('type', 'automation')->firstOrFail();
    expect($automation->status)->toBe('draft');

    post("/cms/commerce/marketing/{$automation->id}/status", ['active' => true])->assertRedirect();
    RunAutomations::dispatchSync();
    expect($automation->fresh()->status)->toBe('active');
    Mail::assertNothingSent();
});

it('keeps the module out of the way while it is off', function () {
    app(ToggleFeature::class)->handle('marketing', false);
    actingAsUserWith(['commerce.marketing.manage']);
    get('/cms/commerce/marketing/campaigns')->assertNotFound();
});

it('forgets marketing emails sent to a customer who is anonymized', function () {
    $ana = marketingCustomer('ana@example.com');
    app(LaunchCampaign::class)->handle(marketingCampaign());
    expect(CampaignSend::query()->count())->toBe(1);

    app(AnonymizeCustomer::class)->handle($ana);
    expect(CampaignSend::query()->count())->toBe(0)
        ->and(Campaign::query()->first()->sent_count)->toBe(1);
});

it('starts automations from their templates in every language', function () {
    actingAsUserWith(['commerce.marketing.manage']);
    get('/cms/commerce/marketing/automations/create?trigger=abandoned_cart')->assertOk()
        ->assertInertia(fn ($page) => $page->where('campaign.trigger', 'abandoned_cart')->where('campaign.delay', 3)
            ->where('campaign.content.en.button_url', '{cart_url}')
            ->where('campaign.content.'.Locales::main().'.button_label', 'Kembali ke keranjang'));
});

it('keeps smart tags in the links of the email\'s text', function () {
    marketingCustomer('ana@example.com');
    $campaign = app(SaveCampaign::class)->handle(new Campaign(['type' => 'campaign', 'status' => 'draft']), [
        'name' => 'Links', 'content' => ['id' => ['subject' => 'Hai', 'body' => '<p><a href="{account_url}">Akun saya</a> <a href="javascript:alert(1)">x</a></p>']],
    ]);
    $message = app(MessageBuilder::class)->build($campaign, null, 'ana@example.com', 'id', '', [], track: false);

    expect($message['html'])->toContain('href="'.url('/account').'"')->not->toContain('javascript:');
});
