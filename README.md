# Sunrice Commerce

An e-commerce package for [Sunrice CMS](https://github.com/Digital-Citra-Kreatif/sunrice-cms): catalog (simple, variable, bundle, physical, digital products), cart and checkout, orders, payments (bank transfer with confirmation, QRIS, COD, gateway packages), shipping (zones, Indonesian regions), promotions (pricing rules, flash sales, vouchers), customer accounts (password, one-time codes, Google), invoices and packing slips, store analytics and MCP tools — with every feature switchable from Settings → Store.

## Quick start

```bash
composer require sunrice/commerce
php artisan commerce:install --demo
```

Then run the scheduler and a queue worker, set up mail, and open the admin → **Shop → Dashboard**:
a checklist leads you through the rest. Details in [docs/installation.md](docs/installation.md).

Requirements: PHP 8.4+, Laravel 13, Sunrice CMS 1.x, SQLite, MySQL or PostgreSQL. No Node needed:
the admin bundle is prebuilt.

## Documentation

| | |
| --- | --- |
| Setup | [Installation](docs/installation.md) · [Configuration](docs/configuration.md) · [Upgrading](docs/upgrading.md) · [Commands](docs/commands.md) |
| Modules | [Features](docs/features.md) · [Catalog](docs/catalog.md) · [Pricing](docs/pricing.md) |
| Selling | [Checkout](docs/checkout.md) · [Orders](docs/orders.md) · [Payments](docs/payments.md) · [Shipping](docs/shipping.md) · [Regions](docs/regions.md) |
| Customers and output | [Accounts](docs/accounts.md) · [Emails](docs/emails.md) · [Documents](docs/documents.md) |
| Storefront | [Templates](docs/templates.md) · [Blade components](docs/blade-components.md) · [Helpers](docs/helpers.md) |
| Insights and AI | [Analytics](docs/analytics.md) · [AI agents](docs/ai-agents.md) |
| Extending | [Extending](docs/extending.md) · [Building an extension package](docs/extension-package.md) |

## Design documents

| Document | Purpose |
| --- | --- |
| [SPEC.md](SPEC.md) | Behaviour: what the store does |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Design: modules, data model, pipelines, contracts, upstream CMS changes |
| [EXECUTION_PLAN.md](EXECUTION_PLAN.md) | Ordered tasks with dependencies and done criteria |
| [AGENTS.md](AGENTS.md) | Rules for contributors and AI agents |
| [CHANGELOG.md](CHANGELOG.md) | Changes per release |

## License

MIT.
