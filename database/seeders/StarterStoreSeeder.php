<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Database\Seeders;

use Dompdf\Dompdf;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Sunrice\Actions\Assets\UploadAsset;
use Sunrice\Actions\Entries\PublishTranslation;
use Sunrice\Actions\Entries\SaveDraft;
use Sunrice\Actions\Entries\SyncEntryTerms;
use Sunrice\Actions\Globals\SaveGlobalValues;
use Sunrice\Actions\Taxonomies\SaveTerm;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\DownloadFile;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Customers\Actions\AssignCustomerRole;
use Sunrice\Commerce\Customers\Actions\SaveAddress;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Database\Seeders\Starter\Artwork;
use Sunrice\Commerce\Database\Seeders\Starter\Catalog;
use Sunrice\Commerce\Orders\Actions\CreateShipment;
use Sunrice\Commerce\Orders\Actions\MarkOrderPaid;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Promotions\Actions\SaveFlashSale;
use Sunrice\Commerce\Promotions\Actions\SavePricingRule;
use Sunrice\Commerce\Promotions\Actions\SaveVoucher;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Settings\Actions\SaveStoreSettings;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\Models\ShippingZone;
use Sunrice\Commerce\Wishlist\Wishlist;
use Sunrice\Facades\Sunrice;
use Sunrice\Models\Asset;
use Sunrice\Models\AssetFolder;
use Sunrice\Models\Blueprint;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;
use Sunrice\Models\GlobalSet;
use Sunrice\Models\Menu;
use Sunrice\Models\Setting;
use Sunrice\Models\Taxonomy;
use Sunrice\Models\Term;
use Sunrice\Models\TermTranslation;
use Sunrice\Support\Locales;

/**
 * The starter store (commerce:install --starter --demo): an apparel shop
 * for the starter theme. About fifty products in women, men and kids
 * categories with colour and size variants and placeholder artwork,
 * bundles and digital products; brands, tags and attribute taxonomies;
 * sale prices, bulk prices, a running flash sale, vouchers and a pricing
 * rule; shipping across Indonesia, bank transfer, QRIS and cash on
 * delivery; pages, menus and the home page; and a demo customer
 * (customer@example.com / password) with addresses, orders in several
 * states and a wishlist.
 *
 * Everything goes through the same actions as the admin. Safe to run
 * again: each part checks what exists and only adds what is missing.
 */
class StarterStoreSeeder extends Seeder
{
    public const CUSTOMER_EMAIL = 'customer@example.com';

    public const CUSTOMER_PASSWORD = 'password';

    /** SKUs start with this; a store that has them already has the products. */
    public const SKU_PREFIX = 'KN-';

    /** Variants the bundles and the demo orders use: always in stock. */
    protected const KEEP_IN_STOCK = ['KN-M01-WHI-M', 'KN-M01-BLA-M', 'KN-M01-NAV-M', 'KN-W04-BEI-M', 'KN-W09-BLA-M', 'KN-K01-WHI-120', 'KN-K06-NAV-120', 'KN-K08-BLU',
        'KN-W04-NAV-M', 'KN-W01-OFF-M', 'KN-W01-NAV-M', 'KN-W07-BLA-M', 'KN-W16-OFF', 'KN-W16-BLA', 'KN-W09-BLA-S', 'KN-W10-NAV-M', 'KN-W06-BEI-M', 'KN-W18-BLA'];

    protected string $locale = 'id';

    protected ?int $folder = null;

    /** @var array<string, int> asset name => id */
    protected array $assets = [];

    /** @var array<string, int> "taxonomy/slug" => term id */
    protected array $terms = [];

    public function run(): void
    {
        $this->locale = Locales::main() === 'id' ? 'id' : 'en';
        app(ScaffoldStore::class)->handle();
        $this->structure();
        app(ScaffoldStore::class)->handle();   // again, now that the pages collection exists: the legal pages
        $this->settings();
        $this->taxonomies();
        $this->products();
        $this->shipping();
        $this->payments();
        $this->promotions();
        $this->pages();
        $this->menus();
        $this->customer();
    }

    /** Pages, the home page blueprint, the colour and size taxonomies and the site globals. */
    protected function structure(): void
    {
        $image = fn (string $handle, string $label) => ['handle' => $handle, 'type' => 'asset', 'label' => $label, 'config' => ['image_only' => true]];
        Sunrice::importStructure([
            'blueprints' => [
                ['handle' => 'page', 'title' => 'Page', 'fields' => [
                    ['handle' => 'intro', 'type' => 'textarea', 'label' => 'Intro'],
                    $image('image', 'Image'),
                    ['handle' => 'body', 'type' => 'rich_text', 'label' => 'Body'],
                ]],
                ['handle' => 'home', 'title' => 'Home page', 'fields' => [
                    ['handle' => 'hero_title', 'type' => 'text', 'label' => 'Hero title'],
                    ['handle' => 'hero_text', 'type' => 'textarea', 'label' => 'Hero text'],
                    $image('hero_image', 'Hero image'),
                    ['handle' => 'hero_button', 'type' => 'text', 'label' => 'Hero button'],
                    ['handle' => 'hero_link', 'type' => 'text', 'label' => 'Hero link', 'translatable' => false],
                    ['handle' => 'body', 'type' => 'rich_text', 'label' => 'Text below the products'],
                ]],
                ['handle' => 'color', 'title' => 'Colour', 'fields' => [
                    ['handle' => 'swatch', 'type' => 'text', 'label' => 'Swatch', 'instructions' => 'A hex colour like #26324a, shown as a swatch.', 'translatable' => false],
                ]],
                ['handle' => 'site', 'title' => 'Site', 'fields' => [
                    ['handle' => 'name', 'type' => 'text', 'label' => 'Name'],
                    $image('logo', 'Logo'),
                    ['handle' => 'announcement', 'type' => 'text', 'label' => 'Announcement bar'],
                ]],
                ['handle' => 'footer', 'title' => 'Footer', 'fields' => [
                    ['handle' => 'text', 'type' => 'rich_text', 'label' => 'Text'],
                    ['handle' => 'social', 'type' => 'repeater', 'label' => 'Social links', 'config' => ['fields' => [
                        ['handle' => 'label', 'type' => 'text', 'label' => 'Label'],
                        ['handle' => 'url', 'type' => 'text', 'label' => 'URL', 'translatable' => false],
                    ]]],
                ]],
            ],
            'taxonomies' => [
                ['handle' => 'colors', 'title' => $this->t('Warna', 'Colours'), 'hierarchical' => false, 'blueprint' => 'color',
                    'settings' => ['has_archive' => false, 'titles' => [$this->t('en', 'id') => $this->t('Colours', 'Warna')]]],
                ['handle' => 'sizes', 'title' => $this->t('Ukuran', 'Sizes'), 'hierarchical' => false,
                    'settings' => ['has_archive' => false, 'titles' => [$this->t('en', 'id') => $this->t('Sizes', 'Ukuran')]]],
            ],
            'collections' => [
                ['handle' => 'pages', 'title' => 'Pages', 'blueprint' => 'page',
                    'settings' => ['route' => '/{slug}', 'has_archive' => false, 'translatable' => true, 'icon' => 'file-text']],
            ],
            'globals' => [
                ['handle' => 'site', 'title' => 'Site', 'blueprint' => 'site', 'group' => 'global'],
                ['handle' => 'footer', 'title' => 'Footer', 'blueprint' => 'footer', 'group' => 'template_part'],
            ],
        ]);
    }

