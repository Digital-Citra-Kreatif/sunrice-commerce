# Changelog

## Unreleased

## 0.2.0 (2026-11-07)

**Upgrading from 0.1**: commerce now needs Sunrice 0.7. Run `composer require sunrice/commerce:^0.2 sunrice/admin:^0.7 sunrice/cms:^0.7 -W`, then `php artisan migrate` (the webhook tables) and `php artisan sunrice:assets`. Update the gateways at the same time: `sunrice/commerce-midtrans`, `-xendit` and `-biteship` 0.1.1 accept commerce 0.2.

**Highlights.**

- **Outgoing webhooks**: signed, queued, retried and logged, for orders, shipments and stock.
- **The admin matches the panel**: page headers, menus and widths are the panel's. Settings sections are tabs, and nothing shifts while a page loads.
- **Forms fold and sum themselves up**: cards show a one-line summary when folded, with Expand all / Collapse all. Groups are headings, repeater rows fold, and text in each language goes in language tabs.
- **Products show once in the sidebar**, under Shop. With several product collections, New product asks which one.
- **The order timeline reads in each reader's language.**

- **Forms fold and sum themselves up, as the panel's do**: a folded card (Settings, vouchers,
  pricing rules, flash sales, shipping, payments) says in one line what it holds. Forms with two or
  more cards get Expand all / Collapse all. A group is a small heading with a rule, not another
  label over a box. Repeater rows (bank accounts, price tiers, pickup locations, weight tables) fold
  to a one-line summary; new rows and rows with errors stay open. Text in each language (payment
  titles and instructions, shipping method titles, email subjects, WhatsApp messages) is in language
  tabs instead of one input per language. The region picker uses the panel's Select. The six
  copies of the per-language builder are now one, `SchemaForm::perLanguage()`; see
  [Extending](docs/extending.md).

- **Products and their taxonomies show once in the sidebar**: with Sunrice 0.7 (now required), the
  product collections and the product categories, brands, tags and attribute taxonomies are listed
  only under Shop → Products (`ContentNavigation::listElsewhere()`), not again under Content and
  Taxonomies; the attribute taxonomies (Settings → Catalog) join that submenu. With several product collections, **New product** asks which one, offering only those the user may add to.

- **The order timeline reads in each reader's language**: entries were written once, in the store's
  language, so an English admin read "Status berubah dari Diproses ke Selesai". Commerce now records
  what it says as an `Orders\TimelineText` (`Timeline::text($key, $replace)`, with labels as nested
  texts and `->then()` for tracking numbers and reasons), kept with the entry and translated when the
  admin order page or the AI tools read it (`OrderEvent::text()`); notes people wrote stay as they
  are, and entries recorded before keep their text. Return, download and payment link entries have
  translations of their own now.

- **The admin looks and works like the rest of the panel**: Shop pages use the panel's page header
  (the title in its display style, one primary action, the rest in a "⋮" menu, a back button), the
  panel's width and spacing (lists, dashboards and order pages full width; forms at the forms'
  width, left-aligned) instead of their own padding and centred columns, and the panel's lists (a
  search box, `Status: all` filters with the rest under "More filters", a Columns menu, the table in
  a card with its pages at the foot, rows that open when clicked). Forms put Save in the header and
  warn before leaving with unsaved changes, lay out in titled cards that fold away, with fields side
  by side and shown only when they apply (the CMS's `width` and `condition`, plus a field's
  `section`; vouchers, pricing rules, flash sales and Settings → General use them), and use the
  panel's selects and checkboxes. Store settings show their sections as tabs, so one menu stays at
  the side. On an order, the status badges sit by its number, its next steps are buttons and the
  rest (customer view, edit items, refund, cancel, trash) is in the "⋮" menu. The Shop group comes
  first in the sidebar and its dashboard is called Overview. The dashboard's loading placeholders
  are as large as what replaces them, so nothing moves while it loads.

- `webhooks` module (off by default): Settings → Webhooks (`commerce.settings.webhooks`) sends
  orders (`order.placed`, `order.paid`, `order.status_changed`, `order.cancelled`,
  `order.completed`, `order.refunded`), shipments (`shipment.created`, `shipment.delivered`) and
  stock changes (`stock.low`, `stock.out`, `stock.back_in`) to endpoints as signed JSON POSTs,
  queued after the change is saved, retried for about 11 hours and logged; endpoints that keep
  failing are switched off. Public HTTPS addresses only. Config `commerce.webhooks.*`; new tables
  `commerce_webhooks` and `commerce_webhook_deliveries`. See [docs/webhooks.md](docs/webhooks.md).

