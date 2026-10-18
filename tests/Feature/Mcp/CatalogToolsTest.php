<?php

declare(strict_types=1);

use Sunrice\Activity\ActivityLogger;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Mcp\StoreTools;
use Sunrice\Commerce\Mcp\Tools;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\ActivityLog;

beforeEach(function () {
    $this->mug = checkoutStore(['track_stock' => true, 'initial_stock' => 5]);
    $this->admin = actingAsSuperAdmin();
    app(ActivityLogger::class)->actingVia('ai', 'Claude');
});

/** A user with only these permissions, acting from now on. */
function staffWith(array $permissions): mixed
{
    return actingAsUserWith(['sunrice.access-admin', ...$permissions], 'staff-'.md5(implode(',', $permissions)).'@example.com');
}

it('lists and reads products, and documents the product field', function () {
    $list = mcpTool(Tools\ListProductsTool::class, ['search' => 'MUG']);
    expect($list['total'])->toBe(1)->and($list['products'][0])->toMatchArray(['title' => 'Mug', 'in_stock' => true])
        ->and($list['products'][0]['price']['amount'])->toBe(50000);

    $product = mcpTool(Tools\GetProductTool::class, ['product' => (string) $list['products'][0]['id']]);
    expect($product['variants'][0])->toMatchArray(['variant_id' => $this->mug->id, 'stock' => 5])
        ->and($product['product']['type'])->toBe('simple')
        ->and($product['editing'])->toContain('update_entry')
        ->and(mcpTool(Tools\GetProductTool::class, ['product' => $this->mug->sku])['id'])->toBe($product['id']);

    staffWith(['commerce.orders.view']);   // no product collection access
    expect((new Tools\ListProductsTool)->shouldRegister())->toBeFalse();
});

it('adjusts stock, but not without the permission', function () {
    $result = mcpTool(Tools\AdjustStockTool::class, ['variant' => $this->mug->sku, 'quantity' => -2, 'note' => 'Broken in the warehouse']);
    expect($result)->toMatchArray(['before' => 5, 'stock' => 3])
        ->and(mcpTool(Tools\AdjustStockTool::class, ['variant' => $this->mug->sku, 'quantity' => 10, 'set' => true])['stock'])->toBe(10);

    staffWith(['commerce.inventory.view']);
    expect((new Tools\AdjustStockTool)->shouldRegister())->toBeFalse();
});

it('lists and reads customers', function () {
    $ani = Customer::query()->create(['email' => 'ani@example.com', 'name' => 'Ani', 'phone' => '+628123', 'orders_count' => 2, 'total_spent' => 150000]);
    makeOrder(['customer_id' => $ani->id, 'number' => 'ORD-ANI']);

    expect(mcpTool(Tools\ListCustomersTool::class, ['search' => 'ani'])['customers'][0])->toMatchArray(['id' => $ani->id, 'orders' => 2])
        ->and(mcpTool(Tools\GetCustomerTool::class, ['customer' => 'ani@example.com'])['latest_orders'][0]['number'])->toBe('ORD-ANI');

    staffWith(['commerce.orders.view']);
    expect((new Tools\GetCustomerTool)->shouldRegister())->toBeFalse();
});

it('saves vouchers through the admin form, describing it first', function () {
    $form = mcpTool(Tools\SaveVoucherTool::class);
    expect(collect($form['fields'])->pluck('handle'))->toContain('code', 'type', 'percent', 'dates');

    $saved = mcpTool(Tools\SaveVoucherTool::class, ['values' => ['name' => 'Hemat 10%', 'code' => 'hemat10', 'active' => true, 'type' => 'percent', 'percent' => 10]]);
    expect($saved)->toMatchArray(['saved' => true, 'code' => 'HEMAT10', 'type' => 'percent'])
        ->and(Voucher::query()->where('code', 'HEMAT10')->value('value'))->toBe(1000)
        ->and(ActivityLog::query()->where('subject_label', 'like', 'Voucher:%')->value('source'))->toBe('ai');

    // Only the changed keys are needed.
    mcpTool(Tools\SaveVoucherTool::class, ['id' => $saved['id'], 'values' => ['percent' => 15]]);
    $voucher = Voucher::query()->find($saved['id']);
    expect($voucher->value)->toBe(1500)->and($voucher->name)->toBe('Hemat 10%');
    expect(mcpTool(Tools\ListVouchersTool::class)['vouchers'][0])->toMatchArray(['code' => 'HEMAT10', 'value' => '15%']);
    expect(mcpTool(Tools\SaveVoucherTool::class, ['values' => ['name' => 'Bad', 'type' => 'percent', 'percent' => 150, 'code' => 'BAD']]))->toHaveKey('error');

    app(ToggleFeature::class)->handle('vouchers', false);
    expect((new Tools\SaveVoucherTool)->shouldRegister())->toBeFalse();
});