    /** Store details, logo and colour; the attribute taxonomies; checkout and catalog choices. */
    protected function settings(): void
    {
        $settings = app(StoreSettings::class);
        $logo = $this->asset('kain-logo', Artwork::logo(), 'KAIN');
        $save = app(SaveStoreSettings::class);
        if (blank($settings->get('general.name')) || $settings->get('general.name') === 'Toko Kopi Contoh') {
            $save->handle('general', [...$settings->section('general'),
                'name' => 'KAIN', 'email' => 'halo@example.com', 'phone' => '0812 0000 2026', 'logo' => $logo, 'brand_color' => '#d7001d',
                'address' => ['line1' => 'Jl. Senopati No. 26', 'region' => ['country' => 'ID', ...$this->place('31', '31.74', '31.74.01')], 'postal_code' => '12190'],
            ]);
        }
        $save->handle('catalog', [...$settings->section('catalog'), 'attribute_taxonomies' => ['colors', 'sizes'], 'show_stock' => 'low',
            'compare_fields' => ['brand', 'categories', 'attributes', 'stock', 'excerpt']]);
        if (blank($settings->get('documents.footer'))) {
            $save->handle('documents', [...$settings->section('documents'), 'footer' => $this->t(
                'Terima kasih telah berbelanja di KAIN. Penukaran ukuran gratis dalam 30 hari dengan label yang masih terpasang.',
                'Thank you for shopping at KAIN. Free size exchanges within 30 days with the tags still on.',
            )]);
        }

        GlobalSet::query()->where('handle', 'site')->first()?->values()->doesntExist()
            && app(SaveGlobalValues::class)->handle(GlobalSet::query()->where('handle', 'site')->firstOrFail(), ['locale' => Locales::main(), 'values' => [
                'name' => 'KAIN', 'logo' => $logo,
                'announcement' => $this->t('Gratis ongkir untuk belanja di atas Rp500.000 · Tukar ukuran gratis 30 hari', 'Free shipping over Rp500,000 · Free size exchanges for 30 days'),
            ]]);
        GlobalSet::query()->where('handle', 'footer')->first()?->values()->doesntExist()
            && app(SaveGlobalValues::class)->handle(GlobalSet::query()->where('handle', 'footer')->firstOrFail(), ['locale' => Locales::main(), 'values' => [
                'text' => '<p>'.$this->t('Pakaian sehari-hari yang sederhana, dibuat untuk dipakai lama.', 'Simple everyday clothing, made to be worn for years.').'</p>',
                'social' => [['label' => 'Instagram', 'url' => 'https://instagram.com/'], ['label' => 'TikTok', 'url' => 'https://tiktok.com/'], ['label' => 'YouTube', 'url' => 'https://youtube.com/']],
            ]]);
    }

    /** Categories (two levels), brands, tags, colours and sizes. */
    protected function taxonomies(): void
    {
        $categories = (string) config('commerce.catalog.category_taxonomy', 'product_categories');
        foreach (Catalog::categories() as $slug => $department) {
            $parent = $this->term($categories, $slug, $department[$this->locale], [
                'image' => $this->asset("category-{$slug}", Artwork::tile($department['shape'], $department['color'], Artwork::ground($department['color'])), $department[$this->locale]),
                'banner' => $this->asset("banner-{$slug}", Artwork::banner([[$department['shape'], $department['color']], ['trousers', '#1f1f1f'], ['tee', '#efeae0']], Artwork::ground($department['color']), 1600, 480), $department[$this->locale]),
                'description' => '<p>'.$this->t("Koleksi {$department['id']} KAIN: potongan sederhana, bahan nyaman, harga jujur.", "KAIN {$department['en']}: simple cuts, comfortable fabrics, honest prices.").'</p>',
            ]);
            foreach ($department['children'] as $childSlug => $child) {
                $this->term($categories, $childSlug, $child[$this->locale], [
                    'image' => $this->asset("category-{$childSlug}", Artwork::tile($child['shape'], $child['color'], Artwork::ground($child['color'])), $child[$this->locale]),
                ], $parent);
            }
        }
        foreach (Catalog::brands() as $slug => $brand) {
            $this->term((string) config('commerce.catalog.brand_taxonomy', 'brands'), $slug, $brand['name'], [
                'logo' => $this->asset("brand-{$slug}", Artwork::brand($brand['name']), $brand['name']),
                'description' => '<p>'.$brand[$this->locale].'</p>', 'website' => $brand['website'],
            ]);
        }
        foreach (Catalog::tags() as $slug => $tag) {
            $this->term((string) config('commerce.catalog.tag_taxonomy', 'product_tags'), $slug, $tag[$this->locale]);
        }
        foreach (Catalog::colors() as $slug => $color) {
            $this->term('colors', $slug, $color[$this->locale], ['swatch' => $color['hex']]);
        }
        $order = 0;
        foreach (array_unique(array_merge(...array_values(Catalog::sizes()))) as $size) {
            $this->term('sizes', 'size-'.Str::slug($size), $size, [], null, $order++);
        }
    }

    protected function products(): void
    {
        $existing = Variant::query()->where('sku', 'like', self::SKU_PREFIX.'%')->exists();
        $entries = [];
        if (! $existing) {
            foreach (Catalog::products() as $i => $product) {
                $entries[$product['code']] = $this->apparel($product, $i);
            }
            $entries += $this->bundles();
            $entries += $this->digital();
            $this->relate($entries);
        }
    }

