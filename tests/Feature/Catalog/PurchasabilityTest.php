<?php

declare(strict_types=1);

use Spatie\Permission\Models\Role;
use Sunrice\Actions\Entries\TrashEntry;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\PriceVisibility;
use Sunrice\Commerce\Catalog\PurchaseModes;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\WhatsApp;
use Workbench\App\Models\User;

it('resolves the button from selling mode and purchase mode', function (string $mode, string $product, bool $cart, string $cta, array $links, string $expected) {
    expect(PurchaseModes::resolve($mode, $product, $cart, $cta, $links))->toBe($expected);
})->with([
    ['shop', 'default', true, 'inquiry', [], 'cart'],
    ['quote', 'cart', true, 'inquiry', [], 'cart'],
    ['whatsapp', 'default', true, 'none', [], 'cart'],
    ['shop', 'default', false, 'whatsapp', [], 'whatsapp'],       // cart module off
    ['catalog', 'default', true, 'inquiry', [], 'inquiry'],
    ['catalog', 'cart', true, 'whatsapp', [], 'whatsapp'],         // no cart in catalog mode
    ['catalog', 'default', true, 'external', [['url' => 'https://x']], 'external'],
    ['catalog', 'default', true, 'external', [], 'none'],          // no links of its own
    ['shop', 'inquiry', true, 'none', [], 'inquiry'],
    ['shop', 'external', true, 'inquiry', [['url' => 'https://x']], 'external'],
    ['shop', 'external', true, 'inquiry', [], 'inquiry'],
    ['shop', 'none', true, 'inquiry', [], 'none'],
]);

it('shows prices to whom the store chose', function () {
    $settings = app(StoreSettings::class);
    $visibility = app(PriceVisibility::class);
    $guest = null;
    $customer = User::query()->create(['name' => 'C', 'email' => 'c@example.com', 'password' => 'x']);
    $reseller = User::query()->create(['name' => 'R', 'email' => 'r@example.com', 'password' => 'x']);
    $reseller->assignRole(Role::findOrCreate('Reseller', 'web'));

    expect($visibility->visibleTo($guest))->toBeTrue();
    $settings->saveSection('catalog', ['price_visibility' => 'signed_in']);
    expect($visibility->visibleTo($guest))->toBeFalse()->and($visibility->visibleTo($customer))->toBeTrue();
    $settings->saveSection('catalog', ['price_visibility' => 'roles', 'price_visibility_roles' => ['Reseller']]);
    expect($visibility->visibleTo($customer))->toBeFalse()->and($visibility->visibleTo($reseller))->toBeTrue();
    $settings->saveSection('catalog', ['price_visibility' => 'nobody']);
    expect($visibility->visibleTo($reseller))->toBeFalse();
});

it('checks availability with reason codes', function () {
    $entry = publishProduct(['variants' => [['id' => 'a', 'price' => 10000, 'min_qty' => 2, 'qty_step' => 2, 'stock_status' => 'in_stock']]]);
    $variant = Product::query()->where('entry_id', $entry->id)->firstOrFail()->variants->first();
    $check = fn (int $qty) => app(Catalog::class)->check($variant->fresh(), $qty)->reason;

    expect($check(2))->toBeNull()
        ->and($check(3))->toBe('qty_rules')
        ->and($check(1))->toBe('qty_rules');

    $variant->update(['stock_status' => 'out_of_stock']);
    expect($check(2))->toBe('out_of_stock');
    $variant->update(['stock_status' => 'in_stock', 'active' => false]);
    expect($check(2))->toBe('inactive_variant');
    $variant->update(['active' => true]);

    app(StoreSettings::class)->saveSection('general', ['selling_mode' => 'catalog']);
    expect($check(2))->toBe('purchase_mode');
    app(StoreSettings::class)->saveSection('general', ['selling_mode' => 'shop']);
    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'nobody']);
    expect($check(2))->toBe('price_hidden');
});

it('refuses entries that are not live', function (Closure $hide) {
    $entry = publishProduct(['variants' => [['id' => 'a', 'price' => 10000]]]);
    $variant = Product::query()->where('entry_id', $entry->id)->firstOrFail()->variants->first();
    $hide($entry);

    expect(app(Catalog::class)->check($variant->fresh(), 1)->reason)->toBe('not_published');
})->with([
    'unpublished' => [fn ($entry) => $entry->update(['status' => 'draft'])],
    'scheduled' => [fn ($entry) => $entry->update(['published_at' => now()->addDay()])],
    'trashed' => [fn ($entry) => app(TrashEntry::class)->handle($entry)],
]);

it('rotates WhatsApp numbers and fills the message template', function () {
    $settings = app(StoreSettings::class);
    $settings->saveSection('general', ['whatsapp' => ['numbers' => [['number' => '0812-1111 1111'], ['number' => '+62 813 2222 2222']], 'rotation' => 'round_robin',
        'product_message' => ['id' => 'Mau {product} {variant} dong']]]);
    $whatsapp = app(WhatsApp::class);

    expect([$whatsapp->next(), $whatsapp->next(), $whatsapp->next()])->toBe(['6281211111111', '6281322222222', '6281211111111'])
        ->and($whatsapp->message('product_message', ['product' => 'Kaos', 'variant' => '(M)'], 'id'))->toBe('Mau Kaos (M) dong')
        ->and($whatsapp->message('product_message', ['product' => 'Kaos'], 'en'))->toBe("Hello, I'm interested in Kaos")
        ->and($whatsapp->url('628', 'a b&c'))->toBe('https://wa.me/628?text=a%20b%26c');
});

it('redirects calls to action to the product\'s own targets only', function () {
    app(StoreSettings::class)->saveSection('general', ['whatsapp' => ['numbers' => [['number' => '081211111111']]]]);
    $entry = publishProduct(['purchase_mode' => 'external', 'external_links' => [['preset' => 'tokopedia', 'url' => 'https://tokopedia.com/toko/kaos']],
        'variants' => [['id' => 'a', 'price' => 10000]]], title: 'Kaos');

    $this->get("/go/external/{$entry->id}")->assertRedirect('https://tokopedia.com/toko/kaos');
    $this->get("/go/external/{$entry->id}?link=5")->assertNotFound();
    $this->get("/go/external/{$entry->id}?url=https://evil.example")->assertRedirect('https://tokopedia.com/toko/kaos');
    expect($this->get("/go/whatsapp/{$entry->id}")->headers->get('Location'))->toStartWith('https://wa.me/6281211111111?text=');
    $this->get("/go/inquiry/{$entry->id}")->assertRedirectContains('#inquiry');
    $this->get('/go/whatsapp/999999')->assertNotFound();

    $entry->update(['status' => 'draft']);
    app()->forgetScopedInstances(); // a new request
    $this->get("/go/external/{$entry->id}")->assertNotFound();
});