## 0.1.0 (2026-11-06)

The first release, for `sunrice/admin` and `sunrice/cms` 0.6. Until 1.0, minor versions (0.2, 0.3…) may change
the public API; each change is listed here with the steps to take. Commerce is a plugin for the Sunrice panel (`sunrice/admin`) and CMS
(`sunrice/cms`), on PHP 8.4 and Laravel 13: products are CMS entries edited in the CMS's entry
editor, the store's admin pages live in the panel under Shop, and the storefront renders through
the CMS's templates and full-page cache.

### Loyalty points
- `loyalty` module (off by default, Online store mode): a points wallet on each customer account
  (1 point is 1 unit of the store's currency). Settings → Loyalty sets one store-wide rule (a
  percentage of the products after discounts, products to include or leave out, a minimum order,
  an expiry in days); completed orders earn and refunds take back their share. Signed-in customers
  pay with their points in the cart, after tax, up to the balance (a new last calculation stage,
  `Loyalty\Loyalty`, and `totals.points`); points are taken when the order is placed, given back
  when it's cancelled, and refunds beyond the money paid go back onto the wallet. My Account →
  Points; Shop → Customers → Loyalty points (`commerce.loyalty.manage`) to see and adjust balances;
  expiry in `commerce:prune`. New column `commerce_customers.loyalty_points` and table
  `commerce_loyalty_transactions`.
- Refunds lock the order while they're worked out, and send only the money part to the payment
  provider.

### Returns
- `returns` module (off by default): customers request returns of completed orders within
  `checkout.returns_days` from My Account (items, quantities, reason, details); staff review them
  in Shop → Orders → Returns (`commerce.returns.manage`) with a note emailed to the customer; the
  "Return requested" (staff) and "Return updated" emails; entries on the order's timeline. New
  tables `commerce_returns` and `commerce_return_items`.

### Product CSV
- Shop → Products → Export CSV (every variant) and Import CSV: bulk price, compare-at price, cost,
  stock, weight and active changes by SKU, previewed with every change and every unusable row before
  they apply, through the product field (live value and draft) and stock movements ("import").

### Product feeds
- `product_feeds` module (off by default): `/feeds/products.xml` for Google Merchant Center and
  Meta catalogs (RSS 2.0 with `g:` fields), one item per buyable variant at the price the product
  page shows; its address on the Store health page.

### Back-in-stock alerts
- `stock_alerts` module (needs Stock tracking): "Email me when it's back" on sold-out products and
  variants, the "Back in stock" store email sent once by `commerce:tick` when the variant can be
  ordered again, customers waiting per variant in Shop → Inventory, pruning and anonymisation. New
  table `commerce_stock_alerts`; `Notifications\Notifier::sendTo()` sends a store email to an
  address of its own.

### Reviews
- Product reviews and ratings (`reviews` module): a 1–5 star rating and text on the product page
  (`<x-commerce::reviews>`), verified purchases, who may review and whether reviews need approval
  (Settings → Store → Catalog), moderation and replies in Shop → Products → Reviews
  (`commerce.reviews.manage`), the rating on cards and in the product's JSON-LD
  (`aggregateRating`), a honeypot, captcha for guests and a rate limit, and anonymisation with the
  customer. New table `commerce_reviews`; `commerce_products` gets `rating_count` and
  `rating_average`.

### Starter theme
- `commerce:install --starter` (tag `commerce-starter`) publishes a complete shop: the storefront
  templates plus Sunrice's layout, a sticky header with a department mega menu (a drawer on phones),
  product search, account, wishlist and cart icons, a footer, the home page (hero, category tiles,
  flash sale with countdown, new arrivals, best sellers, brands), content pages, search results
  and a 404 page.