    /** @param  array<string, mixed>  $p */
    protected function apparel(array $p, int $index): Entry
    {
        $colors = Catalog::colors();
        $sizes = Catalog::sizes()[$p['sizes']];
        $sku = self::SKU_PREFIX.$p['code'];
        $images = [];
        foreach ($p['colors'] as $color) {
            $images[$color] = $this->asset("product-{$p['code']}-{$color}", Artwork::product($p['shape'], $colors[$color]['hex']), $p['title'].' – '.$colors[$color][$this->locale]);
        }
        $detail = $this->asset("product-{$p['code']}-detail", Artwork::product($p['shape'], $colors[$p['colors'][0]]['hex'], true), $p['title']);

        $options = [['id' => 'color', 'name' => $this->t('Warna', 'Colour'), 'taxonomy' => 'colors',
            'values' => array_map(fn (string $c) => ['id' => $c, 'term_id' => $this->terms["colors/{$c}"]], $p['colors'])]];
        if ($sizes !== []) {
            $options[] = ['id' => 'size', 'name' => $this->t('Ukuran', 'Size'), 'taxonomy' => 'sizes',
                'values' => array_map(fn (string $s) => ['id' => Str::slug($s), 'term_id' => $this->terms['sizes/size-'.Str::slug($s)]], $sizes)];
        }
        $weight = ['tee' => 200, 'knit' => 400, 'shirt' => 260, 'jacket' => 700, 'trousers' => 450, 'shorts' => 250, 'skirt' => 300, 'cap' => 120, 'tote' => 300, 'socks' => 150][$p['shape']] ?? 300;
        $variants = [];
        foreach ($p['colors'] as $ci => $color) {
            foreach ($sizes === [] ? [null] : $sizes as $si => $size) {
                $code = strtoupper(substr(str_replace('-', '', $color), 0, 3)).($size !== null ? '-'.$size : '');
                // Stock: steady, a few low and a few sold out; `stock` scales it (0: sold out).
                $seed = crc32($sku.$code) % 100;
                $stock = (int) round(($seed < 8 ? 0 : ($seed < 18 ? 1 + $seed % 3 : 6 + $seed % 30)) * ($p['stock'] ?? 1.0));
                if (in_array("{$sku}-{$code}", self::KEEP_IN_STOCK, true)) {
                    $stock = max($stock, 12 + $seed % 10);
                }
                $variants[] = ['id' => Str::slug("{$p['code']}-{$color}".($size !== null ? "-{$size}" : '')), 'sku' => "{$sku}-{$code}",
                    'options' => array_filter(['color' => $color, 'size' => $size !== null ? Str::slug($size) : null]),
                    'price' => $p['price'], 'compare_at_price' => $p['compare'] ?? null, 'weight' => $weight, 'image' => $images[$color],
                    'track_stock' => true, 'initial_stock' => $stock];
            }
        }
        $value = ['type' => 'variable', 'featured' => (bool) ($p['featured'] ?? false), 'options' => $options, 'variants' => $variants,
            'tiers' => ($p['tiers'] ?? false) ? [['min_qty' => 3, 'type' => 'percent_off', 'value' => 1000], ['min_qty' => 6, 'type' => 'percent_off', 'value' => 1500]] : []];

        $material = Catalog::materials()[$p['material']][$this->locale];
        $data = [
            'excerpt' => $this->excerpt($p, $material),
            'description' => $this->description($p, $material),
            'gallery' => [...array_values($images), $detail],
            'specifications' => [
                ['label' => $this->t('Bahan', 'Material'), 'value' => $material],
                ['label' => $this->t('Potongan', 'Fit'), 'value' => $this->t(in_array($p['shape'], ['knit', 'jacket'], true) ? 'Regular, sedikit longgar' : 'Regular', in_array($p['shape'], ['knit', 'jacket'], true) ? 'Regular, slightly relaxed' : 'Regular')],
                ['label' => $this->t('Perawatan', 'Care'), 'value' => $this->t('Cuci mesin 30°C, jangan diputih', 'Machine wash 30°C, do not bleach')],
                ['label' => $this->t('Asal', 'Made in'), 'value' => 'Indonesia'],
            ],
            'faq' => [
                ['question' => $this->t('Bagaimana jika ukurannya tidak pas?', 'What if the size doesn\'t fit?'), 'answer' => $this->t('Tukar ukuran gratis dalam 30 hari, selama label masih terpasang.', 'Exchange it for free within 30 days, with the tags still on.')],
                ['question' => $this->t('Apakah warnanya luntur?', 'Will the colour fade?'), 'answer' => $this->t('Kain sudah dicuci sebelumnya, jadi warnanya tetap setelah dicuci berkali-kali.', 'The fabric is pre-washed, so the colour holds wash after wash.')],
            ],
        ];
        if ($sizes !== []) {
            $data['size_guide'] = $this->sizeGuide($sizes, $p['sizes'] === 'kids');
        }
        $entry = $this->productEntry($p['title'], $value, $data);
        $this->assignTerms($entry, [
            $this->terms[config('commerce.catalog.category_taxonomy', 'product_categories').'/'.$p['category']],
            $this->terms[config('commerce.catalog.brand_taxonomy', 'brands').'/'.$p['brand']],
            ...array_map(fn (string $tag) => $this->terms[config('commerce.catalog.tag_taxonomy', 'product_tags').'/'.$tag], $p['tags'] ?? []),
        ]);
        // Older products: only the newest few get the "new" badge, and "newest" sorting has an order.
        Entry::query()->whereKey($entry->id)->update(['published_at' => now()->subDays((int) ($p['days'] ?? 30))->subMinutes($index), 'sort_order' => $index]);

        return $entry;
    }

    /** @return array<string, Entry> */
    protected function bundles(): array
    {
        $out = [];
        $bundles = [
            'B01' => ['title' => $this->t('Paket Kaus Harian Isi 3', 'Everyday Tee 3-Pack'), 'shape' => 'stack', 'color' => '#9a9a98', 'category' => 'men-t-shirts', 'percent' => 1500,
                'items' => ['KN-M01-WHI-M', 'KN-M01-BLA-M', 'KN-M01-NAV-M']],
            'B02' => ['title' => $this->t('Set Akhir Pekan Wanita', 'Women\'s Weekend Set'), 'shape' => 'knit', 'color' => '#cdb79a', 'category' => 'women-knitwear', 'percent' => 1000,
                'items' => ['KN-W04-BEI-M', 'KN-W09-BLA-M']],
            'B03' => ['title' => $this->t('Set Sekolah Anak', 'Kids Back-to-School Set'), 'shape' => 'stack', 'color' => '#5b7fa6', 'category' => 'kids-t-shirts', 'percent' => 1000,
                'items' => ['KN-K01-WHI-120', 'KN-K06-NAV-120', 'KN-K08-BLU']],
        ];
        foreach ($bundles as $code => $b) {
            $image = $this->asset("product-{$code}", Artwork::product($b['shape'], $b['color']), $b['title']);
            $items = array_map(fn (string $sku) => ['variant_id' => (int) Variant::query()->where('sku', $sku)->value('id'), 'quantity' => 1], $b['items']);
            $entry = $this->productEntry($b['title'], ['type' => 'bundle', 'bundle' => ['pricing' => 'percent_off', 'value' => $b['percent'], 'items' => $items],
                'variants' => [['id' => strtolower($code), 'sku' => self::SKU_PREFIX.$code, 'price' => 0]]], [
                    'excerpt' => $this->t('Hemat '.($b['percent'] / 100).'% dibanding membeli satu per satu.', 'Save '.($b['percent'] / 100).'% compared with buying them one by one.'),
                    'description' => '<p>'.$this->t('Paket hemat berisi favorit kami. Isi paket tercantum di bawah harga.', 'A value set of our favourites. What\'s inside is listed under the price.').'</p>',
                    'gallery' => [$image],
                ]);
            $this->assignTerms($entry, [$this->terms[config('commerce.catalog.category_taxonomy', 'product_categories').'/'.$b['category']], $this->terms[config('commerce.catalog.brand_taxonomy', 'brands').'/kain']]);
            Entry::query()->whereKey($entry->id)->update(['published_at' => now()->subDays(20), 'sort_order' => 60]);
            $out[$code] = $entry;
        }

        return $out;
    }

    /** @return array<string, Entry> a downloadable lookbook and a gift card */
    protected function digital(): array
    {
        $disk = (string) config('commerce.downloads.disk', 'local');
        $path = 'commerce/downloads/starter/kain-lookbook.pdf';
        if (! Storage::disk($disk)->exists($path)) {
            $pdf = new Dompdf;
            $pdf->loadHtml('<html><body style="font-family: DejaVu Sans, sans-serif; padding: 40px">'
                .'<h1 style="font-size: 40px; letter-spacing: 2px">KAIN</h1><p style="color:#d7001d; text-transform: uppercase">Lookbook</p>'
                .'<p>'.e($this->t('Panduan gaya musim ini: 12 padu padan dari koleksi esensial KAIN.', 'This season\'s style guide: 12 outfits from the KAIN essentials.')).'</p></body></html>');
            $pdf->render();
            Storage::disk($disk)->put($path, (string) $pdf->output());
        }
        $file = DownloadFile::query()->firstOrCreate(['disk' => $disk, 'path' => $path], [
            'type' => 'file', 'name' => 'KAIN Lookbook (PDF)', 'filename' => 'kain-lookbook.pdf', 'mime_type' => 'application/pdf',
            'size' => Storage::disk($disk)->size($path), 'attached' => false,
        ]);
        $book = $this->productEntry('KAIN Lookbook', ['type' => 'simple', 'requires_shipping' => false, 'downloadable' => true,
            'downloads' => [['id' => 'lookbook', 'type' => 'file', 'file_id' => $file->id, 'name' => 'KAIN Lookbook (PDF)']],
            'delivery' => ['modes' => ['link', 'account'], 'download_limit' => 5, 'expiry_days' => 30],
            'variants' => [['id' => 'lookbook', 'sku' => self::SKU_PREFIX.'D01', 'price' => 25000]]], [
                'excerpt' => $this->t('E-book PDF 40 halaman: 12 padu padan untuk musim ini.', 'A 40-page PDF: 12 outfits for this season.'),
                'description' => '<p>'.$this->t('Produk digital: tautan unduhan dikirim lewat email setelah pembayaran dan tersedia di Akun Saya → Unduhan.', 'A digital product: the download link is emailed once paid and stays in My Account → Downloads.').'</p>',
                'gallery' => [$this->asset('product-D01', Artwork::product('book', '#26324a'), 'KAIN Lookbook')],
                'specifications' => [['label' => $this->t('Format', 'Format'), 'value' => 'PDF, 12 MB'], ['label' => $this->t('Halaman', 'Pages'), 'value' => '40']],
            ]);
        $amounts = [100000, 250000, 500000];
        $card = $this->productEntry($this->t('Kartu Hadiah Digital', 'Digital Gift Card'), ['type' => 'variable', 'requires_shipping' => false,
            'options' => [['id' => 'amount', 'name' => $this->t('Nilai', 'Amount'), 'values' => array_map(fn (int $a) => ['id' => (string) $a, 'label' => 'Rp'.number_format($a, 0, ',', '.')], $amounts)]],
            'variants' => array_map(fn (int $a) => ['id' => "gift-{$a}", 'sku' => self::SKU_PREFIX.'G'.($a / 1000), 'price' => $a, 'options' => ['amount' => (string) $a]], $amounts)], [
                'excerpt' => $this->t('Dikirim lewat email, langsung siap diberikan.', 'Sent by email, ready to give straight away.'),
                'description' => '<p>'.$this->t('Kartu hadiah tanpa pengiriman: kami kirim kodenya ke email penerima.', 'A gift card with no shipping: we email the code to the recipient.').'</p>',
                'gallery' => [$this->asset('product-G01', Artwork::product('card', '#cdb79a'), 'Gift card')],
            ]);
        foreach ([$book, $card] as $entry) {
            $this->assignTerms($entry, [$this->terms[config('commerce.catalog.category_taxonomy', 'product_categories').'/gifts']]);
            Entry::query()->whereKey($entry->id)->update(['published_at' => now()->subDays(35), 'sort_order' => 70]);
        }

        return ['D01' => $book, 'G01' => $card];
    }

