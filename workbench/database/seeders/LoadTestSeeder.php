<?php

declare(strict_types=1);

namespace Workbench\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Sunrice\Actions\Entries\PublishTranslation;
use Sunrice\Actions\Entries\SaveDraft;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Promotions\Actions\SaveFlashSale;
use Sunrice\Commerce\Promotions\Actions\SavePricingRule;
use Sunrice\Commerce\Promotions\Actions\SaveVoucher;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;
use Sunrice\Models\Taxonomy;
use Sunrice\Models\Term;
use Sunrice\Support\Locales;
use Workbench\App\Models\User;

/**
 * A large store for load and performance testing, on top of the demo store.
 *
 *   LOADTEST_PRODUCTS=2000 LOADTEST_ORDERS=20000 LOADTEST_CUSTOMERS=5000 \
 *     vendor/bin/testbench db:seed --class='Workbench\Database\Seeders\LoadTestSeeder'
 *
 * Products, categories, brands, vouchers, flash sales and pricing rules go
 * through Sunrice's and commerce's own actions (so the projection, stock and
 * catalog version are real). Customers, addresses, orders (with items,
 * payments, shipments and events) and product view counters are bulk inserted
 * with consistent totals; run `commerce:stats --rebuild` afterwards for the
 * daily statistics. A customer account customer@example.com / password is
 * added. Uses mt_srand(LOADTEST_SEED), so runs are repeatable.
 */
class LoadTestSeeder extends Seeder
{
    protected int $products;

    protected int $orders;

    protected int $customers;

    /** @var array<int, array{id: int, product_id: int, entry_id: int, name: string, title: string, sku: string, price: int, weight: int, shipping: bool, digital: bool}> */
    protected array $variants = [];

    public function run(): void
    {
        $this->products = (int) env('LOADTEST_PRODUCTS', 2000);
        $this->orders = (int) env('LOADTEST_ORDERS', 20000);
        $this->customers = (int) env('LOADTEST_CUSTOMERS', 5000);
        mt_srand((int) env('LOADTEST_SEED', 42));
        DB::disableQueryLog();

        if (Variant::query()->where('sku', 'DEMO-MUG')->doesntExist()) {
            $this->call(DemoStoreSeeder::class);
        }
        if (Variant::query()->where('sku', 'like', 'LT-%')->exists()) {
            $this->command?->warn('The load test store is already seeded.');

            return;
        }

        $this->step('Taxonomies', fn () => $this->taxonomies());
        $this->step("{$this->products} products", fn () => $this->catalog());
        $this->step('Promotions', fn () => $this->promotions());
        $this->step("{$this->customers} customers", fn () => $this->customerRows());
        $this->step("{$this->orders} orders", fn () => $this->orderRows());
        $this->step('Product views', fn () => $this->views());
    }

    protected function step(string $label, callable $callback): void
    {
        $start = microtime(true);
        $callback();
        $this->command?->info(sprintf('%s: %.1fs', $label, microtime(true) - $start));
    }

    /** @var array<string, array<int, int>> */
    protected array $terms = [];

