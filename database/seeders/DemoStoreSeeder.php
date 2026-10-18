<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Sunrice\Actions\Entries\PublishTranslation;
use Sunrice\Actions\Entries\SaveDraft;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Orders\Actions\CreateManualOrder;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Promotions\Actions\SaveFlashSale;
use Sunrice\Commerce\Promotions\Actions\SaveVoucher;
use Sunrice\Commerce\Settings\Actions\SaveStoreSettings;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Models\ShippingZone;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;
use Sunrice\Support\Locales;

/**
 * A demo store (commerce:install --demo): store details, a simple, a
 * variable, a digital and a bundle product, bank transfer and cash on
 * delivery, Indonesian shipping, a voucher, a flash sale and one order.
 * Everything is saved through the same actions as the admin. Runs once:
 * a store that already has the demo mug is left alone.
 */
class DemoStoreSeeder extends Seeder
{
    public function run(): void
    {
        if (Variant::query()->where('sku', 'DEMO-MUG')->exists()) {
            return;
        }
        app(ScaffoldStore::class)->handle();
        $settings = app(StoreSettings::class);
        if (blank($settings->get('general.name'))) {
            app(SaveStoreSettings::class)->handle('general', [...$settings->section('general'),
                'name' => 'Toko Kopi Contoh', 'email' => 'halo@example.com', 'phone' => '0812 0000 0000',
                'address' => ['line1' => 'Jl. Dago 1', 'region' => ['country' => 'ID', 'province_code' => '32', 'city_code' => '32.73'], 'postal_code' => '40135'],
            ]);
        }

        $mug = $this->product('Gelas Kopi', ['variants' => [['id' => 'mug', 'sku' => 'DEMO-MUG', 'price' => 50000, 'compare_at_price' => 65000, 'weight' => 500,
            'track_stock' => true, 'initial_stock' => 25]]], 'Gelas keramik 350 ml.');
        $this->product('Kaos Kopi', ['type' => 'variable',
            'options' => [['id' => 'size', 'name' => 'Ukuran', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M'], ['id' => 'l', 'label' => 'L']]]],
            'variants' => array_map(fn (string $size, int $stock) => ['id' => "kaos-{$size}", 'sku' => 'DEMO-KAOS-'.strtoupper($size), 'price' => 120000, 'weight' => 250,
                'options' => ['size' => $size], 'track_stock' => true, 'initial_stock' => $stock], ['s', 'm', 'l'], [5, 12, 0])], 'Kaos katun 30s.');
        $this->product('Biji Kopi Arabika 250 g', ['variants' => [['id' => 'beans', 'sku' => 'DEMO-BEANS', 'price' => 85000, 'weight' => 270,
            'track_stock' => true, 'initial_stock' => 40]]], 'Arabika Java Preanger, sangrai medium.');
        $this->product('E-book Resep Kopi', ['type' => 'digital', 'requires_shipping' => false, 'downloadable' => true,
            'downloads' => [['type' => 'url', 'url' => 'https://example.com/resep-kopi.pdf', 'name' => 'Resep Kopi (PDF)']],
            'variants' => [['id' => 'ebook', 'sku' => 'DEMO-EBOOK', 'price' => 35000]]], '25 resep kopi rumahan.');
        $this->product('Paket Ngopi', ['type' => 'bundle', 'bundle' => ['pricing' => 'percent_off', 'value' => 1000, 'items' => [
            ['variant_id' => $this->variant('DEMO-MUG'), 'quantity' => 1], ['variant_id' => $this->variant('DEMO-BEANS'), 'quantity' => 1],
        ]], 'variants' => [['id' => 'bundle', 'sku' => 'DEMO-PAKET', 'price' => 0]]], 'Gelas dan biji kopi, hemat 10%.');

        $payments = (array) ($settings->stored()['payments'] ?? []);
        $payments['methods']['bank_transfer'] = [...(array) ($payments['methods']['bank_transfer'] ?? []), 'active' => true, 'title' => ['id' => 'Transfer bank', 'en' => 'Bank transfer'],
            'accounts' => [['bank' => 'bca', 'number' => '1234567890', 'holder' => 'Toko Kopi Contoh']], 'unique_code' => 'add'];
        $payments['methods']['cod'] = [...(array) ($payments['methods']['cod'] ?? []), 'active' => true, 'title' => ['id' => 'Bayar di tempat', 'en' => 'Cash on delivery']];
        $settings->saveSection('payments', $payments);

        if (ShippingZone::query()->doesntExist()) {
            $zone = ShippingZone::query()->create(['name' => 'Indonesia']);
            $zone->regions()->create(['country' => 'ID']);
            $zone->methods()->create(['type' => 'weight', 'title' => ['id' => 'Reguler', 'en' => 'Regular'], 'etd' => ['id' => '2–4 hari', 'en' => '2–4 days'],
                'settings' => ['mode' => 'per_kg', 'price_per_kg' => 12000, 'tolerance' => 300], 'active' => true]);
            $zone->methods()->create(['type' => 'free', 'title' => ['id' => 'Gratis ongkir', 'en' => 'Free shipping'], 'settings' => ['requires' => 'min_subtotal', 'min_subtotal' => 300000], 'active' => true]);
            $zone->methods()->create(['type' => 'pickup', 'title' => ['id' => 'Ambil di toko', 'en' => 'Store pickup'],
                'settings' => ['locations' => [['name' => 'Toko Dago', 'address' => 'Jl. Dago 1, Bandung']]], 'active' => true]);
        }

        $voucher = app(SaveVoucher::class);
        $voucher->handle($voucher->blank(), [...$voucher->values($voucher->blank()), 'name' => 'Hemat 10%', 'code' => 'KOPI10', 'type' => 'percent', 'percent' => 10,
            'max_discount' => 50000, 'min_subtotal' => 100000]);
        $sale = app(SaveFlashSale::class);
        $sale->handle($sale->blank(), [...$sale->values($sale->blank()), 'name' => 'Kilat Gajian',
            'dates' => ['start' => now()->startOfHour()->toIso8601String(), 'end' => now()->addDays(3)->startOfHour()->toIso8601String()],
            'items' => [['target' => [['type' => 'product', 'id' => $mug->product_id]], 'discount_type' => 'percent_off', 'percent' => 20, 'quantity_limit' => 10]]]);

        app(CreateManualOrder::class)->handle([
            'email' => 'rina@example.com', 'name' => 'Rina', 'phone' => '0812 3456 7890',
            'lines' => [['variant_id' => $this->variant('DEMO-MUG'), 'quantity' => 2], ['variant_id' => $this->variant('DEMO-KAOS-M'), 'quantity' => 1]],
            'shipping_address' => ['name' => 'Rina', 'phone' => '0812 3456 7890', 'country' => 'ID', 'province_code' => '32', 'city_code' => '32.73', 'line1' => 'Jl. Sarijadi 1'],
            'shipping' => ['label' => 'Reguler', 'cost' => 12000], 'payment_status' => 'unpaid',
        ], Actor::system(), null);
    }

    /** @param  array<string, mixed>  $value */
    protected function product(string $title, array $value, string $excerpt): Variant
    {
        $collection = Collection::query()->where('handle', (string) (config('commerce.catalog.collections', ['products'])[0] ?? 'products'))->firstOrFail();
        $entry = Entry::query()->create(['collection_id' => $collection->id, 'status' => 'draft', 'sort_order' => 0]);
        $translation = $entry->translations()->create(['locale' => Locales::main(), 'collection_id' => $collection->id, 'title' => $title,
            'slug' => Str::slug($title), 'data' => [], 'seo' => []]);
        app(SaveDraft::class)->handle($translation, ['title' => $title, 'slug' => Str::slug($title), 'data' => ['excerpt' => $excerpt, 'product' => $value]]);
        app(PublishTranslation::class)->handle($translation->fresh());

        return Variant::query()->where('sku', $value['variants'][0]['sku'])->firstOrFail();
    }

    protected function variant(string $sku): int
    {
        return (int) Variant::query()->where('sku', $sku)->value('id');
    }
}