    /**
     * Related products (same category), upsells (pricier, same department)
     * and cross-sells (accessories), saved as a second draft.
     *
     * @param  array<string, Entry>  $entries
     */
    protected function relate(array $entries): void
    {
        $products = collect(Catalog::products())->keyBy('code');
        foreach ($entries as $code => $entry) {
            $p = $products->get($code);
            if ($p === null) {
                continue;
            }
            $department = explode('-', $p['category'])[0];
            $related = $products->filter(fn ($o) => $o['code'] !== $code && $o['category'] === $p['category'])->keys()
                ->merge($products->filter(fn ($o) => $o['code'] !== $code && str_starts_with($o['category'], $department) && $o['shape'] !== $p['shape'])->keys())->unique()->take(5);
            $upsells = $products->filter(fn ($o) => $o['code'] !== $code && str_starts_with($o['category'], $department) && $o['price'] > $p['price'])->sortBy('price')->keys()->take(3);
            $cross = $products->filter(fn ($o) => str_ends_with($o['category'], 'accessories') && str_starts_with($o['category'], $department) && $o['code'] !== $code)->keys()->take(3);
            /** @param iterable<int, string> $codes */
            $ids = fn (iterable $codes): array => array_values(array_filter(array_map(fn (string $c) => isset($entries[$c]) ? $entries[$c]->id : null, [...$codes])));
            $translation = $entry->mainTranslation();
            if ($translation === null) {
                continue;
            }
            app(SaveDraft::class)->handle($translation, ['title' => (string) $translation->title, 'slug' => (string) $translation->slug, 'data' => [...(array) $translation->data,
                'related_products' => $ids($related), 'upsells' => $ids($upsells), 'cross_sells' => $ids([...$cross->all(), 'B01'])]]);
            $published = Entry::query()->whereKey($entry->id)->value('published_at');
            app(PublishTranslation::class)->handle($translation->fresh());
            Entry::query()->whereKey($entry->id)->update(['published_at' => $published]);
        }
    }

    protected function shipping(): void
    {
        if (ShippingZone::query()->where('name', 'Jawa & Bali')->exists()) {
            return;
        }
        $t = fn (string $id, string $en) => ['id' => $id, 'en' => $en];
        $java = ShippingZone::query()->create(['name' => 'Jawa & Bali']);
        foreach (['31', '32', '33', '34', '35', '36', '51'] as $province) {
            $java->regions()->create(['country' => 'ID', 'region_code' => $province]);
        }
        $java->methods()->create(['type' => 'weight', 'title' => $t('Reguler', 'Regular'), 'etd' => $t('2–3 hari', '2–3 days'), 'active' => true,
            'settings' => ['mode' => 'per_kg', 'price_per_kg' => 12000, 'tolerance' => 300]]);
        $java->methods()->create(['type' => 'weight', 'title' => $t('Ekspres', 'Express'), 'etd' => $t('1 hari', 'Next day'), 'active' => true,
            'settings' => ['mode' => 'per_kg', 'price_per_kg' => 24000, 'tolerance' => 300]]);
        $java->methods()->create(['type' => 'free', 'title' => $t('Gratis ongkir', 'Free shipping'), 'etd' => $t('2–4 hari', '2–4 days'), 'active' => true,
            'settings' => ['requires' => 'min_subtotal', 'min_subtotal' => 500000]]);

        $rest = ShippingZone::query()->create(['name' => 'Indonesia']);
        $rest->regions()->create(['country' => 'ID']);
        $rest->methods()->create(['type' => 'weight', 'title' => $t('Reguler', 'Regular'), 'etd' => $t('3–6 hari', '3–6 days'), 'active' => true,
            'settings' => ['mode' => 'table', 'table' => [['max' => 1, 'cost' => 25000], ['max' => 3, 'cost' => 45000], ['max' => 10, 'cost' => 90000]]]]);
        $rest->methods()->create(['type' => 'free', 'title' => $t('Gratis ongkir', 'Free shipping'), 'etd' => $t('4–7 hari', '4–7 days'), 'active' => true,
            'settings' => ['requires' => 'min_subtotal', 'min_subtotal' => 750000]]);
        $rest->methods()->create(['type' => 'pickup', 'title' => $t('Ambil di toko', 'Store pickup'), 'active' => true, 'settings' => ['cost' => 0, 'locations' => [
            ['name' => 'KAIN Senopati', 'address' => 'Jl. Senopati No. 26, Jakarta Selatan', 'instructions' => $this->t('Siap diambil 2 jam setelah pembayaran, 10.00–21.00.', 'Ready 2 hours after payment, 10:00–21:00.')],
            ['name' => 'KAIN Dago', 'address' => 'Jl. Ir. H. Juanda No. 88, Bandung', 'instructions' => $this->t('Siap diambil keesokan harinya.', 'Ready the next day.')],
        ]]]);
    }

