<?php

declare(strict_types=1);

use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Reports\Reports;
use Sunrice\Commerce\Analytics\StatsRecorder;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;

function reportOrder(Product $product, int $qty, int $unit, string $placedAt, array $attributes = []): Order
{
    $order = makeOrder(['status' => 'processing', 'payment_status' => 'paid', 'subtotal' => $qty * $unit, 'total' => $qty * $unit, 'paid_total' => $qty * $unit,
        'placed_at' => $placedAt, 'created_at' => $placedAt, ...$attributes]);
    $order->items()->create(['product_id' => $product->id, 'name' => 'Item', 'quantity' => $qty, 'unit_price' => $unit, 'subtotal' => $qty * $unit, 'total' => $qty * $unit]);

    return $order;
}

function run(string $key, string $from = '2026-03-01', string $to = '2026-03-10', string $interval = 'day'): array
{
    return app(Reports::class)->find($key)->run((new Period($from, $to, interval: $interval))->compared('previous'))->toArray();
}

beforeEach(function () {
    $this->travelTo('2026-03-10 12:00:00');
    app(ScaffoldStore::class)->handle();
    $this->kaos = Product::query()->where('entry_id', publishProduct(['variants' => [['id' => 'k', 'sku' => 'KAOS', 'price' => 80000, 'cost' => 30000, 'track_stock' => true, 'initial_stock' => 2]]], title: 'Kaos')->id)->first();
    $this->tas = Product::query()->where('entry_id', publishProduct(['variants' => [['id' => 't', 'sku' => 'TAS', 'price' => 200000, 'track_stock' => true, 'initial_stock' => 0]]], title: 'Tas')->id)->first();
    $acme = term('brands', 'Acme');
    $shirts = term('product_categories', 'Kaos Pria');
    DB::table('sunrice_entry_term')->insert([['entry_id' => $this->kaos->entry_id, 'term_id' => $acme->id], ['entry_id' => $this->kaos->entry_id, 'term_id' => $shirts->id], ['entry_id' => $this->tas->entry_id, 'term_id' => $acme->id]]);

    $this->ani = Customer::query()->create(['email' => 'ani@example.com', 'name' => 'Ani']);
    $first = reportOrder($this->kaos, 2, 80000, '2026-03-02 10:00:00', ['customer_id' => $this->ani->id]);
    $first->adjustments()->create(['kind' => 'discount', 'source_type' => 'voucher', 'code' => 'HEMAT', 'label' => 'HEMAT', 'amount' => -10000]);
    $first->forceFill(['discount_total' => 10000, 'total' => 150000])->save();
    reportOrder($this->tas, 1, 200000, '2026-03-09 10:00:00', ['customer_id' => $this->ani->id]);
    reportOrder($this->kaos, 1, 80000, '2026-02-25 10:00:00');                     // the comparison period
    DB::table('commerce_product_stats_daily')->insert(['date' => '2026-03-05', 'product_id' => $this->kaos->id, 'views' => 40, 'add_to_carts' => 4, 'cta_whatsapp' => 3, 'cta_inquiry' => 1]);
    app(StatsRecorder::class)->rebuild('2026-02-20', '2026-03-10');
});

it('reports sales per day and week with totals, comparison and drill-down', function () {
    $sales = run('sales');
    expect($sales['rows'])->toHaveCount(10)
        ->and($sales['rows'][1])->toMatchArray(['date' => '2026-03-02', 'orders' => 1, 'gross_sales' => 160000, 'discounts' => 10000, 'net_sales' => 150000,
            'href' => 'commerce/orders?filters[date]=2026-03-02..2026-03-02'])
        ->and($sales['totals'])->toMatchArray(['orders' => 2, 'gross_sales' => 360000, 'net_sales' => 350000, 'total_sales' => 350000])
        ->and(collect($sales['summary'])->firstWhere('key', 'net_sales'))->toMatchArray(['value' => 350000, 'previous' => 80000]);

    $weeks = run('sales', interval: 'week');
    expect(array_column($weeks['rows'], 'date'))->toBe(['2026-03-01', '2026-03-02', '2026-03-09'])
        ->and($weeks['rows'][1]['href'])->toBe('commerce/orders?filters[date]=2026-03-02..2026-03-08');
});

