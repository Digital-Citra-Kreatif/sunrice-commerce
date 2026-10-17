# Sunrice Commerce — Specification

Sunrice Commerce (`sunrice/commerce`) is a Laravel package that adds a store to a site built with
[Sunrice CMS](https://github.com/Digital-Citra-Kreatif/sunrice-cms): a product catalog, cart and
checkout, orders, payments, shipping, promotions, customer accounts and store analytics, managed in
the same admin. It aims at what WooCommerce and Shopify give small and medium stores, with
Indonesian defaults (Rupiah, Bahasa Indonesia, provinces and cities, bank transfer, WhatsApp) and no
Indonesia-only assumptions.

This file is the source of truth for **behaviour**. `ARCHITECTURE.md` explains how it is built.
`EXECUTION_PLAN.md` is the source of truth for structure, naming and order of work. If they
disagree, follow this file and record the conflict in the pull request.

## Stack

- Laravel 13, PHP 8.4 or newer, SQLite, MySQL or PostgreSQL.
  - Sunrice itself runs on PHP 8.3; commerce needs 8.4 because `spatie/laravel-one-time-passwords`
    (passwordless sign-in) requires it.
  - PHP 8.4 also allows Sunrice's optional full-page cache (`spatie/laravel-responsecache`).
- Sunrice CMS 1.x: content, admin shell (Inertia, React 19, Tailwind 4, shadcn), roles and
  permissions (`spatie/laravel-permission`), assets, forms, activity log and MCP server.
- Storefront: Blade templates in the host application, plain CSS and one small dependency-free
  script, in the style of Sunrice's starter templates.

## Design principles

1. **Build on Sunrice, don't duplicate it.** Products are entries of a Sunrice collection;
   categories, tags, brands and attributes are taxonomies; images are assets. Product pages get
   Sunrice's templates, SEO, translations, revisions, sitemap, search and menus. The product inquiry
   form is a Sunrice form. Staff use Sunrice's users, roles, activity log and MCP server.
2. **Operational data lives in commerce tables.** Stock, carts, orders, payments, shipments,
   vouchers and statistics change on their own, so they are regular tables (prefix `commerce_`),
   never entry JSON.
3. **Features switch off safely.** Every feature is a module with declared requirements. A module is
   active only when everything it needs is active. Switching one off hides it and keeps its data;
   switching it back on restores it. No module breaks because another one is off.
4. **The server decides money.** Prices, discounts, shipping, taxes and totals are always computed
   on the server from the catalog and the rules. The browser only sends intents: variant, quantity,
   code, choice.
5. **Orders are snapshots.** An order copies the names, SKUs, prices, discounts, taxes, addresses,
   shipping and payment instructions it was placed with. Later catalog or settings changes never
   change a placed order.
6. **Prefer the simplest implementation that is good enough.** Use a column or a small helper
   before adding a package or a workflow state. Offer clear extension points instead of building in
   every gateway and courier.
7. **Extendable by packages.** Payment gateways, shipping carriers, third-party integrations and
   loyalty programs are separate Composer packages. They plug in through documented contracts,
   events, settings sections, admin panels and storefront slots.

---

## Confirmed behavior

### Installation and scaffolding

- Install with `composer require sunrice/commerce`, then `php artisan commerce:install`.
- `commerce:install` publishes the config and admin assets, runs the migrations and creates the
  store structure in Sunrice (below). It also creates the **Shop Manager** and **Customer** roles,
  syncs permissions and imports the Indonesian regions. The regions step asks first; it defaults to
  provinces, cities and districts when the store country is Indonesia.
- It also publishes `spatie/laravel-one-time-passwords`' migration when its table is missing, and
  adds that package's `HasOneTimePasswords` trait to the user model, the way `sunrice:install` adds
  `HasRoles`.
  - It only edits a writable model file inside the app; otherwise it prints what to add.
  - Without the trait, passwordless sign-in can't be switched on.
- `--templates` also publishes the storefront templates; `--demo` adds demo products, vouchers and
  shipping zones.
- The command is safe to run again. It only adds what is missing and never overwrites structure the
  admin has changed (it reports the differences); `--force` overwrites.
- Structure created (handles are fixed; titles are in the main language and can be renamed):
  - Collection `products`: entry URL `/products/{slug}`, listing (Shop page) at `/products`,
    translatable, sidebar icon `shopping-bag`, default blueprint `product`.
  - Blueprint `product`:
    | Field | Type |
    | --- | --- |
    | `product` | Product data (the commerce field) |
    | `excerpt` | textarea |
    | `description` | rich text |
    | `gallery` | images |
    | `specifications` | repeater of label/value |
    | `faq` | repeater of question/answer |
    | `related_products`, `upsells`, `cross_sells` | entries, limited to products |
    | `size_guide` | rich text |
  - Taxonomies:
    | Handle | Kind | Term pages | Blueprint fields |
    | --- | --- | --- | --- |
    | `product_categories` | hierarchical | `/products/category/{slug}` | image, banner, description |
    | `product_tags` | flat | `/products/tag/{slug}` | — |
    | `brands` | flat | `/brands/{slug}` | logo, banner, description, website |
  - Form `product_inquiry`: name, email, phone, quantity, message, plus hidden product fields. It
    notifies the store email.
  - Legal pages, created only when a `pages` collection exists and saved as drafts: Privacy Policy,
    Terms & Conditions, Returns & Refunds, Shipping Policy. Each has starter text in Indonesian and
    English to review.
  - Menu `shop` (optional): Shop, top categories, Brands, Cart, Account.
- The structure can be changed afterwards in Sunrice: add fields to the product blueprint, rename
  titles, change routes. Commerce depends only on the handles named in `commerce.catalog.*`: the
  product collection, the category, brand and attribute taxonomies, and the product field handle.

### Selling modes

Settings → Store → General → **Selling mode**, one of:

| Mode | Cart | Checkout ends with | Payment methods | Typical use |
| --- | --- | --- | --- | --- |
| Online store (`shop`) | yes | An order, paid with a payment method | required | A normal web shop |
| Quotation (`quote`) | yes | A quote request. Staff reply with prices; when the customer accepts, it becomes an order (paid online if Payments is on) | optional | B2B, made-to-order |
| WhatsApp order (`whatsapp`) | yes | An order recorded as Pending; the customer is then sent to WhatsApp with a pre-filled message | no (payment is arranged in the chat) | Social selling |
| Catalog (`catalog`) | no | — (each product shows a call-to-action instead) | no | Showroom; brands that sell on marketplaces |

- **Catalog call-to-action**: the store sets a default and each product can override it. The
  options are the inquiry form, a WhatsApp chat, external links (several buttons per product, e.g.
  Shopee, Tokopedia, TikTok Shop, with presets) or none.
- **Purchase mode** per product: `default` (follow the store), `cart`, `inquiry`, `whatsapp`,
  `external` or `none`.
  - `cart` is honoured only in modes that have a cart; otherwise the product falls back to the
    store's catalog call-to-action.
  - So in Online store mode one product can show "Ask for a price" (inquiry) or "Buy on Tokopedia"
    (external) instead of Add to cart.
- **WhatsApp settings**:
  - One number, or several in rotation (random or round-robin).
  - Message templates per language, with these placeholders: `{product}`, `{variant}`,
    `{quantity}`, `{price}`, `{url}`, `{order_number}`, `{items}`, `{total}`, `{name}`, `{phone}`,
    `{address}`, `{shipping}`, `{notes}`.
  - Links have the form `https://wa.me/{number}?text=…`.
- Clicks on calls-to-action (WhatsApp, external links, inquiry form views and submissions) are
  counted for analytics through a redirect endpoint. No personal data is stored.
- **Pause orders** (General settings): the catalog and cart stay; checkout shows the store's message
  and refuses new orders. Use it for holidays or stock-taking.
- Changing the mode never deletes data. A save that would leave checkout unable to finish is
  refused, with the reason: for example, Online store with no active payment method, or WhatsApp
  mode without a number.

### Feature modules

Settings → Store → **Features** lists the modules in groups. Users with `commerce.settings.features`
switch them on and off.

**Rules**

1. A module is **active** only when all three hold: it is switched on, every module it requires is
   active, and it is available in the current selling mode. Its own switch is remembered
   separately.
   - Example: switching Cart off makes Checkout and Vouchers inactive; they show "Off — needs Cart".
     Switching Cart back on restores them as they were.
2. The Features page shows each module's requirements and dependents. Switching off a module that
   others need asks for confirmation and lists what becomes inactive.
3. When a module is inactive, these stop: its admin pages and sidebar links, storefront routes (they
   answer 404), Blade components (they render nothing), MCP tools (not listed), emails, scheduled
   jobs and listeners. Its data stays, and so do its permissions, so role grants survive.
4. A module never depends on a module it doesn't require. Optional connections go through contracts
   with a "nothing" implementation: with Inventory off, every product is in stock and nothing is
   decremented; with Taxes off, tax is zero; with Shipping off, checkout has no shipping step.
5. What customers already paid for keeps working.
   - Downloads granted before Digital products was switched off work until they expire.
   - An order placed with a payment or shipping method that is now inactive still shows its saved
     instructions.

**Modules**

| Group | Key | Label | Requires | Selling modes | Default |
| --- | --- | --- | --- | --- | --- |
| Catalog | `catalog` | Products, prices and product pages | — (always on) | all | on |
| Catalog | `variants` | Variable products (options and variants) | catalog | all | on |
| Catalog | `bundles` | Bundles | catalog | all | on |
| Catalog | `digital` | Digital products and downloads | orders | all | on |
| Catalog | `brands` | Brands and brand pages | catalog | all | on |
| Catalog | `inventory` | Stock tracking | catalog | all | on |
| Selling | `cart` | Cart and mini cart | catalog | shop, quote, whatsapp | on |
| Selling | `orders` | Orders (and manual orders) | catalog | all | on |
| Selling | `checkout` | Checkout | cart, orders; also payments in Online store mode | shop, quote, whatsapp | on |
| Selling | `documents` | Invoices, packing slips and quotation PDFs | orders | all | on |
| Selling | `taxes` | Taxes | catalog | all | off |
| Payments | `payments` | Payment methods at checkout and the pay page | orders | shop, quote | on |
| Payments | `manual_payments` | Bank transfer, QRIS/e-wallet instructions, cash on delivery | payments | shop, quote | on |
| Shipping | `shipping` | Shipping zones, rates and shipments | orders | all | on |
| Promotions | `pricing_rules` | Bulk, tier and customer-role prices | catalog | all | on |
| Promotions | `flash_sales` | Flash sales | catalog | all | on |
| Promotions | `vouchers` | Vouchers and automatic discounts | cart | shop, quote, whatsapp | on |
| Customers | `accounts` | Customer accounts and My Account | catalog | all | on |
| Customers | `passwordless_login` | Sign in with an emailed one-time code | accounts | all | off |
| Customers | `google_login` | Sign in with Google | accounts | all | off |
| Customers | `wishlist` | Wishlist | catalog | all | on |
| Customers | `compare` | Product comparison | catalog | all | on |
| Insights & AI | `analytics` | Store analytics and reports | catalog | all | on |
| Insights & AI | `ai_tools` | Store tools for AI agents (MCP) | catalog | all | on |

Extension packages add modules of their own (group "Integrations") whose requirements name these
keys, for example a Midtrans package requiring `payments`.

### Products

**What a product is**

- A product is an entry of the products collection. Its **Product data** field holds the commerce
  part. Title, slug, description, images, SEO, translations, categories, tags and brand work as in
  any Sunrice entry.
- Draft/publish, preview, revisions and edit locks apply to product data too: changed prices and
  variants go live when the entry is published.
- **Stock is the exception.** It is changed directly, through Inventory, and is never part of a
  draft.
- Only entries that Sunrice considers published can be bought. This covers scheduled publishing,
  unpublishing, trash and deleted collections, and is checked against Sunrice on every request.

**Types and kinds**

- Product types: **Simple** (one hidden variant), **Variable** (needs `variants`) and **Bundle**
  (needs `bundles`).
- Kind flags are set per product and can be overridden per variant:
  - **Requires shipping** marks a physical product.
  - **Downloadable** marks a digital product and needs `digital`.
  - A product that is neither is **virtual**: a service, ticket or booking.

**Variable products**

- Up to 3 options (for example Size and Color) and up to 100 variants; both limits are configurable.
- Each option is either **custom** or **global**:
  - Custom: values are typed in the product and are not translated.
  - Global: linked to a Sunrice taxonomy that is listed as an attribute taxonomy in settings (for
    example `colors`). Its values are that taxonomy's terms, so they are translated and filterable
    by slug on the storefront. They can show a swatch (a color or an image from the term's
    blueprint).
- The editor generates the variant combinations. Each variant has:
  - SKU, barcode (GTIN), price, compare-at price and cost (used in profit reports, never shown);
  - weight and dimensions, and an image (asset);
  - stock settings, minimum/maximum/step quantity, an active switch and downloads.

**Prices, SKUs and limits**

- Prices are whole numbers in the store currency's minor unit; for Rupiah that is whole rupiah.
- The compare-at price shows as a struck-through "was" price, with the saving.
- SKUs are unique across the store when filled in.
- Quantity rules per variant: minimum, maximum per order and step (sold in multiples).
- Products can be marked **featured**. Products published within the last N days (setting) get a
  "new" badge.

**Bundles**

- A bundle is a fixed list of variants of other products (simple or variable), each with a quantity.
  Bundles can't contain bundles.
- Price: either a fixed price, or the components' sum minus a percentage or an amount.
- Availability: a bundle is available while every component is. Its stock is the smallest
  component stock divided by that component's quantity.
- Weight is the sum of the components' weights, unless the bundle sets its own.
- Ordering a bundle decrements its components. The order shows the bundle with its components, and
  downloadable components deliver their files.

**Inventory (`inventory`), per variant**

- Track stock with a quantity, or set the stock status by hand (in stock / out of stock).
- Backorders: no / allow / allow and tell the customer.
- Low-stock threshold, with a store default of 5.
- Every change is a movement with a reason (order, cancellation, refund, manual, import) and a user,
  and is shown as history.
- Store settings:
  - show stock: always / only when low ("Only 3 left") / never;
  - hide out-of-stock products from listings;
  - who is notified of low and out-of-stock items.

**Languages**

- Product data is shared across languages. Translated text (title, description, names of global
  attribute values) comes from Sunrice translations and terms.
- Custom option values are not translated.

**Admin**

- **Shop → Products** lists products with columns, filters, search and bulk actions:
  - columns: image, title, type, SKU, price range, stock, status (Published / Draft / Scheduled /
    Trashed, from Sunrice), categories;
  - filters: type, stock status, category, brand, published state;
  - search: title and SKU;
  - bulk actions: mark featured, set stock status.

  Opening a product goes to Sunrice's entry editor.
- **Shop → Inventory** lists variants with their stock. Permitted users adjust stock inline (add,
  subtract or set, with a reason).
- **Product data errors**: when the product data can't be applied (for example, a SKU used by
  another product), the product is not purchasable and the editor shows why. Validation normally
  catches this before publishing.