    protected function payments(): void
    {
        $settings = app(StoreSettings::class);
        $payments = (array) ($settings->stored()['payments'] ?? []);
        $t = fn (string $id, string $en) => ['id' => $id, 'en' => $en];
        $payments['methods']['bank_transfer'] = [...(array) ($payments['methods']['bank_transfer'] ?? []), 'active' => true, 'title' => $t('Transfer bank', 'Bank transfer'),
            'description' => $t('BCA atau Mandiri. Pesanan diproses setelah dana masuk.', 'BCA or Mandiri. We ship once the transfer arrives.'),
            'accounts' => [['bank' => 'bca', 'number' => '5260 123 456', 'holder' => 'PT Kain Sehari Hari'], ['bank' => 'mandiri', 'number' => '127 000 2026 123', 'holder' => 'PT Kain Sehari Hari']],
            'unique_code' => 'add', 'confirmation' => 'optional', 'deadline_hours' => 24,
            'instructions' => $t('Transfer tepat sesuai jumlah, termasuk 3 digit kode unik, agar pembayaran cepat dikenali.', 'Transfer the exact amount, including the 3-digit unique code, so we can match your payment quickly.')];
        $payments['methods']['instructions_qris'] = [...(array) ($payments['methods']['instructions_qris'] ?? []), 'active' => true, 'title' => $t('QRIS (semua e-wallet)', 'QRIS (any e-wallet)'),
            'description' => $t('Bayar dengan GoPay, OVO, DANA, ShopeePay atau m-banking.', 'Pay with GoPay, OVO, DANA, ShopeePay or mobile banking.'),
            'image' => $this->asset('qris-code', $this->qris(), 'QRIS'), 'confirmation' => 'optional', 'deadline_hours' => 2,
            'instructions' => $t("1. Buka aplikasi e-wallet atau m-banking.\n2. Pindai kode QRIS ini.\n3. Pastikan nama merchant KAIN dan jumlahnya sesuai.", "1. Open your e-wallet or banking app.\n2. Scan this QRIS code.\n3. Check the merchant is KAIN and the amount matches.")];
        $payments['methods']['cod'] = [...(array) ($payments['methods']['cod'] ?? []), 'active' => true, 'title' => $t('Bayar di tempat (COD)', 'Cash on delivery'),
            'description' => $t('Bayar tunai ke kurir. Hanya Jabodetabek.', 'Pay the courier in cash. Greater Jakarta only.'), 'provinces' => '31, 32, 36'];
        $payments['instances']['instructions'] = array_values(array_unique([...(array) ($payments['instances']['instructions'] ?? []), 'instructions_qris']));
        $payments['order'] = array_values(array_unique([...(array) ($payments['order'] ?? []), 'bank_transfer', 'instructions_qris', 'cod']));
        $settings->saveSection('payments', $payments);
    }

    protected function promotions(): void
    {
        $products = fn (array $codes) => collect($codes)->map(fn (string $code) => ['type' => 'product',
            'id' => (int) Variant::query()->where('sku', 'like', self::SKU_PREFIX.$code.'-%')->value('product_id')])->filter(fn ($t) => $t['id'] > 0)->values()->all();

        if (! FlashSale::query()->where('slug', 'weekend-flash-sale')->exists()) {
            $sale = app(SaveFlashSale::class);
            $sale->handle($sale->blank(), [...$sale->values($sale->blank()), 'name' => $this->t('Flash Sale Akhir Pekan', 'Weekend Flash Sale'), 'slug' => 'weekend-flash-sale',
                'badge' => 'FLASH', 'show_countdown' => true, 'show_progress' => true,
                'description' => [$this->locale => $this->t('Harga spesial selama 3 hari. Stok terbatas!', 'Special prices for 3 days. While stocks last!')],
                'dates' => ['start' => now()->subHours(6)->startOfHour()->toIso8601String(), 'end' => now()->addDays(2)->addHours(9)->startOfHour()->toIso8601String()],
                'items' => [
                    ['target' => $products(['W07']), 'discount_type' => 'percent_off', 'percent' => 30, 'quantity_limit' => 40],
                    ['target' => $products(['M09']), 'discount_type' => 'percent_off', 'percent' => 25, 'quantity_limit' => 30],
                    ['target' => $products(['W04']), 'discount_type' => 'percent_off', 'percent' => 20, 'quantity_limit' => 50],
                    ['target' => $products(['M12']), 'discount_type' => 'percent_off', 'percent' => 20, 'quantity_limit' => 50],
                    ['target' => $products(['K04']), 'discount_type' => 'percent_off', 'percent' => 30, 'quantity_limit' => 20],
                    ['target' => $products(['W12']), 'discount_type' => 'percent_off', 'percent' => 25, 'quantity_limit' => 25],
                ]]);
        }

        $voucher = app(SaveVoucher::class);
        foreach ([
            ['name' => $this->t('Selamat datang 10%', 'Welcome 10%'), 'code' => 'HALOKAIN', 'type' => 'percent', 'percent' => 10, 'max_discount' => 100000, 'audience' => 'first_order'],
            ['name' => $this->t('Potongan Rp50.000', 'Rp50,000 off'), 'code' => 'HEMAT50', 'type' => 'fixed_cart', 'amount' => 50000, 'min_subtotal' => 400000],
            ['name' => $this->t('Gratis ongkir', 'Free shipping'), 'code' => 'ONGKIRGRATIS', 'type' => 'free_shipping', 'amount' => 30000, 'min_subtotal' => 200000],
        ] as $values) {
            if (! Voucher::query()->where('code', $values['code'])->exists()) {
                $voucher->handle($voucher->blank(), [...$voucher->values($voucher->blank()), ...$values]);
            }
        }

        if (! PriceRule::query()->where('name', 'Basics: 3 or more')->exists()) {
            $rule = app(SavePricingRule::class);
            $rule->handle($rule->blank(), [...$rule->values($rule->blank()), 'name' => 'Basics: 3 or more', 'scope' => 'categories', 'quantity_basis' => 'rule',
                'targets' => [['type' => 'term', 'id' => $this->terms[config('commerce.catalog.category_taxonomy', 'product_categories').'/kids-t-shirts']]],
                'tiers' => [['min_qty' => 3, 'type' => 'percent_off', 'percent' => 10, 'amount' => null]]]);
        }
    }

