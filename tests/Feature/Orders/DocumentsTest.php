<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Storage;
use Sunrice\Commerce\Documents\Documents;
use Sunrice\Commerce\Orders\Models\Document;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    Storage::fake('local');
    app(StoreSettings::class)->saveSection('general', ['name' => 'Toko Sunrice', 'tax_id' => '01.234.567.8-901.000']);
    $this->order = makeOrder(['number' => 'ORD-1', 'customer_name' => 'Rina', 'billing_address' => ['name' => 'Rina', 'country' => 'ID', 'line1' => 'Jl. Sarijadi 1'],
        'shipping_address' => ['name' => 'Rina', 'country' => 'ID', 'line1' => 'Jl. Sarijadi 1'], 'shipping_method' => ['label' => 'JNE REG'], 'shipping_total' => 10000,
        'locale' => 'id', 'dropship' => ['name' => 'Toko Ani', 'phone' => '0811']]);
    $this->order->items()->create(['name' => 'Gelas Kopi', 'sku' => 'MUG', 'quantity' => 2, 'unit_price' => 45000, 'subtotal' => 90000, 'total' => 90000]);
});

it('renders each document as HTML and PDF', function () {
    $documents = app(Documents::class);
    $invoice = $documents->html(collect([$this->order]), 'invoice');
    expect($invoice)->toContain('Faktur')->toContain('Toko Sunrice')->toContain('Gelas Kopi')->toContain('Rp45.000')->toContain('01.234.567.8-901.000');
    $slip = $documents->html(collect([$this->order]), 'packing_slip');
    expect($slip)->toContain('Slip pengiriman')->toContain('Toko Ani')->toContain('JNE REG')->not->toContain('Rp45.000');

    expect(substr($documents->pdf($this->order, 'invoice'), 0, 5))->toBe('%PDF-');
    $quote = makeOrder(['type' => 'quote', 'number' => null, 'quote_number' => 'Q-1', 'quote_valid_until' => now()->addDays(7), 'locale' => 'en']);
    expect($documents->html(collect([$quote]), 'quotation'))->toContain('Quotation')->toContain('Q-1');
});

it('assigns the invoice number once and regenerates after an edit', function () {
    $documents = app(Documents::class);
    $first = $documents->invoiceNumber($this->order);
    expect($first)->toStartWith('INV/')->and($documents->invoiceNumber($this->order))->toBe($first);

    $documents->pdf($this->order, 'invoice');
    $doc = Document::query()->where('type', 'invoice')->sole();
    expect($doc->order_version)->toBe(1)->and(Storage::disk('local')->exists($doc->path))->toBeTrue();
    $documents->pdf($this->order, 'invoice');
    expect(Document::query()->where('type', 'invoice')->sole()->path)->toBe($doc->path);

    $this->order->forceFill(['version' => 2])->save();
    $documents->pdf($this->order->fresh(), 'invoice');
    $doc->refresh();
    expect($doc->order_version)->toBe(2)->and($doc->number)->toBe($first)->and(Storage::disk('local')->exists($doc->path))->toBeTrue();
});

it('serves documents to staff with the permission and invoices to customers by key', function () {
    actingAsUserWith(['commerce.orders.view']);
    $this->get("/cms/commerce/orders/{$this->order->id}/documents/invoice")->assertForbidden();
    actingAsUserWith(['commerce.orders.view', 'commerce.documents.view'], 'docs@example.com');
    $this->get("/cms/commerce/orders/{$this->order->id}/documents/invoice")->assertOk()->assertHeader('Content-Type', 'application/pdf');
    $other = makeOrder();
    $response = $this->get("/cms/commerce/orders/packing-slips?ids={$this->order->id},{$other->id}")->assertOk();
    expect(substr((string) $response->getContent(), 0, 5))->toBe('%PDF-');
    $this->post('/cms/commerce/orders/bulk', ['action' => 'packing_slips', 'ids' => [$this->order->id]])->assertRedirect();

    $this->get("/order/{$this->order->order_key}/invoice")->assertNotFound(); // unpaid
    $this->order->forceFill(['payment_status' => 'paid', 'status' => 'processing'])->save();
    $this->get("/order/{$this->order->order_key}/invoice")->assertOk()->assertHeader('Content-Type', 'application/pdf');
    app(StoreSettings::class)->saveSection('documents', ['customer_invoice_download' => false]);
    $this->get("/order/{$this->order->order_key}/invoice")->assertNotFound();
});