### Price visibility

- Settings → Store → Catalog → **Show prices to**, one of:
  - everyone (the default);
  - signed-in customers;
  - customers with chosen roles;
  - nobody ("Contact us for the price").
- When prices are hidden from a visitor, nothing reveals them. That covers listings, the product
  page, structured data, sorting and filtering by price, the compare page and the JSON endpoints.
- Add to cart is replaced by "Sign in to see prices" (signed-in mode) or by the catalog
  call-to-action.

### Prices and promotions

**Unit price of a cart line**, for the current customer and quantity:

1. Start from the variant price. A bundle starts from its own price rule.
2. Gather the candidates:
   - an active flash sale price, if the item has sale quantity left and the customer is within the
     per-customer limit;
   - the best matching pricing rule for the customer and the quantity;
   - the product's own bulk tiers.
3. The lowest candidate wins (the best price for the customer). Candidates never stack. The source
   that won is saved on the cart line and on the order item.
4. The compare-at price is for display only.

**Order-level discounts** come after unit prices: first automatic discounts (by priority), then
voucher codes (in the order they were applied).

- Each discount works on what is left of the eligible amounts and never goes below zero.
- Discounts are spread over the eligible lines in proportion, exactly to the minor unit, so per-line
  refunds and taxes stay correct.
- Shipping discounts (free shipping) apply to the shipping total.

