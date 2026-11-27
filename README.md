# Sunrice Commerce

An e-commerce package for [Sunrice CMS](https://github.com/Digital-Citra-Kreatif/sunrice-cms): catalog (simple, variable, bundle, physical, digital products), cart and checkout, orders, payments (bank transfer with confirmation, QRIS, COD, gateway packages), shipping (zones, Indonesian regions), promotions (pricing rules, flash sales, vouchers), customer accounts (built on [`sunrice/account`](https://github.com/Digital-Citra-Kreatif/sunrice-account): password, emailed codes, Google), invoices and packing slips, store analytics and MCP tools — with every feature switchable from Settings → Store.

## Quick start

```bash
composer require sunrice/commerce
php artisan sunrice:install --plugins   # the Sunrice panel, with the Accounts and Commerce plugins on it
php artisan account:install             # customer accounts (sunrice/account, installed with commerce)
php artisan commerce:install --demo
```

Your panel provider ends up with both plugins; add the Users screen that lists staff only:

```php
$panel->userResource(AccountUserResource::class)
    ->plugin(CmsPlugin::make())->plugin(AccountPlugin::make())->plugin(CommercePlugin::make());
```

Every order belongs to a customer account: visitors browse and fill a cart freely, and sign in
(one email field, with an emailed code) when they check out.

Then run the scheduler and a queue worker, set up mail, and open the admin → **Shop → Dashboard**:
a checklist leads you through the rest. Details in [docs/installation.md](docs/installation.md).

Requirements are PHP 8.4+, Laravel 13, Sunrice Admin and CMS 0.8.1+,
`sunrice/account` 0.2.1+ and SQLite, MySQL or PostgreSQL. The admin bundle is prebuilt.

## Documentation

| | |
| --- | --- |
| Setup | [Installation](docs/installation.md) · [Configuration](docs/configuration.md) · [Upgrading](docs/upgrading.md) · [Commands](docs/commands.md) |
| Modules | [Features](docs/features.md) · [Catalog](docs/catalog.md) · [Pricing](docs/pricing.md) |
| Selling | [Checkout](docs/checkout.md) · [Orders](docs/orders.md) · [Payments](docs/payments.md) · [Shipping](docs/shipping.md) · [Regions](docs/regions.md) |
| Customers and output | [Accounts](docs/accounts.md) · [Emails](docs/emails.md) · [Marketing emails](docs/marketing.md) · [Documents](docs/documents.md) |
| Storefront | [Templates](docs/templates.md) · [Blade components](docs/blade-components.md) · [Helpers](docs/helpers.md) · [Interface audit](docs/interface-audit.md) |
| Insights and integrations | [Analytics](docs/analytics.md) · [AI agents](docs/ai-agents.md) · [Webhooks](docs/webhooks.md) |
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
