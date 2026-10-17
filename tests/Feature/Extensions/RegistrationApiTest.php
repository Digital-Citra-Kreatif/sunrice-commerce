<?php

declare(strict_types=1);

use Illuminate\Support\ServiceProvider;
use Sunrice\Commerce\Admin\Dashboard\DashboardCards;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Reports\Report;
use Sunrice\Commerce\Analytics\Reports\ReportResult;
use Sunrice\Commerce\Analytics\Reports\Reports;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Checkout\CheckoutFields;
use Sunrice\Commerce\Checkout\Completion\Completions;
use Sunrice\Commerce\Checkout\Completion\WhatsAppCompletion;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Customers\AccountNavigation;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\Feature;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthRegistry;
use Sunrice\Commerce\Health\HealthResult;
use Sunrice\Commerce\Notifications\EmailDefinition;
use Sunrice\Commerce\Notifications\Emails;
use Sunrice\Commerce\Orders\Numbering;
use Sunrice\Commerce\Orders\OrderPanels;
use Sunrice\Commerce\Payments\PaymentRegistry;
use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Calculator;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;
use Sunrice\Commerce\Pricing\Contracts\DiscountProvider;
use Sunrice\Commerce\Pricing\Contracts\FeeProvider;
use Sunrice\Commerce\Pricing\Contracts\PriceCandidateProvider;
use Sunrice\Commerce\Pricing\Contracts\ShippingDiscountProvider;
use Sunrice\Commerce\Pricing\PriceCandidate;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Settings\SettingsRegistry;
use Sunrice\Commerce\Settings\SettingsSection;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Couriers;
use Sunrice\Commerce\Shipping\ShippingTypes;
use Sunrice\Commerce\Storefront\Slots;
use Workbench\App\Commerce\FakeCourier;
use Workbench\App\Commerce\FakeGateway;

/*
 * Every public method of the Commerce registration API (ARCHITECTURE.md
 * §24.1), used the way an extension package would: from its service
 * provider.
 */

class GiftWrapMemberPrice implements PriceCandidateProvider
{
    public function candidates(CalcLine $line, CalculationState $state): iterable
    {
        yield new PriceCandidate($line->variant->price - 5000, ['type' => 'member', 'label' => 'Member price']);
    }
}

class GiftWrapDiscount implements DiscountProvider
{
    public function priority(): int
    {
        return 50;
    }

    public function apply(CalculationState $state): void
    {
        $key = array_key_first($state->lines);
        $state->addAdjustment(new Adjustment('gift', Adjustment::DISCOUNT, 'Gift discount', 1000, ['type' => 'gift'], [$key => 1000]));
    }
}

class GiftWrapShippingDiscount implements ShippingDiscountProvider
{
    public function apply(CalculationState $state): void
    {
        $state->addAdjustment(new Adjustment('gift_ship', Adjustment::SHIPPING_DISCOUNT, 'Half shipping', intdiv((int) $state->shipping['cost'], 2), ['type' => 'gift']));
    }
}

class GiftWrapFee implements FeeProvider
{
    public function apply(CalculationState $state): void
    {
        $state->addAdjustment(new Adjustment('gift_wrap', Adjustment::FEE, 'Gift wrap', 2500, ['type' => 'gift_wrap']));
    }
}

class GiftWrapStage implements CalculationStage
{
    public function run(CalculationState $state): void
    {
        $state->data['gift_stage'] = $state->totals['total'];
    }
}

class GiftWrapHealth implements HealthCheck
{
    public function key(): string
    {
        return 'gift_wrap';
    }

    public function label(): string
    {
        return 'Gift wrap';
    }

    public function run(): HealthResult
    {
        return HealthResult::ok('Paper in stock.');
    }
}

class GiftWrapReport extends Report
{
    public function key(): string
    {
        return 'gift_wraps';
    }

    public function label(): string
    {
        return 'Gift wraps';
    }

    public function run(Period $period): ReportResult
    {
        return new ReportResult([self::column('day', 'Day', 'date')], []);
    }
}

class TelegramCompletion extends WhatsAppCompletion {}

class GiftWrapServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $commerce = app(Commerce::class);
        $commerce->registerFeature(new Feature('gift_wrap', 'selling', 'Gift wrap', 'Wrap orders as gifts.', ['checkout']));
        $commerce->registerSettingsSection(new SettingsSection('gift_wrap', 'Gift wrap', [['handle' => 'fee', 'type' => 'commerce_money', 'label' => 'Fee']], feature: 'gift_wrap', permission: 'commerce.settings.checkout'));
        $commerce->registerPriceCandidateProvider(GiftWrapMemberPrice::class);
        $commerce->registerDiscountProvider(GiftWrapDiscount::class);
        $commerce->registerShippingDiscountProvider(GiftWrapShippingDiscount::class);
        $commerce->registerFeeProvider(GiftWrapFee::class);
        $commerce->registerCalculationStage(GiftWrapStage::class, 95);
        $commerce->checkoutFieldsUsing(fn (CheckoutData $data, CalculationState $state) => [['handle' => 'gift_message', 'type' => 'textarea', 'label' => 'Gift message', 'section' => 'extra']]);
        $commerce->registerCheckoutCompletion(TelegramCompletion::class);
        $commerce->registerAccountPage('gifts', 'Gifts', 'commerce.account', 'gift_wrap');
        $commerce->registerStorefrontSlot('checkout.after_payment', 'commerce::storefront.partials.messages', 'gift_wrap');
        $commerce->registerOrderPanel('gift', 'Gift wrap', fn ($order) => ['wrapped' => true], 'commerce.orders.view');
        $commerce->registerDashboardWidget('gift-wrap', fn (mixed $user, Period $period) => ['from' => $period->from], 'commerce.dashboard.view', 'gift_wrap');
        $commerce->registerEmail(new EmailDefinition('gift_sent', 'Gift sent', feature: 'gift_wrap'));
        $commerce->registerHealthCheck(GiftWrapHealth::class);
        $commerce->registerReport(GiftWrapReport::class);
        $commerce->registerPaymentMethod(FakeGateway::class);
        $commerce->registerShippingMethodType(FakeCourier::class);
        $commerce->registerCourier('giftex', 'GiftEx', 'https://giftex.example/track/{tracking}');
        $commerce->onTick('gift wrap', fn () => 'ticked');
        $commerce->onPrune('gift wrap', fn () => 0);
    }
}

