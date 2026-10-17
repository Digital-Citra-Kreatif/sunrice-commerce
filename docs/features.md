# Features and selling modes

Every part of the store is a module that you can switch on and off, and the store runs in one of
four selling modes. This page lists every module, what it needs, and what happens when it is off.
To register a module of your own, see [extending.md](extending.md#features).

## Contents

- [Selling modes](#selling-modes)
- [How a module becomes active](#how-a-module-becomes-active)
- [Switching a module on or off](#switching-a-module-on-or-off)
- [Modules](#modules)
- [What "off" means](#what-off-means)
- [Module by module](#module-by-module)
- [Checking modules in code](#checking-modules-in-code)

## Selling modes

Choose the mode in Settings → Store → General → **Selling mode** (setting
`general.selling_mode`, default `shop`).

| Mode | Key | Cart | Checkout ends with | Needs these modules |
| --- | --- | --- | --- | --- |
| Online store | `shop` | yes | An order, paid with a payment method | Cart, Orders, Checkout, Payment methods |
| Quotation | `quote` | yes | A quote request; staff reply with prices | Cart, Orders, Checkout |
| WhatsApp order | `whatsapp` | yes | An order, then a WhatsApp chat with the cart | Cart, Orders, Checkout |
| Catalog | `catalog` | no | — (products show a call to action) | — |

- In Catalog mode products show the store's call to action instead of Add to cart: the inquiry
  form, a WhatsApp chat, links to other shops, or nothing. See
  [catalog.md](catalog.md#purchase-modes-and-calls-to-action).
- Each product can override what its button does (its purchase mode), in any selling mode.
- Changing the mode never deletes data. A save that would leave the new mode without a module it
  needs is refused, with the reason, for example "Online store mode needs Payment methods. Choose
  another selling mode first, or switch on what it needs."
- An unknown value in the settings is treated as `shop`.

How each mode checks out is in [checkout.md](checkout.md).

## How a module becomes active

A module is **active** only when all of these hold:

1. it is switched on (or it is a core module, which is always on);
2. the current selling mode is one of the module's modes;
3. every module it requires is active, plus any extra requirement for the current mode.

Each module's own switch is stored separately, under the `features` key of the store settings. So
switching Cart off makes Checkout and Vouchers inactive, but they remember that they were on. When
you switch Cart back on, they come back as they were.

Requirements chain. Checkout requires Cart and Orders, and in Online store mode also Payment
methods. Payment methods requires Orders. So in Online store mode, Checkout is active only when
Cart, Orders and Payment methods are all active.

Example: the store is in Catalog mode. Cart is available only in `shop`, `quote` and `whatsapp`, so
it is inactive, and so are Checkout and Vouchers, which need it. Payment methods is available only
in `shop` and `quote`, so it is inactive too.

## Switching a module on or off

Settings → Store → **Features** lists the modules by group. You need the permission
`commerce.settings.features`. For each module the page shows:

- whether it is switched on and whether it is active;
- why it is inactive: "Not available in … mode", or the module it needs;
- what it requires (in the current mode) and which active modules depend on it.

Switching a module off that others need asks you to confirm and lists what becomes inactive. After
the change, the message names the modules that went off with it.

Two switches are refused:

- switching off a core module (Products, prices and product pages);
- a switch that leaves the current selling mode without a module it can't work without. Online
  store mode needs Cart, Orders, Checkout and Payment methods; Quotation and WhatsApp order need
  Cart, Orders and Checkout; Catalog mode needs nothing. The message names the root cause, for
  example the switched-off module further down the chain.

Every switch is recorded in Sunrice's activity log, and `Sunrice\Commerce\Events\FeatureToggled`
is dispatched with `$feature`, `$on`, `$deactivated` and `$activated` (the keys whose active state
changed).

## Modules

"All" modes means `shop`, `quote`, `whatsapp` and `catalog`.

| Group | Key | Label | Requires | Modes | Default |
| --- | --- | --- | --- | --- | --- |
| Catalog | `catalog` | Products, prices and product pages | — (core, always on) | all | on |
| Catalog | `variants` | Variable products | `catalog` | all | on |
| Catalog | `bundles` | Bundles | `catalog` | all | on |
| Catalog | `digital` | Digital products | `orders` | all | on |
| Catalog | `brands` | Brands | `catalog` | all | on |
| Catalog | `inventory` | Stock tracking | `catalog` | all | on |
| Selling | `cart` | Cart and mini cart | `catalog` | shop, quote, whatsapp | on |
| Selling | `orders` | Orders | `catalog` | all | on |
| Selling | `checkout` | Checkout | `cart`, `orders`; in `shop` mode also `payments` | shop, quote, whatsapp | on |
| Selling | `documents` | Invoices and packing slips | `orders` | all | on |
| Selling | `taxes` | Taxes | `catalog` | all | **off** |
| Payments | `payments` | Payment methods | `orders` | shop, quote | on |
| Payments | `manual_payments` | Bank transfer, QRIS and cash on delivery | `payments` | shop, quote | on |
| Shipping | `shipping` | Shipping | `orders` | all | on |
| Promotions | `pricing_rules` | Pricing rules | `catalog` | all | on |
| Promotions | `flash_sales` | Flash sales | `catalog` | all | on |
| Promotions | `vouchers` | Vouchers | `cart` | shop, quote, whatsapp | on |
| Customers | `accounts` | Customer accounts | `catalog` | all | on |
| Customers | `passwordless_login` | Sign in with an emailed code | `accounts` | all | **off** |
| Customers | `google_login` | Sign in with Google | `accounts` | all | **off** |
| Customers | `wishlist` | Wishlist | `catalog` | all | on |
| Customers | `compare` | Product comparison | `catalog` | all | on |
| Insights & AI | `analytics` | Store analytics | `catalog` | all | on |
| Insights & AI | `ai_tools` | Store tools for AI agents | `catalog` | all | on |

Extension packages add their own modules, usually in the Integrations group (see
[extending.md](extending.md#features)).

## What "off" means

When a module is inactive (switched off, or off because of the mode or a requirement):

- its storefront routes answer 404 (route middleware `commerce.feature:<key>`, or a check in the
  controller);
- its admin pages answer 404 and its Shop sidebar links are hidden;
- its settings sections are hidden (Settings → Store);
- its Blade components and storefront slots render nothing;
- its emails are not sent, and its MCP tools are not available;
- optional connections fall back to a "nothing" implementation: with Stock tracking off every
  product not marked out of stock can be sold and nothing is counted; with Taxes off tax is zero;
  with Shipping off checkout has no shipping step.

Its data stays: products, orders, vouchers, sales, stock quantities and settings are kept, and so
are its permissions, so role grants survive. Switch it back on and everything returns.

What customers already have keeps working. Download links granted before Digital products was
switched off work until they expire, and an order placed with a payment or shipping method that is
now off still shows its saved instructions.

## Module by module

| Key | When it's inactive |
| --- | --- |
| `catalog` | Always active. |
| `variants` | The product editor refuses to save a product of type Variable ("Variable products are switched off"). Variable products already in the store keep their variants until they are synced again; `commerce:sync-products` then marks them failed. |
| `bundles` | The same for the Bundle type. |
| `digital` | File uploads in the product editor are refused and the Digital products settings section is hidden. Download links already granted keep working. |
| `brands` | The brands index (`/brands`) answers 404. |
| `inventory` | Stock is not counted: only each variant's manual stock status matters, and orders don't take stock. Shop → Inventory is hidden. Stock quantities are kept. |
| `cart` | Cart pages and the cart JSON endpoints answer 404; `<x-commerce::cart>` and `<x-commerce::mini-cart>` render nothing. Nothing can be added to a cart, and product buttons show the store's call to action instead. Checkout and Vouchers become inactive. |
| `orders` | Shop → Orders is hidden; the order, pay, quote and track-order pages and My Account → Orders answer 404. Checkout, Documents, Payments, Shipping and Digital products become inactive. |
| `checkout` | `/checkout` answers 404 and the Checkout settings section is hidden. |
| `documents` | Invoice and packing slip downloads answer 404 and their links are hidden; the Documents settings section is hidden. |
| `taxes` | Tax is zero; the Taxes settings and Tax rates pages are hidden; prices show no tax note. |
| `payments` | The pay page, payment return and payment webhooks answer 404; payment method settings are hidden. Can't be switched off in Online store mode. |
| `manual_payments` | The payment confirmation pages answer 404 and Shop → Payments to verify is hidden. |
| `shipping` | No rates are quoted and checkout has no shipping step; shipping settings and the shipments panel on orders are hidden. |
| `pricing_rules` | Pricing rules and products' own bulk prices stop applying, and the tier table is not shown. Shop → Pricing rules is hidden. |
| `flash_sales` | Sale prices stop applying; `/flash-sale` and sale pages answer 404; `<x-commerce::flash-sale>` renders nothing. Shop → Flash sales is hidden. |
| `vouchers` | The voucher endpoints answer 404, codes already on a cart are reported as not found, and automatic discounts stop. Shop → Vouchers is hidden. |
| `accounts` | My Account and the sign-in and register pages answer 404; checkout doesn't offer an account. |
| `passwordless_login` | The sign-in code pages answer 404. They also answer 404 while the user model lacks the `HasOneTimePasswords` trait; the store health check reports it. |
| `google_login` | The Google sign-in routes answer 404. They also answer 404 until `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set. |
| `wishlist` | Wishlist pages answer 404 and `<x-commerce::wishlist-button>` renders nothing. |
| `compare` | Compare pages answer 404 and `<x-commerce::compare-button>` renders nothing. |
| `analytics` | Shop → Reports and the dashboard figures are hidden; product views are not recorded. |
| `ai_tools` | Commerce's MCP tools are not available (see [ai-agents.md](ai-agents.md)). |

## Checking modules in code

```php
use Sunrice\Commerce\Facades\Commerce;

Commerce::active('vouchers');            // active now?
commerce_feature('vouchers');            // the same, as a helper
Commerce::features()->mode();            // 'shop', 'quote', 'whatsapp' or 'catalog'
Commerce::features()->states();          // ['catalog' => true, 'variants' => true, …]
Commerce::features()->switchedOn('cart'); // its own switch, whatever the requirements
Commerce::features()->explain('checkout');
// ['active' => false, 'switched_on' => true, 'reasons' => ['needs:payments']]
// reasons are "mode:<mode>" or "needs:<key>"
```

In Blade:

```blade
@commerceFeature('wishlist')
    <x-commerce::wishlist-button :product="$entry" />
@endcommerceFeature
```

On routes, `commerce.feature:<key>` answers 404 while the module is inactive. List several to need
them all:

```php
Route::middleware('commerce.feature:cart,checkout')->get('express', ExpressCheckout::class);
```

The active state is computed once per request and refreshed when store settings are saved.