    /** About, Help, Size guide, the legal pages (published) and the home page. */
    protected function pages(): void
    {
        $pages = Collection::query()->where('handle', 'pages')->firstOrFail();
        $hero = $this->asset('home-hero', Artwork::banner([['knit', '#cdb79a'], ['jacket', '#26324a'], ['trousers', '#1f1f1f'], ['tee', '#efeae0']], '#e7e2da'), 'KAIN');
        $home = $this->page($pages, 'home', $this->t('Beranda', 'Home'), [
            'hero_title' => $this->t('Pakaian sederhana untuk setiap hari', 'Simple clothes for every day'),
            'hero_text' => $this->t('Koleksi esensial baru: rajut merino, jaket ringan dan kaus Supima. Gratis ongkir di atas Rp500.000.', 'New essentials: merino knits, light jackets and Supima tees. Free shipping over Rp500,000.'),
            'hero_image' => $hero, 'hero_button' => $this->t('Belanja koleksi baru', 'Shop new arrivals'), 'hero_link' => '/products?sort=newest',
        ], 'home', 'sunrice.home');
        if ((int) Setting::get('homepage_entry_id') !== $home->id) {
            Setting::set('homepage_entry_id', $home->id);
        }
        $this->page($pages, $this->t('tentang-kami', 'about'), $this->t('Tentang Kami', 'About us'), [
            'intro' => $this->t('KAIN membuat pakaian sehari-hari yang sederhana, nyaman dan tahan lama.', 'KAIN makes simple, comfortable everyday clothes that last.'),
            'image' => $this->asset('about-image', Artwork::banner([['tee', '#efeae0'], ['shirt', '#5b7fa6'], ['knit', '#9a9a98']], '#ece8e1', 1600, 600), 'KAIN'),
            'body' => $this->t(
                '<p>Kami percaya pakaian yang baik tidak perlu rumit. Setiap potong dirancang di Jakarta dan dijahit oleh mitra kami di Jawa Barat, dengan bahan yang dipilih agar nyaman di iklim tropis.</p><h2>Bahan yang bertanggung jawab</h2><p>Lebih dari separuh koleksi kami memakai katun organik, linen atau poliester daur ulang.</p><h2>Toko kami</h2><p>Kunjungi KAIN Senopati di Jakarta dan KAIN Dago di Bandung, setiap hari pukul 10.00–21.00.</p>',
                '<p>We believe good clothes don\'t need to be complicated. Every piece is designed in Jakarta and sewn by our partners in West Java, in fabrics chosen to be comfortable in the tropics.</p><h2>Responsible materials</h2><p>More than half of our range uses organic cotton, linen or recycled polyester.</p><h2>Our stores</h2><p>Visit KAIN Senopati in Jakarta and KAIN Dago in Bandung, daily 10:00–21:00.</p>',
            ),
        ]);
        $this->page($pages, $this->t('bantuan', 'help'), $this->t('Bantuan', 'Help'), [
            'intro' => $this->t('Pertanyaan tentang pesanan, pengiriman, pembayaran atau ukuran? Mulai dari sini.', 'Questions about orders, delivery, payment or sizes? Start here.'),
            'body' => $this->t(
                '<h2>Pengiriman</h2><p>Pesanan dikirim dalam 1 hari kerja. Reguler 2–3 hari di Jawa & Bali, 3–6 hari di luar Jawa. Gratis ongkir di atas Rp500.000 (Jawa & Bali) dan Rp750.000 (seluruh Indonesia).</p><h2>Pembayaran</h2><p>Transfer bank BCA atau Mandiri, QRIS, atau bayar di tempat untuk Jabodetabek. Sudah transfer? Konfirmasi di halaman pesanan Anda.</p><h2>Tukar dan kembalikan</h2><p>Tukar ukuran gratis dalam 30 hari dengan label masih terpasang. Hubungi halo@example.com.</p><h2>Lacak pesanan</h2><p>Masuk ke Akun Saya, atau gunakan halaman Lacak pesanan dengan nomor pesanan dan email Anda.</p>',
                '<h2>Delivery</h2><p>Orders ship within 1 working day. Regular takes 2–3 days in Java & Bali and 3–6 days elsewhere. Free shipping over Rp500,000 (Java & Bali) and Rp750,000 (all of Indonesia).</p><h2>Payment</h2><p>Bank transfer to BCA or Mandiri, QRIS, or cash on delivery in Greater Jakarta. Already paid? Confirm it from your order page.</p><h2>Exchanges and returns</h2><p>Free size exchanges within 30 days with the tags still on. Email halo@example.com.</p><h2>Track your order</h2><p>Sign in to My Account, or use Track order with your order number and email.</p>',
            ),
        ]);
        // The legal pages commerce:scaffold made as drafts: publish them, and ask for the terms at checkout.
        foreach (Entry::query()->where('collection_id', $pages->id)->where('status', 'draft')->with('translations')->get() as $draft) {
            $translation = $draft->mainTranslation();
            if ($translation !== null && $translation->draft !== null) {
                app(PublishTranslation::class)->handle($translation);
            }
        }
        $terms = Entry::query()->where('collection_id', $pages->id)->whereHas('translations', fn ($q) => $q->whereIn('slug', ['syarat-dan-ketentuan', 'terms-and-conditions']))->value('id');
        $settings = app(StoreSettings::class);
        if ($terms !== null && blank($settings->get('checkout.terms_page'))) {
            app(SaveStoreSettings::class)->handle('checkout', [...$settings->section('checkout'), 'terms_page' => [(int) $terms]]);
        }
    }

    /** The header menu (departments with their categories) and the footer menu. */
    protected function menus(): void
    {
        $categories = (string) config('commerce.catalog.category_taxonomy', 'product_categories');
        $main = [];
        foreach (Catalog::categories() as $slug => $department) {
            if ($department['children'] === []) {
                continue;
            }
            $main[] = ['type' => 'term', 'target' => "{$categories}/{$slug}", 'labels' => ['id' => $department['id'], 'en' => $department['en']], 'children' => array_map(
                fn (string $child, array $c) => ['type' => 'term', 'target' => "{$categories}/{$child}", 'labels' => ['id' => $c['id'], 'en' => $c['en']]],
                array_keys($department['children']), $department['children'],
            )];
        }
        $path = fn (string $key) => '/'.ltrim((string) config("commerce.storefront.paths.{$key}", str_replace('_', '-', $key)), '/');
        $main[] = ['type' => 'url', 'url' => $path('flash_sale'), 'labels' => ['id' => 'Sale', 'en' => 'Sale']];
        $main[] = ['type' => 'url', 'url' => $path('brands'), 'labels' => ['id' => 'Merek', 'en' => 'Brands']];

        $page = fn (string $id, string $en) => 'pages/'.$this->t($id, $en);
        $footer = [
            ['type' => 'url', 'url' => '#', 'labels' => ['id' => 'Bantuan', 'en' => 'Help'], 'children' => [
                ['type' => 'entry', 'target' => $page('bantuan', 'help'), 'labels' => ['id' => 'Pusat bantuan', 'en' => 'Help centre']],
                ['type' => 'url', 'url' => $path('track_order'), 'labels' => ['id' => 'Lacak pesanan', 'en' => 'Track order']],
                ['type' => 'url', 'url' => $path('confirm_payment'), 'labels' => ['id' => 'Konfirmasi pembayaran', 'en' => 'Confirm payment']],
                ['type' => 'entry', 'target' => $page('kebijakan-pengiriman', 'shipping-policy'), 'labels' => ['id' => 'Pengiriman', 'en' => 'Shipping']],
                ['type' => 'entry', 'target' => $page('pengembalian-dan-refund', 'returns-and-refunds'), 'labels' => ['id' => 'Pengembalian', 'en' => 'Returns']],
            ]],
            ['type' => 'url', 'url' => '#', 'labels' => ['id' => 'Belanja', 'en' => 'Shop'], 'children' => [
                ['type' => 'collection', 'target' => 'products', 'labels' => ['id' => 'Semua produk', 'en' => 'All products']],
                ['type' => 'url', 'url' => $path('flash_sale'), 'labels' => ['id' => 'Flash sale', 'en' => 'Flash sale']],
                ['type' => 'url', 'url' => $path('brands'), 'labels' => ['id' => 'Merek', 'en' => 'Brands']],
                ['type' => 'url', 'url' => $path('wishlist'), 'labels' => ['id' => 'Wishlist', 'en' => 'Wishlist']],
                ['type' => 'url', 'url' => $path('compare'), 'labels' => ['id' => 'Bandingkan', 'en' => 'Compare']],
            ]],
            ['type' => 'url', 'url' => '#', 'labels' => ['id' => 'Tentang KAIN', 'en' => 'About KAIN'], 'children' => [
                ['type' => 'entry', 'target' => $page('tentang-kami', 'about'), 'labels' => ['id' => 'Tentang kami', 'en' => 'About us']],
                ['type' => 'entry', 'target' => $page('syarat-dan-ketentuan', 'terms-and-conditions'), 'labels' => ['id' => 'Syarat & ketentuan', 'en' => 'Terms & conditions']],
                ['type' => 'entry', 'target' => $page('kebijakan-privasi', 'privacy-policy'), 'labels' => ['id' => 'Kebijakan privasi', 'en' => 'Privacy policy']],
            ]],
        ];
        $menus = array_values(array_filter([
            Menu::query()->where('handle', 'main')->exists() ? null : ['handle' => 'main', 'title' => 'Main menu', 'items' => $main],
            Menu::query()->where('handle', 'footer')->exists() ? null : ['handle' => 'footer', 'title' => 'Footer menu', 'items' => $footer],
        ]));
        if ($menus !== []) {
            Sunrice::importStructure(['menus' => $menus]);
        }
    }

