# Changelog

## Unreleased — 1.0.0

The first release. Needs Sunrice CMS 1.x with the settings tabs, users scope and structure import
changes (`dev-main` until Sunrice is tagged), PHP 8.4 and Laravel 13. On Sunrice versions with dashboard cards, MCP instructions and
full-page cache control, commerce also adds a Store card to Sunrice's dashboard, adds its guidance
to the MCP server's instructions and keeps store pages out of the full-page cache.

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
- `commerce:install [--templates] [--demo]`, `commerce:doctor`, `commerce:stats` and the other
  commands in `docs/commands.md`.
- Documentation in `docs/`.

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
