# Catalog

Products are ordinary Sunrice entries. Commerce adds one field, **Product data**, that holds the
prices, variants, stock settings and the rest. When you publish a product, commerce copies that
field into its own tables so carts, orders and listings can read it fast.

## Contents

- [The store structure](#the-store-structure)
- [Products are entries](#products-are-entries)
- [The product field](#the-product-field)
- [Product types and kinds](#product-types-and-kinds)
- [Options and variants](#options-and-variants)
- [Purchase modes and calls to action](#purchase-modes-and-calls-to-action)
- [Stock](#stock)
- [Bundles](#bundles)
- [Digital products](#digital-products)
- [Bulk prices](#bulk-prices)
- [Price visibility](#price-visibility)
- [Badges and the stock message](#badges-and-the-stock-message)
- [Categories, tags, brands and attributes](#categories-tags-brands-and-attributes)
- [Listings and filters](#listings-and-filters)
- [Wishlist and compare](#wishlist-and-compare)
- [The projection](#the-projection)
- [Admin pages](#admin-pages)

## The store structure

`php artisan commerce:install` runs `commerce:scaffold`, which creates the store structure in
Sunrice. You can run it again at any time:

```bash
php artisan commerce:scaffold            # add what's missing
php artisan commerce:scaffold --dry-run  # report only
php artisan commerce:scaffold --force    # also overwrite items you changed in the admin
```

It is safe to repeat: it adds what's missing and reports items you changed instead of overwriting
them (unless `--force`). It creates:

| Item | Handle | Details |
| --- | --- | --- |
| Collection | `products` | Entries at `/products/{slug}`, listing (the Shop page) at `/products`, translatable, blueprint `product` |
| Blueprint | `product` | `product` (Product data), `excerpt`, `description`, `gallery`, `specifications` (label/value), `faq` (question/answer), `related_products`, `upsells`, `cross_sells`, `size_guide` |
| Taxonomy | `product_categories` | Hierarchical; term pages at `/products/category/{slug}`; image, banner, description |
| Taxonomy | `product_tags` | Flat; term pages at `/products/tag/{slug}` |
| Taxonomy | `brands` | Flat; term pages at `/brands/{slug}`; logo, banner, description, website |
| Form | `product_inquiry` | Name, email, phone, quantity, message, and hidden product fields |
| Pages | — | Privacy Policy, Terms & Conditions, Returns & Refunds, Shipping Policy, as drafts, only when a `pages` collection exists |
| Menu | `shop` | Shop, Brands, Cart, Account — only when no `shop` menu exists |

Afterwards you can change it in Sunrice: add fields, rename titles, change routes. Commerce only
depends on the handles in `config/commerce.php`:

| Key | Default | |
| --- | --- | --- |
| `catalog.collections` | `['products']` | Collections whose entries are products |
| `catalog.field` | `product` | The handle of the Product data field |
| `catalog.category_taxonomy` | `product_categories` | Category filter and term pages |
| `catalog.tag_taxonomy` | `product_tags` | Tag filter and term pages |
| `catalog.brand_taxonomy` | `brands` | Brand filter and term pages |
| `catalog.inquiry_form` | `product_inquiry` | The form behind the inquiry call to action |
| `catalog.max_options` | `3` | Options per product |
| `catalog.max_variants` | `100` | Variants per product |

See [configuration.md](configuration.md) for the rest of the file and
[installation.md](installation.md) for the install steps.

## Products are entries

Title, slug, description, images, SEO, translations, categories, tags and brand work as in any
Sunrice entry. Drafts, preview, revisions and edit locks apply to Product data too: a changed
price or a new variant goes live when the entry is published. In preview, the product page shows
the draft's prices and variants without saving anything.

Two exceptions:

- **Stock** is changed directly (Shop → Inventory), never through a draft. See [Stock](#stock).
- **Publication** is Sunrice's call. Only entries Sunrice shows as published can be bought:
  scheduled, unpublished, trashed entries and entries of hidden collections can't. This is checked
  against Sunrice on every request.

Product data is shared by all languages. Translated text comes from the entry's translations and
from taxonomy terms.

## The product field

The field type is `commerce_product`. Its value is JSON; unknown keys are dropped and missing keys
get their defaults. Amounts are integers in the smallest currency unit (see
[pricing.md](pricing.md#money)), and percentages are basis points (`1000` = 10%).

```json
{
  "type": "variable",
  "purchase_mode": "default",
  "external_links": [{ "preset": "tokopedia", "label": null, "url": "https://tokopedia.com/…" }],
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
      "sku": "TS-M-RED", "barcode": null,
      "price": 150000, "compare_at_price": 200000, "cost": 80000,
      "weight": 250, "length": 300, "width": 200, "height": 20, "image": 45,
      "requires_shipping": null, "downloadable": null,
      "track_stock": true, "initial_stock": 10, "backorders": "no", "low_stock_threshold": null,
      "stock_status": "in_stock", "min_qty": 1, "max_qty": null, "qty_step": 1, "active": true,
      "downloads": [] }
  ],
  "bundle": null,
  "downloads": [],
  "delivery": null,
  "tiers": [{ "min_qty": 10, "type": "percent_off", "value": 500, "variant": null }]
}
```

| Key | Values | Default |
| --- | --- | --- |
| `type` | `simple`, `variable`, `bundle` | `simple` |
| `purchase_mode` | `default`, `cart`, `inquiry`, `whatsapp`, `external`, `none` | `default` |
| `external_links` | Up to 10 `{preset, label, url}`; `url` starts with `http://` or `https://` | `[]` |
| `requires_shipping`, `downloadable`, `featured` | booleans | `true`, `false`, `false` |
| `tax_class` | A tax class, or `null` for `standard` | `null` |
| `options`, `variants` | See [Options and variants](#options-and-variants) | one empty variant |
| `bundle` | `{pricing, value, items}` for bundles | `null` |
| `downloads`, `delivery` | See [Digital products](#digital-products) | `[]`, `null` |
| `tiers` | Up to 20 bulk prices, see [Bulk prices](#bulk-prices) | `[]` |

Per variant:

| Key | Meaning | Default |
| --- | --- | --- |
| `id` | Stable id (a ULID is assigned to new variants). Keep it when editing: carts and orders follow it. | new |
| `options` | `{optionId: valueId}` | `{}` |
| `sku` | Unique across the store when filled in (case-insensitive), up to 100 characters | `null` |
| `barcode` | GTIN | `null` |
| `price`, `compare_at_price`, `cost` | Minor units. `cost` is for profit reports and never shown. | `0`, `null`, `null` |
| `weight` | Grams | `null` |
| `length`, `width`, `height` | Millimetres (the editor's labels) | `null` |
| `image` | A Sunrice asset id | `null` |
| `requires_shipping`, `downloadable` | Override the product's flag; `null` follows the product | `null` |
| `track_stock`, `initial_stock`, `backorders`, `low_stock_threshold`, `stock_status` | See [Stock](#stock) | `false`, `null`, `no`, `null`, `in_stock` |
| `min_qty`, `max_qty`, `qty_step` | Quantity rules: at least `min_qty`, at most `max_qty` per order, in steps of `qty_step` counted from `min_qty` | `1`, `null`, `1` |
| `active` | Inactive variants can't be bought and are left out of prices and pickers | `true` |
| `downloads` | Files for this variant only | `[]` |

The editor validates the value before saving, with messages such as "SKU TS-M-RED is used by
another product." or "Variant 2 (TS-L): Choose a value for every option.". Negative amounts, a
maximum below the minimum, unknown stock statuses and duplicate option combinations are refused.

To read the stored value in a template, the field hydrates to `Sunrice\Commerce\Catalog\ProductData`
(`type()`, `variants()`, `activeVariants()`, `priceRange()`…). For live prices, stock and badges use
`commerce_product($entry)` instead, which reads the published projection (see
[helpers.md](helpers.md)).

To change product data outside the editor (bulk actions, MCP tools), use
`Catalog\Actions\UpdateProductValues`: it changes the live value and any pending draft, then
re-projects a published entry.

```php
app(UpdateProductValues::class)->handle($entry, fn (array $value) => [...$value, 'featured' => true]);
```

## Product types and kinds

| Type | What it is | Needs |
| --- | --- | --- |
| `simple` | One product, one hidden variant | — |
| `variable` | Options (Size, Color…) and a variant per combination | `variants` module |
| `bundle` | A fixed set of other products, sold together | `bundles` module |

A simple product and a bundle always have exactly one variant without options; extra variants and
options are dropped.

On top of the type, two **kind flags** say what is being sold. Set them on the product; a variant
can override them:

- **Requires shipping** (`requires_shipping`): a physical product. Lines with it need a shipping
  method at checkout. The editor shows the Shipping tab for weight and dimensions.
- **Downloadable** (`downloadable`): a digital product. The editor shows the Digital tab. See
  [Digital products](#digital-products).

A product that is neither is **virtual**: a service, a ticket or a booking. There is no separate
"digital" type: a digital product is a simple or variable product with Downloadable on (and usually
Requires shipping off).

Products can also be **featured** (`featured`): they sort first in the default listing order and
get the `featured` badge.

## Options and variants

A variable product has up to 3 options (`catalog.max_options`) and up to 100 variants
(`catalog.max_variants`). Each option is one of:

- **Custom**: values are typed in the product (`{"id": …, "label": "M"}`). They are not translated.
- **Global**: linked to a Sunrice taxonomy listed in Settings → Store → Catalog → **Attribute
  taxonomies** (for example `colors`). Values are that taxonomy's terms (`{"id": …, "term_id":
  12}`), so their names are translated and they can be filtered on the storefront.

Option names are up to 60 characters, every option needs values, and a value can appear only once
per option. The editor generates the combinations; each variant has its own SKU, price, stock,
quantity rules, weight, image and downloads. Every variant must choose a value for every option,
and two variants can't have the same combination.

A variant's title is its option values joined with " / ", for example `M / Red`. On the product
page the picker lists the options with their values; with JavaScript, the price, stock and image
follow the chosen variant.

## Purchase modes and calls to action

`purchase_mode` decides the product's button:

| Purchase mode | Button |
| --- | --- |
| `default` | Add to cart in modes with a cart; otherwise the store's call to action |
| `cart` | The same as `default` |
| `inquiry` | The inquiry form |
| `whatsapp` | A WhatsApp chat about the product |
| `external` | Links to other shops (`external_links`); the store's call to action when the product has no links |
| `none` | No button |

Modes with a cart are Online store, Quotation and WhatsApp order, while the Cart module is active
(see [features.md](features.md#selling-modes)). So in Online store mode one product can show "Ask
for a price" (inquiry) or "Buy on Tokopedia" (external) instead of Add to cart.

The store's call to action is Settings → Store → Catalog → **Call to action in Catalog mode**
(`catalog.call_to_action`): `inquiry` (default), `whatsapp`, `external` or `none`. `external` uses
each product's own links and shows nothing for products without them.

**External links** have a preset or a label. Presets: `shopee` (Shopee), `tokopedia` (Tokopedia),
`tiktok` (TikTok Shop), `lazada`, `blibli`, `bukalapak`, `website`. A link without a label is shown
as "Buy on {preset}", or the link's host when there is no preset.

Clicks on WhatsApp, external and inquiry buttons go through `/go/{type}/{entry}`, which counts the
click for analytics and redirects to the product's own target (never a URL from the request). The
WhatsApp number and message come from Settings → Store → General → WhatsApp (see
[checkout.md](checkout.md)).

Only products whose button resolves to the cart can be added to a cart. In templates:

```blade
@php($product = commerce_product($entry))
@if ($product->canAddToCart())
    {{-- quantity and Add to cart --}}
@else
    {{-- $product->cta: type, label, url, links --}}
@endif
```

## Stock

Stock settings are per variant, and need the **Stock tracking** (`inventory`) module.

| Key | Values |
| --- | --- |
| `track_stock` | On: count a quantity. Off: set `stock_status` by hand. |
| `stock_status` | `in_stock`, `out_of_stock` or `backorder`, for untracked variants. Tracked variants get it from the quantity. |
| `initial_stock` | The starting quantity, used once: when the variant is first tracked. |
| `backorders` | `no` (stop selling at zero), `allow` (keep selling), `notify` (keep selling and tell customers) |
| `low_stock_threshold` | When the variant counts as low; empty uses the store's (Settings → Store → Catalog → Low stock at, default 5) |

A tracked variant with stock above zero is in stock; at zero or below it is out of stock with
backorders `no`, otherwise on backorder.

**Changing stock.** Product data never changes the quantity after `initial_stock`; publishing a
product leaves stock alone. Change it in **Shop → Inventory** (permissions
`commerce.inventory.view` and `commerce.inventory.adjust`): add or subtract an amount, or set it, with a
reason (`manual`, `correction`, `import`, `refund`) and an optional note. In code:

```php
use Sunrice\Commerce\Inventory\Actions\AdjustStock;

app(AdjustStock::class)->handle($variant, 5);                    // add 5
app(AdjustStock::class)->handle($variant, -2, reason: 'correction', note: 'Damaged');
app(AdjustStock::class)->handle($variant, 40, set: true);        // set to 40
```

Setting below zero is refused. Every change is also recorded in Sunrice's activity log.

**Movements.** Every change is a stock movement with its delta, the quantity after, the reason, the
user and what caused it (an order, for example). Reasons are `initial`, `order`, `cancel`, `expire`,
`refund`, `manual`, `import` and `correction`. Shop → Inventory shows each variant's last 100.

**Orders.** Placing an order takes the stock in one atomic step per variant, so two checkouts can't
sell the same last unit; if one variant is short, nothing is taken and checkout says so. Cancelled
and expired orders give it back. See [orders.md](orders.md).

**Events.** Each change dispatches `Inventory\Events\StockChanged`. Crossing the low-stock
threshold dispatches `StockLow`, reaching zero `StockOut`, and going back above zero `StockBackIn`.
`StockLow` and `StockOut` send the staff emails "low stock" and "out of stock" (see
[emails.md](emails.md)).

**Store settings** (Settings → Store → Catalog):

| Setting | Key | Default |
| --- | --- | --- |
| Show stock | `catalog.show_stock`: `always` ("12 in stock"), `low` ("Only 3 left"), `never` | `low` |
| Low stock at | `catalog.low_stock_threshold` | `5` |
| Hide out-of-stock products from listings | `catalog.hide_out_of_stock` | off |

With Stock tracking off, quantities are ignored and kept: only `stock_status` counts and orders
don't take stock. To use stock from another system, bind your own `Contracts\Inventory` (see
[extending.md](extending.md#swappable-services)).

## Bundles

A bundle is a fixed list of 1 to 20 variants of other products, simple or variable, each with a
quantity. Bundles can't contain bundles.

```json
"bundle": { "pricing": "percent_off", "value": 1000, "items": [{ "variant_id": 381, "quantity": 2 }] }
```

`variant_id` is the component's variant id in `commerce_variants` (from the product picker or the
`get_product` MCP tool).

| `pricing` | Price |
| --- | --- |
| `fixed` | The bundle's own variant price |
| `percent_off` | The components' sum minus `value` basis points (at most 100%) |
| `amount_off` | The components' sum minus `value` minor units (not below zero) |

- **Availability**: a bundle can be bought while every component can. A component that is gone,
  inactive or unpublished stops it. Its stock is the smallest `component stock ÷ quantity` among
  tracked components without backorders.
- **Weight**: the bundle's own weight, or else the components' weights times their quantities.
- **Orders** take the components' stock. The order shows the bundle with its components as child
  lines, and downloadable components deliver their files.

## Digital products

Digital products need the **Digital products** (`digital`) module. Turn on **Downloadable** and add
files on the Digital tab:

```json
"downloads": [
  { "id": "01JG…", "type": "file", "file_id": 77, "name": "E-book (PDF)" },
  { "id": "01JH…", "type": "url", "url": "https://course.example.com/…", "name": "Course" }
],
"delivery": { "modes": ["link", "account"], "download_limit": 3, "expiry_days": 30 }
```

- **Files** are uploads to a private disk (`commerce.downloads.disk`, default `local`; up to
  `commerce.downloads.max_upload_mb`, default 512) or external links. A file can belong to the
  product or to one variant (`variants.*.downloads`). Files are never served from a public URL.
- **Delivery** (`delivery.modes`), any of: `attachment` (attached to the "your downloads" email
  when the file is at most `commerce.downloads.attachment_max_mb`, default 10 MB; otherwise a link
  is sent), `link` (a personal link in the email), `account` (My Account → Downloads). Without
  `delivery`, the store's default applies.
- **Access** is granted when the order is paid, or when it is completed (setting). One grant per
  order line and file, with a 64-character token.
- **Limits**: `download_limit` downloads per file (multiplied by the quantity bought) and
  `expiry_days`. Empty means unlimited and never.

Store defaults, Settings → Store → Digital products:

| Setting | Key | Default |
| --- | --- | --- |
| Delivery | `digital.delivery` | `['link', 'account']` |
| Give access when the order is | `digital.grant_on`: `paid` or `completed` | `paid` |
| Downloads per file | `digital.download_limit` | unlimited |
| Links expire after (days) | `digital.expiry_days` | never |

Downloads go through `/downloads/{token}`: each download is counted against the limit and logged
with its time and IP. Links redirect; cloud disks redirect to a five-minute URL; local files stream
through the app. A revoked, expired or used-up grant answers 410. This route keeps working while
the module is off, so bought files stay available.

On the order page staff can resend the links, extend a grant by some days, reset its count or
revoke it (`Digital\Actions\ManageGrant`). Each action goes on the order timeline.
`Digital\Events\DownloadsGranted` is dispatched with the new grants. Orders with only digital or
virtual items skip shipping, and can complete when paid (Settings → Store → Checkout → Complete
digital-only orders when paid, on by default).

## Bulk prices

A product's own bulk prices (the **Bulk prices** tab) apply to everyone, with the **Pricing rules**
(`pricing_rules`) module:

```json
"tiers": [
  { "min_qty": 10, "type": "percent_off", "value": 500, "variant": null },
  { "min_qty": 50, "type": "fixed_price", "value": 120000, "variant": null }
]
```

- `type` is `percent_off` (basis points), `amount_off` or `fixed_price` (minor units per unit).
- `min_qty` starts at 2.
- `variant` is a variant `id` for a tier of one variant, or `null` for all. Tiers for all variants
  count the product's lines together (a medium and a large count as two); a variant's own tiers count
  that variant only.

Pricing rules for groups of products and customer roles are in
[pricing.md](pricing.md#pricing-rules). The product page shows the tier table that applies to the
visitor, for example "Buy 10+: Rp90.000 / pc".

## Price visibility

Settings → Store → Catalog → **Who sees prices** (`catalog.price_visibility`):

| Value | Who sees prices |
| --- | --- |
| `everyone` | Everyone (default) |
| `signed_in` | Signed-in customers |
| `roles` | Customers with one of `catalog.price_visibility_roles` |
| `nobody` | Nobody ("prices on request") |

When prices are hidden from a visitor, nothing reveals them: listings, the product page, the tier
table, flash sale data, structured data, price sorting and filtering, the compare page and the JSON
endpoints all leave them out. Add to cart is replaced by "Sign in to see prices" (`signed_in` and
`roles`, for guests) or by the call to action, and the cart refuses the product.

`Catalog\PriceVisibility` answers it in code: `visible()` for the current visitor,
`visibleTo($user)` for anyone.

## Badges and the stock message

`commerce_product($entry)->badges` lists:

| Badge | When |
| --- | --- |
| `sale` | A variant's current price is below its compare-at price, or a flash sale runs (only while prices are visible) |
| `new` | Published within the last `catalog.new_badge_days` days (default 14; 0 turns it off) |
| `out_of_stock`, `backorder` | No active variant is in stock |
| `featured` | The product is featured |

Templates show them with `$product->hasBadge('sale')`. The stock message (`$product->stock`) follows
`catalog.show_stock`, and the price display of variable products follows `catalog.price_range`:
`range` (Rp10.000 – Rp25.000), `from` (From Rp10.000) or `min` (the lowest only).

## Categories, tags, brands and attributes

These are Sunrice taxonomies; assign terms in the entry editor.

- **Categories** are hierarchical. Filtering by a category includes its subcategories, and so do
  pricing rules and vouchers that target it.
- **Tags** and **brands** are flat.
- **Attribute taxonomies** (Settings → Store → Catalog) are the global options. A product has an
  attribute term when one of its active variants uses it.

**Term pages** are Sunrice's: `/products/category/{slug}`, `/products/tag/{slug}` and
`/brands/{slug}`. Without templates of your own, commerce's views render them as product listings.
The brands index `/brands` lists the brands and needs the **Brands** module. Publish the templates
to change them (see [templates.md](templates.md)).

## Listings and filters

`<x-commerce::products>` renders a product grid, and `<x-commerce::product-filter>` the filter form
(see [blade-components.md](blade-components.md)). Both read the query string:

| Parameter | Filter |
| --- | --- |
| `category`, `brand`, `tag` | Term slugs or ids; one or several (`category[]=shoes`) |
| `attr[colors][]` | Terms of an attribute taxonomy |
| `q` | Title, summary or SKU (up to 100 characters) |
| `min_price`, `max_price` | In whole currency units (`100000` is Rp100.000) |
| `in_stock`, `on_sale` | `1` to keep only those |
| `sort` | `featured` (default: featured first, then manual order, then newest), `newest`, `price`, `-price`, `best_selling`, `name` |

For example `/products?category[]=shoes&min_price=100000&sort=price`. Only these parameters are
read. While prices are hidden from the visitor, the price filter, the on-sale filter and price
sorting are ignored.

The filter shows facet counts for categories, brands, tags and attributes, each counted over the
other filters, plus the price bounds. Counts are cached for five minutes and refreshed when the
catalog changes.

In PHP, use `Catalog\ProductQuery`:

```php
use Sunrice\Commerce\Catalog\ProductQuery;

$entries = ProductQuery::make()->category('shirts')->inStock()->sort('price')->paginate(24);
$facets = ProductQuery::fromRequest($request)->facets();
```

Listings load prices, stock and sale data in bulk, so a page costs the same number of queries
whatever its size.

## Wishlist and compare

**Wishlist** (`wishlist` module): a heart button (`<x-commerce::wishlist-button :entry="$entry" />`)
on cards and the product page, and a page at `/wishlist`.

- Guests' wishlists are kept by a cookie (`commerce_wishlist`) and merge into the account at sign-in.
- Up to 200 items. The page has add-to-cart buttons.
- Customers can share a read-only link (`/wishlist/shared/{token}`).

**Compare** (`compare` module): `<x-commerce::compare-button :entry="$entry" />` and a page at
`/compare`.

- Up to `catalog.compare_max` products (default 4, from 2 to 6), kept in the session, so it works for
  guests.
- The page lists image, price, stock and the product's specifications matched by label, plus the
  fields chosen in `catalog.compare_fields` (`sku`, `brand`, `categories`, `stock`, `weight`,
  `dimensions`, `attributes`, `excerpt`).

Both pages are `noindex`.

## The projection

On `EntryPublished` for an entry of a product collection, `Catalog\ProductProjector` copies the live
Product data into the commerce tables (`commerce_products`, `commerce_variants`, options, tiers,
bundle items, download files):

- It validates the value with the same rules as the editor.
- It skips the work when nothing changed since the last successful sync.
- Rows are updated in place by their ids, so carts and orders keep pointing at them. Variants
  removed from the product are soft-deleted and come back if they reappear.
- Stock is set only once (`initial_stock`, as an `initial` movement).
- It refreshes the listing index: lowest and highest current price (flash sales included), regular
  prices, on sale and in stock.

If the value can't be applied (for example a SKU taken by another product meanwhile), the projection
never throws. The product is marked failed with the reason: it can't be bought, the product editor
and Shop → Products show the error, and `Catalog\Events\ProductSyncFailed` is dispatched. A
successful sync dispatches `ProductSynced`.

Unpublishing and trashing change nothing in the tables: Sunrice decides what can be bought. When an
entry is deleted for good, its variants are soft-deleted and the product is marked removed, so old
orders keep their references.

Re-project by hand:

```bash
php artisan commerce:sync-products                 # every published product entry
php artisan commerce:sync-products --entry=12 --entry=15
php artisan commerce:sync-products --force         # even when unchanged
```

It prints each failure and exits with an error code when any failed.

## Admin pages

- **Shop → Products** lists products with image, title, type, SKU, price range, stock, status (from
  Sunrice) and categories; filters by type, stock status, category, brand, published state and
  failed sync;
  searches title and SKU; bulk actions mark featured, unmark featured, and set the stock status.
  Opening a product goes to Sunrice's entry editor.
- **The Product data field** has tabs: General, Variants (variable products), Bundle (bundles),
  Inventory, Shipping (when it requires shipping), Bulk prices and Digital (when downloadable).
  Extensions add tabs with `api.registerProductTab()` (see
  [extending.md](extending.md#admin-javascript)).
- **Shop → Inventory** lists the variants (bundles excluded) with their stock, filters low, out of
  stock and untracked, and adjusts stock inline with a reason.