    /** Categories four levels deep, brands, tags and three attribute taxonomies. */
    protected function taxonomies(): void
    {
        $roots = ['Kopi', 'Teh', 'Peralatan Seduh', 'Pakaian', 'Aksesori', 'Makanan Ringan', 'Buku', 'Rumah Tangga'];
        foreach ($roots as $root) {
            $a = $this->term('product_categories', $root);
            foreach (range(1, 4) as $i) {
                $b = $this->term('product_categories', "{$root} {$i}", $a);
                foreach (range(1, 3) as $j) {
                    $c = $this->term('product_categories', "{$root} {$i}.{$j}", $b);
                    foreach (range(1, 2) as $k) {
                        $this->terms['leaf'][] = $this->term('product_categories', "{$root} {$i}.{$j}.{$k}", $c);
                    }
                }
            }
        }
        foreach (range(1, 150) as $i) {
            $this->terms['brands'][] = $this->term('brands', 'Merek '.Str::title(Str::random(5))." {$i}");
        }
        foreach (range(1, 60) as $i) {
            $this->terms['product_tags'][] = $this->term('product_tags', "Tag {$i}");
        }
        $attributes = ['colors' => ['Merah', 'Biru', 'Hijau', 'Hitam', 'Putih', 'Kuning', 'Ungu', 'Abu-abu', 'Cokelat', 'Krem'],
            'sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL'], 'materials' => ['Katun', 'Linen', 'Poliester', 'Wol', 'Bambu']];
        $products = Collection::query()->where('handle', 'products')->firstOrFail();
        foreach ($attributes as $handle => $names) {
            $taxonomy = Taxonomy::query()->firstOrCreate(['handle' => $handle], ['title' => Str::title($handle), 'settings' => []]);
            $products->taxonomies()->syncWithoutDetaching([$taxonomy->id]);
            foreach ($names as $name) {
                $this->terms[$handle][] = $this->term($handle, $name);
            }
        }
        $settings = app(StoreSettings::class);
        $settings->saveSection('catalog', [...$settings->section('catalog'), 'attribute_taxonomies' => array_keys($attributes)]);
    }

    protected function term(string $taxonomy, string $name, ?int $parent = null): int
    {
        $taxonomyId = (int) Taxonomy::query()->where('handle', $taxonomy)->value('id');
        $term = Term::query()->create(['taxonomy_id' => $taxonomyId, 'parent_id' => $parent, 'sort_order' => 0]);
        $term->translations()->create(['taxonomy_id' => $taxonomyId, 'locale' => Locales::main(), 'name' => $name, 'slug' => Str::slug($name), 'data' => [], 'is_ready' => true]);

        return (int) $term->id;
    }

    /** Simple (55%), variable (30%, up to three options and 100 variants), digital (8%) and bundles (7%). */
    protected function catalog(): void
    {
        $collection = Collection::query()->where('handle', 'products')->firstOrFail();
        $words = ['Arabika', 'Robusta', 'Gayo', 'Toraja', 'Kintamani', 'Flores', 'Premium', 'Klasik', 'Spesial', 'Organik', 'Sangrai', 'Gelas',
            'Kaos', 'Tumbler', 'Dripper', 'Kettle', 'Grinder', 'Teh Hijau', 'Teh Hitam', 'Keripik', 'Kemeja', 'Topi', 'Tas', 'Celemek'];
        $simple = [];
        for ($n = 1; $n <= $this->products; $n++) {
            $roll = mt_rand(1, 100);
            $kind = $roll <= 55 ? 'simple' : ($roll <= 85 ? 'variable' : ($roll <= 93 ? 'digital' : 'bundle'));
            if ($kind === 'bundle' && count($simple) < 4) {
                $kind = 'simple';
            }
            $title = $words[mt_rand(0, count($words) - 1)].' '.$words[mt_rand(0, count($words) - 1)]." {$n}";
            if ($n % 10 === 0) {
                // Long names, to check wrapping on every page.
                $title .= ' — edisi terbatas dengan nama produk yang sangat panjang sekali untuk menguji tata letak keranjang, checkout, faktur dan email '.$n;
            }
            $price = mt_rand(10, 2000) * 1000 + (mt_rand(0, 3) === 0 ? 500 : 0);
            $sku = "LT-{$n}";
            $value = match ($kind) {
                'simple' => ['variants' => [$this->variantValue('v', $sku, $price)]],
                'digital' => ['requires_shipping' => false, 'downloadable' => true,
                    'downloads' => [['type' => 'url', 'url' => "https://example.com/files/{$n}.pdf", 'name' => "File {$n}.pdf"]],
                    'variants' => [['id' => 'v', 'sku' => $sku, 'price' => $price]]],
                'variable' => $this->variableValue($sku, $price),
                'bundle' => ['type' => 'bundle', 'bundle' => ['pricing' => 'percent_off', 'value' => 500 * mt_rand(1, 4), 'items' => array_map(
                    fn (int $variant) => ['variant_id' => $variant, 'quantity' => mt_rand(1, 2)],
                    array_values(array_unique(array_map(fn () => $simple[mt_rand(0, count($simple) - 1)], range(1, mt_rand(2, 4))))),
                )], 'variants' => [['id' => 'v', 'sku' => $sku, 'price' => 0]]],
            };
            if (mt_rand(1, 10) === 1) {
                $value['tiers'] = [['min_qty' => 5, 'type' => 'percent_off', 'value' => 500], ['min_qty' => 20, 'type' => 'percent_off', 'value' => 1000]];
            }
            $value['featured'] = mt_rand(1, 40) === 1;

            $entry = Entry::query()->create(['collection_id' => $collection->id, 'status' => 'draft', 'sort_order' => 0]);
            $slug = Str::slug(Str::limit($title, 80, ''))."-{$n}";
            $translation = $entry->translations()->create(['locale' => Locales::main(), 'collection_id' => $collection->id, 'title' => $title,
                'slug' => $slug, 'data' => [], 'seo' => []]);
            $entry->terms()->sync(array_values(array_unique([
                $this->pick('leaf'), $this->pick('brands'), ...array_map(fn () => $this->pick('product_tags'), range(0, mt_rand(0, 3))),
            ])));
            app(SaveDraft::class)->handle($translation, ['title' => $title, 'slug' => $slug, 'data' => [
                'excerpt' => "Produk uji {$n}: {$kind}.", 'product' => $value,
            ]]);
            app(PublishTranslation::class)->handle($translation->fresh());
            if ($kind === 'simple') {
                $simple[] = (int) Variant::query()->where('sku', $sku)->value('id');
            }
            if ($n % 250 === 0) {
                $this->command?->line("  {$n} products");
            }
        }
        // Order lines need each variant's product and price.
        $this->variants = DB::table('commerce_variants as v')->join('commerce_products as p', 'p.id', '=', 'v.product_id')
            ->join('sunrice_entry_translations as t', fn ($j) => $j->on('t.entry_id', '=', 'p.entry_id')->where('t.locale', Locales::main()))
            ->where('v.active', true)->whereNull('v.deleted_at')
            ->get(['v.id', 'v.product_id', 'p.entry_id', 't.title as name', 'v.title', 'v.sku', 'v.price', 'v.weight', 'p.requires_shipping as shipping', 'p.downloadable as digital', 'p.type'])
            ->filter(fn ($v) => $v->type !== 'bundle')
            ->map(fn ($v) => ['id' => (int) $v->id, 'product_id' => (int) $v->product_id, 'entry_id' => (int) $v->entry_id, 'name' => (string) $v->name,
                'title' => (string) $v->title, 'sku' => (string) $v->sku, 'price' => (int) $v->price, 'weight' => (int) $v->weight,
                'shipping' => (bool) $v->shipping, 'digital' => (bool) $v->digital])
            ->values()->all();
    }

    /** @return array<string, mixed> */
    protected function variantValue(string $id, string $sku, int $price): array
    {
        $tracked = mt_rand(1, 10) <= 7;

        return ['id' => $id, 'sku' => $sku, 'price' => $price, 'compare_at_price' => mt_rand(1, 5) === 1 ? (int) ($price * 1.25) : null,
            'cost' => (int) ($price * 0.6), 'weight' => mt_rand(50, 3000), 'track_stock' => $tracked,
            'initial_stock' => $tracked ? (mt_rand(1, 20) === 1 ? 0 : mt_rand(1, 300)) : null,
            'backorders' => mt_rand(1, 15) === 1 ? 'allow' : 'no'];
    }

    /** @return array<string, mixed> */
    protected function variableValue(string $sku, int $price): array
    {
        $count = mt_rand(1, 3);
        $handles = array_slice(['colors', 'sizes', 'materials'], 0, $count);
        $options = [];
        foreach ($handles as $handle) {
            $ids = $this->terms[$handle];
            shuffle($ids);
            $take = array_slice($ids, 0, $count === 3 ? mt_rand(2, 5) : mt_rand(2, count($ids)));
            $options[] = ['id' => $handle, 'name' => Str::title($handle), 'taxonomy' => $handle,
                'values' => array_map(fn (int $term) => ['id' => "t{$term}", 'term_id' => $term], $take)];
        }
        $combos = [[]];
        foreach ($options as $option) {
            $next = [];
            foreach ($combos as $combo) {
                foreach ($option['values'] as $v) {
                    $next[] = [...$combo, $option['id'] => $v['id']];
                }
            }
            $combos = $next;
        }
        $combos = array_slice($combos, 0, 100);
        $variants = [];
        foreach ($combos as $i => $combo) {
            $variants[] = [...$this->variantValue("v{$i}", "{$sku}-{$i}", $price + 5000 * ($i % 4)), 'options' => $combo];
        }

        return ['type' => 'variable', 'options' => $options, 'variants' => $variants];
    }

    protected function pick(string $key): int
    {
        return $this->terms[$key][mt_rand(0, count($this->terms[$key]) - 1)];
    }

    /** 300 vouchers, flash sales (one running, past and scheduled ones) and 30 pricing rules. */
    protected function promotions(): void
    {
        $products = DB::table('commerce_products')->where('type', '!=', 'bundle')
            ->whereNotIn('id', DB::table('commerce_flash_sale_items')->select('product_id'))->pluck('id')->all();
        $voucher = app(SaveVoucher::class);
        foreach (range(1, 300) as $i) {
            $type = ['percent', 'fixed_cart', 'fixed_item', 'free_shipping'][$i % 4];
            $voucher->handle($voucher->blank(), [...$voucher->values($voucher->blank()), 'name' => "Voucher {$i}", 'code' => "LOAD{$i}", 'type' => $type,
                'percent' => 5 + $i % 20, 'amount' => 5000 * (1 + $i % 10), 'max_discount' => 100000, 'min_subtotal' => $i % 3 === 0 ? 100000 : null,
                'active' => $i % 7 !== 0, 'usage_limit' => $i % 5 === 0 ? 100 : null]);
        }
        $sale = app(SaveFlashSale::class);
        shuffle($products);
        $windows = [['-1 hour', '+3 days', true]];
        foreach (range(1, 12) as $m) {
            $windows[] = ["-{$m} months", '-'.$m.' months +2 days', false];
        }
        foreach (range(1, 4) as $w) {
            $windows[] = ["+{$w} weeks", "+{$w} weeks +2 days", false];
        }
        $size = max(1, min(40, intdiv(count($products), count($windows))));
        foreach ($windows as $w => [$start, $end, $now]) {
            if (($chunk = array_slice($products, $w * $size, $size)) === []) {
                break;
            }
            $sale->handle($sale->blank(), [...$sale->values($sale->blank()), 'name' => $now ? 'Kilat Besar' : "Flash sale {$w}",
                'dates' => ['start' => Carbon::parse($start)->startOfHour()->toIso8601String(), 'end' => Carbon::parse($end)->startOfHour()->toIso8601String()],
                'items' => array_map(fn (int $id, int $k) => ['target' => [['type' => 'product', 'id' => $id]], 'discount_type' => 'percent_off',
                    'percent' => 10 + 5 * ($k % 5), 'quantity_limit' => $k % 3 === 0 ? 50 : null], $chunk, array_keys($chunk))]);
        }
        $rule = app(SavePricingRule::class);
        foreach (range(1, 30) as $i) {
            $scope = ['all', 'categories', 'brands', 'products'][$i % 4];
            $targets = match ($scope) {
                'categories' => [['type' => 'term', 'id' => $this->pick('leaf')]],
                'brands' => [['type' => 'term', 'id' => $this->pick('brands')]],
                'products' => array_map(fn ($id) => ['type' => 'product', 'id' => $id], array_slice($products, ($i * 5) % max(1, count($products) - 5), 5)),
                default => [],
            };
            $rule->handle($rule->blank(), [...$rule->values($rule->blank()), 'name' => "Grosir {$i}", 'scope' => $scope, 'targets' => $targets,
                'active' => $i % 6 !== 0, 'tiers' => [['min_qty' => 3 + $i % 5, 'type' => 'percent_off', 'percent' => 3 + $i % 7]]]);
        }
    }

    /** @var array<int, array{id: int, email: string, name: string, phone: string, address: array<string, mixed>}> */
    protected array $customerList = [];

    protected function customerRows(): void
    {
        $regions = DB::table('commerce_regions')->where('level', 3)->limit(400)->get(['code', 'name', 'parent_code'])->all();
        $names = fn (string $code) => (string) DB::table('commerce_regions')->where('code', $code)->value('name');
        $cities = [];
        $now = now();
        $customerUser = User::query()->firstOrCreate(['email' => 'customer@example.com'], ['name' => 'Pelanggan Uji', 'password' => bcrypt('password')]);
        $customerUser->assignRole(Role::findOrCreate('Customer', (string) config('sunrice.auth.guard', 'web')));
        $rows = [];
        for ($i = 1; $i <= $this->customers; $i++) {
            $rows[] = ['user_id' => $i === 1 ? $customerUser->id : null, 'email' => $i === 1 ? 'customer@example.com' : "pelanggan{$i}@example.com",
                'name' => $i === 1 ? 'Pelanggan Uji' : 'Pelanggan '.Str::title(Str::random(6)), 'phone' => '+62812'.str_pad((string) $i, 8, '0', STR_PAD_LEFT),
                'accepts_marketing' => $i % 3 === 0, 'created_at' => $now->copy()->subDays(mt_rand(0, 400)), 'updated_at' => $now];
            if (count($rows) === 1000) {
                DB::table('commerce_customers')->insert($rows);
                $rows = [];
            }
        }
        DB::table('commerce_customers')->insert($rows);
        $rows = [];
        foreach (DB::table('commerce_customers')->where('email', 'like', 'pelanggan%')->orWhere('email', 'customer@example.com')->orderBy('id')->get(['id', 'email', 'name', 'phone']) as $c) {
            $addresses = [];
            foreach (range(1, mt_rand(1, 3)) as $a) {
                $district = $regions[mt_rand(0, count($regions) - 1)];
                $city = $district->parent_code;
                $cities[$city] ??= [$names($city), (string) DB::table('commerce_regions')->where('code', $city)->value('parent_code')];
                $province = $cities[$city][1];
                $cities[$province] ??= [$names($province), ''];
                $address = ['name' => $c->name, 'phone' => $c->phone, 'country' => 'ID', 'province_code' => $province, 'province' => $cities[$province][0],
                    'city_code' => $city, 'city' => $cities[$city][0], 'district_code' => $district->code, 'district' => $district->name,
                    'postal_code' => (string) mt_rand(10000, 99999), 'line1' => 'Jl. Uji Beban No. '.mt_rand(1, 300)];
                $addresses[] = $address;
                $rows[] = [...$address, 'customer_id' => $c->id, 'label' => $a === 1 ? 'Rumah' : 'Kantor', 'default_shipping' => $a === 1, 'default_billing' => $a === 1,
                    'created_at' => $now, 'updated_at' => $now];
            }
            $this->customerList[] = ['id' => (int) $c->id, 'email' => (string) $c->email, 'name' => (string) $c->name, 'phone' => (string) $c->phone, 'address' => $addresses[0]];
            if (count($rows) >= 1000) {
                DB::table('commerce_addresses')->insert($rows);
                $rows = [];
            }
        }
        DB::table('commerce_addresses')->insert($rows);
    }

    /**
     * Orders over the past year with 1–6 lines (a few with 50–200), in every
     * status, with payments, shipments, events and some voucher discounts.
     * Totals add up: subtotal − discount + shipping = total.
     */
    protected function orderRows(): void
    {
        $statuses = [ // status, payment, fulfillment, weight
            ['completed', 'paid', 'shipped', 45], ['processing', 'paid', 'unfulfilled', 12], ['processing', 'paid', 'partially_shipped', 3],
            ['pending', 'unpaid', 'unfulfilled', 8], ['on_hold', 'awaiting_confirmation', 'unfulfilled', 4], ['cancelled', 'unpaid', 'unfulfilled', 14],
            ['refunded', 'refunded', 'unfulfilled', 3], ['failed', 'failed', 'unfulfilled', 2], ['completed', 'partially_refunded', 'shipped', 2],
        ];
        $pool = [];
        foreach ($statuses as $s) {
            $pool = [...$pool, ...array_fill(0, $s[3], $s)];
        }
        $vouchers = DB::table('commerce_vouchers')->where('type', 'percent')->limit(20)->get(['id', 'code', 'name'])->all();
        $sequences = [];
        $orderId = (int) DB::table('commerce_orders')->max('id');
        $itemId = (int) DB::table('commerce_order_items')->max('id');
        $batch = ['commerce_orders' => [], 'commerce_order_items' => [], 'commerce_order_adjustments' => [], 'commerce_order_events' => [],
            'commerce_payments' => [], 'commerce_shipments' => [], 'commerce_voucher_redemptions' => []];
        $start = now()->subDays(365)->startOfDay();
        $span = now()->startOfDay()->subSecond()->getTimestamp() - $start->getTimestamp();
        $times = [];
        for ($i = 0; $i < $this->orders; $i++) {
            $times[] = $start->getTimestamp() + mt_rand(0, $span);
        }
        sort($times);
        foreach ($times as $i => $time) {
            $at = Carbon::createFromTimestamp($time);
            $orderId++;
            [$status, $payment, $fulfillment] = $pool[mt_rand(0, count($pool) - 1)];
            $guest = mt_rand(1, 5) === 1;
            $customer = $this->customerList[mt_rand(0, count($this->customerList) - 1)];
            $lines = $i % 1000 === 7 ? mt_rand(50, 200) : mt_rand(1, 6);
            $subtotal = 0;
            $weight = 0;
            $shippable = false;
            $picked = [];
            for ($l = 0; $l < $lines; $l++) {
                $v = $this->variants[mt_rand(0, count($this->variants) - 1)];
                if (isset($picked[$v['id']])) {
                    continue;
                }
                $picked[$v['id']] = true;
                $qty = $v['digital'] ? 1 : mt_rand(1, 4);
                $line = $v['price'] * $qty;
                $subtotal += $line;
                $weight += $v['weight'] * $qty;
                $shippable = $shippable || $v['shipping'];
                $itemId++;
                $batch['commerce_order_items'][] = ['id' => $itemId, 'order_id' => $orderId, 'product_id' => $v['product_id'], 'variant_id' => $v['id'], 'entry_id' => $v['entry_id'],
                    'name' => Str::limit($v['name'], 250), 'variant_title' => $v['title'] !== '' ? $v['title'] : null, 'sku' => $v['sku'], 'quantity' => $qty,
                    'unit_price' => $v['price'], 'regular_unit_price' => $v['price'], 'price_source' => '{"type":"base"}', 'subtotal' => $line, 'discount_total' => 0,
                    'tax_total' => 0, 'total' => $line, 'weight' => $v['weight'], 'requires_shipping' => $v['shipping'], 'downloadable' => $v['digital'],
                    'fulfilled_quantity' => $fulfillment === 'shipped' ? $qty : 0, 'created_at' => $at, 'updated_at' => $at];
            }
            $discount = 0;
            if (mt_rand(1, 6) === 1 && $vouchers !== []) {
                $voucher = $vouchers[mt_rand(0, count($vouchers) - 1)];
                $discount = min(100000, intdiv($subtotal, 10));
                $batch['commerce_order_adjustments'][] = ['order_id' => $orderId, 'kind' => 'discount', 'source_type' => 'voucher', 'source_id' => (string) $voucher->id,
                    'code' => $voucher->code, 'label' => $voucher->name, 'amount' => -$discount, 'created_at' => $at];
                $batch['commerce_voucher_redemptions'][] = ['voucher_id' => $voucher->id, 'order_id' => $orderId, 'customer_id' => $guest ? null : $customer['id'],
                    'email' => $customer['email'], 'code' => $voucher->code, 'amount' => $discount, 'released_at' => in_array($status, ['cancelled', 'failed'], true) ? $at : null, 'created_at' => $at];
            }
            $shipping = $shippable ? 12000 * max(1, (int) ceil($weight / 1000)) : 0;
            $total = $subtotal - $discount + $shipping;
            $paid = in_array($payment, ['paid', 'partially_refunded', 'refunded'], true);
            $refunded = $payment === 'refunded' ? $total : ($payment === 'partially_refunded' ? intdiv($total, 4) : 0);
            $day = $at->format('Y-m-d');
            $sequences[$day] = ($sequences[$day] ?? 0) + 1;
            $method = mt_rand(0, 1) === 0 ? ['bank_transfer', 'Transfer bank'] : ['cod', 'Bayar di tempat'];
            $batch['commerce_orders'][] = ['id' => $orderId, 'type' => 'order', 'number' => 'ORD-'.$at->format('Ymd').'-'.str_pad((string) $sequences[$day], 4, '0', STR_PAD_LEFT),
                'order_key' => Str::random(40), 'status' => $status, 'payment_status' => $payment, 'fulfillment_status' => $shippable ? $fulfillment : 'not_required',
                'channel' => 'storefront', 'customer_id' => $guest ? null : $customer['id'], 'email' => $customer['email'], 'phone' => $customer['phone'],
                'customer_name' => $customer['name'], 'billing_address' => json_encode($customer['address']), 'shipping_address' => $shippable ? json_encode($customer['address']) : null,
                'shipping_method' => $shippable ? json_encode(['id' => 'weight:1:default', 'method' => 'weight', 'method_id' => 1, 'service' => 'default', 'label' => 'Reguler', 'cost' => $shipping, 'eta' => null, 'meta' => []]) : null,
                'payment_method' => $method[0], 'payment_method_title' => $method[1], 'currency' => 'IDR', 'locale' => Locales::main(),
                'subtotal' => $subtotal, 'discount_total' => $discount, 'shipping_total' => $shipping, 'total' => $total, 'paid_total' => $paid ? $total : 0,
                'refunded_total' => $refunded, 'weight' => $weight, 'placed_at' => $at, 'paid_at' => $paid ? $at->copy()->addHours(2) : null,
                'completed_at' => $status === 'completed' ? $at->copy()->addDays(4) : null, 'cancelled_at' => $status === 'cancelled' ? $at->copy()->addDay() : null,
                'cancel_reason' => $status === 'cancelled' ? 'expired' : null, 'created_at' => $at, 'updated_at' => $at];
            $batch['commerce_order_events'][] = ['order_id' => $orderId, 'type' => 'status', 'visibility' => 'internal', 'message' => 'Order placed',
                'data' => '{"to":"pending","channel":"storefront"}', 'source' => 'storefront', 'created_at' => $at];
            if ($status !== 'pending') {
                $batch['commerce_order_events'][] = ['order_id' => $orderId, 'type' => 'status', 'visibility' => 'customer', 'message' => "Status changed to {$status}",
                    'data' => json_encode(['from' => 'pending', 'to' => $status]), 'source' => 'system', 'created_at' => $at->copy()->addHours(3)];
            }
            $batch['commerce_payments'][] = ['order_id' => $orderId, 'method' => $method[0], 'method_title' => $method[1], 'amount' => $total, 'currency' => 'IDR',
                'status' => $paid ? 'paid' : ($payment === 'failed' ? 'failed' : ($status === 'cancelled' ? 'cancelled' : 'pending')),
                'paid_at' => $paid ? $at->copy()->addHours(2) : null, 'refunded_amount' => $refunded, 'created_at' => $at, 'updated_at' => $at];
            if ($shippable && in_array($fulfillment, ['shipped', 'partially_shipped'], true)) {
                $batch['commerce_shipments'][] = ['order_id' => $orderId, 'courier' => 'jne', 'courier_name' => 'JNE', 'service' => 'REG', 'tracking_number' => 'JNE'.$orderId,
                    'status' => $status === 'completed' ? 'delivered' : 'shipped', 'cost' => $shipping, 'shipped_at' => $at->copy()->addDay(),
                    'delivered_at' => $status === 'completed' ? $at->copy()->addDays(3) : null, 'created_at' => $at, 'updated_at' => $at];
            }
            if (count($batch['commerce_order_items']) >= 2000 || $i === count($times) - 1) {
                foreach ($batch as $table => $rows) {
                    foreach (array_chunk($rows, 500) as $chunk) {
                        DB::table($table)->insert($chunk);
                    }
                    $batch[$table] = [];
                }
            }
        }
        foreach (['commerce_orders', 'commerce_order_items'] as $table) {
            if (DB::getDriverName() === 'pgsql') {
                DB::statement("select setval('{$table}_id_seq', (select max(id) from {$table}))");
            }
        }
        foreach ($sequences as $day => $count) {
            DB::table('commerce_sequences')->updateOrInsert(['key' => 'order:'.$day], ['value' => $count, 'updated_at' => now()]);
        }
        // The customers' order counts and spend, and products' sales (correlated subqueries: any database).
        $orders = 'from commerce_orders o where o.customer_id = commerce_customers.id';
        DB::statement("update commerce_customers set orders_count = (select count(*) {$orders}),
            total_spent = (select coalesce(sum(case when o.payment_status in ('paid', 'partially_refunded') then o.total - o.refunded_total else 0 end), 0) {$orders}),
            first_order_at = (select min(o.placed_at) {$orders}), last_order_at = (select max(o.placed_at) {$orders})
            where exists (select 1 {$orders})");
        DB::statement('update commerce_products set sales_count = (select coalesce(sum(i.quantity), 0) from commerce_order_items i where i.product_id = commerce_products.id)');
    }

    /** Daily view and add-to-cart counters for a year (the order-based columns come from commerce:stats). */
    protected function views(): void
    {
        $products = DB::table('commerce_products')->pluck('id')->all();
        $rows = [];
        for ($d = 365; $d >= 0; $d--) {
            $date = now()->subDays($d)->toDateString();
            foreach (array_rand(array_flip($products), min(150, count($products))) as $id) {
                $rows[] = ['date' => $date, 'product_id' => $id, 'views' => mt_rand(1, 300), 'add_to_carts' => mt_rand(0, 20)];
            }
            if (count($rows) >= 3000) {
                DB::table('commerce_product_stats_daily')->insert($rows);
                $rows = [];
            }
        }
        DB::table('commerce_product_stats_daily')->insert($rows);
    }
}
