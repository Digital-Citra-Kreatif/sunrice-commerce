# Sunrice Commerce — Architecture

How Sunrice Commerce is built. `SPEC.md` says *what* it does; this file says *how*. `EXECUTION_PLAN.md`
turns both into ordered tasks. When this file and `SPEC.md` disagree, `SPEC.md` wins.

Contents:

1. [Overview](#1-overview)
2. [Package conventions](#2-package-conventions)
3. [How commerce plugs into Sunrice](#3-how-commerce-plugs-into-sunrice)
4. [Modules and feature switches](#4-modules-and-feature-switches)
5. [Settings](#5-settings)
6. [Data model](#6-data-model)
7. [Catalog](#7-catalog)
8. [Pricing engine](#8-pricing-engine)
9. [Promotions](#9-promotions)
10. [Cart, wishlist, compare](#10-cart-wishlist-compare)
11. [Checkout and placing an order](#11-checkout-and-placing-an-order)
12. [Orders and quotes](#12-orders-and-quotes)
13. [Payments](#13-payments)
14. [Shipping](#14-shipping)
15. [Taxes](#15-taxes)
16. [Customers and authentication](#16-customers-and-authentication)
17. [Digital delivery](#17-digital-delivery)
18. [Documents](#18-documents)
19. [Notifications](#19-notifications)
20. [Analytics](#20-analytics)
21. [Admin](#21-admin)
22. [Storefront](#22-storefront)
23. [MCP tools](#23-mcp-tools)
24. [Extension contracts](#24-extension-contracts)
25. [Events](#25-events)
26. [Caching and performance](#26-caching-and-performance)
27. [Security](#27-security)
28. [Testing](#28-testing)
29. [Observability and store health](#29-observability-and-store-health)
30. [Changes needed in Sunrice CMS](#30-changes-needed-in-sunrice-cms)
31. [Decision log](#31-decision-log)

---

## 1. Overview

```
Host Laravel 13 application
│
├── sunrice/cms ─────────────── content, admin shell, staff auth, roles, assets, forms,
│                               activity log, MCP server, Blade components
│
├── sunrice/commerce ────────── this package
│   ├── Integration   CommerceServiceProvider · Commerce (registration API) · Features · StoreSettings
│   ├── Domain        Catalog · Inventory · Pricing · Promotions · Taxes · Cart · Checkout · Orders
│   │                 Payments · Shipping · Regions · Customers · Digital · Documents
│   │                 Notifications · Analytics
│   ├── Interfaces    Admin (Inertia pages inside Sunrice's admin) · Storefront (Blade routes,
│   │                 components, JSON endpoints) · MCP tools · Artisan commands · Webhooks
│   └── Contracts     PaymentMethod · ShippingMethodType · DiscountProvider · PriceCandidateProvider
│                     CheckoutCompletion · TaxCalculator · Inventory · DocumentRenderer …
│
└── extension packages ──────── sunrice/commerce-midtrans, -xendit, -rajaongkir, -biteship,
                                -loyalty, -accurate … depend on sunrice/commerce only
```

Request paths:

- **Product page**: Sunrice's catch-all → `PageController` → template (`sunrice.products.show`
  published by commerce, or commerce's fallback through a template hook) →
  `commerce_product($entry)` builds a `ProductView` from commerce tables → Blade.
- **Store pages** (cart, checkout, account): commerce's own routes, registered before Sunrice's
  fallback route, in the visitor's language → thin controller → action → view model → Blade.
- **Admin**: `Sunrice::adminRoutes()` → commerce controller → `Inertia::render('Commerce/…')` → React
  page registered by commerce's admin script through `window.Sunrice.registerPage()`.
- **Product editing**: Sunrice's entry editor; the `product` field is a commerce field type with its
  own admin control. Publishing the entry fires `EntryPublished` → `ProductProjector` writes the
  commerce tables.

## 2. Package conventions

| Item | Value |
| --- | --- |
| Composer package | `sunrice/commerce` |
| PHP namespace | `Sunrice\Commerce\` → `src/` (tests `Sunrice\Commerce\Tests\` → `tests/`) |
| Service provider | `Sunrice\Commerce\CommerceServiceProvider` (auto-discovered) |
| Facade | `Sunrice\Commerce\Facades\Commerce` → `Sunrice\Commerce\Commerce` (singleton registration API) |
| Config | `config/commerce.php`, key `commerce` |
| Views / components | `commerce::` / `<x-commerce::…>` |
| Translations | `commerce::storefront.*`, `commerce::emails.*`, `commerce::statuses.*` (Indonesian and English) |
| Tables | Prefix `commerce_`; auto-increment `id` except reference data keyed by official codes (`commerce_regions.code`) |
| Money columns | `bigInteger` in the currency's minor unit (IDR: whole rupiah). Percentages as basis points (`1100` = 11.00%) |
| Weights / sizes | Grams / millimetres as unsigned integers |
| Public keys | Random strings for anything in a URL (`order_key`, cart and wishlist tokens, download tokens), never ids |
| References to Sunrice rows | Plain indexed columns (`entry_id`, `term_id`, `asset_id`, `user_id`); no foreign keys into Sunrice or host tables (as Sunrice does for `author_id`). Foreign keys only between commerce tables |
| Permissions | `commerce.<area>.<action>` (Sunrice refuses `sunrice.*` names from packages) |
| Admin routes | Under `{admin}/commerce/…`, named `sunrice.admin.commerce.<area>.<action>` (prefix added by `Sunrice::adminRoutes()`) |
| Storefront routes | `commerce.<name>`, and `commerce.<name>.locale` for the language-prefixed copy |
| Inertia pages | `Commerce/<Area>/<Page>` |
| Write operations | Single-purpose action classes `src/<Area>/Actions/<Verb><Noun>.php` with a public `handle()`. Controllers, MCP tools and commands call actions |
| Strict types | Every PHP file starts `declare(strict_types=1);` |
| Events | `src/Events/`, dispatched after the database commit |

`src/` layout (one folder per domain area):

```
src/
├── Commerce.php · CommerceServiceProvider.php · Facades/Commerce.php · helpers.php
├── Features/        Feature, FeatureRegistry, Features (resolver), Middleware, Blade directive
├── Settings/        StoreSettings, SettingsSection, sections/*, Actions/SaveStoreSettings
├── Support/         Money, MoneyFormatter, Allocator, Sequences, NumberFormat, Phone, Address
├── Regions/         Region model, RegionImporter, Countries, RegionMapping
├── Catalog/         ProductField (FieldType), ProductData, ProductProjector, Catalog, ProductView(Factory),
│                    ProductQuery, PurchaseModes, PriceVisibility, Bundles, Models/*
├── Inventory/       Contracts/Inventory, DatabaseInventory, NullInventory, Actions/AdjustStock
├── Pricing/         PricingContext, Calculator, CalculationState, Stages/*, Adjustment, PriceCandidate
├── Promotions/      PriceRules/*, FlashSales/*, Vouchers/*
├── Taxes/           Contracts/TaxCalculator, TableRateTaxCalculator, NullTaxCalculator
├── Cart/            CartManager, Models/*, Actions/*
├── Checkout/        CheckoutData, CheckoutValidator, Completions/*, Actions/PlaceOrder, WhatsAppMessage
├── Orders/          Models/*, OrderStateMachine, Actions/*, Numbering
├── Payments/        Contracts/*, PaymentManager, Methods/{BankTransfer,Instructions,CashOnDelivery},
│                    Confirmations/*, Actions/RecordPaymentResult, Webhooks/*
├── Shipping/        Contracts/*, ShippingManager, Methods/{Free,Flat,Weight,Pickup}, ZoneMatcher, Couriers
├── Customers/       Customer, Address, CurrentCustomer, Auth/*, Actions/*
├── Digital/         DownloadFile, DownloadGrant, Actions/*, DownloadController
├── Documents/       Contracts/DocumentRenderer, DompdfRenderer, Documents
├── Notifications/   Notifier, CommerceNotification, Customer/*, Staff/*
├── Analytics/       StatsRecorder, Reports/*, Tracking
├── Health/          HealthCheck, checks/*
├── Mcp/Tools/       *Tool extends Sunrice\Mcp\Tools\SunriceTool
├── Http/            Controllers/{Admin,Storefront,Account,Api,Webhooks}, Middleware, Requests
├── View/Components/ Products, ProductFilter, Product, Cart, MiniCart, Checkout, Price, …
├── Events/ · Listeners/ · Console/
```

## 3. How commerce plugs into Sunrice

Commerce uses only Sunrice's public API (see Sunrice `docs/packages.md`), plus the small additions in
[§30](#30-changes-needed-in-sunrice-cms).

| Need | Sunrice API used |
| --- | --- |
| Admin screens | `Sunrice::adminRoutes()`, `Sunrice::registerAdminScript()` / `registerAdminStyle()`, `window.Sunrice.registerPage()` |
| Sidebar group "Shop" | `Sunrice::addNavigationItem(…, group: 'Shop', can: fn ($user) => …)`, `Sunrice::navigationUsing()` for ordering |
| Settings → Store tab | `Sunrice::addSettingsTab()` (**U1**) |
| Permissions in the role editor | `Sunrice::registerPermission()` (group labels "Store: Orders", "Store: Settings", …) |
| Default roles | Commerce's own seeder (Sunrice's `RolesSeeder::match()` patterns) |
| Product data field | `Sunrice::registerField(ProductField::class)` + `window.Sunrice.registerField('commerce_product', …)` |
| Other admin controls | Field types `commerce_money`, `commerce_region`, `commerce_variant_picker`, `commerce_datetime_range` (used in commerce's own forms through `components.FieldRenderer`) |
| Product lifecycle | Events `EntryPublished`, `EntryUnpublished`, `EntryDeleted`, `EntryRestored` |
| Querying products | `sunrice_entries($collection)` / `EntryQuery` (publication rules, translations, term filters, search) and its `toBase()` escape hatch for id subqueries |
| Product, category and brand page templates | Sunrice's template resolution + `Sunrice::resolveTemplateUsing()` (falls back to commerce views when the app has no product template) |
| Store page layout and SEO | The site layout `sunrice.layouts.app`, `<x-sunrice::seo>`, `<x-sunrice::code>`, `sunrice_menu()`, `sunrice_global()` |
| Language prefixes on store routes | `Sunrice\Http\Middleware\SetFrontendLocale`, `Sunrice\Support\Locales`; `Sunrice::frontendRoutes()` (**U12**) when available |
| Body classes on store pages | `Sunrice::bodyClassUsing()` |
| Inquiry form | Sunrice forms (`<x-sunrice::form handle="product_inquiry">`), `FormSubmitted` event (**U9**) |
| Store structure scaffold | `Sunrice::importStructure()` (**U4**) |
| Store settings storage | `Sunrice\Models\Setting::get()` / `set()` (key `commerce`) |
| Activity log | `ActivityLogger::record()`, `withSource()` |
| AI agents | `Sunrice::registerMcpTool()`, `Sunrice::addMcpInstructions()` (**U6**) |
| Hiding customers from Users | `Sunrice::usersQueryUsing()` (**U3**) |
| Admin tables | `components.DataTable` + `Sunrice\Admin\Table\TableQuery` (documented as public, **U14**) |
| Captcha on public forms | `Sunrice\Support\Captcha` (documented as public, **U13**) |

Commerce never queries Sunrice tables directly, with two documented exceptions:

1. `EntryQuery::toBase()` is used as an id subquery.
2. `Entry::mainTranslation()->data` is read by the projector.

## 4. Modules and feature switches

### 4.1 Definitions

```php
final class Feature
{
    public function __construct(
        public readonly string $key,                 // 'vouchers'
        public readonly string $group,               // 'promotions'
        public readonly string $label,
        public readonly string $description,
        public readonly array $requires = [],        // ['cart']
        public readonly array $modes = Feature::ALL_MODES,   // where it can be active
        public readonly array $modeRequires = [],    // ['shop' => ['payments']]
        public readonly bool $default = true,
        public readonly bool $core = false,          // 'catalog': cannot be switched off
        public readonly ?string $settingsSection = null,
    ) {}
}
```

- The built-in features (SPEC § Feature modules) are registered in `FeatureRegistry` by the
  provider. Packages call `Commerce::registerFeature(new Feature(...))` (group `integrations` by
  default).
- A test asserts that the requirement graph has no cycles and that every key it names exists.

### 4.2 Resolution

The stored switches live in `StoreSettings` (`features: {key: bool}`); a missing key means the
feature's default.

```
active(f) = f.core
         or ( switchedOn(f)
              and mode ∈ f.modes
              and ∀ r ∈ f.requires ∪ f.modeRequires[mode] : active(r) )
```

- `Features` (singleton) computes every state once per request and keeps it in memory. Saving the
  settings resets it.
- `Features::explain($key)` returns `{active, switchedOn, reasons: ['needs:cart', 'mode:catalog']}`
  for the Features page, MCP and health checks.
- `ToggleFeature` (action) refuses changes that would leave the selling mode unusable. For example,
  switching `payments` off in Online store mode fails with "Choose another selling mode first".
- It returns the list of features that become inactive, so the UI can ask for confirmation, and it
  dispatches `FeatureToggled`.

### 4.3 Always registered, gated at runtime

Everything a module owns is **registered** at boot regardless of its switch:

- routes, permissions, resources, listeners, schedules, MCP tools, Blade components;
- admin pages and navigation items.

Access is **gated** at runtime:

| Thing | Gate |
| --- | --- |
| Storefront and admin routes | Middleware `commerce.feature:vouchers` → 404 when inactive |
| Admin navigation items | `can: fn ($user) => Features::active('orders') && $user->can('commerce.orders.view')` |
| Policies | Commerce policies extend `FeatureGatedPolicy`; its `before()` returns `false` when the module is inactive |
| Blade | `@commerceFeature('wishlist') … @endcommerceFeature`; components render nothing when inactive |
| Listeners | `Listeners\Concerns\RunsWhenActive` (`protected string $feature`) skips the handler |
| Schedules | `->when(fn () => Features::active('flash_sales'))` |
| MCP tools | `shouldRegister()` returns false when inactive (laravel/mcp hides the tool) |
| Emails | `Notifier` checks the module and the email's own switch |

Why: route caching keeps working, `sunrice:sync-permissions` never deletes a switched-off module's
permissions (roles keep their grants), and there is no database access at boot.

### 4.4 Optional connections use "nothing" implementations

Code never asks "is module X on?" to decide how to behave. It calls a contract, and the container
binds the active implementation or a null implementation:

| Contract | Active implementation | When inactive |
| --- | --- | --- |
| `Inventory\Contracts\Inventory` | `DatabaseInventory` | `NullInventory`: unlimited, reserve/release do nothing |
| `Taxes\Contracts\TaxCalculator` | `TableRateTaxCalculator` | `NullTaxCalculator`: zero tax |
| `Shipping\ShippingManager` | zones and methods | Returns "no shipping needed"; checkout hides the step |
| `Pricing` candidate providers | flash sale, price rules, product tiers | Not added to the pipeline |
| `Pricing` discount providers | automatic discounts, vouchers | Not added; the voucher field is hidden |
| `Payments\PaymentManager` | registered methods | Offers no methods (only when the selling mode doesn't need them) |
| `Documents\Documents` | dompdf renderer | Document links hidden; email attachments skipped |
| `Digital\Delivery` | grants and deliveries | Nothing granted (existing grants keep working) |
| `Customers\CurrentCustomer` | the `commerce` guard user | Always a guest |
| `Analytics\Tracking` | daily counters | Does nothing |

Bindings are scoped (resolved per request through a factory that consults `Features`). Queue
workers reset them for each job, like Sunrice does for settings.

### 4.5 Data stays valid when a module is off

- Orders keep snapshots: voucher codes, rule labels, shipping and payment instructions, tax rates.
  So no order screen needs an inactive module's tables to render.
- References to optional data are nullable, set null on delete, and checked when read. A voucher
  limited to a payment method that was removed simply ignores it, and the voucher editor warns.
- Turning a module back on needs no migration or repair: its rows are where they were.

### 4.6 Feature matrix test

`tests/Feature/FeatureMatrixTest.php` boots the store once for each feature with that feature off
(and with all optional features off), then asserts:

- the module's routes answer 404 and its navigation items are gone;
- its components render nothing and its MCP tools aren't listed;
- the core flows of the remaining active modules still pass: browse, add to cart, checkout and
  order in each selling mode where they apply.

## 5. Settings

- Stored as one row in `sunrice_settings` with key `commerce`, read through `Setting::get()` once per
  request and cached in the app cache under `commerce:settings` until saved.
- `StoreSettings` is a typed accessor: `StoreSettings::current()->get('checkout.guest_checkout')`.
  Defaults come from `config/commerce.php`, so config and `.env` act as defaults, the same as
  Sunrice's site settings.
- **Secrets never go in settings.** Google client secret, gateway keys and carrier keys stay in
  `.env` and config.
- **Sections**:
  - Each section is a `SettingsSection` with a key, label, permission (`commerce.settings.<key>`),
    feature, field schema (Sunrice field definitions rendered by `FieldRenderer`) and validation
    rules, or a custom page component.
  - The built-in sections are General, Features, Catalog, Checkout, Payments, Shipping, Taxes,
    Accounts, Emails and Documents. Packages add theirs with `Commerce::registerSettingsSection()`.
- **Saving**: `SaveStoreSettings` validates the section, applies cross-checks (§4.2, e.g. WhatsApp
  mode needs a number), stores it and clears the cache. It logs the changed keys to the activity log
  and dispatches `StoreSettingsSaved`.
- **Locked settings**: currency code and decimals can't change once an order exists (like Sunrice's
  main-language lock).
- Translatable texts in settings (payment method titles, email subjects, WhatsApp templates, shipping
  method titles) are stored as `{locale: text}` maps; an empty value falls back to the main language.

## 6. Data model

Tables are listed by area. `FK` means a foreign key within commerce tables; plain `*_id` columns
pointing at Sunrice or host rows are indexed but not constrained. Every table has timestamps unless
noted.

### 6.1 Catalog and inventory

**`commerce_products`** — one row per product entry (the projection).

| Column | Type | Notes |
| --- | --- | --- |
| `entry_id` | ubigint | Unique |
| `collection_id` | ubigint | Indexed |
| `type` | string | `simple` \| `variable` \| `bundle` |
| `purchase_mode` | string | Default `default` |
| `external_links` | json, nullable | |
| `requires_shipping`, `downloadable`, `featured` | bool | |
| `tax_class` | string, nullable | |
| `bundle_pricing` | string, nullable | `fixed` \| `percent_off` \| `amount_off` |
| `bundle_value` | bigint, nullable | |
| `min_price`, `max_price` | bigint, nullable, indexed | Everyone's current price, including an active flash sale; used to sort and filter listings |
| `min_regular_price`, `max_regular_price` | bigint, nullable | |
| `on_sale`, `in_stock` | bool, indexed | |
| `sales_count` | uint | Units sold in paid orders |
| `data_hash` | string | |
| `sync_status` | string | `ok` \| `failed` |
| `sync_error` | text, nullable | |
| `synced_at` | timestamp | |

**`commerce_product_options`**: `product_id` FK cascade, `uid` (ULID from the field), `name`,
`taxonomy_id` (nullable, a global attribute), `position`. Unique `(product_id, uid)`.

**`commerce_product_option_values`**: `option_id` FK cascade, `uid`, `label` (custom values),
`term_id` (nullable, global values), `position`. Unique `(option_id, uid)`; index on `term_id`.

**`commerce_variants`**

| Column | Type | Notes |
| --- | --- | --- |
| `product_id` | FK cascade | |
| `uid` | string | |
| `sku` | string, nullable | Unique |
| `barcode` | string, nullable | |
| `title` | string | Option labels in the main language, e.g. "M / Red" |
| `price` | bigint | |
| `compare_at_price`, `cost` | bigint, nullable | |
| `weight` | uint, nullable | Grams |
| `length`, `width`, `height` | uint, nullable | Millimetres |
| `image_asset_id` | ubigint, nullable | |
| `requires_shipping`, `downloadable` | bool, nullable | `null` = inherit from the product |
| `track_stock` | bool | |
| `stock_quantity` | int, nullable | May go below 0 with backorders |
| `stock_status` | string | `in_stock` \| `out_of_stock` \| `backorder` |
| `backorders` | string | `no` \| `allow` \| `notify` |
| `low_stock_threshold` | uint, nullable | |
| `min_qty` | uint | Default 1 |
| `max_qty` | uint, nullable | |
| `qty_step` | uint | Default 1 |
| `position` | int | |
| `is_default`, `active` | bool | |
| `deleted_at` | timestamp | Soft deletes: order lines keep their variant |

Unique `(product_id, uid)`; index `(product_id, active)`.

**`commerce_variant_option_values`**: `variant_id` FK cascade, `option_value_id` FK cascade; primary
key on both.

**`commerce_bundle_items`**: `product_id` FK cascade (the bundle), `variant_id` FK (the component),
`quantity`, `position`.

**`commerce_price_tiers`** (a product's own bulk tiers): `product_id` FK cascade, `variant_id`
(nullable FK cascade), `min_qty`, `type` (`percent_off` | `amount_off` | `fixed_price`), `value`
(basis points or minor units), `position`.

**`commerce_download_files`**: `product_id` and `variant_id` (nullable FK, null on delete), `type`
(`file` | `url`), `name`, `disk`, `path`, `filename`, `mime_type`, `size`, `url`, `uploaded_by`,
`attached` (bool), soft deletes. Grants keep pointing at detached files.

**`commerce_stock_movements`** (no `updated_at`):

| Column | Type | Notes |
| --- | --- | --- |
| `variant_id` | FK cascade | |
| `delta` | int | |
| `quantity_after` | int, nullable | |
| `reason` | string | `initial` \| `order` \| `cancel` \| `expire` \| `refund` \| `manual` \| `import` \| `correction` |
| `reference_type`, `reference_id` | nullable morph | |
| `user_id` | nullable | |
| `note` | string, nullable | |
| `created_at` | timestamp | |

Index `(variant_id, created_at)`.

### 6.2 Promotions and taxes

**`commerce_price_rules`**: `name`, `active`, `priority`, `starts_at`, `ends_at` (nullable),
`audience` (`everyone` | `guests` | `signed_in` | `roles`), `roles` (json), `scope` (`all` |
`products` | `variants` | `categories` | `brands`), `quantity_basis` (`variant` | `product` |
`rule`), `tiers` (json `[{min_qty, type, value}]`).

**`commerce_price_rule_targets`**: `rule_id` FK cascade, `target_type` (`product` | `variant` |
`term`), `target_id`.

**`commerce_flash_sales`**: `name`, `slug` (unique), `starts_at`, `ends_at` (indexed), `active`,
`badge`, `description` (json per locale), `show_countdown`, `show_progress`, `show_teaser`,
`per_customer_limit`, `banner_asset_id`.

**`commerce_flash_sale_items`**: `flash_sale_id` FK cascade, `product_id` FK cascade, `variant_id`
(nullable FK cascade; null = every variant of the product), `discount_type`, `discount_value`,
`quantity_limit` (nullable), `sold_quantity` (uint), `per_customer_limit` (nullable), `position`.
Index `(variant_id)`, `(product_id)`.

**`commerce_vouchers`**

| Column | Type | Notes |
| --- | --- | --- |
| `code` | string, nullable, unique | Stored uppercase |
| `name`, `description` | string | |
| `automatic` | bool | |
| `type` | string | `percent` \| `fixed_cart` \| `fixed_item` \| `free_shipping` \| `buy_x_get_y` |
| `value` | bigint | |
| `max_discount` | bigint, nullable | |
| `bxgy` | json, nullable | `{buy_qty, get_qty, get_type, get_value}` |
| `starts_at`, `ends_at` | timestamp, nullable | |
| `min_subtotal`, `max_subtotal` | bigint, nullable | |
| `subtotal_basis` | string | `eligible` \| `cart` |
| `min_quantity` | uint, nullable | |
| `exclude_sale_items` | bool | |
| `audience` | string | `everyone` \| `signed_in` \| `roles` \| `customers` \| `first_order` |
| `roles`, `payment_methods`, `shipping_methods` | json | |
| `destinations` | json | `[{country, region_code}]` |
| `usage_limit`, `usage_limit_per_customer` | uint, nullable | |
| `times_used` | uint | |
| `combinable`, `exclusive` | bool | |
| `priority` | int | |
| `active` | bool | |
| `deleted_at` | timestamp | Soft deletes |

**`commerce_voucher_targets`**: `voucher_id` FK cascade, `mode` (`include` | `exclude` | `buy` |
`get`), `target_type`, `target_id`.

**`commerce_voucher_customers`**: `voucher_id` FK cascade, `customer_id` (nullable FK), `email`
(nullable).

**`commerce_voucher_redemptions`** (no `updated_at`): `voucher_id` FK, `order_id` FK cascade,
`customer_id`, `email`, `phone`, `code`, `amount`, `released_at` (nullable), `created_at`. Index
`(voucher_id, customer_id)`, `(voucher_id, email)`.

**`commerce_tax_rates`**: `tax_class` (default `standard`), `country` (char 2, nullable = all),
`region_code` (nullable), `name`, `rate` (basis points), `compound`, `shipping`, `priority`.

### 6.3 Customers, carts, lists

**`commerce_customers`**

| Column | Type | Notes |
| --- | --- | --- |
| `user_id` | ubigint, nullable | Unique; host user, not a foreign key |
| `email` | string | Unique, lowercase |
| `name`, `phone` | string | `phone` indexed, E.164 |
| `accepts_marketing` | bool | |
| `marketing_consent_at` | timestamp, nullable | |
| `locale` | string | |
| `orders_count` | uint | |
| `total_spent` | bigint | |
| `first_order_at`, `last_order_at` | timestamp | |
| `note` | text | |
| `deletion_requested_at`, `anonymized_at` | timestamp | |
| `meta` | json | |

**`commerce_addresses`**: `customer_id` FK cascade, `label`, `name`, `phone`, `company`, `country`
(char 2), `province_code`, `city_code`, `district_code`, `village_code`, `province`, `city`,
`district`, `village` (names), `state` (non-ID), `postal_code`, `line1`, `line2`, `notes`,
`default_shipping`, `default_billing`.

One-time sign-in codes use `spatie/laravel-one-time-passwords`' own `one_time_passwords` table
(`password`, `origin_properties`, `expires_at`, morphs `authenticatable`), published and migrated
by `commerce:install`.

**`commerce_social_accounts`**: `user_id` (indexed), `provider`, `provider_id`, `email`, `avatar`.
Unique `(provider, provider_id)`.

**`commerce_carts`**

| Column | Type | Notes |
| --- | --- | --- |
| `token` | string(64) | Unique |
| `customer_id` | nullable FK, null on delete | Indexed |
| `currency`, `locale` | string | |
| `vouchers` | json | Codes |
| `checkout` | json | Contact, addresses, chosen shipping and payment, notes, dropshipper, extra fields, `checkout_token`, `totals_hash` |
| `status` | string | `active` \| `merged` \| `converted` \| `abandoned` |
| `order_id` | nullable FK | |
| `last_activity_at` | timestamp | Indexed |

**`commerce_cart_items`**: `cart_id` FK cascade, `variant_id` FK cascade, `quantity`,
`unit_price_seen` (for "price changed" notices), `meta` (json). Unique `(cart_id, variant_id)`.

**`commerce_wishlists`**: `customer_id` (nullable FK cascade), `token` (unique, guests),
`share_token` (unique), `is_shared`.

**`commerce_wishlist_items`**: `wishlist_id` FK cascade, `product_id` FK cascade, `variant_id`
(nullable FK cascade), `created_at`. Unique `(wishlist_id, product_id, variant_id)`.

### 6.4 Orders, payments, fulfilment

**`commerce_orders`**

| Column | Type | Notes |
| --- | --- | --- |
| `type` | string, indexed | `order` \| `quote` |
| `number`, `quote_number` | string, nullable, unique | |
| `order_key` | string(40) | Unique |
| `checkout_token` | string, nullable, unique | |
| `status`, `payment_status`, `fulfillment_status` | string, indexed | |
| `channel` | string | `storefront` \| `admin` \| `whatsapp` \| `mcp` \| `api` |
| `selling_mode` | string | |
| `customer_id` | nullable FK, null on delete, indexed | |
| `user_id` | indexed | |
| `email` | indexed | |
| `phone`, `customer_name` | string | |
| `billing_address`, `shipping_address` | json | Snapshots |
| `shipping_method` | json | Snapshot: method id, type, title, rate code, ETD, cost |
| `payment_method`, `payment_method_title` | string | |
| `currency`, `locale` | string | |
| `prices_include_tax` | bool | |
| `subtotal`, `discount_total`, `shipping_total`, `fee_total`, `tax_total`, `total`, `paid_total`, `refunded_total` | bigint | |
| `weight` | uint | |
| `customer_note` | text | |
| `dropship`, `fields`, `meta` | json | `fields` holds extension fields |
| `ip_address`, `user_agent` | string | |
| `placed_at` | timestamp, indexed | |
| `paid_at`, `completed_at`, `cancelled_at` | timestamp | |
| `expires_at` | timestamp, indexed | |
| `quote_valid_until` | timestamp | |
| `cancel_reason` | string | |
| `version` | uint | Bumped on every change; used by document caching and optimistic checks |
| `deleted_at` | timestamp | Soft deletes |

**`commerce_order_items`**

| Column | Type | Notes |
| --- | --- | --- |
| `order_id` | FK cascade | |
| `parent_id` | nullable self FK | Bundle components |
| `product_id`, `variant_id` | nullable FK, null on delete | |
| `entry_id` | | |
| `name`, `variant_title`, `sku` | string | |
| `options` | json | |
| `quantity` | uint | |
| `unit_price`, `regular_unit_price` | bigint | |
| `compare_at_price` | bigint | |
| `price_source` | json | `{type, id, label}` |
| `subtotal`, `discount_total`, `tax_total`, `total` | bigint | |
| `cost` | bigint | |
| `weight` | uint | |
| `requires_shipping`, `downloadable` | bool | |
| `fulfilled_quantity`, `refunded_quantity` | uint | |
| `meta` | json | |

**`commerce_order_adjustments`** (no `updated_at`):

| Column | Type | Notes |
| --- | --- | --- |
| `order_id` | FK cascade | |
| `order_item_id` | nullable FK cascade | Set for per-line allocations |
| `kind` | string | `discount` \| `shipping_discount` \| `fee` \| `tax` \| `unique_code` \| `manual` |
| `source_type` | string | `voucher` \| `automatic` \| `price_rule` \| `flash_sale` \| `payment_fee` \| `tax_rate` \| `manual` \| `<extension>` |
| `source_id` | nullable | |
| `code`, `label` | string | |
| `amount` | bigint | Signed; negative lowers the total |
| `meta` | json | |
| `created_at` | timestamp | |

**`commerce_order_events`** (the timeline; no `updated_at`): `order_id` FK cascade, `type` (`status`
| `payment` | `note` | `email` | `shipment` | `refund` | `edit` | `system`), `visibility`
(`internal` | `customer`), `message`, `data` (json), `user_id`, `source` (`admin` | `storefront` |
`system` | `ai` | `gateway`), `created_at`.

**`commerce_payments`**: `order_id` FK cascade, `method`, `method_title`, `amount`, `currency`,
`status` (`pending` | `awaiting_confirmation` | `paid` | `failed` | `expired` | `cancelled` |
`refunded` | `partially_refunded`), `reference` (indexed), `instructions` (json snapshot),
`expires_at`, `paid_at`, `refunded_amount`, `meta` (json).

**`commerce_payment_confirmations`**

| Column | Type | Notes |
| --- | --- | --- |
| `order_id` | FK cascade | |
| `payment_id` | nullable FK | |
| `customer_id` | | |
| `sender_name`, `sender_bank` | string | |
| `amount` | bigint | |
| `transferred_at` | date | |
| `destination` | json | Snapshot of the account paid into |
| `proof_disk`, `proof_path` | string | |
| `note` | string | |
| `status` | string | `submitted` \| `approved` \| `rejected` |
| `reviewed_by`, `reviewed_at`, `review_note` | | |
| `ip_address` | string | |

**`commerce_refunds`**: `order_id` FK cascade, `payment_id`, `amount`, `reason`, `items` (json
`[{order_item_id, quantity, amount}]`), `restock`, `method` (`manual` | `gateway`), `reference`,
`status`, `created_by`.

**`commerce_shipments`**: `order_id` FK cascade, `courier` (preset key), `courier_name`, `service`,
`tracking_number` (indexed), `tracking_url`, `status` (`shipped` | `in_transit` | `delivered` |
`returned` | `cancelled`), `items` (json), `cost`, `shipped_at`, `delivered_at`, `meta`,
`created_by`.

**`commerce_documents`**: `order_id` FK cascade, `type` (`invoice` | `packing_slip` | `quotation`),
`number`, `issued_at`, `disk`, `path`, `order_version`. Unique `(type, number)`.

**`commerce_download_grants`**

| Column | Type | Notes |
| --- | --- | --- |
| `order_id`, `order_item_id`, `download_file_id` | FK cascade | |
| `customer_id` | | |
| `email` | string | |
| `token` | string(64) | Unique |
| `downloads_remaining` | uint, nullable | |
| `download_count` | uint | |
| `expires_at`, `revoked_at`, `last_downloaded_at` | timestamp | |

**`commerce_download_logs`** (no `updated_at`): `grant_id` FK cascade, `ip_address`, `user_agent`,
`created_at`.

**`commerce_webhook_calls`**: `method`, `event_id`, `payload_hash`, `payment_id`, `status`
(`received` | `processed` | `failed` | `ignored`), `error`, `received_at`, `processed_at`. Unique
`(method, event_id)`.

### 6.5 Shipping, regions, infrastructure

- **`commerce_shipping_zones`**: `name`, `position`, `everywhere_else`.
- **`commerce_shipping_zone_regions`**: `zone_id` FK cascade, `country`, `region_code` (nullable).
  Index `(country, region_code)`.
- **`commerce_shipping_methods`**: `zone_id` FK cascade, `type`, `title` (json per locale), `etd`
  (json per locale), `settings` (json), `active`, `position`.
- **`commerce_regions`** (primary key `code`; only `updated_at`): `code` (`32.73.01`),
  `parent_code` (indexed), `level` (1–4), `name`, `kind` (`provinsi` | `kabupaten` | `kota` |
  `kecamatan` | `kelurahan` | `desa` | `desa_adat`), `postal_code` (villages), `active`, `dataset`.
- **`commerce_region_mappings`**: `provider`, `region_code`, `external_id`, `meta`. Unique
  `(provider, region_code)`.
- **`commerce_sequences`** (only `updated_at`): `key` (primary, e.g. `order:2026`,
  `invoice:2026-10`), `value`.
- **`commerce_stats_daily`**: `date` (unique), `orders`, `items_sold`, `gross_sales`, `discounts`,
  `refunds`, `net_sales`, `shipping`, `taxes`, `fees`, `total_sales`, `new_customers`,
  `returning_customers`, `carts_created`, `checkouts_started`, `quotes_requested`.
- **`commerce_product_stats_daily`**: `date`, `product_id`, `views`, `add_to_carts`, `units_sold`,
  `revenue`, `cta_whatsapp`, `cta_external`, `cta_inquiry`. Unique `(date, product_id)`.

## 7. Catalog

### 7.1 The `commerce_product` field type

`Sunrice\Commerce\Catalog\ProductField` extends `Sunrice\Fields\FieldType`, type `commerce_product`,
and is placed in the product blueprint as handle `product`. Its value (shared, not translatable):

```json
{
  "type": "variable",
  "purchase_mode": "default",
  "external_links": [{ "preset": "tokopedia", "label": "Tokopedia", "url": "https://…" }],
  "requires_shipping": true,
  "downloadable": false,
  "featured": false,
  "tax_class": null,
  "options": [
    { "id": "01JA…", "name": "Size", "taxonomy": null,
      "values": [{ "id": "01JB…", "label": "M" }, { "id": "01JC…", "label": "L" }] },
    { "id": "01JD…", "name": "Color", "taxonomy": "colors",
      "values": [{ "id": "01JE…", "term_id": 12 }] }
  ],
  "variants": [
    { "id": "01JF…", "options": { "01JA…": "01JB…", "01JD…": "01JE…" },
      "sku": "TS-M-RED", "barcode": null, "price": 150000, "compare_at_price": 200000, "cost": 80000,
      "weight": 250, "length": 300, "width": 200, "height": 20, "image": 45,
      "track_stock": true, "initial_stock": 10, "backorders": "no", "low_stock_threshold": null,
      "stock_status": "in_stock", "min_qty": 1, "max_qty": null, "qty_step": 1, "active": true,
      "downloads": [] }
  ],
  "bundle": { "pricing": "percent_off", "value": 1000, "items": [{ "variant_id": 381, "quantity": 2 }] },
  "downloads": [{ "id": "01JG…", "file_id": 77, "type": "file", "name": "E-book (PDF)" }],
  "delivery": { "modes": ["link", "account"], "download_limit": null, "expiry_days": null },
  "tiers": [{ "min_qty": 10, "type": "percent_off", "value": 500, "variant": null }]
}
```

- **`rules()`**:
  - validates the structure, enums, limits (3 options, 100 variants) and money fields
    (integers ≥ 0);
  - bundles: components must exist and must not be bundles;
  - every option combination maps to at most one variant;
  - SKU uniqueness against `commerce_variants`, excluding variants whose `uid` is in the posted
    value. With **U16** the rule receives the entry and excludes its own product exactly.
- **`normalize()`**:
  - assigns ULIDs to new options, values, variants and downloads;
  - fills defaults;
  - drops keys not in the schema (unlike Sunrice's general rule, this field owns its shape);
  - a simple product always keeps exactly one variant with no options.
- **`references()`**: variant images (assets) and bundle component entries, so Sunrice's "Used by"
  and asset usage work.
- **`defaultValue()`**: a simple, physical product with one empty variant.
- **`hydrate()`**: returns a `ProductData` DTO of the stored value. It is used for preview; live
  pages use `commerce_product($entry)` (§7.4).

### 7.2 Projection (`ProductProjector`)

1. A listener on `EntryPublished` runs it synchronously for entries of product collections
   (`commerce.catalog.collections`, default `['products']`). `commerce:sync-products {--entry=}`
   runs it for every product entry.
2. It reads the main translation's **live** value, `$entry->mainTranslation()->data['product']`,
   and validates it with the same validator as `rules()`.
3. If `sha256(json)` equals `data_hash` and the last sync succeeded, it stops.
4. In one transaction:
   - upsert the product by `entry_id`;
   - upsert options and values by `uid`, deleting the missing ones;
   - upsert variants by `(product_id, uid)`: soft-delete missing ones, restore ones that reappear;
   - sync the variant ↔ value pivot;
   - replace tiers and bundle items;
   - attach the referenced download files and detach others (files stay for existing grants).
5. New tracked variants get `initial_stock` as a stock movement with reason `initial`. Existing
   variants' stock is never touched.
6. `PriceIndex::refresh($product)` recomputes the min/max prices, `on_sale` and `in_stock`.
7. It sets `sync_status = ok` and dispatches `ProductSynced`.
8. On any exception it rolls back and sets `sync_status = failed` with the message. It reports the
   exception and dispatches `ProductSyncFailed`. It never rethrows, so the editor's publish request
   still succeeds. The product is not purchasable until fixed, and the editor control, Shop →
   Products and store health show the error.

Other events:

- **`EntryUnpublished`**, **`EntryDeleted`** (trash), **`EntryRestored`**: no projection change.
  Purchasability is always read from Sunrice.
- **Force delete**: the listener sees that the entry no longer exists and soft-deletes the variants
  and marks the product removed, keeping order references.

### 7.3 Purchasability

`Catalog::check(Variant $variant, int $qty, PricingContext $ctx): Availability` returns ok or a
reason code:

- `not_published`: Sunrice's own `EntryQuery` for the entry returns nothing. This covers
  publication, schedule, trash and deleted collections.
- `sync_failed`, `inactive_variant`;
- `purchase_mode` (resolves to something other than cart), `price_hidden`, `feature_off`;
- `out_of_stock`, `qty_rules`, `flash_sale_limit`.

The entry check is batched: one `EntryQuery` with `where('id', 'in', $entryIds)` for all lines.

`PurchaseModes::resolve($product, $mode)` is a pure function over the store mode, the product's
`purchase_mode`, active features and the catalog call-to-action. It is used by templates, the cart
and MCP alike.

### 7.4 Product views

- `ProductViewFactory::forEntries(Collection $entries, PricingContext $ctx)` loads, in a fixed
  number of queries, the products, variants, option values (with terms), active flash sale items,
  matching price rules, tiers and stock for every entry on the page.
- It returns `ProductView` objects:
  - `type`, `price` (display: `amount`, `compareAt`, `isRange`, `from`, `to`, `taxSuffix`,
    `hidden`);
  - `badges`, `stock` (status and message), `cta` (resolved call-to-action);
  - `flashSale` (ends at, sold %), `tiers` (table);
  - `variantsJson` (for the picker), `structuredData()`.
- `commerce_product($entry)` returns the entry's view (memoized per request).
- In preview (`$entry->hydrationContext->preview`), the factory maps the **draft** value in memory
  with the projector's mapper (no writes). Stock comes from existing variants by `uid`, or from
  `initial_stock`.
- **Template fallback**: the provider registers a `Sunrice::resolveTemplateUsing()` hook. For
  entries of product collections, and term pages of the product taxonomies, it swaps a generic
  result (`sunrice.show`, `sunrice::defaults.show`, `sunrice.index`, `sunrice.taxonomies.show`, …)
  for commerce's fallback views (`commerce::storefront.product`, `.shop`, `.category`, `.brand`).
  Templates the app publishes under `sunrice/products/…` are found first by Sunrice itself.

### 7.5 Listing queries (`ProductQuery`)

Used by `<x-commerce::products>` and `<x-commerce::product-filter>`.

```php
$ids = sunrice_entries('products')
    ->whereTerm('product_categories', $category, includeChildren: true)  // Sunrice filters
    ->search($q, ['title', 'excerpt'])
    ->toBase()->reorder()->select('sunrice_entries.id');                  // published, not hidden

Product::query()
    ->whereIn('entry_id', $ids)
    ->when($skuMatch, fn ($q) => $q->orWhereHas('variants', …))  // SKU search
    ->whereBetween('min_price', [$min, $max])
    ->where('in_stock', true)                                     // filters
    ->whereExists(/* variant has option value with term_id IN (…) */)
    ->orderBy('min_price')                                         // sorts
    ->paginate($perPage, pageName: 'page');
```

- The page's entries are then loaded with
  `sunrice_entries('products')->where('id', 'in', $pageEntryIds)->get()` (resolved for the
  language, cached ids) and put back in the paginator's order.
- **Facet counts** (categories, brands, attribute terms, price bounds) are grouped queries over the
  same filtered base, excluding the facet's own filter, cached for 5 minutes under the catalog
  version (§26).
- **Sorts**: `featured` (featured first, then manual order), `newest` (`published_at` through the
  base), `price`, `-price`, `best_selling` (`sales_count`), `name` (main-language title through the
  base).
- With hidden prices, the price filter and price sorts are dropped. With the product query cached
  in Sunrice, only ids are stored.

### 7.6 Inventory

`DatabaseInventory` implements the contract:

- **`reserve(lines)`**: for each variant, in id order, a single atomic statement. Zero affected rows
  means `OutOfStock` with the variant's name.

  ```sql
  UPDATE commerce_variants
     SET stock_quantity = stock_quantity - :qty
   WHERE id = :id
     AND (track_stock = 0 OR backorders <> 'no' OR stock_quantity >= :qty)
  ```

  Bundles reserve their components. Each change writes a movement and updates `stock_status`.
- **`release(order)`**: adds back what the order reserved. It is idempotent, guarded by the order's
  `meta.stock_reserved` flag.
- **`adjust(...)`**: manual changes with a reason. They fire `StockChanged`, plus `StockLow`,
  `StockOut` or `StockBackIn` when a threshold is crossed.
- `PriceIndex::refreshStock($product)` keeps `in_stock` correct for listings.

## 8. Pricing engine

### 8.1 Money

- **`Money`** is an immutable value: `int $amount` plus the store currency.
- **`MoneyFormatter`** formats from settings: symbol, position, thousands and decimal separators,
  decimals. It doesn't need `ext-intl`. Default `Rp150.000`.
- **`Allocator::proportional(int $total, array $weights): array`** splits an amount by the
  largest-remainder method, so the parts always sum exactly.
- **Percent math**: `intdiv($amount * $basisPoints + 5000, 10000)` (half up).

### 8.2 Calculation pipeline

One `Calculator` serves the cart, checkout, order placement, manual orders, quote edits and MCP
quotes:

```
CalculationState {
  PricingContext ctx   // customer, roles, guest?, now, locale, currency, channel,
                       // destination address, chosen shipping rate, chosen payment method
  lines[]              // variant, product, quantity, unitPrice, regularUnitPrice, priceSource,
                       // subtotal, discounts[] (allocations), taxes[], flags (onSale,
                       // requiresShipping, downloadable, taxClass)
  codes[]              // requested voucher codes
  adjustments[]        // order-level: shipping discount, fees, unique code
  shipping             // needed?, available rates, chosen rate, cost
  totals               // subtotal, discount, shipping, fee, tax, total
  notices[]            // removed lines, code errors, price changes
}
```

Stages run in order of priority. Extensions insert stages with
`Commerce::registerCalculationStage(Stage::class, priority)`.

| Priority | Stage | What it does |
| --- | --- | --- |
| 10 | `ResolveLines` | Loads variants and products; checks purchasability (§7.3); removes and notes lines that can't be bought |
| 20 | `UnitPrices` | Asks every `PriceCandidateProvider` for candidates; the lowest wins (§8.3) |
| 30 | `Subtotals` | Line subtotal = unit price × quantity |
| 40 | `Discounts` | `DiscountProvider`s in priority order (automatic discounts, then codes, then extensions); each returns adjustments with per-line allocations |
| 50 | `Shipping` | When any line needs shipping: rates for the destination from `ShippingManager`; the chosen rate's cost |
| 60 | `ShippingDiscounts` | Free-shipping vouchers and others |
| 70 | `Fees` | Payment method fee; the unique code (only when placing an order); extension fees |
| 80 | `Taxes` | `TaxCalculator` |
| 90 | `Totals` | Sums; clamps the total at zero; checks that the lines sum to the totals |

- `CalculationState::hash()` covers each line's variant, quantity and unit price, the adjustments,
  the shipping rate, fees, taxes and the total.
- Checkout renders the hash into the form, and `PlaceOrder` compares it (§11.3).

### 8.3 Unit price candidates

A `PriceCandidateProvider` returns zero or more
`PriceCandidate(amount, source: {type, id, label}, meta)` for a line:

- **`BasePrice`**: the variant price. For a bundle: the fixed price, or the components' sum minus
  the percentage or amount.
- **`FlashSalePrice`**: the active item for the variant, if `sold_quantity + qty ≤ quantity_limit`
  and the customer's earlier purchases plus `qty` are within the per-customer limit. Otherwise it
  returns nothing and adds a notice when the limit was the reason.
- **`PriceRulePrice`**: the matching rules (§9.1). The tier for the counted quantity; the best
  across rules.
- **`ProductTierPrice`**: the product's own tiers.

The lowest amount wins; ties keep the earlier provider. The winning source is stored on the line.
Lines whose winning source is a flash sale, or whose variant has a compare-at price above the unit
price, are flagged `onSale` (used by `exclude_sale_items`).

## 9. Promotions

### 9.1 Pricing rules

- **Matching**: active, inside its dates, audience matches the context (guests, signed in, or the
  user's roles), and target matches. Category targets include descendant terms: Sunrice's term
  tree, cached per catalog version.
- **Quantity basis**:
  - `variant`: the line's quantity;
  - `product`: the sum of lines of the same product;
  - `rule`: the sum of every line the rule targets.

  This needs the whole cart, so the provider receives the state, not just the line.

### 9.2 Flash sales

- **Active sale for a variant**: `starts_at ≤ now < ends_at` and `active`, from items with that
  `variant_id`, or with `product_id` and a null `variant_id`.
- **Overlap check on save**: the expanded variant set of the sale, against any other sale whose time
  window intersects.
- **Reservation at order placement**:

  ```sql
  UPDATE commerce_flash_sale_items
     SET sold_quantity = sold_quantity + :qty
   WHERE id = :id
     AND (quantity_limit IS NULL OR sold_quantity + :qty <= quantity_limit)
  ```

  Released on cancellation, using the item ids recorded in the order item's `price_source`.
- **Per-customer purchases** are counted from `commerce_order_items` with that sale in
  `price_source`, for the customer's id, or for the email/phone of guests, excluding cancelled
  orders.
- **Boundaries**: `commerce:tick` (every minute) finds sales that started or ended since the last
  tick, refreshes `PriceIndex` for their products, bumps the catalog version and fires
  `FlashSaleStarted` / `FlashSaleEnded`.

### 9.3 Vouchers

- **`VoucherDiscountProvider`** (codes) and **`AutomaticDiscountProvider`**: each voucher is checked
  in order by `VoucherEligibility`. The first failure gives the customer's message key.
  1. Active and within dates.
  2. Audience.
  3. Usage: global and per-customer counts from redemptions not released.
  4. Destinations, payment methods and shipping methods (only once known; until then the cart shows
     "applies at checkout if …").
  5. Eligible lines: targets include/exclude, sale exclusion.
  6. Minimum and maximum subtotal on the chosen basis, and minimum quantity.
  7. Combination rules against what is already applied.
- **Amounts by type**:

  | Type | Amount |
  | --- | --- |
  | `percent` | Eligible remaining × rate, capped by `max_discount` |
  | `fixed_cart` | `min(value, eligible remaining)` |
  | `fixed_item` | `value` × eligible quantity, capped per line |
  | `free_shipping` | Applied in the `ShippingDiscounts` stage |
  | `buy_x_get_y` | Sorts eligible "get" units by price ascending; the number of free or discounted units is `floor(buy units ÷ buy_qty) × get_qty` |

  Allocated to lines with `Allocator`.
- **Redemption**: at placement, inside the order transaction:

  ```sql
  UPDATE commerce_vouchers
     SET times_used = times_used + 1
   WHERE id = :id
     AND (usage_limit IS NULL OR times_used < usage_limit)
  ```

  The per-customer limit is re-checked under the lock. A redemption row is written. Cancellation or
  expiry sets `released_at` and decrements `times_used`.
- **Code attempts**: rate limiter `commerce-voucher` (10 per minute per cart token + IP).

## 10. Cart, wishlist, compare

- **`CartManager::current()`**:
  - a signed-in customer gets their active cart;
  - a guest gets the cart for the `commerce_cart` cookie (64 random characters, httpOnly,
    `SameSite=Lax`, 30 days), created lazily on the first write;
  - at sign-in, `MergeCarts` moves the guest lines into the customer's cart, adding quantities and
    clamping them to the rules, and marks the guest cart `merged`.
- **Writes**: `AddToCart`, `UpdateCartItem`, `RemoveCartItem`, `ApplyVoucher`, `RemoveVoucher`,
  `UpdateCheckoutData` (actions). Each runs the calculator to validate, stores
  `unit_price_seen`, touches `last_activity_at` and dispatches its event.
- **Reads**: a `CartView` (lines with product views, totals, notices), memoized per request.
  `<x-commerce::cart>` and the JSON endpoint use the same view.
- **Pruning** (`commerce:prune`, daily): active carts untouched for `commerce.cart.prune_days` are
  marked abandoned, then deleted after another N days. Converted carts are kept.
- **Wishlist**: works like the cart: a guest token cookie `commerce_wishlist`, merged at sign-in,
  plus `share_token` for public links.
- **Compare**: product ids in the session (`commerce.compare`), validated on render. No table.

## 11. Checkout and placing an order

### 11.1 Checkout data

- **Storage**: `commerce_carts.checkout` holds what the customer has entered so far, so a reload
  keeps it. `CheckoutData` is the typed wrapper.
- **Validation**: `CheckoutValidator` builds rules from the settings and active modules:
  - phone required;
  - company and tax ID fields;
  - address per country — for Indonesia, region codes must exist, be active and form a valid
    parent chain;
  - shipping rate in the current rate list;
  - payment method available;
  - terms accepted;
  - extension fields (`Commerce::checkoutFieldsUsing()`).
- **Addresses**: `Address` is a value object with codes and names, `format()` for display, and
  `toArray()` for snapshots. Phones normalize to E.164 (`08…` → `+628…`) through `Support\Phone`.

### 11.2 Completion strategies

```php
interface CheckoutCompletion
{
    public static function key(): string;                    // 'order' | 'quote' | 'whatsapp'
    public function orderType(): string;                     // 'order' | 'quote'
    public function requiresPayment(): bool;
    public function initialStates(CalculationState $state): OrderStates; // status, payment, fulfilment
    public function reservesStock(): bool;                   // quotes: false
    public function afterPlaced(Order $order): CompletionResponse;      // where to send the customer
}
```

The selling mode picks the built-in strategy:

| Strategy | Initial state | `afterPlaced` |
| --- | --- | --- |
| `OrderCompletion` | Pending payment, or Processing for zero-total and COD | Redirect to the order page, or the gateway's redirect from `PaymentMethod::start()` |
| `QuoteCompletion` | `requested`; reserves nothing | The quote's order page |
| `WhatsAppCompletion` | Pending, payment "Arranged via WhatsApp" | Order page with the `wa.me` link, built by `WhatsAppMessage` from the per-language template and the next number in rotation (counter in the cache) |

Packages add strategies with `Commerce::registerCheckoutCompletion()`.

### 11.3 `PlaceOrder`

`DB::transaction(..., attempts: 3)`. Locks are always taken in the same order to avoid deadlocks:
cart → variants (by id) → flash sale items (by id) → vouchers (by id) → sequence.

1. Lock the cart row. If it is already `converted`, return its order (idempotent). If
   `checkout_token` already exists on an order, return that order.
2. Refuse while **Pause orders** is on.
3. Run the calculator fresh. Any removed line or notice that changes money means: abort with
   `CheckoutChanged` (the checkout re-renders, highlighting the changes).
4. Compare `hash()` with the posted `totals_hash`; on mismatch, abort with `CheckoutChanged`.
5. Validate the checkout data (§11.1).
6. If the strategy reserves stock: `Inventory::reserve()`, flash sale reservations, voucher
   redemptions (atomic conditional updates; any failure rolls back with a specific message).
7. Upsert the customer by user, otherwise by email (`commerce_customers`); store new addresses for
   signed-in customers who asked to save them.
8. Pick the unique code (bank transfer with the setting on): a random value in the range such that
   `total ± code` isn't the total of another open bank-transfer order in the last 7 days (up to 20
   tries, then any value). Add it as a `unique_code` adjustment.
9. Assign the number (`Numbering::next('order')`, §12.2), `order_key` (40 random characters) and
   `checkout_token`.
10. Insert the order, items (bundle components as child items), adjustments, the first timeline
    event and the payment row (method, amount, deadline, instruction snapshot for manual methods).
11. Mark the cart `converted` with `order_id`.
12. After commit:
    - dispatch `OrderPlaced` (or `QuoteRequested`), which triggers emails, analytics and customer
      stats;
    - for gateways, call `PaymentMethod::start()` **outside** the transaction. If it fails, the
      order stays Pending and the order page offers the pay page;
    - return `afterPlaced()`.

## 12. Orders and quotes

### 12.1 State machine

`OrderStateMachine::transition(Order $order, string $to, TransitionContext $ctx)`:

- **Checks** the transition against the table in SPEC § Orders. Its guards include:
  - cancelling a paid order requires `refunded_total = paid_total`;
  - completing requires paid or COD;
  - quotes only move between quote statuses.
- **Writes**, in a transaction: the status, its timestamp (`paid_at`, `completed_at`,
  `cancelled_at`), `version + 1` and a timeline event (with actor and source).
- **After commit** it dispatches `OrderStatusChanged($order, $from, $to)` plus the specific event
  (`OrderCancelled`, `OrderCompleted`, …).
- **Effects are listeners**, so each is small, testable and skippable by feature:

| Listener | On | Does |
| --- | --- | --- |
| `ReleaseReservations` | `OrderCancelled` | Stock, flash sale quantities, vouchers; idempotent via `meta` flags |
| `GrantDownloads` | `OrderPaid` (or `OrderCompleted`, setting) | Creates download grants |
| `AutoCompleteOrder` | `OrderPaid`, `ShipmentCreated` | Completes per settings |
| `UpdateCustomerStats` | `OrderPaid`, `OrderRefunded`, `OrderCancelled` | Customer counters |
| `RecordSalesCount` | `OrderPaid`, `OrderRefunded` | `sales_count` on products |
| `SendOrderEmails` | the above | §19 |
| `RecordStats` | the above | §20 |

Payment status changes only through `RecordPaymentResult` (§13.2), and fulfilment status only
through shipment actions.

### 12.2 Numbering

- **`Sequences::next(string $key): int`**: `SELECT … FOR UPDATE` on `commerce_sequences` (inserting
  the row if missing), increment, return. SQLite serializes writes, so tests are deterministic.
- **`NumberFormat::render(string $format, int $seq, CarbonInterface $at)`**: fills the tokens
  `{Y} {y} {m} {d} {seq} {seq:N}`. The sequence key comes from the reset rule: `order`,
  `order:2026`, `order:2026-10` or `order:2026-10-17`.
- Orders, quotes and invoices have separate formats and keys. `Commerce::orderNumberUsing()` can
  replace the order numbering entirely.

### 12.3 Editing, manual orders, refunds, shipments

- **`EditOrder`** (unpaid only):
  - replaces lines and recalculates with the calculator in "frozen prices" mode: existing lines keep
    their unit price, new lines use current prices, and overrides need
    `commerce.orders.override-prices`;
  - re-reserves the stock difference;
  - bumps `version`, logs the diff and can notify the customer.
- **`CreateManualOrder`**: the same calculator with `channel = admin`. The payment status is chosen
  by staff: unpaid (sends the pay link) or paid (records a manual payment).
- **`RecordRefund`**: an amount up to `paid_total − refunded_total` and the item quantities. It
  restocks when chosen and updates the payment and order status (via `RecordPaymentResult` and the
  state machine), then dispatches `OrderRefunded`. Gateway refunds call `SupportsRefunds::refund()`
  first.
- **`CreateShipment`** / `UpdateShipment` / `MarkDelivered`: item quantities can't exceed what's
  left to fulfil; they update `fulfilled_quantity` and the order's fulfilment status. Couriers come
  from presets (`config('commerce.shipping.couriers')`: key, name, tracking URL with `{tracking}`)
  or free text.

### 12.4 Quotes

- A quote is an order row with `type = quote` and `number = null`. `quote_number` is assigned from
  its own format.
- **`RespondToQuote`** (permission `commerce.quotes.respond`): staff edit lines, unit prices,
  shipping and discount, set `quote_valid_until`, and send. The status becomes `quoted` and the
  customer gets the "quote ready" email with `/quote/{order_key}`.
- **`AcceptQuote`** (customer, on the quote page):
  - re-checks availability;
  - reserves stock (like `PlaceOrder` step 6, prices frozen as quoted);
  - assigns the order number, sets `type = order`, status Pending payment (or Processing for a zero
    total);
  - records `QuoteAccepted` then `OrderPlaced`, and sends the customer to the pay page when
    Payments is active.
- **`DeclineQuote`**: customer or staff.
- **Expiry**: `commerce:tick` expires quotes past `quote_valid_until`.

## 13. Payments

### 13.1 Contract

```php
namespace Sunrice\Commerce\Payments\Contracts;

interface PaymentMethod
{
    public static function key(): string;                          // 'bank_transfer', 'midtrans_snap'
    public function label(): string;                               // admin name
    public function settingsSchema(): array;                       // Sunrice field definitions
    public function settingsRules(): array;
    public function isAvailable(PaymentContext $ctx): bool;        // amount, currency, region, roles, shipping
    public function fee(PaymentContext $ctx): ?Fee;                // optional surcharge
    public function deadline(Order $order): ?\DateTimeInterface;   // unpaid deadline
    public function start(Order $order, Payment $payment): PaymentStart;
    public function instructionsView(): ?string;                   // partial for order page and email
}

// PaymentStart is one of:
//   PaymentStart::instructions(array $snapshot)
//   PaymentStart::redirect(string $url)
//   PaymentStart::embedded(string $view, array $data)   // e.g. a Snap token
//   PaymentStart::paid(PaymentResult $result)

interface HandlesReturn      { public function handleReturn(Request $request, Payment $payment): PaymentResult; }
interface HandlesWebhooks    { public function parseWebhook(Request $request): WebhookEvent; }   // verifies; throws InvalidWebhook
interface SupportsRefunds    { public function refund(Payment $payment, int $amount, string $reason): RefundResult; }
interface SupportsCancel     { public function cancel(Payment $payment): void; }
interface SupportsStatusCheck{ public function check(Payment $payment): PaymentResult; }
```

- `PaymentResult` holds the status (`paid` | `pending` | `failed` | `expired` | `cancelled` |
  `refunded`), amount, reference, `occurredAt` and raw data.
- `WebhookEvent` holds the provider's event id (for idempotency), the payment reference and the
  `PaymentResult`.
- Methods are registered with `Commerce::registerPaymentMethod(Class::class)`. Their stored
  settings (`payments.methods.{key}`) are rendered from `settingsSchema()` in Settings → Payments.

### 13.2 One writer for payment state

`RecordPaymentResult::handle(Payment $payment, PaymentResult $result, Actor $actor)` is the only
code that changes `commerce_payments.status` and `commerce_orders.payment_status`, `paid_total`
and `refunded_total`.

1. It locks the payment and the order.
2. It ignores results that don't move the state forward. For example, `pending` after `paid` is
   ignored, and the same `(reference, status)` twice is a no-op.
3. It updates the rows and adds a timeline event.
4. It calls the state machine: Paid → Processing (or Completed for digital-only orders, per
   settings); Failed → Failed; Expired → Cancelled.
5. After commit it dispatches `PaymentSucceeded`, `PaymentFailed` or `PaymentExpired` and
   `OrderPaid`.

Gateways, staff "Mark as paid", confirmation approvals and expiries all go through it.

### 13.3 Webhooks, return, expiry

- `POST /commerce/webhooks/{method}` is registered **without** the `web` group: no session and no
  CSRF, with a `throttle:commerce-webhooks` limit. It:
  1. stores a `commerce_webhook_calls` row;
  2. calls `parseWebhook()`, which verifies the signature;
  3. de-duplicates on `(method, event_id)`;
  4. finds the payment by reference;
  5. calls `RecordPaymentResult`;
  6. answers `200` quickly (heavy work runs after the response).
- `GET /order/{key}/payment/return` calls `handleReturn()` and redirects to the order page.
- `commerce:tick` expires unpaid payments past `expires_at`. It skips `awaiting_confirmation`; for
  gateways with `SupportsStatusCheck`, it checks once before expiring.

### 13.4 Manual methods (`manual_payments`)

- **`BankTransfer`**:
  - settings: accounts (repeater: bank preset, account number, holder, branch, logo asset),
    instructions per language, unique code (off / add / subtract, range), confirmation (required /
    optional / off), deadline hours;
  - `start()` returns instructions with the account snapshot and the amount to pay (total including
    the unique code).
- **`PaymentInstructions`**: a title, an image asset (QRIS) and text. You can add several of these
  method instances with their own keys (`instructions_qris`, `instructions_dana`). Methods are
  instances: `Commerce::registerPaymentMethod()` registers a class; settings may hold several
  instances of an "instances" class.
- **`CashOnDelivery`**: an optional fee, allowed destinations and shipping methods. It starts the
  order as Processing with the payment pending.

### 13.5 Payment confirmations

- **Customer side**: `SubmitPaymentConfirmation` validates the fields and stores the proof on
  `commerce.payments.proof_disk` (default `local`, private) under
  `commerce/proofs/{order}/{random}.{ext}`, after checking type and size. Images are re-encoded
  through `intervention/image` (a Sunrice dependency) to drop metadata and active content. Then:
  - payment status → `awaiting_confirmation`, and `expires_at` is paused;
  - `PaymentConfirmationSubmitted` → the staff email and the admin badge count.
- **Staff side**:
  - `ApproveConfirmation` calls `RecordPaymentResult(paid)` with the confirmation as reference. If
    the amount is lower than expected, it asks for an explicit "approve anyway".
  - `RejectConfirmation` returns the payment to pending, restores the deadline (extended by the
    time spent in review) and emails the customer.
- **Proof files** stream through an authorized admin route. `commerce:prune` deletes proofs older
  than `payments.proof_retention_days`.

## 14. Shipping

### 14.1 Contract and built-ins

```php
interface ShippingMethodType
{
    public static function key(): string;            // 'free' | 'flat' | 'weight' | 'pickup' | 'rajaongkir' …
    public function label(): string;
    public function settingsSchema(): array;
    public function settingsRules(): array;
    /** @return array<int, ShippingRate> */
    public function rates(ShippingRequest $request, ShippingMethod $method): array;
}

interface TracksShipments { public function track(Shipment $shipment): TrackingInfo; }
interface BooksShipments  { public function book(Order $order, Shipment $shipment): BookingResult; }
```

- **`ShippingRequest`** carries:
  - the origin (store address) and the destination `Address`;
  - a `Package`: lines with weight, dimensions, quantity and value; total actual weight; total
    volumetric weight with the method's divisor;
  - subtotal after discounts, currency, customer and a COD flag.
- **`ShippingRate`** has the method id, a service code, a label, the cost, ETD text and meta.
- **Built-ins**:
  - `FreeShipping`: always, a minimum subtotal, or requires a free-shipping voucher.
  - `FlatRate`: per order plus per item.
  - `WeightBased`: per kg with a tolerance and minimum, or a table; the volumetric option uses
    `max(actual, volumetric)`.
  - `LocalPickup`: locations; the rate meta carries the location, and checkout skips the address.

### 14.2 Zones

`ZoneMatcher::match(Address $destination)`:

- Zones are tried by `position`, then the "everywhere else" zone.
- A zone region matches if `country` is equal and (`region_code` is null, or the address's
  province, city, district or village code equals it or starts with it followed by a dot).
- The first matching zone gives its active methods. `ShippingManager::rates()` asks each method's
  type for rates and applies the availability filters (min/max subtotal, max weight).
- Carrier types cache rates for 10 minutes by a hash of the request.
- Carrier location ids live in `commerce_region_mappings` (`RegionMapping::for('biteship',
  '32.73.01')`).

## 15. Taxes

- `TableRateTaxCalculator`:
  - picks rates by the tax address (shipping / billing / store, per settings), class, country and
    province (most specific first, by priority);
  - computes per line on the line total after discounts;
  - compound rates apply on top of earlier ones;
  - shipping is taxed by rates flagged `shipping`.
- **Inclusive prices**: `tax = round(amount × rate ÷ (10000 + rate))`; the net is derived.
  **Exclusive prices**: `tax = round(amount × rate ÷ 10000)`.
- Adjustments are stored per line with the rate snapshot, and order totals sum them.
- Display is a presentation setting on `ProductView` (incl./excl. with suffix).

## 16. Customers and authentication

### 16.1 The `commerce` guard

- In `register()`, if `auth.guards.{commerce.auth.guard}` (default `commerce`) is not defined, the
  provider adds `['driver' => 'session', 'provider' => <the provider of sunrice.auth.guard>]`. The
  storefront therefore uses the same user table as the admin but a different session key and
  remember cookie.
- Roles stay on Sunrice's guard. The Customer role is created with
  `guard_name = sunrice.auth.guard`, and spatie checks permissions by the model's default guard,
  so `$user->can()` works whichever guard signed the user in.
- `CurrentCustomer` resolves `Auth::guard('commerce')->user()` to a `Customer`, creating the
  customer row on first use. Guests resolve to `null`.
- Middleware `commerce.auth` redirects guests to `/account/login`.
- **Shared-guard mode** (`commerce.auth.guard` = `sunrice.auth.guard`): `EnsureNotStaff` refuses
  code and Google sign-ins for users who `can('sunrice.access-admin')`.
- **Signing out** of the storefront regenerates the session id and logs out the `commerce` guard
  only. It doesn't invalidate the whole session, so the admin sign-in and the cart cookie survive.

### 16.2 Sign-in flows

- **Password**: `LoginCustomer` uses the `commerce-login` throttle, keyed like Sunrice's
  `LoginThrottle` (email+IP, IP, account).
- **Password reset**: Laravel's broker (`auth.passwords.users`) with commerce's own notification
  and storefront URL:
  `Password::broker()->sendResetLink([...], fn ($user, $token) => $user->notify(new CustomerResetPassword($token)))`.
- **Email verification**: commerce's own signed route (`/account/verify/{id}/{hash}`), setting
  `email_verified_at` on the user. The host model doesn't need `MustVerifyEmail`.
- **One-time code** (`passwordless_login`), with `spatie/laravel-one-time-passwords` (PHP 8.4). The
  host user model uses its `HasOneTimePasswords` trait; `commerce:install` adds it, and store health
  reports it when missing.
  1. **Request** (`RequestLoginCode`, throttled `commerce-login-code`: 1/min per email, 10/hour per
     IP):
     - finds the user by email;
     - calls `$user->createOneTimePassword(minutes: settings 'accounts.code_minutes', default 10)`
       (only one active code per user);
     - sends commerce's own `CustomerLoginCode` notification (storefront branding, the customer's
       language).

     Commerce does not change the package's global `notification` config, so a host app can keep
     using the package for its own purposes. Unknown emails get the same response, with a "Create
     an account" link.
  2. **Consume** (`ConsumeLoginCode`):
     - calls `$user->consumeOneTimePassword($code)`, which compares in constant time, enforces the
       same IP and user agent, allows 5 tries per minute, and deletes the code when used;
     - on `Ok`, signs in with `Auth::guard('commerce')->login($user, $remember)`, marks the email
       verified and runs `LinkGuestOrders`;
     - maps other results (`IncorrectOneTimePassword`, `OneTimePasswordExpired`, `DifferentOrigin`,
       `RateLimitExceeded`, `NoOneTimePasswordsFound`) to commerce's own Indonesian and English
       messages.

     **Never** call the package's `attemptLoginUsingOneTimePassword()`: it uses `auth()->login()`,
     the default guard, which is the admin's guard.
  3. **Passwordless registration**: name and email (plus phone if required) create an unverified
     user with the Customer role; the code from step 1 then verifies and signs in.
- **Google** (`google_login`, `laravel/socialite`):
  1. `/account/login/google` redirects to Google; the callback (one fixed URL, without a language
     prefix) reads the Google user.
  2. A link in `commerce_social_accounts` signs that user in.
  3. Otherwise, a verified Google email matching a user links and signs in; otherwise a user is
     created (if registration is open) with the Customer role and `email_verified_at`.
- `LinkGuestOrders` runs after any verified-email event and sets `customer_id` / `user_id` on past
  guest orders with that email.

### 16.3 Customers in the admin

- With **U3**, the provider registers `Sunrice::usersQueryUsing()`. It hides users whose roles are
  all customer roles (`accounts.customer_roles`, default `[Customer]`), so Users lists staff only.
- Shop → Customers works on `commerce_customers` joined to users.
- `AnonymizeCustomer` does the following, logged:
  - replaces name, email and phone with placeholders on the customer, the user (if any, also
    disabling sign-in) and the orders' snapshots;
  - deletes addresses, wishlists, tokens and social links;
  - keeps money columns and items.

## 17. Digital delivery

- **Uploads** go through an admin endpoint used by the product field control. They are stored on
  `commerce.downloads.disk` (default `local`) under `commerce/downloads/{random}/{filename}`, as
  `commerce_download_files` rows with `attached = false` until a projection references them.
  `commerce:prune` deletes unattached files older than 7 days.
- **`GrantDownloads`**: for each downloadable item, a grant per file (variant files, else product
  files), with limits and expiry from the product's delivery settings.
- **`DeliverDownloads`** (after granting):
  - email links (`/downloads/{token}`), and attachments when the attachment mode is on and the total
    size ≤ `digital.attachment_max_mb`;
  - the account library lists the grants of the signed-in customer's orders.
- **`DownloadController`**:
  - checks the token, revocation, expiry and remaining count;
  - increments the count and logs the download;
  - streams from the disk (`Storage::download`, or a 5-minute `temporaryUrl()` redirect when the
    disk supports it);
  - external URL grants redirect.
- Grants keep working while `digital` is inactive (SPEC rule 5); only new grants stop.

## 18. Documents

- **`Documents`** service: `invoice($order)`, `packingSlip($order|$orders)`, `quotation($order)`.
  Each returns PDF bytes (`DocumentRenderer`) or HTML for printing.
- **`DompdfRenderer`** (`barryvdh/laravel-dompdf`) is the default. The templates use tables, not
  flexbox or grid, because dompdf supports CSS 2.1. Sites can bind another renderer (for example
  spatie/laravel-pdf with Gotenberg).
- **Views**: `commerce::documents.invoice`, `.packing-slip`, `.quotation`, publishable with
  `commerce-documents`. They are rendered in the order's language.
- **Numbers**: `commerce_documents` holds them. The invoice number is assigned at placement or at
  payment (setting) through `Numbering::next('invoice')`.
- **Caching**: generated PDFs are stored privately (`commerce/documents/{order_id}/…`) with the
  `order_version` they were made from, and regenerated when the order's `version` changes.
- **Routes**:
  - admin: single and bulk (`documents.view`; bulk packing slips stream one PDF);
  - customer: the invoice from the order page, by order key, when the setting allows.

## 19. Notifications

- **`CommerceNotification`** (base) extends Laravel's `Notification`, implements `ShouldQueue` and
  uses `locale($order->locale)`. Its subject and heading come from settings per locale, and it uses
  a markdown view with the store's branding. Attachments come from `attachments()`, which asks
  `Documents` and the digital delivery rules.
- **`Notifier::send(string $key, Order|Customer|Variant $subject, array $context = [])`**:
  1. checks the module and the email's switch;
  2. resolves the recipients: the customer email, or for staff emails the configured addresses plus
     users with the chosen roles (unique by email);
  3. dispatches;
  4. writes an `email` timeline event for order emails.
- **Email keys** (registered in an email registry; packages add theirs with
  `Commerce::registerEmail()`):
  - customer: `order_received`, `payment_confirmation_received`, `payment_rejected`,
    `payment_received`, `order_shipped`, `order_completed`, `order_cancelled`, `order_refunded`,
    `customer_note`, `downloads_ready`, `quote_received`, `quote_ready`, `account_welcome`,
    `verify_email`, `login_code`, `password_reset`;
  - staff: `staff_new_order`, `staff_payment_confirmation`, `staff_order_cancelled`,
    `staff_new_quote`, `staff_low_stock`, `staff_out_of_stock`, `staff_deletion_request`.
- **Settings → Emails** shows each email: switch, recipients (staff), subject and heading per
  language, attachments, a preview rendered with the latest order (or a sample) and "send test".
- Account security emails (`verify_email`, `login_code`, `password_reset`) can't be switched off
  while their feature is active.

## 20. Analytics

- **`StatsRecorder`** (a queued listener on `OrderPlaced`, `OrderPaid`, `OrderRefunded`,
  `OrderCancelled`, `CartItemAdded`, `CheckoutStarted`, `QuoteRequested`) recomputes the affected
  **day** row of `commerce_stats_daily` and the product rows of `commerce_product_stats_daily` from
  the source tables, with one grouped query per day. Recomputing is idempotent, so retries and
  reorderings are safe.
- `commerce:stats --rebuild [--from=]` recomputes history; the scheduler re-runs yesterday nightly.
- **Views**:
  - recorded on product page render after the response (`app()->terminating`);
  - skipped for previews, staff (signed in to the admin guard), bots (user-agent list) and when
    `analytics.track_views` is off;
  - stored as upsert-increments on `commerce_product_stats_daily`.
- **CTA clicks**: `/go/{type}/{product}` (`type` = `whatsapp` | `external` | `inquiry`) increments
  and redirects. External targets are only the product's own links (no open redirect).
- **Days** follow the site timezone (Sunrice's Settings → General).
- **Reports**:
  - `Reports\*` classes return series and tables from the daily tables, with drill-down into
    orders;
  - CSV export through `spatie/simple-excel`;
  - dashboard KPIs are Inertia deferred props, so the page shell renders first.

## 21. Admin

### 21.1 Routes and pages

- `routes/admin.php` is loaded with `Sunrice::adminRoutes(fn () => require …)`. All routes are under
  `{admin}/commerce`. Each route has `commerce.feature:<key>` middleware, and each controller method
  calls `Gate::authorize('commerce.<area>.<action>')`.
- Inertia pages (React):

| Page | Purpose |
| --- | --- |
| `Commerce/Dashboard` | Checklist, health, to-do, KPIs, charts, recent orders, extension widgets |
| `Commerce/Orders/Index`, `Show`, `Create` | Orders and quotes (type filter), detail with panels, manual orders |
| `Commerce/Confirmations/Index` | Payment confirmation queue with proof viewer |
| `Commerce/Customers/Index`, `Show` | Customers |
| `Commerce/Products/Index` | Commerce view of products; rows open Sunrice's entry editor |
| `Commerce/Inventory/Index` | Variant stock with inline adjust and history drawer |
| `Commerce/Vouchers/Index`, `Edit` | Vouchers and automatic discounts |
| `Commerce/FlashSales/Index`, `Edit` | Flash sales with item picker |
| `Commerce/PricingRules/Index`, `Edit` | Pricing rules |
| `Commerce/Reports/Show` | One component for every report (`report` prop) |
| `Commerce/Settings/Section` | Schema-driven settings section (General, Catalog, Checkout, Accounts, Taxes, Documents and extension sections) |
| `Commerce/Settings/Features` | Feature switches with dependency explanations |
| `Commerce/Settings/Payments` | Method list (order, enable) and per-method settings |
| `Commerce/Settings/Shipping` | Zones list, zone editor (regions, methods) |
| `Commerce/Settings/Emails` | Email list, editor, preview, test |

- **Settings pages** render Sunrice's `SettingsTabs` (U1, `window.Sunrice.components.SettingsTabs`)
  with "Store" current, plus commerce's section menu.
- **Badges** (orders to process, confirmations waiting) use U7's navigation badges when available.

### 21.2 The admin bundle

- **Source**: `resources/js/admin/` (TypeScript, React 19 types). Vite builds it in library mode to
  `dist/admin.js` (one ES module) and `dist/admin.css`. The provider registers both with
  `Sunrice::registerAdminScript('vendor/commerce/admin.js?v=…')`; they are published with the
  `commerce-assets` tag.
- **React and Inertia** are not bundled. `react`, `react-dom` and `react/jsx-runtime` resolve to
  small shim modules that re-export `window.Sunrice.React` / `ReactDOM`, and Inertia comes from
  `window.Sunrice.inertia`. Libraries that import `react` (recharts, dnd-kit) use the same shims.
  `react-is` is bundled.
- **CSS** is Tailwind 4 utilities only: no preflight, the prefix `cm:` (avoiding clashes with
  Sunrice's classes) and theme tokens mapped to Sunrice's CSS variables (`--background`,
  `--primary`, …), so light/dark and the branding accent follow the admin. Prefer
  `window.Sunrice.ui` and `components` (U10 adds more primitives).
- **`window.SunriceCommerce`** (API version 1) is exposed by the bundle:

  ```ts
  window.SunriceCommerce = {
      version: 1,
      registerOrderPanel(name, Component),       // extra panel on the order page
      registerDashboardWidget(name, Component),  // store dashboard card
      registerSettingsSection(name, Component),  // custom-UI settings section
      registerProductTab(name, Component),       // extra tab in the Product data field
      formatMoney(amount), parseMoney(text),
      components: { MoneyInput, RegionPicker, VariantPicker, StatusBadge, KpiCard, Chart },
  };
  ```

  Extension scripts may load before it, so they queue:

  ```js
  (window.SunriceCommerceQueue ||= []).push((api) => api.registerOrderPanel(...));
  ```

  The bundle drains the queue when it loads.
- **Field controls** registered with `window.Sunrice.registerField()`:
  - `commerce_product`: the Product data editor, with tabs General, Variants, Inventory, Shipping,
    Digital, Bundle, Bulk pricing, Advanced and extension tabs;
  - `commerce_money`, `commerce_region`, `commerce_variant_picker`, `commerce_datetime_range`.

  The product control reads the entry id from Inertia page props to call `api/sku-check` and
  `api/stock`. It shows live stock read-only with an Adjust dialog, and shows `sync_error` when the
  last projection failed.

### 21.3 Tables

- List pages use `components.DataTable`. Their controllers build props with Sunrice's `TableQuery`
  (`searchable`, `filterable`, `sortable`, `paginate()`, `meta()`) over commerce models.
- Column preferences use Sunrice's table-preferences endpoint with table keys `commerce.orders`,
  `commerce.customers` and so on.
- Date-range filters use U10's `date_range` filter type. Until then, a small filter bar above the
  table edits the same query string.

## 22. Storefront

### 22.1 Routes

| File | Contents |
| --- | --- |
| `routes/storefront.php` | Store pages; localized; `web` + `SetFrontendLocale` |
| `routes/account.php` | `/account/*`; localized; `commerce.auth` where needed |
| `routes/api.php` | JSON for `commerce.js`: `/commerce/api/*`; `web` group (session + CSRF); throttled |
| `routes/webhooks.php` | `/commerce/webhooks/{method}`; stateless (§13.3) |

- `Commerce::localizedRoutes()` registers each storefront and account group twice: unprefixed with
  names `commerce.*`, and under `{locale}` (only non-main available locales) with names
  `commerce.*.locale`. `Sunrice::frontendRoutes()` (U12) replaces it when available.
- `commerce_url('cart', [...])` picks the right name for the current language.
- The routes are registered in `boot()`, so they win over Sunrice's `Route::fallback`. Paths come
  from `commerce.storefront.paths` and can be changed per site:
  - `cart`, `checkout`, `order/{key}`, `order/{key}/pay`, `confirm-payment`, `track-order`,
    `quote/{key}`;
  - `account/…`, `wishlist`, `wishlist/{share}`, `compare`, `brands`, `flash-sale/{slug?}`;
  - `downloads/{token}`, `go/{type}/{product}`.

### 22.2 Controllers, views and components

- Controllers are thin: they call actions and view models. Views resolve app-first:
  `view()->first(['commerce.cart', 'commerce::storefront.cart'])`.
- Private pages (cart, checkout, order, account, wishlist, compare) get `X-Robots-Tag: noindex` and
  pass `:noindex="true"` to `<x-sunrice::seo>`.
- Body classes through `Sunrice::bodyClassUsing()`: `page-commerce commerce-{page}`.
- **Components**: logic only, data on `$component` like Sunrice's components (each listed in SPEC §
  Storefront).
  - `<x-commerce::products>` takes `collection`, `category`, `brand`, `tag`, `featured`,
    `on-sale`, `per-page`, `limit`, `order-by` and `ids`.
  - `<x-commerce::product-filter>` takes `filters`, `sorts` and `per-page`, mirroring
    `<x-sunrice::entry-filter>`'s shape (`$component->entries`, `filters`, `sorts`, `active`,
    `clearUrl`).
- **Slots**: `<x-commerce::slot name="checkout.before_submit" :order="$order" />` renders the
  partials registered with `Commerce::registerStorefrontSlot()`. The published templates include
  slots at:
  - `head`;
  - `product.before_add_to_cart`, `product.after_add_to_cart`, `product.after_summary`;
  - `cart.after_items`, `cart.totals_after`;
  - `checkout.after_contact`, `checkout.after_shipping`, `checkout.after_payment`,
    `checkout.before_submit`;
  - `order.after_summary`, `account.overview`, `mini_cart.footer`.

### 22.3 Published templates and theme

`php artisan vendor:publish --tag=commerce-templates` copies:

```
resources/views/sunrice/products/show.blade.php            product page
resources/views/sunrice/products/index.blade.php           Shop page (collection listing)
resources/views/sunrice/taxonomies/product_categories/show.blade.php
resources/views/sunrice/taxonomies/brands/show.blade.php
resources/views/sunrice/taxonomies/product_tags/show.blade.php
resources/views/commerce/{cart,checkout,order,pay,confirm-payment,track-order,quote,
                          brands,flash-sale,wishlist,compare}.blade.php
resources/views/commerce/account/{overview,orders,order,downloads,addresses,profile,
                                  login,register,forgot-password,reset-password,link,code}.blade.php
resources/views/commerce/partials/{product-card,price,add-to-cart,variant-picker,stock,
                                   mini-cart,cart-lines,totals,filters,address-form,
                                   region-select,flash-sale,tier-table,wishlist-button,
                                   compare-button,account-nav,structured-data,…}.blade.php
public/commerce-theme/commerce.css · commerce.js
```

- Each file starts with a comment listing the variables and components it uses, as in Sunrice's
  starter templates.
- Templates extend `sunrice.layouts.app` when it exists, else commerce's minimal layout.
- `commerce.js` is plain ES2019 with no build step. It works from `data-commerce-*` attributes and
  `<script type="application/json">` data, and dispatches `commerce:cart-updated` on `document` for
  themes to listen to.

## 23. MCP tools

- The tools live in `src/Mcp/Tools/*Tool.php`, extend `Sunrice\Mcp\Tools\SunriceTool` and are
  registered with `Sunrice::registerMcpTool()`.
- Each tool:
  - implements `shouldRegister()`: `ai_tools` active, its own module active, and the token user has
    the permission;
  - calls the same actions as the admin, so validation, the state machine and the activity log
    apply, with source `ai`;
  - returns compact JSON with money as integers plus a formatted string.
- **Instructions** (U6) are appended to the server's instructions:

  > Store tools start with get_store_info. Ask the user before approving payments, refunding,
  > cancelling orders, switching store features or changing many prices. Products are Sunrice
  > entries: change their content and Product data with update_entry (field `product`); get_product
  > shows the field's shape.

## 24. Extension contracts

### 24.1 `Commerce` registration API (the 1.x public surface)

```php
Commerce::registerFeature(Feature $feature);
Commerce::registerPaymentMethod(string $class);
Commerce::registerShippingMethodType(string $class);
Commerce::registerPriceCandidateProvider(string $class, int $priority = 100);
Commerce::registerDiscountProvider(string $class, int $priority = 100);
Commerce::registerCalculationStage(string $class, int $priority);
Commerce::registerCheckoutCompletion(string $class);
Commerce::checkoutFieldsUsing(callable $fields);     // fn (CheckoutContext $ctx): array of Sunrice field definitions
Commerce::registerSettingsSection(SettingsSection $section);
Commerce::registerAccountPage(string $key, string $label, string $routeName, ?string $feature = null);
Commerce::registerStorefrontSlot(string $slot, string $view, ?string $feature = null);
Commerce::registerOrderPanel(string $name, ?string $can = null, ?string $feature = null);
Commerce::registerDashboardWidget(string $name, Closure $props, ?string $can = null, ?string $feature = null);
Commerce::registerEmail(string $key, string $notificationClass, array $defaults);
Commerce::registerHealthCheck(string $class);
Commerce::registerCourier(string $key, string $name, ?string $trackingUrl);
Commerce::orderNumberUsing(callable $generator);
```

Read-side helpers are public too: `Commerce::features()`, `Commerce::settings()`,
`Commerce::cart()`, `Commerce::customer()`, `Commerce::money(int $amount)`.

### 24.2 Contracts

| Contract | For |
| --- | --- |
| `Payments\Contracts\PaymentMethod` (+ `HandlesReturn`, `HandlesWebhooks`, `SupportsRefunds`, `SupportsCancel`, `SupportsStatusCheck`) | Gateways (§13.1) |
| `Shipping\Contracts\ShippingMethodType` (+ `TracksShipments`, `BooksShipments`) | Couriers (§14.1) |
| `Pricing\Contracts\PriceCandidateProvider` | Member prices, price lists |
| `Pricing\Contracts\DiscountProvider` | Loyalty points, gift cards, cashback |
| `Pricing\Contracts\CalculationStage` | Extra fees, rounding rules |
| `Checkout\Contracts\CheckoutCompletion` | New checkout endings (e.g., Telegram, marketplace) |
| `Taxes\Contracts\TaxCalculator` | External tax engines |
| `Inventory\Contracts\Inventory` | External stock (ERP) |
| `Documents\Contracts\DocumentRenderer` | Other PDF engines |

```php
interface DiscountProvider
{
    public function key(): string;
    /** Called in the Discounts stage; returns adjustments with per-line allocations. */
    public function apply(CalculationState $state): DiscountResult;
    /** Called inside PlaceOrder's transaction; reserve what you gave (e.g. deduct points). */
    public function commit(Order $order, DiscountResult $result): void;
    /** Called when the order is cancelled or expires. */
    public function release(Order $order): void;
}
```

### 24.3 What an extension package looks like

```
sunrice/commerce-midtrans
├── composer.json          requires sunrice/commerce ^1.0, midtrans/midtrans-php
├── config/commerce-midtrans.php       keys from .env
├── src/MidtransServiceProvider.php    Commerce::registerFeature(new Feature('midtrans', requires: ['payments']));
│                                      Commerce::registerPaymentMethod(MidtransSnap::class);
├── src/MidtransSnap.php               implements PaymentMethod, HandlesWebhooks, SupportsRefunds, SupportsStatusCheck
└── resources/views/instructions.blade.php
```

- **Loyalty**:
  - a `DiscountProvider` (redeem points) and listeners on `OrderPaid` / `OrderCompleted` (earn) and
    `OrderRefunded` / `OrderCancelled` (reverse);
  - an account page via `registerAccountPage('points', …)`, a slot `checkout.after_payment` for
    the "use points" control, and a dashboard widget;
  - its ledger tables are keyed by `customer_id`.
- **Couriers** (RajaOngkir, Biteship): a `ShippingMethodType` with live rates, a mapping importer
  filling `commerce_region_mappings`, and `TracksShipments`.

The workbench contains a fake gateway, a fake courier and a fake loyalty provider. They prove the
contracts in tests (§28).

## 25. Events

All events are in `Sunrice\Commerce\Events`, are dispatched after commit, and carry models (and
small value objects):

| Area | Events |
| --- | --- |
| Catalog | `ProductSynced`, `ProductSyncFailed`, `StockChanged`, `StockLow`, `StockOut`, `StockBackIn` |
| Cart | `CartItemAdded`, `CartItemUpdated`, `CartItemRemoved`, `CartMerged`, `VoucherApplied`, `VoucherRemoved`, `CheckoutStarted` |
| Orders | `OrderPlaced`, `OrderStatusChanged`, `OrderPaid`, `OrderOnHold`, `OrderCancelled`, `OrderCompleted`, `OrderRefunded`, `OrderEdited`, `OrderNoteAdded`, `ShipmentCreated`, `ShipmentDelivered` |
| Quotes | `QuoteRequested`, `QuoteSent`, `QuoteAccepted`, `QuoteDeclined`, `QuoteExpired` |
| Payments | `PaymentStarted`, `PaymentSucceeded`, `PaymentFailed`, `PaymentExpired`, `PaymentConfirmationSubmitted`, `PaymentConfirmationApproved`, `PaymentConfirmationRejected` |
| Customers | `CustomerRegistered`, `CustomerSignedIn` (method), `CustomerEmailVerified`, `CustomerUpdated`, `AccountDeletionRequested`, `CustomerAnonymized` |
| Digital | `DownloadsGranted`, `DownloadAccessed` |
| Promotions | `VoucherRedeemed`, `VoucherReleased`, `FlashSaleStarted`, `FlashSaleEnded` |
| Settings | `StoreSettingsSaved`, `FeatureToggled` |

## 26. Caching and performance

- **Catalog version**:
  - `commerce:catalog_version` in Sunrice's cache store;
  - bumped on product sync, price rule, flash sale, tax, attribute and catalog settings changes,
    and at flash sale boundaries;
  - used in the keys of facet counts and the term trees that rules need;
  - **not** bumped by stock or orders.
- **Never cached**: carts, prices for a customer, stock, orders. They are cheap indexed reads.
- **Sunrice's content version** is never bumped by hot paths. Saving store settings bumps it (via
  `Setting::set()`), which is rare.
- **Query budgets**, guarded by tests that count queries:
  - product listing: at most +5 queries over Sunrice's own;
  - product page: at most +8;
  - cart page: at most 12 total;
  - checkout render: at most 20;
  - placing an order: no N+1 per line.
- **Full-page cache**: commerce registers a U11 hook that excludes product, product-taxonomy and
  store pages, and any request with a commerce session or cart cookie. Without U11, store health
  warns when `sunrice.cache.full_page` is on.
- **Regions** are cached forever per dataset version; the JSON endpoint sends long-lived cache
  headers.

## 27. Security

- **Authorization**: every admin route and MCP tool authorizes with commerce permissions.
  Policies cover models: orders, customers, vouchers, flash sales, rules, confirmations, downloads,
  documents. All extend `FeatureGatedPolicy`.
- **Customers' own data**: account routes check `customer_id` ownership. Guests can reach an order
  only through `order_key` (40 random characters; lookups need the number plus email, and are
  rate-limited).
- **Input**:
  - Form requests whitelist fields, and models use `$fillable`.
  - Prices, totals and discounts are never read from input. Staff overrides are separate, permission
    checked and logged.
- **Uploads**:
  - Payment proofs accept jpg, png, webp and pdf up to 5 MB. Images are re-encoded; PDFs are
    stored as-is and served with `Content-Disposition: attachment`.
  - Digital files are admin uploads on private disks, served only through tokens.
  - Nothing user-uploaded is ever served from a public disk.
- **Rate limits**: `commerce-login`, `commerce-login-code`, `commerce-register`,
  `commerce-voucher`, `commerce-cart` (60/min), `commerce-checkout` (10/min), `commerce-confirm`
  (5/min), `commerce-lookup` (5/min), `commerce-webhooks`.
- **Honeypot** (`spatie/laravel-honeypot`) on public forms, plus captcha (U13) when configured.
- **Redirects**: `/go/*` only redirects to the product's stored links or `wa.me` with configured
  numbers. Return URLs after sign-in must be relative.
- **WhatsApp messages** are URL-encoded, and template placeholders are filled from escaped values.
- **Secrets** stay in `.env`. Settings pages never echo them; health only says "set" or "missing".
- **Staff and customers are separated** by the guard (§16.1).
- **Privacy**: anonymization, proof retention, download logs and IPs are prunable
  (`commerce.privacy.*`).

## 28. Testing

- **Pest with Orchestra Testbench.** `tests/TestCase.php` loads Sunrice's provider and its
  dependencies (Inertia, permission, honeypot, sitemap, MCP), then the commerce provider. The DB
  matrix is SQLite, MySQL 8 and PostgreSQL 16, on PHP 8.4 and 8.5. Commerce needs 8.4, while
  Sunrice's own CI also covers 8.3.
- **Helpers** in `tests/Pest.php`:
  - `actingAsShopManager()`, `actingAsCustomer()`;
  - `product([...])`: creates a Sunrice entry with product data, publishes it and projects it;
  - `cart()->add(...)`, `placeOrder([...])`;
  - `setSellingMode()`, `withFeatures([...])`, `withoutFeatures([...])`.
- **Pricing scenarios** are table-driven: PHP arrays in `tests/Fixtures/pricing/*.php` give lines,
  rules, sales, vouchers, shipping, taxes and expected totals and allocations. One test runs them
  all.
- **The state machine** is tested against every row of the transition table, allowed and refused.
- **Concurrency**: conditional updates are proved by asserting affected rows (stock, sale
  quantities, voucher uses, sequences). MySQL and PostgreSQL CI run two connections with
  overlapping transactions for `Sequences` and `Inventory::reserve`.
- **Feature matrix** (§4.6) and **query budgets** (§26).
- **Contracts**: workbench fakes (gateway with redirect and webhook, courier with live rates,
  loyalty discount provider) drive end-to-end tests of the extension points.
- **Emails and documents**: rendered HTML assertions, and PDFs are generated (byte check) for each
  document type.
- **Frontend**: `npm run typecheck && npm run build` for the admin bundle; `node --test` for pure
  helpers (money parsing, variant matching, region cascade) in `tests/Frontend/*.test.mjs`, like
  Sunrice.
- **End to end** (`tests/Feature/EndToEndTest.php`): install, scaffold, create products with
  variants and a bundle, then for each selling mode browse, filter, add to cart, apply a voucher,
  check out with an Indonesian address and shipping zone, confirm the transfer, approve it, ship,
  complete, refund, and download a digital file.

## 29. Observability and store health

- **Activity log**: every staff change through commerce actions calls `ActivityLogger::record()`
  with type `order`, `voucher`, `flash_sale`, `price_rule`, `customer`, `stock`, `store_setting` or
  `feature`, listing the changed fields (never values for secrets).
- **Order timeline**: the customer-facing history plus internal events.
- **Health checks** (`Health\HealthCheck`, registered and extendable) return ok, warning or error
  with a message and a fix link. They are shown on the dashboard, and `php artisan commerce:doctor`
  prints them for CI and deploys:

| Check | Fails when |
| --- | --- |
| Selling mode | Online store has no available payment method; WhatsApp has no number; Quotation has no staff recipients |
| Shipping coverage | Physical products exist but no zone matches the store country |
| Store identity | Address, email or phone missing (invoices, emails) |
| Legal pages | Terms or Privacy page not set or not published |
| Mail | `mail.default` is `log` or `array` |
| Queue | `QUEUE_CONNECTION=sync` (warning) or the heartbeat job hasn't run for 10 minutes |
| Scheduler | `commerce:tick` hasn't run for 5 minutes |
| Regions | Store country is ID but no regions are imported |
| Sign-in | `google_login` active without client id or secret; `passwordless_login` active but the user model lacks `HasOneTimePasswords` |
| Products | `sync_status = failed` count |
| Cache | `sunrice.cache.full_page` on without U11 |
| Upstream | A Sunrice version without the required U-items for an active feature |

## 30. Changes needed in Sunrice CMS

Small, general additions to Sunrice's public API. Each is its own pull request in
`sunrice-cms`, with tests and docs, following that repository's `AGENTS.md`. "Needed by" names the
commerce tasks that depend on it; "Without it" is the fallback, when one exists.

| Id | Change | Needed by | Without it |
| --- | --- | --- | --- |
| **U1** | **Settings tabs.** `Sunrice::addSettingsTab(string $key, string $label, string $href, string\|callable\|null $can = null)`. Shared as `settingsTabs` in Inertia props; `SettingsTabs` renders built-ins plus registered tabs; `window.Sunrice.components.SettingsTabs` exported so package pages show the same bar with their tab current (`current` becomes a string) | C3.3 | "Store" lives only in the Shop sidebar group; the user's "settings page" requirement isn't met |
| **U2** | **Dashboard cards.** `Sunrice::addDashboardCard(string $name, Closure $props, string\|callable\|null $can = null, int $position = 100)` + `window.Sunrice.registerDashboardCard(name, Component)`; cards render on the CMS dashboard with deferred props | C13.4 | No store card on the CMS dashboard (the store dashboard is unaffected) |
| **U3** | **Users list scope and pagination.** `Sunrice::usersQueryUsing(callable $scope)` applied to the Users list, its "move content to" list and user pickers; server-side pagination and search (TableQuery) and a role filter on Users — stores have thousands of customer accounts | C7.6 | Customers appear in Users; the Users page loads every account (slow) |
| **U4** | **Structure import.** `Sunrice::importStructure(array $definition, bool $dryRun = false, bool $force = false): ImportReport` and `php artisan sunrice:import-structure {file}`: idempotent upsert by handle of fieldsets, blueprints, taxonomies (with blueprints and routes), collections (settings, taxonomies), globals, menus, forms and draft entries (pages); reports differences instead of overwriting unless forced; syncs permissions | C4.6 | The scaffolder would have to call Sunrice's internal actions |
| **U5** | **Content write API.** A documented `Sunrice::content()` service: `createEntry`, `saveDraft`, `publish`, `unpublish`, `trash` (wrapping the existing actions, with validation and events) | Demo data (C4.6), product import/bulk edit (after v1) | Demo seeding uses the workbench only; import/bulk edit stay out of v1 |
| **U6** | **MCP instructions.** `Sunrice::addMcpInstructions(string $markdown)`, appended to the server's instructions | C14.1 | Tool descriptions carry the guidance alone |
| **U7** | **Navigation.** Honour `Resource::navigationGroup()` / `navigationIcon()` (currently ignored) and add `badge: ?Closure` to `addNavigationItem()` (lazy count shown on the link) | C3.2 | No badges; resources stay under "Resources" |
| **U8** | **Package docs in the admin.** `Sunrice::registerDocs(string $directory, string $section)` so Manage → Docs lists commerce's guides | C16.2 | Docs only in the repository |
| **U9** | **`FormSubmitted` event** dispatched by `SubmitForm` (form, submission) | C13.1 | Inquiry counts come from observing the `FormSubmission` model |
| **U10** | **Admin API v3.** `window.Sunrice.ui` adds DropdownMenu, Popover, Command, Sheet, Tooltip, AlertDialog, Separator, Skeleton, Calendar/DatePicker; `components` adds AssetPicker, EntryPicker, TermPicker, SettingsTabs; DataTable filter types `date_range` and async `search_select` | C3.1, C4.4 | Commerce bundles its own copies (bigger bundle, slight visual drift) |
| **U11** | **Full-page cache control.** `Sunrice::cachePageUsing(callable $decide)` consulted before `CacheResponse` stores a page (`fn (Request, ?TemplateContext): bool`) | C12.3 | Store health warns; sites must keep the full-page cache off |
| **U12** | **Package frontend routes.** `Sunrice::frontendRoutes(Closure $routes)`: registers the group unprefixed and for each non-main locale with `SetFrontendLocale`, names suffixed `.locale`; documents `Locales` as public | C2.9 | Commerce registers both copies itself with `SetFrontendLocale` (same result, duplicated logic) |
| **U13** | **Public captcha.** Document `Sunrice\Support\Captcha` (`enabled()`, `widget()`, `verify()`) as public API | C7.2, C9.3 | Honeypot and rate limits only |
| **U14** | **Public table API.** Document `Sunrice\Admin\Table\TableQuery` and `Column` for package pages | C3.1 | Commerce uses them anyway (risk of breaking changes) |
| **U15** | **Package menu links.** `Sunrice::registerMenuLink(string $key, string $label, Closure $url)` adds a "Store" link type in the menu editor ("Cart", "My Account", "Flash sale") whose URL follows the active language | C12.1 | Editors type `/cart` (no language prefix) |
| **U16** | **Field validation context.** `FieldType::rules(array $field, ?FieldContext $context = null)` with the entry being saved (id, collection, locale), so custom fields can validate uniqueness against other entries | C4.2 | SKU check excludes the posted variant ids; duplicates of a duplicated product are caught at projection (`sync_error`) |

U1, U3 and U4 are required before the matching commerce phases. The others are recommended and
have fallbacks.

## 31. Decision log

| Decision | Chosen | Alternatives considered | Why |
| --- | --- | --- | --- |
| Where products live | Sunrice entries + commerce projection tables | Commerce-only product tables with their own admin | SEO, translations, revisions, templates, sitemap, search and editor features come free; matches Sunrice's packages guide |
| Where product data is edited | A field in the entry (drafted, published) projected on publish | Immediate commerce endpoints from a panel | One Save/Publish model in one editor; works for new entries; previewable; revisions cover price mistakes. Stock stays immediate |
| Purchasability | Always read from Sunrice | Mirroring status into commerce tables | Deleted collections, schedules and trash have no per-entry events; mirroring would drift |
| Customer identity | Host users + Customer role + commerce customer record; guests get records too | A separate customers table and model | The user asked for roles; one identity for staff who shop; roles drive pricing and price visibility |
| Customer sessions | Separate `commerce` guard on the same users provider | Sharing the admin guard | Link/code/Google sign-in on the storefront must never open the admin or bypass its two-factor login |
| Order states | Three dimensions (status, payment, fulfilment) | A single WooCommerce-style status | Each dimension has one meaning; fewer combined states; clearer UI and reports |
| Stock timing | Reserve at placement, release on cancel/expiry with payment deadlines | Reserve at payment | Prevents overselling with manual transfers; one rule for every method |
| Price conflicts | Best price wins, no stacking between unit-price sources; discounts after | Priority-ordered stacking | Predictable for staff and customers; easy to explain |
| Feature switches | Always register, gate at runtime, null implementations | Conditional registration | Route cache, stable permissions, no DB at boot, no scattered `if` checks |
| Money | Integers in minor units, own formatter | brick/money, moneyphp, intl | Exact arithmetic is simple here; avoids 0.x API churn and IDR's two-decimal ISO default |
| Regions | Vendored cahyadsn data (2025 decree), our own table | laravolt/indonesia | Newer decree, clean names, no cache flush side effects; one table keyed by official codes |
| PDF | dompdf behind a contract | Browsershot/Chrome, mPDF (GPL) | Pure PHP, installs anywhere; swappable |
| Passwordless | `spatie/laravel-one-time-passwords` (codes only), commerce raises its PHP floor to 8.4 | Built in (signed URL + hashed code), magic-link packages | Maintained, reputable, constant-time checks, same-origin enforcement and rate limiting built in. 8.4 is within Laravel 13's range and also enables Sunrice's full-page cache. Codes only: a link would work on any device |
| Settings storage | One `commerce` row in `sunrice_settings` | A commerce settings table | Same mechanism and caching as Sunrice's site settings |
| MCP | Tools on Sunrice's server | A second MCP server | One token, one permission model, one activity log |