**Rounding**: every amount is a whole number of minor units, percentages round half up per line,
and totals are sums of lines.

**Pricing rules (`pricing_rules`)**

- A rule has a name, an active switch, an optional start and end, and a priority (used only for
  display order). It also has:
  - **Who**: everyone, guests, signed-in customers, or chosen roles (for example "Reseller").
  - **What**: all products, chosen products or variants, categories (including subcategories), or
    brands.
  - **Tiers**: from quantity N, either percent off, amount off or a fixed unit price.
  - **Quantity counted** per variant, per product (all its variants together), or across every item
    the rule covers (mix and match).
- A role price (for example wholesale) is a rule with one tier starting at quantity 1.
- Products can also have their own bulk tiers in Product data; those apply to everyone.
- The product page shows the tier table that applies to the visitor, for example "Buy 10+:
  Rp90.000 / pc".

**Flash sales (`flash_sales`)**

- A sale has:
  - a name, and a start and end (date and time, in the store timezone);
  - items: variants, or a whole product meaning all its variants. Each item has a sale price
    (fixed, percent off or amount off), an optional sale quantity (a cap) and an optional
    per-customer limit;
  - display options: badge text, a countdown on the product page and cards, a "sold" progress bar,
    and whether to show the sale before it starts (teaser).
- A variant can be in only one sale at a time; saving overlapping sales with the same variant is
  refused.
- The sale price applies only between start and end, and while sale quantity remains. When the sale
  quantity runs out, the item goes back to its normal price.
- While the sale price applies, quantity above the per-customer limit is refused.
- Sale quantity is reserved when an order is placed and released if the order is cancelled.
- `/flash-sale` lists the current and upcoming sales; each sale also has its own page.
- Carts recalculate when a sale starts or ends. If that happens during checkout, checkout shows
  "Prices changed".

**Vouchers and automatic discounts (`vouchers`)**

- **Code**: case-insensitive and unique, made of letters, digits, `-` and `_`. A voucher can also be
  **automatic**: it has no code and applies by itself when its conditions are met.
- **Types**:
  - percent off, with an optional maximum discount;
  - fixed amount off the cart;
  - fixed amount off each eligible item;
  - free shipping, or a shipping discount up to an amount;
  - buy X get Y: buy N of the targets, get M of the targets (cheapest first) at a percentage off or
    free.
- **Conditions**:
  - start and end dates;
  - minimum and maximum subtotal, of the eligible items or of the whole cart;
  - minimum quantity of eligible items;
  - products, variants, categories and brands to include or exclude;
  - exclude items already on sale (flash sale or compare-at);
  - customers: everyone, signed-in only, chosen roles, specific customers or emails, or first order
    only;
  - payment methods;
  - shipping destinations (countries, provinces) and shipping methods.
- **Limits**: total uses; uses per customer (by account, or by email or phone for guests); maximum
  discount.
- **Combining**:
  - One code per order, unless every applied code is marked combinable.
  - Automatic discounts combine with codes unless marked exclusive.
  - A free-shipping voucher combines with one other code by default (setting).
- **Usage** is counted when the order is placed. It is given back if the order is cancelled or
  expires, but not on refund.
- **Messages** say exactly why a code doesn't apply:
  - not found;
  - not started yet, or expired;
  - minimum spend not reached (with how much more is needed);
  - not valid for these products;
  - used up;
  - only for signed-in customers, or only for certain customers;
  - can't be combined;
  - not for this payment method, shipping method or destination.
- Code attempts are rate-limited per visitor.
- **Admin**: a list with uses, discount given and revenue; create, edit, duplicate and deactivate.
  Deleting a used voucher keeps the snapshots in its orders.

**Taxes (`taxes`, off by default)**