it('reports products, categories, brands, vouchers, customers, stock and calls to action', function () {
    expect(run('products')['rows'][0])->toMatchArray(['product' => 'Tas', 'units' => 1, 'revenue' => 200000])
        ->and(collect(run('products')['rows'])->firstWhere('product', 'Kaos'))->toMatchArray(['units' => 2, 'views' => 40, 'add_to_carts' => 4, 'conversion' => 5.0]);

    expect(run('brands')['rows'])->toBe([['term' => 'Acme', 'products' => 2, 'units' => 3, 'revenue' => 360000, 'views' => 40, 'conversion' => 7.5]])
        ->and(run('categories')['rows'][0])->toMatchArray(['term' => 'Kaos Pria', 'units' => 2, 'revenue' => 160000]);

    expect(run('vouchers')['rows'])->toBe([['code' => 'HEMAT', 'uses' => 1, 'discount' => 10000, 'revenue' => 150000, 'href' => null]]);

    $customers = run('customers');
    expect($customers['rows'][0])->toMatchArray(['customer' => 'Ani', 'orders' => 2, 'spent' => 350000, 'last_order' => '2026-03-09'])
        ->and(collect($customers['summary'])->pluck('value', 'key')->all())->toBe(['new_customers' => 1, 'returning_customers' => 1]);

    $stock = run('stock');
    expect(array_column($stock['rows'], 'status', 'sku'))->toBe(['TAS' => 'Out of stock', 'KAOS' => 'Low'])
        ->and(collect($stock['summary'])->pluck('value', 'key')->all())->toBe(['low' => 1, 'out' => 1, 'value' => 60000]);

    expect(run('ctas')['rows'][0])->toMatchArray(['product' => 'Kaos', 'whatsapp' => 3, 'inquiry' => 1, 'total' => 4, 'rate' => 10.0]);
});

it('shows a report page and streams its CSV', function () {
    actingAsUserWith(['commerce.reports.view', 'commerce.reports.export']);

    $this->get('/cms/commerce/reports')->assertRedirect('/cms/commerce/reports/sales');
    $this->get('/cms/commerce/reports/sales?from=2026-03-01&to=2026-03-10')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Commerce/Reports/Show', false)
        ->where('report.key', 'sales')
        ->where('period.from', '2026-03-01')
        ->where('result.totals.orders', 2)
        ->where('reports', fn ($reports) => collect($reports)->pluck('key')->contains('ctas'))
        ->where('exportUrl', '/cms/commerce/reports/sales/export?from=2026-03-01&to=2026-03-10'));

    $csv = $this->get('/cms/commerce/reports/sales/export?from=2026-03-01&to=2026-03-10')->assertOk()->streamedContent();
    $lines = array_values(array_filter(explode("\n", trim(ltrim($csv, "\u{FEFF}")))));  // a BOM first, for Excel
    expect($lines[0])->toBe('Day,Orders,Items,"Gross sales",Discounts,Refunds,"Net sales",Shipping,Taxes,Fees,Total')
        ->and($lines)->toHaveCount(12)
        ->and($lines[11])->toStartWith('Total,2,3,360000');
    $this->get('/cms/commerce/reports/nope')->assertNotFound();
});

it('needs the report permissions', function () {
    actingAsUserWith(['commerce.reports.view']);
    $this->get('/cms/commerce/reports/sales')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page->where('exportUrl', null));
    $this->get('/cms/commerce/reports/sales/export')->assertForbidden();

    actingAsUserWith(['commerce.dashboard.view'], 'editor@example.com');
    $this->get('/cms/commerce/reports/sales')->assertForbidden();
});
