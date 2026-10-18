# Building an extension package

A step-by-step guide to `sunrice/commerce-<name>`, using a payment gateway as the example. The
same steps apply to couriers, loyalty programs and other add-ons; [extending.md](extending.md)
lists every extension point.

## 1. The package

```
sunrice/commerce-midtrans
├── composer.json
├── config/commerce-midtrans.php
├── resources/views/instructions.blade.php
├── src/MidtransServiceProvider.php
├── src/MidtransSnap.php
└── tests/
```

`composer.json`:

```json
{
    "name": "sunrice/commerce-midtrans",
    "require": {
        "php": "^8.4",
        "spatie/laravel-package-tools": "^1.93",
        "sunrice/commerce": "^1.0",
        "midtrans/midtrans-php": "^2.6"
    },
    "require-dev": {
        "orchestra/testbench": "^11.0",
        "pestphp/pest": "^4.0"
    },
    "autoload": { "psr-4": { "Sunrice\\CommerceMidtrans\\": "src/" } },
    "extra": { "laravel": { "providers": ["Sunrice\\CommerceMidtrans\\MidtransServiceProvider"] } }
}
```

Keep secrets in `.env` and the config file, never in store settings shown in the admin.

The service provider is a `spatie/laravel-package-tools` `PackageServiceProvider` named after the
package. `hasConfigFile()` merges `config/commerce-midtrans.php` as `config('commerce-midtrans.*')`
and publishes it with `php artisan vendor:publish --tag=commerce-midtrans-config`; `hasViews()`
loads `resources/views` as `commerce-midtrans::`.

The real gateway packages follow this shape:
[`sunrice/commerce-midtrans`](https://github.com/Digital-Citra-Kreatif/sunrice-commerce-midtrans),
[`sunrice/commerce-xendit`](https://github.com/Digital-Citra-Kreatif/sunrice-commerce-xendit) and,
for shipping, `sunrice/commerce-biteship`.

## 2. A feature

Register a feature so the owner can switch the whole package off, and so it switches off with
what it needs:

```php
class MidtransServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package->name('commerce-midtrans')
            ->hasConfigFile()
            ->hasViews();
    }

    public function packageRegistered(): void
    {
        $this->app->bindIf(MidtransClient::class, MidtransSdkClient::class);   // swappable in tests
    }

    public function packageBooted(): void
    {
        Commerce::registerFeature(new Feature('midtrans', 'payments', 'Midtrans', 'Cards, e-wallets and virtual accounts.', ['payments']));
        Commerce::registerPaymentMethod(MidtransSnap::class);
    }
}
```

Methods, slots, account pages, widgets and emails take the feature key so they disappear with it.

## 3. The extension itself

Implement the contract (here `PaymentMethod` through `PaymentMethodBase`):

```php
class MidtransSnap extends PaymentMethodBase implements HandlesWebhooks, SupportsRefunds, SupportsStatusCheck
{
    public static function key(): string { return 'midtrans_snap'; }

    public function label(): string { return 'Midtrans'; }

    public function settingsSchema(): array
    {
        return [['handle' => 'sandbox', 'type' => 'toggle', 'label' => 'Sandbox']];
    }

    public function start(Order $order, Payment $payment): PaymentStart
    {
        $token = $this->client()->createTransaction([...]);

        return PaymentStart::redirect($token->redirect_url);
    }

    public function parseWebhook(Request $request): WebhookEvent
    {
        // Verify the signature; throw InvalidWebhook when it doesn't match.
        return new WebhookEvent(eventId: …, reference: …, result: PaymentResult::paid($amount, $reference));
    }

    public function refund(Payment $payment, int $amount, string $reason): RefundResult { … }

    public function check(Payment $payment): PaymentResult { … }
}
```

Rules that keep stores consistent:

- report results; don't change orders or payments yourself (`RecordPaymentResult` is the only
  writer, and it ignores impossible moves);
- amounts are integers in the smallest currency unit;
- webhooks are retried by gateways: make `parseWebhook()` pure and give each event a stable id.

## 4. Storefront and admin pieces

- **Templates**: views in your namespace (`commerce-midtrans::instructions`); return the name from
  `instructionsView()`. Customers' themes can override them with `vendor/commerce-midtrans`.
- **Storefront slots**: `Commerce::registerStorefrontSlot('checkout.after_payment', 'commerce-midtrans::badge', 'midtrans')`.
- **My Account**: `Commerce::registerAccountPage()` plus a route under `commerce.auth`.
- **Admin UI**: build a small script that calls `window.SunriceCommerce.register…` (order panel,
  dashboard widget, settings section, product tab), mark `react`, `react-dom` and
  `react/jsx-runtime` as externals mapped to `window.Sunrice.React` / `ReactDOM`, and load it with
  `Sunrice::registerAdminScript('vendor/commerce-midtrans/admin.js')`.
- **Settings**: `Commerce::registerSettingsSection()` for anything the owner sets; permission
  `commerce.settings.<key>` (register it with Sunrice's permissions so roles can be given it).

## 5. Health checks and scheduled work

Tell the owner what's missing before customers notice:

```php
Commerce::registerHealthCheck(MidtransKeysCheck::class);   // keys set? sandbox in production?
Commerce::onTick('midtrans', fn () => …);                 // every minute; keep it short
```

## 6. Tests

Test against a real store with Orchestra Testbench:

- register Sunrice's and commerce's providers before yours (see commerce's `tests/TestCase.php`);
- set up a store like commerce's `checkoutStore()` helper: regions, a product, a shipping zone and
  your method switched on in `payments.methods.<key>`;
- place an order through `POST /checkout`, then drive your method: a signed webhook to
  `POST /webhooks/midtrans_snap`, a refund through `Orders\Actions\RecordRefund`, the status check
  through `Orders\Expiry`;
- assert on the order (status, payment status, timeline) rather than on your own tables.

Commerce's own references do exactly this: `workbench/app/Commerce/FakeGateway.php`
(`tests/Feature/Payments/GatewayTest.php`), `FakeCourier.php` and `FakeLoyalty.php`
(`tests/Feature/Extensions/FakeExtensionsTest.php`).

## 7. Release

- Require `sunrice/commerce: ^1.0`; the APIs in [extending.md](extending.md) follow semantic
  versioning.
- Document the `.env` keys and the feature's name in your README.
- Add your package's migrations with `$this->loadMigrationsFrom()` (or a publish tag) and key your
  tables by `customer_id` / `order_id`, never by email.