it('saves flash sales and pricing rules once the user agrees', function () {
    $values = ['name' => 'Payday', 'active' => true,
        'dates' => ['start' => now()->addDay()->toIso8601String(), 'end' => now()->addDays(2)->toIso8601String()],
        'items' => [['target' => [['type' => 'product', 'id' => $this->mug->product_id]], 'discount_type' => 'percent_off', 'percent' => 20]]];
    expect(mcpTool(Tools\SaveFlashSaleTool::class, ['values' => $values])['error'])->toContain('confirm: true')
        ->and(FlashSale::query()->count())->toBe(0);
    $sale = mcpTool(Tools\SaveFlashSaleTool::class, ['values' => $values, 'confirm' => true]);
    expect($sale)->toMatchArray(['saved' => true, 'name' => 'Payday', 'items' => 1])
        ->and(mcpTool(Tools\ListFlashSalesTool::class)['flash_sales'][0])->toMatchArray(['name' => 'Payday', 'state' => 'upcoming']);

    $values = ['name' => 'Grosir', 'active' => true, 'audience' => 'everyone', 'scope' => 'all',
        'quantity_basis' => 'product', 'tiers' => [['min_qty' => 10, 'type' => 'percent_off', 'percent' => 5]]];
    expect(mcpTool(Tools\SavePricingRuleTool::class, ['values' => $values])['error'])->toContain('every product');
    $rule = mcpTool(Tools\SavePricingRuleTool::class, ['values' => $values, 'confirm' => true]);
    expect($rule['saved'])->toBeTrue()->and(PriceRule::query()->sole()->tiers)->toEqual([['min_qty' => 10, 'type' => 'percent_off', 'value' => 500]]);

    staffWith(['commerce.vouchers.manage']);
    expect((new Tools\SaveFlashSaleTool)->shouldRegister())->toBeFalse()
        ->and((new Tools\SavePricingRuleTool)->shouldRegister())->toBeFalse()
        ->and(FlashSale::query()->count())->toBe(1);
});

it('runs reports', function () {
    $order = makeOrder(['status' => 'processing', 'payment_status' => 'paid', 'paid_total' => 100000]);
    OrderPaid::dispatch($order);

    $report = mcpTool(Tools\SalesReportTool::class, ['period' => '7d']);
    expect($report['report'])->toBe('sales')->and($report['totals']['orders'])->toBe(1)->and($report['rows'])->toHaveCount(7)
        ->and(mcpTool(Tools\SalesReportTool::class, ['report' => 'nope']))->toHaveKey('error')
        ->and(mcpTool(Tools\SalesReportTool::class, ['report' => 'stock'])['period'])->toBeNull();

    staffWith(['commerce.dashboard.view']);
    expect((new Tools\SalesReportTool)->shouldRegister())->toBeFalse();
});

it('reads and changes store settings and features', function () {
    app(StoreSettings::class)->saveSection('general', ['name' => 'Toko Sunrice', 'email' => 'toko@example.com']);
    $sections = collect(mcpTool(Tools\GetStoreSettingsTool::class)['sections'])->pluck('key');
    expect($sections)->toContain('general', 'checkout')->not->toContain('payments', 'features');
    $general = mcpTool(Tools\GetStoreSettingsTool::class, ['section' => 'general']);
    expect($general['values']['name'])->toBe(app(StoreSettings::class)->get('general.name'));

    $updated = mcpTool(Tools\UpdateStoreSettingsTool::class, ['section' => 'general', 'values' => ['pause_orders' => true]]);
    expect($updated['saved'])->toBeTrue()
        ->and(app(StoreSettings::class)->get('general.pause_orders'))->toBeTrue()
        ->and(app(StoreSettings::class)->get('general.name'))->toBe($general['values']['name']);   // the rest is kept

    expect(mcpTool(Tools\SetStoreFeatureTool::class, ['feature' => 'wishlist', 'on' => false])['error'])->toContain('confirm: true');
    $switched = mcpTool(Tools\SetStoreFeatureTool::class, ['feature' => 'wishlist', 'on' => false, 'confirm' => true]);
    expect($switched['deactivated'])->toContain('wishlist')->and(app(Features::class)->active('wishlist'))->toBeFalse()
        ->and(mcpTool(Tools\SetStoreFeatureTool::class, ['feature' => 'ai_tools', 'on' => false, 'confirm' => true]))->toHaveKey('error');

    staffWith(['commerce.settings.catalog']);
    expect(collect(mcpTool(Tools\GetStoreSettingsTool::class)['sections'])->pluck('key')->all())->toBe(['catalog', 'digital'])   // digital settings share the catalog permission
        ->and((new Tools\SetStoreFeatureTool)->shouldRegister())->toBeFalse()
        ->and(mcpTool(Tools\UpdateStoreSettingsTool::class, ['section' => 'general', 'values' => ['pause_orders' => false]]))->toHaveKey('error');
});

it('quotes shipping to a destination', function () {
    $quote = mcpTool(Tools\QuoteShippingTool::class, ['lines' => [['variant_id' => $this->mug->id, 'quantity' => 2]], 'destination' => checkoutInput()['shipping_address']]);
    expect($quote['weight_grams'])->toBe(1000)
        ->and(collect($quote['rates'])->firstWhere('id', 'flat:1:default')['cost']['amount'])->toBe(10000);

    app(ToggleFeature::class)->handle('shipping', false);
    expect((new Tools\QuoteShippingTool)->shouldRegister())->toBeFalse();
});

it('adds the store guidance to the MCP server instructions', function () {
    $sunrice = app(Sunrice\Sunrice::class);
    if (! method_exists($sunrice, 'mcpInstructions')) {
        $this->markTestSkipped('Needs Sunrice with MCP instructions (U6).');
    }

    expect($sunrice->mcpInstructions())->toContain(StoreTools::INSTRUCTIONS);
});