- The storefront theme is restyled in a clean, product-first look and its templates gained:
  breadcrumbs, a product gallery with thumbnails, colour swatches in the variant picker, on cards
  and in the filters (from a colour term's `swatch` field), size boxes, collapsible product
  details, bundle contents and digital delivery details, upsells; a listing layout with a filter
  column (a drawer on phones), a category tree, active-filter chips, product counts and empty
  states; a two-column cart and checkout with step indicator, line images and a sticky summary;
  a thank-you page; account pages, sign-in with a "new customer" panel, wishlist add-to-cart.
  New partials: `listing`, `active-filters`, `product-extras`, `breadcrumbs`, `empty`,
  `pagination`, `icon`. Slots, `data-commerce-*` hooks and class names are kept.
- `commerce.css` uses design tokens (`--commerce-fg`, `--commerce-accent`, `--commerce-font`…);
  `commerce.js` adds the menu and filter drawers, quantity steppers and gallery thumbnails.
- Invoices, packing slips, quotations and store emails share the look.
- `StarterStoreSeeder` (`--starter --demo`): an apparel store with about 50 products, variants,
  placeholder artwork, bundles, digital products, promotions, shipping, payments, pages, menus and
  a demo customer (`customer@example.com` / `password`) with orders and a wishlist.

### Store
- Products as Sunrice entries with a Product data field: simple, variable (up to 3 options),
  bundle and digital products; external links and calls to action (WhatsApp, inquiry, shop links);
  stock with backorders, low-stock alerts and history; brands, categories, tags and attribute
  taxonomies with filters; wishlist and compare.
- Pricing pipeline: tier prices, pricing rules by audience, flash sales with caps and per-customer
  limits, vouchers and automatic discounts (percent, fixed, free shipping, buy X get Y), taxes,
  fees and staff overrides.
- Cart (guest and signed in, merged at sign-in), checkout for four selling modes (online store,
  quotation, WhatsApp order, catalog), Indonesian addresses down to the village, and a totals check
  so customers never pay a price they didn't see.
- Orders and quotes with a state machine, timeline, manual orders, editing unpaid orders,
  shipments, refunds, numbering formats, expiry of unpaid orders, and invoices, packing slips and
  quotations as PDFs.
- Payments: bank transfer with unique codes and payment confirmations, payment instructions
  (QRIS and others), cash on delivery, and the gateway contracts with signed, idempotent webhooks.
- Shipping: zones over Indonesian regions, flat, weight-based, free and pickup methods, courier
  presets and tracking.
- Customer accounts: password, emailed sign-in codes and Google; orders, quotes, downloads,
  addresses and deletion requests; anonymization for staff.
- Taxes by shipping, billing or store address, with prices shown including or excluding tax.
- Emails for every order event, editable in Settings → Store → Emails, with the store logo and
  brand color.
- My Account overview with recent orders and quick links; terms and captcha at registration.
- Everything the store needs in the admin's Shop group: products with their categories, brands
  and tags, and Store settings.
- Hidden copies of customer emails; `Commerce::emailTemplate()`, `emailTheme()` and
  `documentTemplate()` replace email bodies, the email frame, account emails, invoices, packing
  slips and quotations with a site's or package's own views.
- Customers admin with filters by role, orders, spending and sign-up date, and CSV export.
- Analytics: daily statistics, a dashboard with KPIs, a sales chart and to-dos, eight reports with
  CSV export, and view and click tracking without personal data.
- 23 store tools for AI agents on Sunrice's MCP server; refunds, payment reviews, cancelling,
  store features and price-changing saves need `confirm: true`.
- Storefront templates (publishable), Blade components, slots, SEO (JSON-LD, canonical URLs,
  noindex on private pages) and query budgets guarded by tests.

### For developers
- The `Commerce` registration API, contracts for payments, shipping, pricing (including
  `ReservesDiscounts`), checkout completions, inventory, taxes and documents, events, and
  `window.SunriceCommerce` for the admin; documented in `docs/extending.md`.
- `Payments\Methods\GatewayMethod`, the base for redirect gateway packages
  (`sunrice/commerce-midtrans`, `sunrice/commerce-xendit`): sandbox keys from `.env`, a payment
  page created once per payment, status checks on return, and the amount checked against the
  payment.
- `commerce:install [--templates] [--demo]`, `commerce:doctor`, `commerce:stats` and the other
  commands in `docs/commands.md`.
- Documentation in `docs/`.
- Template helpers `commerce_values($entryOrTerm)` (a CMS entry translation's or term's field
  values, worked out once per request) and `commerce_body_classes()`; see `docs/helpers.md`.
- `ProductView::$variants` (the picker rows) is built the first time it's read, and the variants'
  option values load then, in one query for the page. Listing cards, cart lines and checkout no
  longer build a row per variant, which made pages of products with many variants slow (24
  products with 100 variants: about 550 ms to 190 ms on SQLite; a 200-line cart about 870 ms to
  470 ms; `COMMERCE_BENCH=1 vendor/bin/pest tests/Feature/Catalog/ProductViewBenchmarkTest.php`). The rows, `variantsJson()`, `jsonSerialize()` and the JSON-LD `offerCount` are
  unchanged. `ProductView`'s constructor and `with(variants: …)` also take a closure that builds
  the rows.

### Marketing emails
- New `marketing` module (off by default): email campaigns to customers who accept marketing, with
  audience rules (days since the last order, recent buyers, new customers, spending, products
  bought, location, engagement…) and a live count; automations with templates (abandoned cart,
  welcome, no first order yet, after an order, win back); texts per language with smart tags,
  preview and test sends; open and click tracking with per-link results; one-click unsubscribe.
  Sent by queued jobs in batches (`commerce.marketing.*`). Permission `commerce.marketing.manage`;
  run `php artisan migrate` and `php artisan commerce:seed-roles` (Shop Manager gets it). See
  [docs/marketing.md](docs/marketing.md).
- `Commerce::registerMarketingTrigger()` adds automation triggers from packages.

### Fixes
- CSV exports (orders, customers, reports) write text that starts like a formula as plain text, so a
  customer's name can't run in Excel or Sheets.
- Changing or resetting a storefront password signs out "remember me" on other devices, and
  changing the email needs the current password. Sites that published `account/profile.blade.php`
  need its new `current_password` field (`php artisan vendor:publish --tag=commerce-templates`, or
  copy it in).
- The customer page only gives or takes away roles with less access than the staff member's own
  (Sunrice's permission ranking); other roles the account has are kept.
- The Shop Manager role gets `sunrice.guide.view` (run `php artisan commerce:seed-roles`).
- Full-page cache: product, shop and product term pages are cached for anonymous visitors for
  `commerce.cache.product_pages_ttl` seconds (300), and cleared when a product sells out, runs
  low or comes back, and when prices change. Visitors with a cart, wishlist, comparison or
  customer account are never served a cached page, so they don't see someone else's header or an
  empty cart count. Needs Sunrice's `bypassPageCacheUsing()`; on older versions product pages
  stay out of the cache.
- A gateway payment confirmed after its deadline cancelled the order is recorded paid, but the order
  stays cancelled and isn't fulfilled (no downloads, invoice number or "payment received"):
  `PaymentAfterCancellation` fires and staff get the new `staff_paid_after_cancel` email.
- A gateway reporting less than the amount due no longer marks the order paid; the timeline notes it.
- A webhook that fails while recording gives its event id back, so the gateway's retry is processed
  instead of ignored as a duplicate.
- Cancelling, refunding with restock or editing an order returns the components a bundle was sold
  with, even after the bundle's contents changed.
- One payment or quote that fails to expire no longer stops the others in `commerce:tick`.
- Guest orders join an account only when its email is verified (or the account was made by that
  checkout), so registering someone else's address doesn't collect their orders.
- With the storefront sharing the admin's guard and Sunrice's two-factor login on, staff can't sign
  in with their password on the storefront (it skipped the code step).
- The SKU check, variant search and targets picker APIs check permissions (product editing, order
  editing, or managing vouchers, flash sales or pricing rules).
- Bulk packing slips are rendered 25 orders at a time (`commerce.documents.batch_size`) into one
  PDF, so 200 orders no longer run out of PHP's memory. Renderers can do the same by implementing
  `Documents\BatchRenderer`.
- A cart holds up to 500 different products (`commerce.cart.max_lines`); adding another is refused
  with a message (`cart_full`), on the add-to-cart form, the cart API, "Buy again" and the sign-in
  merge. More of a product already in the cart is still fine. The cart page shows 25 lines a page
  (`commerce.cart.per_page`, `?page=`) with the whole cart's totals, and the drawer and checkout
  summary list the first 10 (`commerce.cart.preview_lines`) and then "and 3 more". The cart JSON
  has `line_count`, and `GET {api}/cart?lines=10` lists only the first lines. Changed templates:
  `partials/cart`, `partials/mini-cart`, `partials/checkout-summary`, and the theme's `commerce.js`
  and `commerce.css`; published copies keep showing every line until updated.