- Tax classes: Standard plus any you add (for example Zero).
- Rates by country, optionally narrowed to a province. Each rate has a name (for example PPN), a
  percentage (for example 11%), and switches for compound and for applying to shipping.
- Settings:
  - prices are entered including or excluding tax;
  - prices are shown in the store including or excluding tax;
  - tax is based on the shipping address, the billing address or the store address;
  - rounding is per line.
- Invoices show tax per rate.
- Optional checkout fields for company name and tax ID (NPWP) support B2B invoices.

### Cart (`cart`)

- **Storage**: each visitor has one cart, stored in the database and identified by a cookie holding
  a long random token. Signed-in customers keep their cart across devices.
- **Signing in**: a guest cart merges into the customer's cart. Quantities are added together,
  within stock and quantity rules.
- **Lines** are a variant and a quantity. Adding a line checks the product is purchasable:
  published, purchase mode cart, price visible, variant active, stock, quantity rules and flash sale
  limits.
- **Mini cart**: a count and subtotal in the header, with a drawer or list loaded from a small JSON
  endpoint. Every action also works as a plain form post without JavaScript.
- **Cart page**:
  - items, quantity changes and removal;
  - voucher field;
  - shipping estimate (optional, by destination province and city);
  - totals;
  - cross-sells, from the products' Cross-sells field;
  - a notice when a price or availability changed since the item was added.
- **Cleanup**: untouched carts are deleted after N days (default 30). Carts that were merged or
  turned into an order are kept, linked to the order, for analytics.

### Checkout (`checkout`)

**Page**

One page, in sections:
- contact: email, phone, name;
- account: sign in, create an account, or continue as a guest (per settings);
- shipping address, when something in the cart needs shipping;
- billing address: the same as shipping by default, optionally separate;
- shipping method;
- payment method (Online store mode);
- voucher;
- order notes;
- dropshipper (optional): sender name and phone, printed on the packing slip;
- terms acceptance, linking the Terms page (setting);
- order summary.

**Settings**

- Guest checkout allowed (default yes).
- Create an account at checkout: offer / always / never.
- Require a phone number (default yes).
- Ask for company and tax ID.
- Ask for address line 2.
- Require a postal code.
- Minimum order amount.
- Order notes on or off.
- Dropshipper fields on or off.

**Addresses**

- Indonesia uses cascading selects: province → city/regency → district (kecamatan) → village
  (kelurahan/desa; optional, per settings). The postal code is suggested from the village.
- Other countries use free text for state, city and postal code.
- Signed-in customers can pick one of their saved addresses.

**Shipping methods** are recalculated when the address or the cart changes. Without JavaScript,
an "Update shipping" button does the same.

**Placing the order**

- Everything is recomputed on the server. If anything changed since the customer last saw the
  totals (price, a sale ending, a voucher no longer valid, shipping rate, stock), the order is not
  placed and checkout shows what changed.
- Placing is idempotent: a double submit creates one order.
- Stock, flash sale quantities and voucher uses are reserved when the order is placed, all or
  nothing.

**Completion by selling mode**

- **Online store**: the order is Pending payment. Zero-total orders and cash on delivery go straight
  to Processing. The payment method then takes over (it shows instructions or sends the customer to
  a gateway), and the order page follows.
- **Quotation**: a quote request is created. The thank-you page says the store will reply, and the
  customer and staff are emailed.
- **WhatsApp**: the order is Pending, with payment "Arranged via WhatsApp". The thank-you page opens
  WhatsApp with the order message, plus a button in case it didn't open.

**Order page (thank you)**

- It shows:
  - the order number, status, items and totals;
  - payment instructions: bank accounts, the exact amount to transfer including any unique code,
    and the deadline;
  - an "I have paid" confirmation link;
  - downloads, once paid;
  - the WhatsApp button (WhatsApp mode);
  - an invitation to create an account (guests).
- Its URL contains a long random key, so no sign-in is needed. It is `noindex`.
- Guests can also look up an order at `/track-order` with the order number and email.

### Orders (`orders`)

**Numbers**

- Configurable format: tokens `{Y} {y} {m} {d} {seq}`, with padding like `{seq:5}`, plus fixed
  text.
- The sequence resets never, yearly, monthly or daily. The default is `ORD-{Y}{m}{d}-{seq:4}`.
- Numbers stay unique under concurrent checkouts.

**States**

Each order has three states, shown separately:
- **Status**: Pending payment, On hold, Processing, Completed, Cancelled, Refunded, Failed.
- **Payment**: Unpaid, Awaiting confirmation, Paid, Partially refunded, Refunded, Failed.
- **Fulfilment**: Unfulfilled, Partially shipped, Shipped, Not required (nothing to ship).

Quotes have their own statuses: Requested, Quoted, Accepted (it became an order), Declined, Expired,
Cancelled.

The server enforces the transitions below. Every change goes on the order timeline (who and when)
and into Sunrice's activity log.

| From | To | When | Effects |
| --- | --- | --- | --- |
| (new) | Pending payment | Order placed, unpaid | Stock, sale quantity and voucher uses reserved; emails "order received" (customer) and "new order" (staff) |
| (new) | Processing | Placed with a zero total or cash on delivery | Same reservations and emails |
| Pending payment | Processing | Payment recorded as paid (a gateway, staff approving a transfer, or staff marking it paid) | Digital access granted; email "payment received" |
| Pending payment | Cancelled | The customer cancels (if allowed, before paying), staff cancel, or the payment deadline passes | Stock, sale quantity and voucher uses released; payment cancelled; email "order cancelled" |
| Pending payment | Failed | A gateway reports a failure | Email "payment failed" with a pay-again link; reservations kept until the deadline |
| Failed | Pending payment | The customer pays again | — |
| Pending payment or Processing | On hold | Staff | — |
| On hold | The status before | Staff | — |
| Processing | Completed | Staff; or automatically when fully shipped (setting); or straight away when nothing needs shipping (setting) | Email "order completed" |
| Processing or Completed | Refunded | Refunds reach the amount paid | Email "order refunded" |
| Processing | Cancelled | Staff. If the order is paid, it must be refunded first; the dialog offers that | As for cancelling |

**Payment deadline**: each payment method sets one (bank transfer defaults to 24 hours; gateways
set their own). While a payment confirmation awaits review, the deadline is paused.

**Admin: Shop → Orders**

- **List**:
  - search: number, name, email, phone, SKU;
  - filters: status, payment, fulfilment, payment method, shipping method, date range, voucher,
    channel;
  - saved column choices and CSV export (permission);
  - bulk actions: mark Processing or Completed, print packing slips, export.
- **Order page**:
  - items, with bundle components;
  - a totals breakdown: where each unit price came from, discounts, shipping, taxes, fees;
  - customer and addresses, editable until shipped;
  - payments and confirmations;
  - shipments: add tracking (a courier preset or free text, service, tracking number), with
    partial shipments by item quantity;
  - timeline: status changes, emails sent, notes (internal, or to the customer — those are
    emailed);
  - documents: invoice and packing slip;
  - actions, per permission: mark paid, cancel, refund, complete, resend emails, edit, trash.
