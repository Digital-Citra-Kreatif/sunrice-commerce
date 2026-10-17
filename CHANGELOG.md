# Changelog

## Unreleased — 1.0.0

The first release. Needs Sunrice CMS with the settings tabs, users scope and structure import
changes, PHP 8.4 and Laravel 13.

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
- Emails for every order event, editable in Settings → Store → Emails.
- Analytics: daily statistics, a dashboard with KPIs, a sales chart and to-dos, eight reports with
  CSV export, and view and click tracking without personal data.
- 23 store tools for AI agents on Sunrice's MCP server.
- Storefront templates (publishable), Blade components, slots, SEO (JSON-LD, canonical URLs,
  noindex on private pages) and query budgets guarded by tests.

### For developers
- The `Commerce` registration API, contracts for payments, shipping, pricing (including
  `ReservesDiscounts`), checkout completions, inventory, taxes and documents, events, and
  `window.SunriceCommerce` for the admin; documented in `docs/extending.md`.
- `commerce:install [--templates] [--demo]`, `commerce:doctor`, `commerce:stats` and the other
  commands in `docs/commands.md`.
- Documentation in `docs/`.
