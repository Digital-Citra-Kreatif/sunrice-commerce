<?php

declare(strict_types=1);

namespace Workbench\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Sunrice\Actions\Entries\PublishTranslation;
use Sunrice\Actions\Entries\SaveDraft;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Orders\Actions\CreateManualOrder;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Regions\RegionImporter;
use Sunrice\Commerce\Shipping\Models\ShippingZone;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;
use Sunrice\Support\Locales;
use Workbench\App\Models\User;

/** A small store to click through: regions (fixture), two products, a shipping zone and an order. */
class DemoStoreSeeder extends Seeder
{
    public function run(): void
    {
        if (Variant::query()->where('sku', 'MUG')->exists()) {
            return;
        }
        (new RegionImporter(__DIR__.'/../../../tests/Fixtures/regions'))->import(4);
        app(ScaffoldStore::class)->handle();
        $collection = Collection::query()->where('handle', 'products')->firstOrFail();
        foreach ([['Gelas Kopi', 'MUG', 50000, 500], ['Kaos Polos', 'KAOS', 120000, 250]] as [$title, $sku, $price, $weight]) {
            $entry = Entry::query()->create(['collection_id' => $collection->id, 'status' => 'draft', 'sort_order' => 0]);
            $translation = $entry->translations()->create(['locale' => Locales::main(), 'collection_id' => $collection->id, 'title' => $title, 'slug' => Str::slug($title), 'data' => [], 'seo' => []]);
            app(SaveDraft::class)->handle($translation, ['title' => $title, 'slug' => Str::slug($title), 'data' => ['product' => [
                'variants' => [['id' => strtolower($sku), 'sku' => $sku, 'price' => $price, 'weight' => $weight, 'track_stock' => true, 'initial_stock' => 20]],
            ]]]);
            app(PublishTranslation::class)->handle($translation->fresh());
        }
        $zone = ShippingZone::query()->create(['name' => 'Indonesia']);
        $zone->regions()->create(['country' => 'ID']);
        $zone->methods()->create(['type' => 'flat', 'title' => ['id' => 'Reguler', 'en' => 'Regular'], 'etd' => ['id' => '2–3 hari', 'en' => '2–3 days'], 'settings' => ['cost' => 15000], 'active' => true]);
        $zone->methods()->create(['type' => 'pickup', 'title' => ['id' => 'Ambil di toko', 'en' => 'Store pickup'], 'settings' => ['locations' => [['name' => 'Toko Dago', 'address' => 'Jl. Dago 1, Bandung']]], 'active' => true]);

        $admin = User::query()->where('email', 'admin@example.com')->firstOrFail();
        app(CreateManualOrder::class)->handle([
            'email' => 'rina@example.com', 'name' => 'Rina', 'phone' => '0812 3456 7890',
            'lines' => [['variant_id' => Variant::query()->where('sku', 'MUG')->value('id'), 'quantity' => 2], ['variant_id' => Variant::query()->where('sku', 'KAOS')->value('id'), 'quantity' => 1]],
            'shipping_address' => ['name' => 'Rina', 'phone' => '0812 3456 7890', 'country' => 'ID', 'province_code' => '32', 'city_code' => '32.73', 'district_code' => '32.73.01', 'line1' => 'Jl. Sarijadi 1'],
            'shipping' => ['label' => 'JNE REG', 'cost' => 15000], 'payment_status' => 'unpaid',
        ], Actor::admin($admin), $admin);
    }
}