- **Manual orders**: staff create an order for a customer, for example from a chat. They pick
  products, variants and quantities. With permission they can override unit prices. They set the
  shipping method and cost, any discount and the payment status. The customer can be emailed the
  order link to pay.
- **Editing items** is allowed only while the order is unpaid. Totals recalculate, and the customer
  can be notified.
- **Refunds** are recorded by hand: amount, items, reason, and whether to restock. Gateway refunds
  come with gateway packages.
- **Trash** (soft delete) needs `commerce.orders.delete`. Orders with payments can't be deleted for
  good.

### Payments (`payments`, `manual_payments`)

**Methods**

- Payment methods are listed in Settings → Store → Payments, in order. Each has:
  - an active switch;
  - a title and description per language;
  - availability: minimum/maximum order total, countries or provinces, shipping methods, customer
    roles;
  - an optional fee (fixed and/or percent);
  - a payment deadline.
- **Built-in manual methods**:
  - **Bank transfer**:
    - several bank accounts (bank, account number, holder, branch, logo);
    - an optional **unique code**: 1–999 added to or subtracted from the total, so each open
      order's transfer amount is unique;
    - instructions on the order page and in the "order received" email, with copy buttons and the
      deadline;
    - a payment confirmation, which can be required or optional.
  - **Payment instructions**: a title, an image (for example a static QRIS code) and
    instructions, for QRIS, e-wallets or anything else. Confirmation works as for bank transfer.
  - **Cash on delivery**: an optional extra fee, limited to chosen destinations and shipping
    methods. The order goes to Processing unpaid; staff mark it paid when the cash arrives.

**Payment confirmation** (bank transfer and instructions methods)

1. The customer submits a confirmation from the order page, from My Account, or from the public
   `/confirm-payment` page (order number plus email).
   - Fields: sender name, sender bank, amount, transfer date, the account paid into, proof (image
     or PDF, up to 5 MB) and a note.
   - The form is protected by a honeypot, a rate limit, and a captcha when one is configured.
2. The payment becomes **Awaiting confirmation** and the deadline pauses. Staff are notified:
   - by email, to the addresses in settings and to users with chosen roles (Shop Manager by
     default);
   - with a badge in the admin;
   - through an MCP tool.
3. Staff with `commerce.payments.verify` see the proof next to the expected amount and the order:
   - **Approve**: the payment is Paid, the order moves to Processing, and the follow-up effects run.
   - **Reject**, with a reason: the payment goes back to Unpaid and the deadline resumes. The
     customer is emailed a link to submit again.
4. Staff can also mark an order paid without a confirmation, entering a reference, date and
   account.

**Pay page** (`/order/{key}/pay`): for unpaid orders, the customer pays again or chooses another
available method. Accepted quotes and manual orders use it too.

**Gateways**: gateway packages add methods (redirect, embedded or virtual-account flows) and their
webhooks through the payment method contract. The core records the results.

### Shipping (`shipping`)

- The store origin address is set in Settings → Store → General.
- **Shipping zones**: each has a name and regions — countries, and for Indonesia also provinces,
  cities/regencies and districts. Zones are checked in order and the first match wins. An optional
  "everywhere else" zone catches the rest.
- **Methods**: each zone has one or more, in order. Every method has a title per language, an
  estimated delivery text (for example "2–3 days") and availability (minimum/maximum cart subtotal,
  maximum weight). The built-in methods:
  - **Free shipping**: always, above a minimum subtotal (after discounts), or with a free-shipping
    voucher.
  - **Flat rate**: per order, plus an optional amount per item.
  - **By weight**, one of:
    - a price per kg, rounding up after a tolerance (for example 1.3 kg counts as 1 kg and
      1.31 kg as 2 kg), with a minimum weight and optional volumetric weight (L×W×H ÷ divisor,
      default 6000);
    - a weight table (up to X kg costs Y).
  - **Local pickup**: pickup locations with an address and instructions; no shipping address is
    needed.
- So "free shipping", "a fixed price per province" and "a price per country" are all a zone plus a
  method.
- Carrier packages (for example RajaOngkir or Biteship) add method types that ask the carrier's API
  for live rates.
- **Shipments** record the courier (presets for common Indonesian couriers with their tracking
  links, or free text), service, tracking number and items. The customer is emailed "shipped" with
  the tracking link. Staff then mark the shipment delivered.
- Orders with nothing to ship skip shipping.

### Indonesian regions

- **Bundled data**:
  - provinces (38), cities/regencies (514), districts (7,285), and villages (83,762) with postal
    codes;
  - source: Kepmendagri 300.2.2-2430/2025, through the MIT-licensed `cahyadsn/wilayah` and
    `cahyadsn/wilayah_kodepos` datasets, converted to database-independent files, with
    attribution.
- **Import**: `php artisan commerce:regions:import --level=district` (levels: province, city,
  district, village). The installer defaults to district.
- **Codes** are the official Kemendagri codes: `32`, `32.73`, `32.73.01`, `32.73.01.1001`.
- **Updates** arrive with package releases. Re-importing updates names, adds new codes and marks
  removed codes inactive, never deleting them.
- Addresses store both codes and names, so an address still prints correctly after a region is
  renamed.
- Other countries use a built-in ISO 3166 country list with free-text state and city.
- Carrier packages map region codes to their own location ids in a shared mapping table.

### Customers and accounts (`accounts`)

**Who customers are**

- Customers are users of the site's user model (Sunrice's `sunrice.auth.user_model`) with the
  **Customer** role, plus a commerce customer record holding phone, addresses, statistics and
  marketing consent.
- Guests who order get a customer record without a user account.

**Kept apart from the Sunrice admin**

- Customers sign in on the storefront, with their own pages and the site's layout, never in the
  Sunrice admin.
- The storefront uses its own session guard (`commerce`, on the same user table). A storefront
  sign-in never opens `/cms`, and the Customer role has no admin permissions.
- Staff accounts can shop too; they sign in on the storefront separately.
- If a site configures the storefront to share the admin's guard, sign-ins by code or Google are
  refused for accounts that can open the admin.

**Signing in**

