# Extending Sunrice Commerce

Extension packages (gateways, couriers, loyalty, marketplaces…) plug into commerce from their own
Laravel service provider. Everything here is the 1.x public surface: it follows semantic
versioning. For a step-by-step walkthrough of a new package, see
[extension-package.md](extension-package.md).

```php
use Sunrice\Commerce\Facades\Commerce;   // or app(\Sunrice\Commerce\Commerce::class)

class LoyaltyServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Commerce::registerFeature(new Feature('loyalty', 'promotions', 'Loyalty points', 'Earn and spend points.', ['accounts']));
        Commerce::registerDiscountProvider(PointsDiscount::class);
        Commerce::registerAccountPage('points', 'Points', 'loyalty.points', 'loyalty');
        // …
    }
}
```

The workbench has three working references: `workbench/app/Commerce/FakeGateway.php`,
`FakeCourier.php` and `FakeLoyalty.php`, run end to end by `tests/Feature/Extensions`.

## Contents

- [Features](#features)
- [Settings sections](#settings-sections)
- [Pricing](#pricing): price candidates, discounts, shipping discounts, fees, stages
- [Payments](#payments)
- [Shipping](#shipping)
- [Checkout](#checkout): fields, completions
- [Orders](#orders): numbering, panels
- [My Account pages](#my-account-pages)
- [Storefront slots](#storefront-slots)
- [Dashboard widgets, reports and health checks](#dashboard-widgets-reports-and-health-checks)
- [Emails](#emails)
- [Marketing triggers](#marketing-triggers)
- [Scheduled work](#scheduled-work)
- [MCP tools](#mcp-tools)
- [Swappable services](#swappable-services)
- [Admin JavaScript](#admin-javascript)
- [Events](#events)
- [Read helpers](#read-helpers)

## Features

Every module is a feature switch (Settings → Store → Features). Register yours so the store owner
can turn it off, and gate everything else you register on it (most `register*` methods take a
`$feature` argument).

```php
Commerce::registerFeature(new Feature(
    key: 'loyalty',
    group: 'promotions',          // catalog, selling, payments, shipping, promotions, customers, insights, integrations
    label: 'Loyalty points',
    description: 'Earn points on paid orders and spend them at checkout.',
    requires: ['accounts'],        // switched off with them; can't be on without them
));
Commerce::active('loyalty');       // also commerce_feature('loyalty'), @commerceFeature('loyalty')
```

Route middleware `commerce.feature:loyalty` returns 404 while the feature is off. `FeatureToggled`
is dispatched when it changes.

## Settings sections

A section on Settings → Store, stored under its key in the store settings and validated by its
fields (Sunrice field definitions, plus `commerce_money`, `commerce_region`, `commerce_targets`,
`commerce_datetime_range`).

```php
Commerce::registerSettingsSection(new SettingsSection(
    key: 'loyalty',
    label: 'Loyalty',
    fields: [['handle' => 'point_value', 'type' => 'commerce_money', 'label' => 'A point is worth', 'required' => true]],
    rules: ['point_value' => ['integer', 'min:1']],
    feature: 'loyalty',
    permission: 'commerce.settings.loyalty',  // default: commerce.settings.<key>
));
Commerce::settings()->get('loyalty.point_value', 100);
```

For a section that needs its own UI, register a React component with the same key (see
[Admin JavaScript](#admin-javascript)); it receives `section` and `form` (the values and the save
action) instead of the generated form.

## Pricing

One calculator prices carts, checkout, manual orders, quotes and edits. It runs stages in priority
order: lines 10, unit prices 20, subtotals 30, discounts 40, shipping 50, shipping discounts 60,
fees 70, taxes 80, totals 90. Amounts are integers in the currency's smallest unit.

| Register | Contract | Use for |
| --- | --- | --- |
| `registerPriceCandidateProvider($class, $order)` | `Pricing\Contracts\PriceCandidateProvider` — `candidates(CalcLine, CalculationState): iterable<PriceCandidate>` | Member prices, price lists. The lowest candidate wins. |
| `registerDiscountProvider($class)` | `Pricing\Contracts\DiscountProvider` — `priority()`, `apply(CalculationState)` | Points, gift cards, cashback. Add `Adjustment::DISCOUNT` with per-line allocations. |
| `registerShippingDiscountProvider($class)` | `Pricing\Contracts\ShippingDiscountProvider` — `apply(CalculationState)` | Shipping subsidies. Add `Adjustment::SHIPPING_DISCOUNT`. |
| `registerFeeProvider($class)` | `Pricing\Contracts\FeeProvider` — `apply(CalculationState)` | Gift wrap, insurance. Add `Adjustment::FEE`. |
| `registerCalculationStage($class, $priority)` | `Pricing\Contracts\CalculationStage` — `run(CalculationState)` | Anything else: rounding, extra data in `$state->data`. |

```php
$state->addAdjustment(new Adjustment(
    key: 'loyalty',
    type: Adjustment::DISCOUNT,
    label: 'Points',
    amount: 30000,                              // always positive; the type gives the direction
    source: ['type' => 'loyalty'],
    allocations: ['i12' => 20000, 'i13' => 10000], // line key => amount (discounts)
    meta: ['points' => 300],
));
```

**Reserving what you gave.** A provider that holds something back (points, a gift card balance)
also implements `Pricing\Contracts\ReservesDiscounts`:

- `commit(Order $order, CalculationState $state)` runs inside the order-placing transaction, after
  stock, flash sales and vouchers. Throw `Checkout\CheckoutRefused` to refuse the order (the balance
  was spent elsewhere).
- `release(Order $order)` runs once when the order is cancelled or expires unpaid.

Earning (points on `OrderPaid`) and reversing (on `OrderRefunded`) are your own listeners.

The calculation context (`$state->ctx`, a `PricingContext`) carries the customer, roles, channel
(`storefront`, `admin`, `quote`), destination, shipping rate, payment method and the time.

## Payments

```php
Commerce::registerPaymentMethod(MidtransSnap::class);
```

A method implements `Payments\Contracts\PaymentMethod` (extending `Payments\PaymentMethodBase`
gives settings, title, availability rules, fees and deadlines from the admin form):

| Method | |
| --- | --- |
| `static key()` | `midtrans_snap` |
| `label()`, `settingsSchema()`, `settingsRules()` | The admin form (Settings → Store → Payments) |
| `isAvailable(PaymentContext)`, `fee(PaymentContext)`, `deadline(Order)` | When it's offered, its fee, how long the customer has |
| `start(Order, Payment): PaymentStart` | `PaymentStart::redirect($url)`, `::embedded($view, $data)`, `::instructions($snapshot)` or `::paid($result)` |
| `instructionsView()` | The pay page partial for instructions |

Optional contracts:

- `HandlesReturn::handleReturn(Request, Payment): PaymentResult` — the customer comes back;
- `HandlesWebhooks::parseWebhook(Request): WebhookEvent` — `POST /webhooks/{method}`, stateless; throw
  `InvalidWebhook` on a bad signature. Duplicates are ignored by event id;
- `SupportsRefunds::refund(Payment, int $amount, string $reason): RefundResult`;
- `SupportsCancel::cancel(Payment)`;
- `SupportsStatusCheck::check(Payment): PaymentResult` — asked once before an unpaid order
  expires, so a payment the webhook missed isn't lost;
- `AddsUniqueCode::uniqueCodeRange(): ?array` — a unique amount for bank transfers.

A redirect gateway can extend `Payments\Methods\GatewayMethod` instead, as
`sunrice/commerce-midtrans` and `sunrice/commerce-xendit` do. It gives a sandbox switch that names
which `.env` keys are set (never their values) and the webhook URL, per-language instructions, a
gateway page created once per payment and reused, `handleReturn()` through the status check, the
instructions partial with a "Continue to payment" link (also in the order email), and
`paidResult()`, which refuses an amount other than the payment's. The package implements:

| Method | |
| --- | --- |
| `currencies()` | The currencies the gateway takes; the method is hidden for others |
| `configured()` | The keys for the current mode are set (and the SDK is installed) |
| `createPayment(Order, Payment, string $reference)` | Create the gateway page: `['url' => …, 'meta' => […]]` |
| `check(Payment)` | Ask the gateway for the payment's state |
| `parseWebhook(Request)` | Verify and map the notification |

Results are `PaymentResult::paid($amount, $reference)`, `failed()`, `pending()`, `expired()`,
`cancelled()`, `awaitingConfirmation()` or `refunded($amount)`. Only
`Payments\Actions\RecordPaymentResult` changes payment state; never update orders or payments
yourself.

## Shipping

```php
Commerce::registerShippingMethodType(BiteshipRates::class);
Commerce::registerCourier('jne', 'JNE', 'https://www.jne.co.id/tracking?awb={tracking}');
```

A type implements `Shipping\Contracts\ShippingMethodType`: `static key()`, `label()`,
`settingsSchema()`, `settingsRules()` and `rates(ShippingRequest, ShippingMethod): ShippingRate[]`.
The request has the origin and destination (`Support\Address`, with `country()` and region codes),
the package (`weight()`, `volumetricWeight()`, `quantity()`), the subtotal and whether it's cash on
delivery. Return `ShippingRate::for($method, $cost, $service, $label, $etd)`. Rates of extension
types are cached for ten minutes per request.

- `TracksShipments::track(Shipment): TrackingInfo` — `commerce:tick` checks open shipments with a
  tracking number at most once an hour; `TrackingInfo(..., delivered: true)` marks the parcel
  delivered (`ShipmentDelivered`).
- `BooksShipments::book(Order, Shipment): BookingResult` — book a pickup and get the tracking
  number. Commerce doesn't call it yet: call it from your own admin action or listener
  (`ShipmentCreated`).

## Checkout

```php
// Extra fields (Sunrice field definitions) with a `section`: contact, shipping, extra.
Commerce::checkoutFieldsUsing(fn (CheckoutData $data, CalculationState $state) => [
    ['handle' => 'npwp', 'type' => 'text', 'label' => 'NPWP', 'section' => 'extra'],
]);

// Replace how a selling mode ends (order, quote, whatsapp) — e.g. send WhatsApp orders to Telegram.
Commerce::registerCheckoutCompletion(TelegramCompletion::class);
```

A completion implements `Checkout\Completion\CheckoutCompletion`: `static key()`, `orderType()`,
`requiresPayment()`, `initialStates(CalculationState, CheckoutData): OrderStates`,
`reservesStock()` and `afterPlaced(Order): CompletionResponse`. Field values are saved on the order
(`fields`).

## Orders

```php
Commerce::orderNumberUsing(fn (?Order $order) => 'TK-'.now()->format('ymd').'-'.Str::upper(Str::random(4)));

// A panel on the admin order page: data here, component in the admin bundle.
Commerce::registerOrderPanel('loyalty', 'Points', fn (Order $order) => ['earned' => …], 'commerce.orders.view');
```

Change orders only through the actions (`Orders\Actions\*`) and `Orders\OrderStateMachine`, with an
`Orders\Actor` (`Actor::system()`, `Actor::admin($user)`, `Actor::ai($user)`…): they validate, keep
the timeline and dispatch the events.

## My Account pages

```php
Commerce::registerAccountPage('points', 'Points', 'loyalty.points', 'loyalty', position: 60);

Route::middleware(['web', 'commerce.auth'])->get('account/points', PointsController::class)->name('loyalty.points');
```

Views extend the account layout and fill `account`; the menu and the current item come from the
registry:

```blade
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))
@section('account') … @endsection
```

`Commerce::customer()` is the signed-in customer.

## Storefront slots

```php
Commerce::registerStorefrontSlot('checkout.after_payment', 'loyalty::checkout', 'loyalty');
```

The partial gets the slot's variables. Templates render slots with
`<x-commerce::slot name="…" />`; published templates keep them.

| Slot | Where | Variables |
| --- | --- | --- |
| `head` | `<head>` of the store layout | — |
| `product.after_summary` | Product page, after the title and excerpt | `$entry` |
| `product.before_add_to_cart` | Before the price and buy form | `$entry` |
| `product.after_add_to_cart` | After the buy form | `$entry` |
| `cart.after_items` | Cart, after the lines | `$cart` (CartView) |
| `cart.totals_after` | Cart, after the totals | `$cart` |
| `mini_cart.footer` | Mini-cart drawer footer | — |
| `checkout.before` | Top of the checkout form | — |
| `checkout.after_contact` | After the contact fields | `$state` |
| `checkout.after_shipping` | After the shipping methods | `$state` |
| `checkout.after_payment` | After the payment methods (inside the form) | `$state` |
| `checkout.before_submit` | Before the place-order button | — |
| `order.after_payment` | Order page, after the payment box | — |
| `order.after_summary` | Order page, after the items | `$order` |
| `order.after` | End of the order page | — |
| `account.overview` | My Account overview | `$customer` |

## Dashboard widgets, reports and health checks

```php
// Props here (computed after the page shows), component in the admin bundle under the same name.
Commerce::registerDashboardWidget('loyalty-points', fn ($user, Period $period) => ['issued' => …], 'commerce.dashboard.view', 'loyalty');

// A report on Shop → Reports, with date range, comparison and CSV export.
Commerce::registerReport(PointsReport::class);     // extends Analytics\Reports\Report

// A line on the dashboard's health card and in `php artisan commerce:doctor`.
Commerce::registerHealthCheck(BiteshipKeysCheck::class); // implements Health\HealthCheck
```

A report returns `ReportResult(columns, rows, totals, chart, summary)`: columns have a `kind`
(`text`, `money`, `count`, `percent`, `date`), rows may carry an `href` (drill-down), and `Period`
gives `from`, `to`, the comparison range and `buckets()` for the interval.

## Emails

```php
Commerce::registerEmail(new EmailDefinition('points_expiring', 'Points expiring soon', feature: 'loyalty'));
app(Notifier::class)->send('points_expiring', $customer, ['points' => 120]); // subject: an Order, Customer or Variant
```

The owner can switch it off, change the subject and text (Settings → Store → Emails), preview it and
send a test. The body part is the view `commerce::emails.parts.points_expiring`, or one of your own:
`Commerce::emailTemplate('loyalty::emails.points-expiring', 'points_expiring')`.

Replace commerce's views from your package too: `Commerce::emailTemplate($view, $key)` (one email's
body, or the frame of every store email without a key), `Commerce::emailTheme($view)` and
`Commerce::documentTemplate('invoice' | 'packing_slip' | 'quotation' | 'layout', $view)`. See
[emails.md](emails.md#customizing-templates) and [documents.md](documents.md#customizing-the-templates).

## Marketing triggers

Automations (Shop → Marketing → Automations) start from a `Trigger` (`Sunrice\Commerce\Marketing\Automations\Trigger`):
its key, label, description, delay (unit, label, default), starting template, and the recipients
whose moment fell in a time window. `CustomerTrigger` covers dates on the customer record.

```php
Commerce::registerMarketingTrigger(new BirthdayTrigger);
```

See [marketing.md](marketing.md#adding-a-trigger).

## Scheduled work

```php
Commerce::onTick('loyalty expiry', fn () => ExpirePoints::run());   // every minute (commerce:tick)
Commerce::onPrune('loyalty ledger', fn () => PruneLedger::run());   // daily (commerce:prune)
```

Steps run one after another; a failing step is reported and doesn't stop the others. Keep ticks
fast: throttle your own work (the shipment tracker checks each parcel at most hourly).

## MCP tools

Commerce's store tools live on Sunrice's MCP server. Add yours with Sunrice's API; extending
`Sunrice\Commerce\Mcp\CommerceTool` gives the store checks (the `ai_tools` feature, your module,
the permission), an `ai` actor and `confirm: true` handling:

```php
class GetPointsTool extends CommerceTool
{
    protected string $name = 'get_points';
    protected ?string $feature = 'loyalty';
    protected ?string $permission = 'commerce.customers.view';

    protected function run(Request $request): Response { … }
}

Sunrice::registerMcpTool(GetPointsTool::class);
```

## Swappable services

Bind your own implementation in your provider's `register()`:

| Contract | Default | For |
| --- | --- | --- |
| `Contracts\Inventory` | `Inventory\DatabaseInventory` | External stock (ERP) |
| `Contracts\TaxCalculator` | `Taxes\TableRateTaxCalculator` | External tax engines |
| `Contracts\ShippingQuoter` | `Shipping\ShippingManager` | Replacing rate shopping as a whole |
| `Contracts\SaleLimits` | none | Per-customer purchase limits |
| `Contracts\Tracking` | `Analytics\StatsTracking` | Sending storefront events elsewhere too |
| `Documents\DocumentRenderer` | `Documents\DompdfRenderer` | Other PDF engines (`Documents\BatchRenderer` to render bulk documents in batches) |

## Admin JavaScript

The admin bundle exposes `window.SunriceCommerce` (React and Inertia come from `window.Sunrice`).
Scripts that may load first queue their calls:

```js
(window.SunriceCommerceQueue ||= []).push((api) => {
    api.registerOrderPanel('loyalty', LoyaltyPanel);           // props: { order, data }
    api.registerDashboardWidget('loyalty-points', PointsWidget); // props: the PHP props
    api.registerSettingsSection('loyalty', LoyaltySettings);   // props: { section, form }
    api.registerProductTab('loyalty', ProductPoints);          // a Product data tab; props: { value, update, path }; a static `label` names it
});
```

`api.formatMoney(amount)` and `api.parseMoney(text)` use the store's currency format;
`api.components` has `PageHeader`, `EmptyState`, `StatusBadge`, `MoneyInput`, `SchemaFormView`,
`SectionNav`, `SettingsLayout`, `KpiCard` and `Chart` (recharts, loaded on first use). Load your
script with `Sunrice::registerAdminScript()`.

## Events

Order, payment and shipment events are dispatched after the database transaction commits. Payloads
are public properties.

| Event | Payload |
| --- | --- |
| `Cart\Events\CartItemAdded`, `CartItemUpdated`, `CartItemRemoved` | `CartItem $item` |
| `Cart\Events\CartMerged` | `Cart $guest, Cart $into` |
| `Cart\Events\VoucherApplied`, `VoucherRemoved` | `Cart $cart, string $code` |
| `Catalog\Events\ProductSynced` | `Product $product` |
| `Catalog\Events\ProductSyncFailed` | `Product $product, string $error` |
| `Checkout\Events\CheckoutStarted` | `Cart $cart` |
| `Customers\Events\AccountDeletionRequested` | `Customer $customer` |
| `Digital\Events\DownloadsGranted` | `Order $order, array $grants, bool $resent` |
| `Events\FeatureToggled` | `string $feature, bool $on, array $deactivated, array $activated` |
| `Events\StoreSettingsSaved` | `string $section, array $changes` |
| `Inventory\Events\StockChanged`, `StockLow`, `StockOut`, `StockBackIn` | `Variant $variant, ?int $before, ?int $after` |
| `Orders\Events\OrderPlaced`, `OrderPaid`, `QuoteRequested`, `QuoteSent`, `QuoteAccepted`, `PaymentLinkRequested` | `Order $order` |
| `Orders\Events\OrderStatusChanged` | `Order $order, string $from, string $to, Actor $actor` |
| `Orders\Events\OrderCancelled`, `OrderCompleted`, `OrderOnHold`, `OrderFailed`, `QuoteDeclined`, `QuoteExpired` | `Order $order, Actor $actor, ?string $reason` |
| `Orders\Events\OrderEdited` | `Order $order, array $changes, bool $notify` |
| `Orders\Events\OrderNoteAdded` | `Order $order, OrderEvent $note` |
| `Orders\Events\OrderRefunded` | `Order $order, Refund $refund` |
| `Orders\Events\ShipmentCreated`, `ShipmentDelivered` | `Order $order, Shipment $shipment` |
| `Payments\Events\PaymentRecorded`, `PaymentSucceeded`, `PaymentFailed`, `PaymentExpired` | `Payment $payment, PaymentResult $result` |
| `Payments\Events\PaymentAfterCancellation` | `Payment $payment, PaymentResult $result, Order $order` (paid after the order was cancelled: no `OrderPaid`) |
| `Payments\Events\PaymentConfirmationSubmitted`, `PaymentConfirmationApproved`, `PaymentConfirmationRejected` | `PaymentConfirmation $confirmation` |
| `Promotions\FlashSales\Events\FlashSaleStarted`, `FlashSaleEnded` | `FlashSale $sale` |

## Read helpers

```php
Commerce::version();
Commerce::features();          // Features: active(), mode(), states()
Commerce::active('vouchers');
Commerce::settings();          // StoreSettings: get('general.name'), section('checkout')
Commerce::cart();              // the visitor's Cart, or null
Commerce::customer();          // the signed-in Customer, or null
Commerce::money(150000);       // Money: format() → "Rp150.000"
```