    /** The demo customer: an account, two addresses, orders in several states and a wishlist. */
    protected function customer(): void
    {
        $model = (string) config('sunrice.auth.user_model', config('auth.providers.users.model'));
        if (! class_exists($model) || $model::query()->where('email', self::CUSTOMER_EMAIL)->exists()) {
            return;
        }
        /** @var Model&Authenticatable $user */
        $user = $model::query()->forceCreate(['name' => 'Dewi Lestari', 'email' => self::CUSTOMER_EMAIL, 'password' => Hash::make(self::CUSTOMER_PASSWORD), 'email_verified_at' => now()]);
        app(AssignCustomerRole::class)->handle($user);
        $customer = Customer::forUser($user);
        $customer->forceFill(['phone' => '+6281234560026', 'accepts_marketing' => true, 'marketing_consent_at' => now()])->save();

        $home = ['name' => 'Dewi Lestari', 'phone' => '0812 3456 0026', 'country' => 'ID', ...$this->place('31', '31.74', '31.74.04'),
            'line1' => 'Jl. Kemang Raya No. 12', 'postal_code' => '12730', 'label' => $this->t('Rumah', 'Home'), 'default_shipping' => true, 'default_billing' => true];
        $office = ['name' => 'Dewi Lestari', 'phone' => '0812 3456 0026', 'country' => 'ID', ...$this->place('32', '32.73', '32.73.01'),
            'line1' => 'Jl. Sukasari No. 5, Lantai 3', 'postal_code' => '40151', 'label' => $this->t('Kantor', 'Office')];
        foreach ([$home, $office] as $address) {
            app(SaveAddress::class)->handle($customer, $address);
        }
        $address = array_diff_key($customer->addresses()->first()?->toAddress() ?? $home, ['label' => 1, 'default_shipping' => 1, 'default_billing' => 1]);

        $sku = fn (string $sku) => Variant::query()->where('sku', $sku)->firstOrFail();
        $regular = (int) ShippingMethod::query()->where('type', 'weight')->orderBy('id')->value('id');
        $actor = Actor::system();
        $machine = app(OrderStateMachine::class);

        // Completed a month ago, shipped, paid by transfer.
        $completed = $this->order($user, [[$sku('KN-W04-NAV-M'), 1], [$sku('KN-W01-OFF-M'), 2]], 'bank_transfer', $address, "weight:{$regular}:default");
        app(MarkOrderPaid::class)->handle($completed, $actor, 'BCA 0926');
        $this->ship($completed, 'jne', 'JNE', 'JNE0026001122');
        $machine->transition($completed->refresh(), OrderStatus::COMPLETED, $actor);
        $this->backdate($completed, 34);

        // Shipped last week.
        $shipped = $this->order($user, [[$sku('KN-W07-BLA-M'), 1], [$sku('KN-W16-OFF'), 1]], 'instructions_qris', $address, "weight:{$regular}:default");
        app(MarkOrderPaid::class)->handle($shipped, $actor, 'QRIS-5521');
        $this->ship($shipped, 'sicepat', 'SiCepat', 'SCP260011223344');
        $this->backdate($shipped, 6);

        // Paid, being packed.
        $processing = $this->order($user, [[$sku('KN-W09-BLA-S'), 1]], 'bank_transfer', $address, "weight:{$regular}:default");
        app(MarkOrderPaid::class)->handle($processing, $actor, 'Mandiri 1102');
        $this->backdate($processing, 2);

        // A digital order: the lookbook, with its download.
        $digital = $this->order($user, [[$sku('KN-D01'), 1]], 'instructions_qris', null, null);
        app(MarkOrderPaid::class)->handle($digital, $actor, 'QRIS-7781');
        $this->backdate($digital, 12);

        // Cancelled.
        $cancelled = $this->order($user, [[$sku('KN-W10-NAV-M'), 1]], 'bank_transfer', $address, "weight:{$regular}:default");
        $machine->transition($cancelled, OrderStatus::CANCELLED, $actor, $this->t('Dibatalkan oleh pelanggan', 'Cancelled by the customer'));
        $this->backdate($cancelled, 20);

        // Waiting for the transfer: the order page shows the bank accounts.
        $this->order($user, [[$sku('KN-W06-BEI-M'), 1], [$sku('KN-W18-BLA'), 2]], 'bank_transfer', $address, "weight:{$regular}:default");

        $wishlist = Wishlist::query()->firstOrCreate(['customer_id' => $customer->id], ['share_token' => Str::random(40)]);
        foreach (['W08', 'M10', 'W12', 'K03'] as $code) {
            $productId = (int) Variant::query()->where('sku', 'like', self::SKU_PREFIX.$code.'-%')->value('product_id');
            if ($productId > 0) {
                $wishlist->items()->firstOrCreate(['product_id' => $productId]);
            }
        }
        Auth::forgetGuards();
        app()->forgetScopedInstances();
    }

    /**
     * Region codes for an address: the ones asked for when imported, else
     * the nearest ones that are (stores may import regions only partly).
     *
     * @return array{province_code: string, city_code: string, district_code?: string}
     */
    protected function place(string $province, string $city, string $district): array
    {
        $regions = fn () => DB::table('commerce_regions');
        $exists = fn (string $code) => $regions()->where('code', $code)->exists();
        $child = fn (string $parent) => $regions()->where('parent_code', $parent)->orderBy('code')->value('code');
        if (! $exists($city)) {
            $withDistricts = fn () => $regions()->where('level', 2)->whereIn('code', $regions()->where('level', 3)->select('parent_code'))->orderBy('code');
            $city = (string) ($withDistricts()->where('parent_code', $province)->value('code') ?? $withDistricts()->value('code'));
            $province = (string) ($regions()->where('code', $city)->value('parent_code') ?? $province);
            $district = '';
        }
        $district = $district !== '' && $exists($district) ? $district : (string) $child($city);

        return array_filter(['province_code' => $province, 'city_code' => $city, 'district_code' => $district], fn ($v) => $v !== '');
    }

    /**
     * An order placed the way checkout places it, as the customer.
     *
     * @param  array<int, array{0: Variant, 1: int}>  $lines
     * @param  array<string, mixed>|null  $address
     */
    protected function order(Authenticatable $user, array $lines, string $payment, ?array $address, ?string $rate): Order
    {
        Auth::guard((string) config('commerce.auth.guard', 'commerce'))->setUser($user);
        app()->forgetScopedInstances();
        $customer = Customer::forUser($user);
        $cart = Cart::query()->create(['token' => Str::random(64), 'status' => 'active', 'currency' => 'IDR', 'customer_id' => $customer->id, 'last_activity_at' => now()]);
        foreach ($lines as [$variant, $quantity]) {
            $cart->items()->create(['variant_id' => $variant->id, 'quantity' => $quantity]);
        }
        $data = CheckoutData::fromCart($cart)->merge(array_filter([
            'name' => $customer->name, 'email' => $customer->email, 'phone' => '0812 3456 0026',
            'shipping_address' => $address, 'billing_same' => '1', 'shipping_rate' => $rate, 'payment_method' => $payment, 'terms' => '1',
        ], fn ($v) => $v !== null));

        return app(PlaceOrder::class)->handle($cart->fresh() ?? $cart, $data, null)->order->refresh();
    }

    protected function ship(Order $order, string $courier, string $name, string $tracking): void
    {
        app(CreateShipment::class)->handle($order->refresh(), ['courier' => $courier, 'courier_name' => $name, 'tracking_number' => $tracking],
            $order->items->whereNull('parent_id')->map(fn ($item) => ['order_item_id' => $item->id, 'quantity' => $item->quantity])->values()->all(), Actor::system());
    }

    protected function backdate(Order $order, int $days): void
    {
        $at = now()->subDays($days)->setTime(10 + $days % 9, 15);
        $order->forceFill(['placed_at' => $at, 'created_at' => $at, 'paid_at' => $order->paid_at !== null ? $at->copy()->addHours(2) : null])->save();
    }

