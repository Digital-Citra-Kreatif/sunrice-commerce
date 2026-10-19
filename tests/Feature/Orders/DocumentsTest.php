<?php

declare(strict_types=1);

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Sunrice\Commerce\Documents\Documents;
use Sunrice\Commerce\Orders\Models\Document;
use Sunrice\Commerce\Orders\Models\Order;
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

it('shows where to transfer while unpaid, and the customer\'s note', function () {
    $this->order->forceFill(['customer_note' => 'Tolong dibungkus kado'])->save();
    $this->order->payments()->create(['method' => 'bank_transfer', 'amount' => 100000, 'status' => 'pending',
        'instructions' => ['accounts' => [['bank' => 'BCA', 'number' => '1234567890', 'holder' => 'PT Sunrice', 'branch' => null]]]]);
    $documents = app(Documents::class);

    expect($documents->html(collect([$this->order->fresh()]), 'invoice'))->toContain('Transfer ke')->toContain('1234567890')->toContain('PT Sunrice')
        ->toContain('Tolong dibungkus kado');

    $this->order->forceFill(['payment_status' => 'paid'])->save();
    expect($documents->html(collect([$this->order->fresh()]), 'invoice'))->not->toContain('1234567890');
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

it('loads the orders of bulk packing slips together, not one by one', function () {
    $documents = app(Documents::class);
    $orders = function (int $count): Collection {
        foreach (range(1, $count) as $i) {
            $order = makeOrder(['shipping_address' => ['name' => 'Rina', 'country' => 'ID', 'line1' => "Jl. Uji {$i}"]]);
            $order->items()->create(['name' => "Produk {$i}", 'sku' => "P{$i}", 'quantity' => 1]);
        }

        return Order::query()->orderBy('id')->get();
    };
    $measure = function ($orders) use ($documents): int {
        DB::flushQueryLog();
        DB::enableQueryLog();
        $documents->html($orders, 'packing_slip');
        $count = count(DB::getQueryLog());
        DB::disableQueryLog();

        return $count;
    };
    $documents->html(Order::query()->get(), 'packing_slip'); // store settings, read once
    $few = $measure($orders(1));

    expect($measure($orders(8)))->toBe($few);
});

it('renders bulk packing slips in batches into one PDF, a page per order in order', function () {
    config(['commerce.documents.batch_size' => 2]);
    foreach (range(2, 5) as $i) {
        makeOrder(['number' => "ORD-{$i}", 'shipping_address' => ['name' => 'Rina', 'country' => 'ID', 'line1' => "Jl. Uji {$i}"]]);
    }
    $pdf = app(Documents::class)->bulkPdf(Order::query()->orderBy('id')->get());

    // The page texts: dompdf compresses each page's content and writes its text in UTF-16.
    preg_match_all('#stream\r?\n(.*?)\r?\nendstream#s', $pdf, $streams);
    $text = str_replace("\0", '', implode('', array_map(fn (string $stream) => (string) @gzuncompress($stream), $streams[1])));
    preg_match_all('#\(ORD-(\d)\)#', $text, $numbers);

    expect(substr($pdf, 0, 5))->toBe('%PDF-')->and($pdf)->toContain('/Count 5')
        ->and(array_values(array_unique($numbers[1])))->toBe(['1', '2', '3', '4', '5']);
});
