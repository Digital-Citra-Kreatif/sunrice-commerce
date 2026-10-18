# Pricing, promotions and taxes

One calculator prices everything: the cart, checkout, placing an order, manual orders, order edits,
quotes and the MCP tools. The browser only sends what the customer wants (a variant, a quantity, a
code, a choice); every amount is computed on the server from the catalog and the rules.

## Contents

- [Money](#money)
- [The calculation](#the-calculation)
- [Unit prices](#unit-prices)
- [Pricing rules](#pricing-rules)
- [Flash sales](#flash-sales)
- [Vouchers and automatic discounts](#vouchers-and-automatic-discounts)
- [Shipping discounts and fees](#shipping-discounts-and-fees)
- [Taxes](#taxes)
- [Staff prices in manual orders, edits and quotes](#staff-prices-in-manual-orders-edits-and-quotes)
- [Running a calculation in code](#running-a-calculation-in-code)

## Money

- Every amount is an **integer in the currency's smallest unit**. For Rupiah (0 decimals) that is
  whole rupiah: `150000` is Rp150.000. With 2 decimals, `1999` would be 19,99.
- Percentages are **basis points**: `1100` is 11%, `10000` is 100%.
- Percent math rounds half up: `amount × basisPoints ÷ 10000`.
- An amount spread over lines (an order discount, a tax) uses the largest-remainder method, so the
  parts always add up to the whole exactly (`Support\Allocator::proportional()`).

The currency is set in Settings → Store → General → Currency (`general.currency`):

| Key | Default | |
| --- | --- | --- |
| `code` | `IDR` | Three letters. Can't be changed once there are orders. |
| `symbol` | `Rp` | |
| `position` | `left` | `left` or `right` of the amount |
| `space` | off | A space between symbol and amount |
| `thousands` | `.` | `.`, `,`, space or none |
| `decimal` | `,` | `,` or `.` |
| `decimals` | `0` | 0 to 3 |

```php
commerce_money(150000);              // "Rp150.000"
commerce_money(150000, false);       // "150.000"
Commerce::money(150000)->format();   // "Rp150.000"
app(\Sunrice\Commerce\Support\MoneyFormatter::class)->parse('Rp150.000'); // 150000
```

`Support\Money` is an immutable value with `add()`, `subtract()`, `multiply()`, `percent()` and
`format()`. In the admin bundle, `api.formatMoney()` and `api.parseMoney()` use the same format.

Only one currency per store is supported.

## The calculation

`Pricing\Calculator` runs stages in priority order over a `CalculationState`:

| Priority | Stage | What it does |
| --- | --- | --- |
| 10 | Lines | Drops lines that can't be bought (unpublished, out of stock, hidden prices, quantity rules…) with a notice; a line with too little stock is cut to what's left. Sets each line's flags: needs shipping, downloadable, tax class. |
| 20 | Unit prices | Asks every price candidate provider; the lowest candidate wins (see [Unit prices](#unit-prices)) |
| 25 | Staff prices | Unit prices set by staff (admin and quote channels only) |
| 30 | Subtotals | Line subtotal = unit price × quantity |
| 40 | Discounts | Automatic discounts, then voucher codes, then extension discounts |
| 45 | Staff discount | A discount set by staff, spread over the lines |
| 50 | Shipping | Rates for the destination when a line needs shipping; the chosen rate's cost |
| 55 | Staff shipping | A shipping label and cost set by staff, replacing the quoted rate |
| 60 | Shipping discounts | Free-shipping vouchers and extension shipping discounts |
| 70 | Fees | The payment method's fee and extension fees |
| 80 | Taxes | The tax calculator (zero while Taxes is off) |
| 90 | Totals | Adds it all up |

The totals:

```
total = subtotal − discount + shipping − shipping_discount + fee + tax added on top
```

- A line is never discounted below zero, and the total never goes below zero.
- Shipping discounts never exceed the shipping cost.
- With prices including tax, the tax is part of the subtotal and only reported (`tax`). With prices
  excluding tax, it is added to the total.
- For bank transfers with a unique code, the code is added to (or taken off) the total when the
  order is placed (see [payments.md](payments.md)).

The state also collects **notices**: lines removed or cut, codes that don't apply, flash sale
limits. The cart and checkout show them.

`CalculationState::hash()` fingerprints what the customer will pay. Checkout renders it in the form
and placing the order compares it, so a price that changed in between (a sale ended, a rule was
edited) shows "Prices changed" instead of charging a different amount (see
[checkout.md](checkout.md)).

Extensions add providers and stages at any priority; see [extending.md](extending.md#pricing).

## Unit prices

For each line, every price candidate provider offers zero or more prices. The **lowest wins**, and
candidates never stack. When two are equal, the provider registered with the lower order number
wins.

| Order | Provider | Candidate | Module |
| --- | --- | --- | --- |
| 0 | Base price | The variant's price; for a bundle, its bundle price (see [catalog.md](catalog.md#bundles)) | — |
| 5 | Flash sale | The running sale's price, while the cap and the customer's limit allow the line's quantity | `flash_sales` |
| 10 | Product bulk prices | The best of the product's own tiers reached by the quantity | `pricing_rules` |
| 20 | Pricing rules | The best tier of every matching rule, for the counted quantity | `pricing_rules` |
| 100 | Extensions | Registered with `Commerce::registerPriceCandidateProvider()` (order 100 unless given) | — |

The winner's source is saved on the cart line and the order item (`price_source`: `type` is
`base`, `flash_sale`, `tier`, `price_rule` or `manual`, with its id and label), so the order page
shows where each unit price came from.

**Compare-at price** is for display only: it shows as the struck-through "was" price. It is never a
candidate. A line counts as **on sale** when its price came from a flash sale, or its unit price is
below the variant's compare-at price. Vouchers can leave such lines out.

Tier and rule prices are computed from the variant's own price, not from another candidate:

| Tier type | Unit price |
| --- | --- |
| `percent_off` | price − price × value (basis points) |
| `amount_off` | price − value, not below zero |
| `fixed_price` | value |

Example: a shirt costs Rp100.000. A flash sale prices it at Rp85.000; a "Reseller" rule gives 20%
off from 1 unit (Rp80.000); the product's own tier gives 10% off from 10 units (Rp90.000). A
reseller buying 12 pays Rp80.000 per unit; the line's source is the pricing rule.

## Pricing rules

Shop → Pricing rules (`pricing_rules` module, permission `commerce.pricing-rules.manage`) holds bulk,
tier and customer-role prices.

| Field | Values |
| --- | --- |
| Name, Active | |
| When | An optional start and end |
| Customers (audience) | `everyone`, `guests` (only), `signed_in`, `roles` (with chosen roles, for example Reseller) |
| Products (scope) | `all`, `products`, `variants`, `categories` (including subcategories), `brands` |
| Count the quantity (quantity basis) | `variant` (the line), `product` (all the product's variants in the cart), `rule` (every item the rule covers: mix and match) |
| Prices (tiers) | 1 to 20 tiers: from N units, percent off, amount off per unit, or a fixed unit price |
| Priority | Display order only; the best price always wins |

- A rule applies while it is active, inside its dates, the customer is in its audience and the
  variant is in its scope.
- A **role price** (wholesale, reseller) is a rule for that role with one tier from 1 unit.
- Of all matching rules, the lowest price wins.
- The product page shows the tier table for the visitor: every quantity where the product's tiers or
  the matching rules give a lower price, with the saving in percent and the unit price (for
  example from 10 units, -10%, Rp90.000).

Products' own bulk prices (product data → Bulk prices) work the same way for everyone; see
[catalog.md](catalog.md#bulk-prices).

## Flash sales

Shop → Flash sales (`flash_sales` module, permission `commerce.flash-sales.manage`).

| Field | |
| --- | --- |
| Name, URL slug | The sale's page is `/flash-sale/{slug}`; an empty slug is made from the name |
| Active | |
| When | Start and end, both required |
| Badge | Short text, for example "12.12" |
| Description, Banner | Per language; an image |
| Show a countdown | On product pages and cards |
| Show how much is sold | A progress bar, for items with a cap |
| Announce it before it starts | The teaser: the sale is listed (and its page opens) before it starts |
| Units per customer | The default per-customer limit at the sale price |
| Products | 1 to 200 items (below) |

Each item is a **product** (all its variants) or one **variant**, with:

- a sale price: percent off, amount off, or a fixed price;
- a cap: units at this price (optional);
- units per customer (optional; overrides the sale's).

How it works:

- The sale price applies only between the start and the end, while the sale is active.
- A variant's own item wins over an item for its whole product.
- **Overlaps are refused**: an active sale can't share a variant with another active sale whose
  dates overlap.
- **Cap.** While units are left, the sale price applies. If a line asks for more units than are
  left, the line is priced at the regular price, with a notice. When the cap is used up, the item is
  back at its regular price, on listings too.
- **Per customer.** Units already bought at the sale price are counted from the customer's orders
  (by account, or by email or phone for guests; cancelled and expired orders don't count). If a line
  would go over the limit, the line is priced at the regular price, with a notice.
- **Reservation.** Sale units are counted when the order is placed, in one atomic step, so a cap
  can't be oversold: if the cap filled up meanwhile, checkout refuses the order. A cancelled or
  expired order gives them back.
- **Start and end.** `commerce:tick` (every minute) finds sales that started or ended, refreshes
  their products' listing prices, and dispatches `Promotions\FlashSales\Events\FlashSaleStarted` or
  `FlashSaleEnded`. Carts price with the current time, so checkout shows "Prices changed" when a
  sale starts or ends during it.

On the storefront:

- `/flash-sale` lists the running sales and up to six upcoming ones with a teaser. A sale's page
  answers 404 after it ends, and before it starts unless it has a teaser.
- Product views carry the running sale (`commerce_product($entry)->flashSale`: name, badge, end
  time, countdown, sold and cap, sold percent) and the `sale` badge.
- `<x-commerce::flash-sale />` shows the running sale (or `slug="…"`) with its countdown and
  products, and nothing when none runs (see [blade-components.md](blade-components.md)).

## Vouchers and automatic discounts

Shop → Vouchers (`vouchers` module, permission `commerce.vouchers.manage`). A **voucher** has a code
the customer enters. An **automatic discount** has no code and applies by itself when its conditions
are met.

**Codes** are letters, digits, `-` and `_`, up to 64 characters, unique, and case-insensitive (they
are stored in capitals). A new voucher gets a random 8-character code. Code attempts are limited to
10 a minute per cart and IP address.

### Types

| Type | Discount |
| --- | --- |
| `percent` | A percentage of the eligible items, optionally capped by a maximum discount |
| `fixed_cart` | An amount off the order, at most the eligible items' total |
| `fixed_item` | An amount off each eligible unit, at most each line's total |
| `free_shipping` | The shipping cost; with an amount, at most that amount |
| `buy_x_get_y` | Buy N units, get M units free, at a percentage off, or an amount off |

**Buy X get Y.** "Buy from" and "Get from" are product targets. An empty "Buy from" means any
eligible item; an empty "Get from" means the same products as "Buy from". The cheapest eligible
"get" units are discounted first.

- When both lists are the same (an empty "Get from" included), the free units come from the same items:
  `floor(units ÷ (N + M)) × M`. Buy 2 get 1 free with 3 shirts in the cart gives 1 shirt free.
- Otherwise: `floor(buy units ÷ N) × M` units of the "get" items.

### Conditions

| Condition | |
| --- | --- |
| When | Start and end (empty: always) |
| Only for / Except | Products, variants and terms (categories with their subcategories, brands, tags) |
| Not for items already on sale | Leaves out lines from a flash sale or below their compare-at price |
| Minimum spend, Maximum spend | Counted on the whole cart or the eligible items only (setting "Spend counted on") |
| Minimum items | Counted on the same basis |
| Customers | `everyone`, `signed_in`, `roles`, `customers` (a list of emails, matched to accounts), `first_order` (no earlier order that wasn't cancelled or expired) |
| Payment methods | Method keys, for example `bank_transfer` |
| Shipping methods | Method types, for example `flat`, `weight`, `pickup` |
| Shipping to | Countries, optionally narrowed to a province or city |

Destination, payment and shipping conditions are checked once the customer has chosen them. Until
then the voucher applies with the notice "HEMAT10 applies at checkout if the payment method match."

### Limits

- **Uses in total** and **uses per customer**. Per customer counts by account, email or phone.
- Use is counted when the order is placed, in one atomic step under the limit; if the limit was
  reached meanwhile, checkout refuses the order. It is given back when the order is cancelled or
  expires, but not on refund.

### Order and combining

1. Automatic discounts apply first, higher **priority** first.
2. Then the codes, in the order the customer entered them.
3. Each one works on what is left of the eligible lines after the earlier ones, and is spread over
   them in proportion, exactly to the smallest unit, so per-line refunds and taxes stay right.

A voucher joins those already applied when, for each of them:

- neither is **exclusive** (an exclusive voucher always stands alone);
- one of the two is an automatic discount (automatic discounts combine with codes), or both are
  marked **combinable** (new vouchers are), or
- one is a free-shipping code and it is the only other code, while **A free-shipping code can be
  used with one other code** is on (Settings → Store → Checkout, on by default).

To keep codes from stacking with an automatic discount, mark one of them exclusive.

### Why a code doesn't apply

Conditions are checked in this order, and the first that fails is the message:

| Reason | Message |
| --- | --- |
| `not_found` | The code :code doesn't exist. |
| `inactive` | This code is no longer valid. |
| `not_started`, `expired` | This code is valid from :date. / This code has expired. |
| `sign_in`, `audience`, `first_order` | Sign in to use this code. / This code isn't for your account. / This code is for a first order only. |
| `usage_limit`, `customer_limit` | This code has been used up. / You have already used this code. |
| `destination`, `payment_method`, `shipping_method` | This code isn't valid for your shipping address / with the chosen payment method / with the chosen shipping. |
| `no_eligible_items` | No product in your cart qualifies for this code. |
| `min_subtotal`, `max_subtotal`, `min_quantity` | Spend at least :amount to use this code (:missing more). / … |
| `not_combinable` | This code can't be combined with :code. |

The messages are translations in `commerce::validation.voucher.*`.

The admin list shows each voucher's code (or "Automatic"), discount, uses (against the limit),
discount given, end date and status (Active, Scheduled, Expired, Used up, Off), and filters codes
from automatic discounts. Vouchers can be created, edited, switched off and deleted. Orders keep a
snapshot of the discount, so deleting a used voucher doesn't change them.

## Shipping discounts and fees

- **Free shipping** vouchers apply in the shipping discounts stage, to the chosen rate's cost (and
  only when a line needs shipping). A free-shipping voucher limited to shipping methods doesn't
  apply with another method.
- **Payment fees**: the chosen payment method's fee: a fixed amount plus a percentage of the
  discounted subtotal plus shipping minus shipping discounts, as set on the method (see
  [payments.md](payments.md)).

How rates are quoted is in [shipping.md](shipping.md).

## Taxes

Taxes need the **Taxes** (`taxes`) module, which is **off** by default. While it is off, tax is zero.

Settings → Store → Taxes:

| Setting | Key | Default |
| --- | --- | --- |
| Prices include tax | `taxes.prices_include_tax` | on (usual in Indonesia) |
| Show prices | `taxes.display_prices`: `incl` (including tax, with an "incl. tax" note), `excl` (excluding tax, with an "excl. tax" note), `none` (as entered, no note) | `incl` |
| Tax by | `taxes.based_on`: `shipping` (the shipping address), `billing` (the billing address; the shipping address while there is none) or `store` (the store address) | `shipping` |
| Tax classes | `taxes.classes`; `standard` always exists | `['standard']` |

When prices are shown differently from how they are entered (entered including tax, shown excluding
it, or the other way round), the store converts them: product pages, cards and variant prices with
the rates of the product's tax class at the store address (the visitor's address isn't known yet),
cart lines with the tax worked out for them. Totals, orders and invoices always show what is
charged. In templates, `app(\Sunrice\Commerce\Taxes\TaxDisplay::class)` does the conversion
(`price($amount, $taxClass)`, `line($calcLine, $amount)`).

Each product picks a **tax class** (`tax_class` in product data; empty is `standard`).

**Rates** (Settings → Store → Tax rates, permission `commerce.settings.taxes`): up to 200 rows of

| Field | |
| --- | --- |
| Name | For example PPN. Invoices show tax per rate name. |
| Tax class | |
| Rate (%) | For example 11 |
| Where | A country, optionally a province or city; empty for everywhere |
| Compound | Charged on top of the other taxes |
| Also on shipping | Taxes the shipping cost too |
| Priority | Order of the rates |

How tax is worked out:

- Per line, on the line's total after discounts, with the rates of its class for the address.
  Rounding is per line.
- With **Tax by: shipping**, the shipping address is used once known; before that (in the cart),
  the store address.
- A rate for a province or city replaces the general rate with the same name there.
- **Prices include tax**: the tax is taken out of the price. Rp111.000 at 11% contains Rp11.000 of
  tax, and the total doesn't change.
- **Prices exclude tax**: the tax is added on top. Rp100.000 at 11% becomes Rp111.000.
- Compound rates apply to the amount plus the other taxes.
- Shipping is taxed with the `standard` class rates marked "Also on shipping", on the shipping cost
  after shipping discounts.

"Show prices" adds the tax note next to prices on the storefront; the amounts shown are the prices
as you entered them. For company names and tax numbers (NPWP) at checkout, turn on Settings → Store
→ Checkout → Ask for a company name and tax number. Invoices are in [documents.md](documents.md).

To use an external tax engine, bind your own `Contracts\TaxCalculator` (see
[extending.md](extending.md#swappable-services)).

## Staff prices in manual orders, edits and quotes

Manual orders, edits of unpaid orders and quotes are priced by the same calculator, in the `admin`
or `quote` channel (see [orders.md](orders.md)). In these channels:

- Lines skip the storefront purchase checks (published, stock, price visibility…), but removed
  variants are still refused.
- **Unit prices** can be set per line. That needs the permission
  `commerce.orders.override-prices`; without it, a changed price is refused ("You may not change
  prices."). Quotes are priced by whoever may respond to them, without that permission. The line's
  source becomes `manual`.
- **When editing an unpaid order**, existing lines keep the price they were placed with; new lines
  get today's price.
- **Shipping**: a label and a cost replace the quoted rates, when a line needs shipping.
- **Discount**: an amount with a label, spread over the lines in proportion, after vouchers. It is
  capped at what's left of the lines.

Everything else (vouchers, shipping discounts, fees, taxes, totals) runs as usual.

## Running a calculation in code

```php
use Sunrice\Commerce\Pricing\Calculator;
use Sunrice\Commerce\Pricing\PricingContext;

$state = app(Calculator::class)->calculate(
    [[$variant, 2], [$otherVariantId, 1]],   // [variant or id, quantity, meta?]
    PricingContext::current(),               // the storefront visitor
    ['HEMAT10'],                             // voucher codes
);

$state->totals;     // subtotal, discount, shipping, shipping_discount, fee, tax, total
$state->lines;      // CalcLine: unitPrice, regularUnitPrice, priceSource, subtotal, discounts, taxes
$state->notices;    // [['code' => 'voucher_min_subtotal', 'message' => '…', 'voucher' => 'HEMAT10'], …]
$state->toArray();  // everything, with the hash
```

`PricingContext` carries the customer and roles, the time, the language, the channel (`storefront`,
`admin`, `quote`), the destination, the chosen shipping rate and payment method, and the email and
phone (for per-customer limits). Change any of them with `with()`:

```php
$ctx = PricingContext::for($user)->with(['destination' => ['country' => 'ID', 'province_code' => '31']]);
```