- Methods:
  - email and password, whenever accounts are on;
  - an emailed one-time code (`passwordless_login`, using `spatie/laravel-one-time-passwords`);
  - Google (`google_login`; needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`).
- Throttling works like the admin login: per email and IP, per IP, and per account.
- **One-time codes**:
  - 6 digits, valid for 10 minutes (setting), usable once, and deleted when used;
  - requesting a new code cancels the previous one;
  - a code works only in the browser that asked for it (same IP and user agent);
  - at most 5 tries per minute;
  - a code can be requested once a minute per email.
- Messages never reveal whether an email has an account.

**Registration**

- Registration can be switched on or off.
- Fields: name, email, phone (optional or required), password.
- With passwordless sign-in on, customers can register without a password. The emailed code then
  verifies the email and signs them in.
- Email verification can be required (on by default); a terms checkbox can be shown.
- Protected by a honeypot, a rate limit, and a captcha when one is configured.
- New accounts get the Customer role and a welcome email.

**Linking guest orders**: when a customer verifies an email (verification link, sign-in code or
Google), earlier guest orders with that email join the account.

**My Account (`/account`)**

- Overview: recent orders and quick links.
- Orders: the list, and each order's details:
  - timeline, payment instructions and payment confirmation;
  - tracking and invoice download;
  - buy again, and cancel (if allowed).
- Downloads: the digital library.
- Addresses: add, edit and delete; set defaults.
- Profile:
  - name and phone;
  - email, with re-verification when changed;
  - set or change the password;
  - marketing consent and the linked Google account.
- Wishlist.
- Quotes (Quotation mode).
- Sign out.
- Request account deletion. Staff are notified and can anonymize: personal data is removed from the
  account, the customer record and the orders, while financial data is kept.

**Admin**

- **Shop → Customers** has a list and a page per customer:
  - list filters: has an account, role, number of orders, total spent, sign-up date;
  - customer page: profile, addresses, orders, statistics, roles (from the list of customer roles),
    notes;
  - actions: send a password reset link, mark the email verified, anonymize.
- Sunrice's Users screen lists staff only, that is accounts that can open the admin. Customers are
  managed in Shop → Customers.

### Digital products (`digital`)

- **Files** belong to a product or a variant. They are uploads to a private disk (never public URLs)
  or external links (for example a course URL).
- **Delivery**: the store sets a default and each product can override it. One or more of:
  - **Email attachment**: files are attached to the "your downloads" email when their total size is
    under a limit (default 10 MB); above it, links are sent instead.
  - **Email link**: personal download links.
  - **My Account library**: downloads are listed under Account → Downloads. Guests are invited to
    create an account; their email links keep working.
- **Access** starts when the order is paid (setting: or when it is completed).
- **Limits**: downloads per file (default unlimited) and expiry in days (default never). Per order,
  staff can resend, extend, reset counts or revoke.
- **Links** are long random tokens. Files stream through the app; S3-type disks use temporary URLs.
  Every download is logged with its time and IP.
- Orders with only digital or virtual items skip shipping and can complete automatically when paid
  (setting).

### Invoices, packing slips and quotations (`documents`)

- Every document is available as a PDF and as printable HTML.
- **Invoice** contents:
  - store logo, name, address and tax ID;
  - invoice number and date, and the order number;
  - billing (and shipping) address;
  - items, discounts, shipping, fees, taxes per rate and total;
  - payment method and status, with bank details while unpaid;
  - notes and footer text.
- **Packing slip** contents: the shipping address with the sender (the store or the dropshipper),
  items and quantities (no prices), notes and the order number.
- **Quotation**: like the invoice, titled "Quotation", with its validity date (Quotation mode).
- **Invoice numbers** have their own format and sequence (default `INV/{Y}/{m}/{seq:4}`, reset
  monthly). They are assigned when the order is placed or when it is paid (setting).
- Documents are in the order's language. Their templates are publishable Blade views.
- **Admin**: download or print per order, or in bulk (packing slips for the selected orders as one
  PDF).
- **Customers**: download the invoice from the order page or My Account (setting).
- Emails can attach documents; see Notifications.

### Notifications

**How emails work**

- Every email can be switched on or off.
- Each has a subject and heading per language, with defaults in Indonesian and English.
- Templates are publishable Blade (markdown) views with the store logo and color.
- Emails are queued, and each one sent is recorded on the order timeline.

**The emails**

- To customers:
  - order received (with payment instructions);
  - payment confirmation received;
  - payment rejected;
  - payment received / order processing;
  - shipped (with tracking);
  - order completed, order cancelled, order refunded;
  - a note from the store;
  - downloads ready;
  - quote received, and quote ready (prices plus an accept link);
  - account emails: welcome, verify email, sign-in code, password reset.
- To staff:
  - new order;
  - payment confirmation submitted (with a link to the proof);
  - order cancelled (by the customer or the deadline);
  - new quote request;
  - low stock, out of stock;
  - account deletion request.

**Recipients and attachments**

- Staff emails go to the addresses and/or the users with chosen roles set per email (default: Shop
  Manager).
- Attachments are set per email:
  - invoice PDF: on customer emails for order received, payment received and order completed;
  - packing slip PDF: on the staff new-order email;
  - digital files: on the downloads-ready email.
- Customer emails are sent in the order's language; staff emails in the main language.

### Wishlist and compare

**Wishlist (`wishlist`)**

- A heart button on product cards and the product page.
- Guests' wishlists are stored by a cookie token and merge into the account at sign-in.
- The wishlist page has add-to-cart buttons. Customers can share a read-only link.
- Up to 200 items.

**Compare (`compare`)**

- Up to 4 products by default (configurable from 2 to 6).
- The compare page lists image, price, stock, brand, categories, options, the product's
  specifications (matched by label) and any fields chosen in settings.
- The list is stored in the session, so it works for guests.

### Store dashboard and analytics (`analytics`)

**Shop → Dashboard** (in the Sunrice admin, `commerce.dashboard.view`)

- A setup checklist until everything is done: add products, a payment method, shipping, the store
  address and the legal pages, then place a test order.
- Store health warnings, any of:
  - no payment method in Online store mode;
  - no shipping zone for physical products;
  - mail not delivering;
  - queue or scheduler not running;
  - regions not imported;
  - Google sign-in on without keys;
  - product data errors;
  - full-page cache on.
- To do: orders awaiting payment confirmation, orders to ship, quotes to answer, low stock.
- KPIs for today, 7 or 30 days, against the previous period: total sales, orders, average order
  value, items sold, new customers. Plus a sales chart, top products and recent orders.

**Shop → Reports** (`commerce.reports.view`)

| Report | Shows |
| --- | --- |
| Sales over time | Gross, discounts, refunds, net, shipping, taxes and total, per day, week or month |
| Products | Units, revenue, views, add-to-carts, conversion |
| Categories and brands | — |
| Vouchers | Uses, discount given, revenue |
| Customers | New vs returning, top customers |
| Stock | Low, out of stock, stock value at cost |
| Calls-to-action | WhatsApp, external and inquiry clicks per product |

Reports take a date range and a comparison period, and export to CSV (`commerce.reports.export`).

**Definitions**

- Gross sales: item totals before order-level discounts, for orders that are paid (or Processing or
  Completed), counted by placement date.
- Net sales: gross minus discounts minus refunds.
- Total: net plus shipping, taxes and fees.
- Average order value: net sales divided by orders.
- Cancelled orders, failed orders and quotes are excluded. Refunds count on the date they were made.

**Tracking**

- Product views and call-to-action clicks are counted per day without personal data. Staff and
  known bots are excluded.
- The Sunrice dashboard gets a small Store card (today's sales, to-do counts) for users who may see
  the store dashboard.

### Admin integration

- **Sidebar group "Shop"**:
  - Dashboard, Orders (badge: to process), Quotes (Quotation mode), Payment confirmations (badge),
    Customers, Products, Inventory, Vouchers, Flash sales, Pricing rules, Reports;
  - each link shows only when its module is active and the user has the permission.
- **Settings → Store**: a tab next to General and SEO. Each section needs its own permission
  (`commerce.settings.<section>`), and extension packages can add sections.
  | Section | Contents |
  | --- | --- |
  | General | Store identity, address, contact, WhatsApp, currency format, units, selling mode, pause orders |
  | Features | Modules |
  | Catalog | Price visibility, call-to-action, stock display, badges, attribute taxonomies, compare fields |
  | Checkout | Fields, guest/account, terms, minimums, order numbers |
  | Payments | Methods |
  | Shipping | Zones and methods, courier presets |
  | Taxes | — |
  | Accounts | Registration, sign-in methods, verification, customer roles |
  | Emails | Each notification, recipients, attachments, texts |
  | Documents | Invoice details and numbering |
- **Product editing** stays in Sunrice's entry editor, through the Product data field.
- **Activity log**: everything staff change in commerce is recorded in Sunrice's activity log —
  orders, payments, refunds, stock, vouchers, sales, rules, settings, features and customers.

### Storefront

**Templates and assets**

- Package fallback views render a working store without publishing anything.
- `php artisan vendor:publish --tag=commerce-templates` publishes editable templates into the app:
  - `resources/views/sunrice/products/…` and the product taxonomy folders for product, listing and
    term pages (Sunrice's template resolution finds them);
  - `resources/views/commerce/…` for store pages;
  - `public/commerce-theme/commerce.css` and `commerce.js`.
- Templates extend the site layout `sunrice.layouts.app` from Sunrice's starter templates when it
  exists.

**Pages**

- Shop (product listing with filters, sorting and pagination), product page, category page, brand
  page, brands index, tag page and product search results.
- Cart, mini cart (a header partial), checkout, order page (thank you), pay page, payment
  confirmation, track order and quote page.
- Flash sale page, wishlist (and shared wishlist), compare.
- My Account, and the sign-in, register, forgot password, reset, link and code pages.
- Legal pages, which are Sunrice pages.

**Filters and sorting**

- Filters: categories (with counts), brands, price range, attributes (global attribute
  taxonomies), in stock, on sale, and search text (title, excerpt, SKU).
- Sorts: featured/manual, newest, price low to high, price high to low, best selling, name.
- URLs are shareable, for example `/products?category[]=shoes&price_min=100000&sort=price`. The form
  works without JavaScript, and only declared filters are read.

**Product page** contents:
- a gallery whose image switches with the variant;
- title and brand;
- price: sale or compare-at, a range for variable products, a tax suffix;
- flash sale countdown and progress, and the tier table;
- variant picker: option buttons or swatches, with unavailable combinations disabled;
- quantity, Add to cart or the call-to-action, and the stock message;
- wishlist and compare buttons;
- description, specifications and FAQ, related products and upsells, breadcrumbs;
- structured data: schema.org Product, Offer and AggregateOffer, without prices when they are
  hidden.

**Languages and indexing**

- Every store page is in the visitor's language, with URL prefixes as in Sunrice (`/cart`,
  `/en/cart`).
- Interface text ships in Indonesian and English, as publishable translations.
- Cart, checkout, order, account, wishlist and compare pages are `noindex`.

**JavaScript is optional.** Forms post normally. `commerce.js` adds AJAX add-to-cart, mini cart
refresh, variant picking, region selects, countdowns and shipping rate refresh.

**For developers**: Blade components that contain logic only (the markup is in the templates, as in
Sunrice) and helpers, all documented:
- `<x-commerce::products>`, `<x-commerce::product-filter>`, `<x-commerce::product>`;
- `<x-commerce::cart>`, `<x-commerce::mini-cart>`, `<x-commerce::checkout>`;
- `<x-commerce::price>`, `<x-commerce::flash-sale>`, `<x-commerce::wishlist-button>`,
  `<x-commerce::compare-button>`, `<x-commerce::region-select>`, `<x-commerce::slot>`;
- `commerce_product($entry)`, `commerce_cart()`, `commerce_customer()`, `commerce_money($amount)`,
  `commerce_url($name)`;
- `@commerceFeature('wishlist') … @endcommerceFeature`.

### AI agents (MCP)

- While `ai_tools` is active, commerce adds tools to Sunrice's MCP server. They use the same token
  and permissions, and the activity log records them with source "AI agent".
- Tools for inactive modules, or that the token's user lacks permission for, are not listed.
- The tools:
  | Area | Tools |
  | --- | --- |
  | Start | `get_store_info` |
  | Orders | `list_orders`, `get_order`, `update_order` (status, notes, shipment), `create_order`, `refund_order` |
  | Payments | `list_payment_confirmations`, `review_payment_confirmation` |
  | Catalog | `list_products`, `get_product`, `adjust_stock` |
  | Customers | `list_customers`, `get_customer` |
  | Promotions | `list_vouchers`, `save_voucher`, `list_flash_sales`, `save_flash_sale`, `save_pricing_rule` |
  | Reports | `sales_report` |
  | Settings | `get_store_settings`, `update_store_settings`, `set_store_feature` |
  | Shipping | `quote_shipping` |
- Product content and product data are edited with Sunrice's entry tools (`update_entry` with the
  `product` field); `get_product` explains the field's shape.
- The server instructions tell agents to ask before approving payments, refunding, cancelling,
  changing prices in bulk or switching features.

### Extension points (for separate packages)

- **Payment gateways**: the payment method contract covers availability, fees, starting a payment
  (instructions, redirect or embedded token), the return, the webhook (verified, idempotent),
  refund/cancel/status capabilities, thank-you and email partials, and a settings schema.
- **Shipping**: the shipping method type contract covers settings, rates for a package to a
  destination, and optional tracking and booking. A region mapping table holds carrier location
  ids.
- **Integrations**:
  - domain events for everything that happens: order placed, paid, cancelled, refunded and shipped,
    payments, stock, customers, vouchers;
  - checkout field hooks;
  - order admin panels and actions, dashboard widgets, settings sections and features;
  - storefront slots.
- **Loyalty**: a discount provider contract (for example, redeeming points), My Account pages,
  checkout and cart slots, order lifecycle events (earn on paid or completed, reverse on refund or
  cancel) and customer data.

Details are in `ARCHITECTURE.md` § Extension contracts.

### Security and privacy

**Access**

- Permissions are checked on the server everywhere: admin endpoints, MCP tools and actions.
  Policies deny access to inactive modules.

**Storefront protection**

- Every storefront form has CSRF protection.
- Public forms have a honeypot and rate limits: register, sign-in, link/code requests, payment
  confirmation, inquiry, voucher codes and add to cart.
- A captcha is added when one is configured in Sunrice.

**Orders and money**

- Guests reach order pages only with the long random key. Lookups need the order number plus email.
  Nothing personal appears in URLs.
- Payment proofs and digital files are stored on private disks and served only to authorized users.
  Uploads are checked for type (jpg, png, webp, pdf) and size.
- Prices and totals are never accepted from the browser.
- Webhooks are verified (signature checks per gateway) and processed idempotently.

**Credentials**

- Customer passwords are hashed.
- One-time sign-in codes expire within minutes, are deleted once used, and are checked in constant
  time. Other tokens (download and order keys) are long random strings.
- Remember-me cookies are per guard.

**Personal data**

- Accounts can be deleted or anonymized.
- Payment proofs are pruned after N days (setting, default 365).
- IP addresses are kept only where needed (orders, downloads) and can be pruned.

### Performance

- **Listings**: product listings add a fixed number of queries whatever the page size, because
  prices, stock and sale data load in bulk. Tests guard this, as in Sunrice.
- **Caching**:
  - Prices are never cached with pages. Sunrice's query cache stores only entry ids, so it stays
    valid.
  - With the full-page cache on, product pages and store pages are excluded (needs upstream U11;
    until then the store dashboard warns that the full-page cache is on).
- **Hot paths**: add-to-cart, checkout and stock changes never bump Sunrice's content cache version.
- **Statistics** are pre-aggregated per day.

---

## Permission matrix

All commerce permissions use the `commerce.` prefix and appear in Users → Roles under the "Store"
groups (registered with `Sunrice::registerPermission()`):

| Permission | Grants |
| --- | --- |
| `commerce.dashboard.view` | The store dashboard |
| `commerce.orders.view` | Viewing orders and quotes |
| `commerce.orders.create` | Creating manual orders |
| `commerce.orders.edit` | Editing orders: addresses, items while unpaid, notes, status changes |
| `commerce.orders.override-prices` | Changing unit prices in manual and unpaid orders |
| `commerce.orders.cancel` | Cancelling orders |
| `commerce.orders.refund` | Recording refunds |
| `commerce.orders.delete` | Trashing orders |
| `commerce.orders.export` | Exporting orders |
| `commerce.quotes.respond` | Pricing and sending quotes |
| `commerce.payments.verify` | Approving and rejecting payment confirmations; marking orders paid |
| `commerce.shipments.manage` | Adding and editing shipments and tracking |
| `commerce.documents.view` | Downloading and printing invoices, packing slips and quotations |
| `commerce.customers.view`, `.edit`, `.delete`, `.export` | Customers (`delete` = anonymize) |
| `commerce.inventory.view`, `.adjust` | Stock levels; adjusting them |
| `commerce.vouchers.manage` | Vouchers and automatic discounts |
| `commerce.flash-sales.manage` | Flash sales |
| `commerce.pricing-rules.manage` | Pricing rules |
| `commerce.reports.view`, `.export` | Reports; exporting them |
| `commerce.settings.general`, `.features`, `.catalog`, `.checkout`, `.payments`, `.shipping`, `.taxes`, `.accounts`, `.emails`, `.documents` | One per Settings → Store section; `.features` switches modules |

Product content uses Sunrice's own permissions: the entry permissions of the products collection
(`sunrice.entries.{id}.*`) and the term permissions of the product taxonomies.

## Default roles

| Role | Gets |
| --- | --- |
| Shop Manager | `sunrice.access-admin`, `sunrice.view-drafts`, every entry permission of the products collection, the term permissions of the product categories, tags, brands and attribute taxonomies, `sunrice.assets.view`/`upload`/`edit`, the inquiry form's submission permissions, and every `commerce.*` permission |
| Customer | No admin permissions. It is the storefront role, used by price visibility and pricing rules |
| Administrator (Sunrice's) | Every `commerce.*` permission as well |

- `php artisan commerce:seed-roles` creates or updates these roles. It only adds permissions, so run
  it again after adding attribute taxonomies.
- Suggested custom roles (documented, not seeded):
  - **Fulfilment**: `orders.view`, `shipments.manage`, `documents.view`.
  - **Finance**: `orders.view`, `payments.verify`, `orders.refund`, `reports.*`.
  - **Reseller**: a customer role used in pricing rules.

## Packages

| Need | Package |
| --- | --- |
| Google sign-in | `laravel/socialite` |
| Passwordless sign-in (emailed codes) | `spatie/laravel-one-time-passwords` (requires PHP 8.4) |
| PDF documents | `barryvdh/laravel-dompdf` (dompdf, pure PHP), behind a renderer contract |
| Indonesian regions | Data from `cahyadsn/wilayah` and `cahyadsn/wilayah_kodepos` (MIT), vendored as files |
| CSV export | `spatie/simple-excel` (already used by Sunrice) |
| Admin charts | `recharts` (bundled into the commerce admin script) |

Confirm that each package's current release declares Laravel 13 support before adding it.

Deliberately not used:

- `brick/money`, `moneyphp/money`: integers in minor units plus a small helper are enough. Both
  libraries also treat IDR as having two decimals.
- `laravolt/indonesia`: older decree, about 140 truncated names, and a cache clear that flushes the
  whole application cache.
- Magic-link packages: a code works only in the browser that asked for it, which is safer than a
  link that works anywhere. So sign-in is by code only.
- Payment and shipping SDKs: they belong in the separate gateway and carrier packages.

## Out of scope for v1

- Multiple currencies; multiple stores or warehouses; marketplaces (multi-vendor); point of sale.
- Payment gateway and courier API integrations (separate packages); shipping labels.
- Product reviews and ratings; product Q&A.
- Subscriptions, memberships, gift cards, store credit and loyalty points (loyalty is a separate
  package).
- Abandoned-cart emails, back-in-stock and price-drop alerts, product feeds (Google Merchant, Meta).
- Configurable bundles (customer-picked components), product add-ons and personalization fields,
  deposits and installments.
- A returns/RMA workflow and exchanges; refunds are recorded by hand.
- Product CSV import/export and bulk price editing. These are planned right after v1 and need
  upstream U5.
- A headless/REST API (the MCP server and the Blade components are the interfaces); search engines
  (Scout).
- e-Faktur/Coretax tax invoices and accounting integrations (separate packages).
- B2B company accounts with several buyers, approval workflows and credit limits.
