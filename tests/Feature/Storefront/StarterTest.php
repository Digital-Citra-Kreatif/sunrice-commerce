<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Database\Seeders\StarterStoreSeeder;
use Sunrice\Commerce\Documents\Documents;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderAdjustment;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Regions\RegionImporter;
use Sunrice\Commerce\Storefront\Templates;
use Sunrice\Models\Asset;
use Sunrice\Models\Entry;
use Sunrice\Models\Menu;
use Sunrice\Models\Term;
use Sunrice\Support\Locales;
use Workbench\App\Models\User;

/*
 * The starter theme (commerce:install --starter) and its demo store
 * (StarterStoreSeeder): every page renders with the demo data, the seeder
 * can run twice, and the documents are still PDFs. Publishing is tested in
 * TemplatesTest, with the other tests that write into the app's views.
 */

function starterStore(): void
{
    // Seeding fifty products with their artwork takes more than a parallel worker's default 128 MB.
    ini_set('memory_limit', '512M');
    Storage::fake((string) config('sunrice.assets.disk', 'public'));
    Storage::fake((string) config('commerce.downloads.disk', 'local'));
    (new RegionImporter(__DIR__.'/../../Fixtures/regions'))->import(4);
    app(StarterStoreSeeder::class)->run();
    // As if published: resources/views/starter is looked up first, like the app's views.
    View::prependLocation($starter = __DIR__.'/../../../resources/views/starter');
    config(['view.paths' => [$starter, ...(array) config('view.paths')]]);
}

it('ships starter templates that compile to valid PHP', function () {
    $dir = __DIR__.'/../../../resources/views/starter';
    $files = Templates::files($dir);
    expect($files)->toContain('sunrice/layouts/app.blade.php', 'sunrice/home.blade.php', 'sunrice/pages/show.blade.php', 'sunrice/search.blade.php', 'errors/404.blade.php');
    foreach ($files as $file) {
        token_get_all(Blade::compileString((string) file_get_contents("{$dir}/{$file}")), TOKEN_PARSE);
    }
});

it('seeds the starter store once, however often it runs', function () {
    starterStore();
    $counts = fn () => [Product::query()->count(), Variant::query()->count(), Asset::query()->count(), Term::query()->count(), Entry::query()->count(),
        Order::query()->count(), Voucher::query()->count(), FlashSale::query()->count(), Menu::query()->count(), Customer::query()->count()];
    $first = $counts();
    app(StarterStoreSeeder::class)->run();

    expect($counts())->toBe($first)
        ->and($first[0])->toBeGreaterThanOrEqual(40)
        ->and(Product::query()->where('type', 'bundle')->count())->toBe(3)
        ->and(Product::query()->where('downloadable', true)->count())->toBe(1)
        ->and(Order::query()->distinct()->pluck('status')->all())->toContain('completed', 'processing', 'cancelled', 'pending')
        ->and(User::query()->where('email', StarterStoreSeeder::CUSTOMER_EMAIL)->exists())->toBeTrue();
});

it('renders every starter page with the demo data', function () {
    starterStore();
    $order = Order::query()->where('status', 'pending')->firstOrFail();
    $sale = FlashSale::query()->firstOrFail();

    foreach (['/', '/products', '/products?q=kaus', '/products?q=tidak-ada-apa-apa', '/products/category/women', '/products/category/women-t-shirts?sort=price',
        '/brands', '/brands/arah-outdoor', '/products/tag/best-sellers', '/products/supima-cotton-crew-neck-t-shirt', '/products/paket-kaus-harian-isi-3',
        '/products/kain-lookbook', '/products/kartu-hadiah-digital', '/search?q=merino', '/tentang-kami', '/bantuan', '/cart', '/compare', '/wishlist',
        '/flash-sale', '/flash-sale/'.$sale->slug, '/track-order', '/confirm-payment', $order->url(), $order->url().'/pay',
        '/account/login', '/account/register', '/account/forgot-password'] as $path) {
        $this->get($path)->assertOk()->assertSee('commerce-header', false)->assertSee('commerce-footer', false);
    }
    $this->get('/tidak-ada')->assertNotFound()->assertSee('commerce-empty', false);
    $this->get('/')->assertSee('commerce-hero', false)->assertSee('data-commerce-countdown', false);
    $this->get('/products/category/women')->assertSee('data-commerce-filters', false)->assertSee('commerce-swatch', false);

    $this->actingAs(User::query()->where('email', StarterStoreSeeder::CUSTOMER_EMAIL)->firstOrFail(), (string) config('commerce.auth.guard', 'commerce'));
    foreach (['/account', '/account/orders', '/account/orders/'.Order::query()->where('status', 'completed')->value('id'), '/account/downloads',
        '/account/addresses', '/account/profile'] as $path) {
        $this->get($path)->assertOk()->assertSee('commerce-account', false);
    }
    $this->get('/wishlist')->assertOk()->assertSee('commerce-wishlist__item', false);
});

it('still renders the documents of starter orders as PDFs', function () {
    starterStore();
    $documents = app(Documents::class);
    foreach (Order::query()->whereIn('status', ['completed', 'pending'])->get() as $order) {
        foreach (['invoice', 'packing_slip'] as $type) {
            expect(substr($documents->pdf($order, $type), 0, 5))->toBe('%PDF-');
        }
        expect($documents->html(collect([$order]), 'invoice'))->toContain('KAIN')->toContain($order->number);
    }
});

it('seeds in the store language, with one shot per colour', function () {
    app()->setLocale('en');
    starterStore();
    $locale = Locales::main();
    $customer = Customer::query()->firstOrFail();

    expect(app()->getLocale())->toBe('en')
        ->and($customer->locale)->toBe($locale)
        ->and(Order::query()->distinct()->pluck('locale')->all())->toBe([$locale]);
    if ($locale === 'id') {
        expect(OrderAdjustment::query()->where('kind', 'unique_code')->pluck('label')->unique()->all())->not->toContain('Unique code');
    }

    // Each garment's gallery is its colour shots, nothing more.
    $tee = Product::query()->where('type', 'variable')->firstOrFail();
    $gallery = (array) Entry::query()->findOrFail($tee->entry_id)->translations()->firstOrFail()->data['gallery'];
    expect($gallery)->toHaveCount($tee->variants()->distinct()->count('image_asset_id'));
});