    /**
     * A published product entry.
     *
     * @param  array<string, mixed>  $value
     * @param  array<string, mixed>  $data
     */
    protected function productEntry(string $title, array $value, array $data): Entry
    {
        $collection = Collection::query()->where('handle', (string) (config('commerce.catalog.collections', ['products'])[0] ?? 'products'))->firstOrFail();

        return $this->publish($collection, $title, Str::slug($title), [...$data, (string) config('commerce.catalog.field', 'product') => $value]);
    }

    /** @param  array<string, mixed>  $data */
    protected function page(Collection $pages, string $slug, string $title, array $data, ?string $blueprint = null, ?string $template = null): Entry
    {
        $existing = Entry::query()->where('collection_id', $pages->id)->whereHas('translations', fn ($q) => $q->where('slug', $slug))->first();
        if ($existing !== null) {
            return $existing;
        }
        $blueprintId = $blueprint !== null ? Blueprint::query()->where('handle', $blueprint)->value('id') : null;

        return $this->publish($pages, $title, $slug, $data, $blueprintId, $template);
    }

    /** @param  array<string, mixed>  $data */
    protected function publish(Collection $collection, string $title, string $slug, array $data, ?int $blueprintId = null, ?string $template = null): Entry
    {
        $entry = Entry::query()->create(['collection_id' => $collection->id, 'blueprint_id' => $blueprintId, 'template' => $template, 'status' => 'draft', 'sort_order' => 0]);
        $translation = $entry->translations()->create(['locale' => Locales::main(), 'collection_id' => $collection->id, 'title' => $title, 'slug' => $slug, 'data' => [], 'seo' => []]);
        app(SaveDraft::class)->handle($translation, ['title' => $title, 'slug' => $slug, 'data' => $data]);
        app(PublishTranslation::class)->handle($translation->fresh() ?? $translation);

        return $entry->fresh() ?? $entry;
    }

    /** @param  array<int, int>  $termIds */
    protected function assignTerms(Entry $entry, array $termIds): void
    {
        app(SyncEntryTerms::class)->handle($entry, array_values(array_filter($termIds)));
    }

    /**
     * A term found by slug, or created.
     *
     * @param  array<string, mixed>  $data
     */
    protected function term(string $taxonomy, string $slug, string $name, array $data = [], ?int $parent = null, int $order = 0): int
    {
        $model = Taxonomy::query()->where('handle', $taxonomy)->firstOrFail();
        $id = TermTranslation::query()->where('taxonomy_id', $model->id)->where('slug', $slug)->value('term_id');
        if ($id === null) {
            $term = app(SaveTerm::class)->handle($model, ['parent_id' => $parent, 'translations' => [Locales::main() => ['title' => $name, 'slug' => $slug, 'data' => $data]]]);
            $id = $term->id;
            if ($order > 0) {
                Term::query()->whereKey($id)->update(['sort_order' => $order]);
            }
        }

        return $this->terms["{$taxonomy}/{$slug}"] = (int) $id;
    }

    /** An SVG in the asset library (folder "Starter store"), uploaded once. */
    protected function asset(string $name, string $svg, string $alt): int
    {
        if (isset($this->assets[$name])) {
            return $this->assets[$name];
        }
        $existing = Asset::query()->where('filename', "{$name}.svg")->value('id');
        if ($existing !== null) {
            return $this->assets[$name] = (int) $existing;
        }
        $this->folder ??= (int) (AssetFolder::query()->where('name', 'Starter store')->whereNull('parent_id')->value('id')
            ?? AssetFolder::query()->create(['name' => 'Starter store'])->id);
        $path = tempnam(sys_get_temp_dir(), 'kain');
        file_put_contents((string) $path, $svg);
        $asset = app(UploadAsset::class)->handle(new UploadedFile((string) $path, "{$name}.svg", 'image/svg+xml', null, true), ['folder_id' => $this->folder, 'alt' => $alt, 'title' => $alt]);
        @unlink((string) $path);

        return $this->assets[$name] = $asset->id;
    }

    /** A QRIS-like placeholder: a grid of squares, clearly not a real code. */
    protected function qris(): string
    {
        $cells = '';
        for ($y = 0; $y < 21; $y++) {
            for ($x = 0; $x < 21; $x++) {
                $finder = ($x < 7 && $y < 7) || ($x > 13 && $y < 7) || ($x < 7 && $y > 13);
                $on = $finder ? (min($x % 14, $y % 14) % 6 === 0 || (in_array($x % 14, [2, 3, 4], true) && in_array($y % 14, [2, 3, 4], true)) || max($x % 14, $y % 14) === 6)
                    : (crc32("{$x}-{$y}") % 3 === 0);
                $cells .= $on ? '<rect x="'.(20 + $x * 12).'" y="'.(40 + $y * 12).'" width="12" height="12"/>' : '';
            }
        }

        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 292 330" width="292" height="330"><rect width="292" height="330" fill="#ffffff"/>'
            .'<text x="146" y="26" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="16">QRIS · KAIN (DEMO)</text>'
            .'<g fill="#111111">'.$cells.'</g></svg>';
    }

    /** @param  array<string, mixed>  $p */
    protected function excerpt(array $p, string $material): string
    {
        return match ($p['shape']) {
            'tee' => $this->t("Kaus harian dari {$material}. Lembut, adem dan tidak mudah melar.", "An everyday tee in {$material}. Soft, breathable and keeps its shape."),
            'knit' => $this->t("Rajutan halus dari {$material}, hangat tanpa terasa berat.", "A fine knit in {$material}, warm without the weight."),
            'shirt' => $this->t("Kemeja rapi dari {$material}, nyaman dari kantor sampai akhir pekan.", "A neat shirt in {$material}, from the office to the weekend."),
            'jacket' => $this->t("Lapisan luar ringan dari {$material}. Mudah dilipat untuk perjalanan.", "A light outer layer in {$material}. Packs down for travel."),
            'trousers', 'shorts' => $this->t("Celana dengan potongan bersih dari {$material}, pinggang nyaman.", "Clean-cut trousers in {$material} with a comfortable waist."),
            'skirt' => $this->t("Rok dengan jatuh yang indah dari {$material}.", "A skirt with a beautiful drape in {$material}."),
            default => $this->t("Aksesori sehari-hari dari {$material}.", "An everyday accessory in {$material}."),
        };
    }

    /** @param  array<string, mixed>  $p */
    protected function description(array $p, string $material): string
    {
        return '<p>'.e($this->excerpt($p, $material)).' '.e($this->t('Dirancang di Jakarta untuk iklim tropis, dengan detail yang dibuat untuk dipakai bertahun-tahun.', 'Designed in Jakarta for the tropics, with details made to last for years.')).'</p>'
            .'<ul><li>'.e($this->t('Jahitan ganda yang kuat', 'Strong double stitching')).'</li><li>'.e($this->t('Warna tahan lama setelah dicuci', 'Colour that lasts wash after wash')).'</li><li>'.e($material).'</li></ul>';
    }

    /** @param  array<int, string>  $sizes */
    protected function sizeGuide(array $sizes, bool $kids): string
    {
        $rows = '';
        foreach ($sizes as $i => $size) {
            $rows .= '<tr><td>'.e($size).'</td><td>'.($kids ? 56 + $i * 4 : 82 + $i * 6).'</td><td>'.($kids ? 42 + $i * 4 : 62 + $i * 2).'</td></tr>';
        }

        return '<table><thead><tr><th>'.$this->t('Ukuran', 'Size').'</th><th>'.$this->t('Lingkar dada (cm)', 'Chest (cm)').'</th><th>'.$this->t('Panjang (cm)', 'Length (cm)').'</th></tr></thead><tbody>'.$rows.'</tbody></table>';
    }

    /** The text in the site's main language (Indonesian, else English). */
    protected function t(string $id, string $en): string
    {
        return $this->locale === 'id' ? $id : $en;
    }
}