beforeEach(function () {
    $this->mug = checkoutStore();
    $this->app->register(GiftWrapServiceProvider::class);
    $this->admin = actingAsSuperAdmin();
});

afterEach(fn () => Numbering::orderNumbersUsing(null));

it('registers features, settings sections, emails, couriers, methods, reports and health checks', function () {
    expect(app(FeatureRegistry::class)->get('gift_wrap')?->label)->toBe('Gift wrap')
        ->and(app(Commerce::class)->active('gift_wrap'))->toBeTrue()
        ->and(app(SettingsRegistry::class)->get('gift_wrap')?->label)->toBe('Gift wrap')
        ->and(app(Emails::class)->get('gift_sent')?->label)->toBe('Gift sent')
        ->and(app(Couriers::class)->trackingUrl('giftex', 'AB1'))->toBe('https://giftex.example/track/AB1')
        ->and(app(PaymentRegistry::class)->classes())->toContain(FakeGateway::class)
        ->and(app(ShippingTypes::class)->get('fake_courier'))->toBeInstanceOf(FakeCourier::class)
        ->and(app(Reports::class)->find('gift_wraps'))->toBeInstanceOf(GiftWrapReport::class)
        ->and(app(HealthRegistry::class)->run()['gift_wrap']['result']->status)->toBe(HealthResult::OK)
        ->and(app(Commerce::class)->tickSteps())->toHaveKey('gift wrap')
        ->and(app(Commerce::class)->pruneSteps())->toHaveKey('gift wrap');
});

it('plugs providers and stages into the calculation', function () {
    $ctx = PricingContext::guest()->with(['destination' => checkoutInput()['shipping_address'], 'shippingRate' => 'flat:1:default']);
    $state = app(Calculator::class)->calculate(['l1' => [$this->mug, 2, []]], $ctx);

    expect($state->lines['l1']->unitPrice)->toBe(45000)                    // member price
        ->and($state->totals)->toMatchArray(['subtotal' => 90000, 'discount' => 1000, 'shipping' => 10000, 'shipping_discount' => 5000, 'fee' => 2500])
        ->and($state->totals['total'])->toBe(90000 - 1000 + 10000 - 5000 + 2500)
        ->and($state->data['gift_stage'])->toBe($state->totals['total']);  // ran after the totals
});

it('extends checkout, numbering, the order page, My Account, slots and the dashboard', function () {
    $state = app(Calculator::class)->calculate(['l1' => [$this->mug, 1, []]], PricingContext::guest());
    expect(collect(app(CheckoutFields::class)->for(new CheckoutData([]), $state))->pluck('handle'))->toContain('gift_message')
        ->and(app(Completions::class)->get('whatsapp'))->toBeInstanceOf(TelegramCompletion::class);

    app(Commerce::class)->orderNumberUsing(fn () => 'GW-0001');
    expect(app(Numbering::class)->next('order'))->toBe('GW-0001');

    $order = makeOrder();
    expect(collect(app(OrderPanels::class)->for($order, $this->admin))->firstWhere('key', 'gift')['data'])->toBe(['wrapped' => true])
        ->and(collect(app(AccountNavigation::class)->items())->pluck('key'))->toContain('gifts')
        ->and(app(Slots::class)->views('checkout.after_payment'))->toContain('commerce::storefront.partials.messages')
        ->and(app(DashboardCards::class)->widgets($this->admin, Period::preset('7d')))->toHaveKey('gift-wrap');

    // A module switched off takes its pieces with it.
    app(ToggleFeature::class)->handle('gift_wrap', false);
    expect(app(DashboardCards::class)->widgets($this->admin))->not->toHaveKey('gift-wrap')
        ->and(app(Slots::class)->views('checkout.after_payment'))->toBe([]);
});

it('offers read helpers', function () {
    $commerce = app(Commerce::class);
    expect($commerce->version())->toBeString()
        ->and($commerce->money(150000)->format())->toBe('Rp150.000')
        ->and($commerce->features()->active('orders'))->toBeTrue()
        ->and($commerce->settings())->toBeInstanceOf(StoreSettings::class)
        ->and($commerce->cart())->toBeNull()
        ->and($commerce->customer())->toBeNull();
});
