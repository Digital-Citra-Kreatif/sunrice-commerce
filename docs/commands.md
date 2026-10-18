# Commands

| Command | What it does | Scheduled |
| --- | --- | --- |
| [`commerce:install`](#commerceinstall) | Sets up the store | — |
| [`commerce:doctor`](#commercedoctor) | Checks the setup | — |
| [`commerce:tick`](#commercetick) | Every-minute work | every minute |
| [`commerce:prune`](#commerceprune) | Clean-up | daily |
| [`commerce:stats`](#commercestats) | Recomputes daily statistics | daily at 00:20 |
| [`commerce:scaffold`](#commercescaffold) | Creates the store structure in Sunrice | — |
| [`commerce:sync-products`](#commercesync-products) | Projects product entries into the commerce tables | — |
| [`commerce:regions:import`](#commerceregionsimport) | Imports Indonesian regions | — |
| [`commerce:seed-roles`](#commerceseed-roles) | Creates or updates the store roles | — |
| [`commerce:publish-assets`](#commercepublish-assets) | Publishes the admin bundle | — |

The scheduled commands are registered for you; run Laravel's scheduler every minute
([installation.md](installation.md#run-the-scheduler-and-a-queue-worker)).

## commerce:install

```bash
php artisan commerce:install [--templates] [--demo] [--no-regions] [--regions=district] [--force]
```

Publishes the config and assets, the sign-in code migration (when missing), migrates, adds the
`HasOneTimePasswords` trait to the user model, scaffolds the store, syncs permissions and roles,
imports regions and prints the next steps. Safe to run again.

| Option | |
| --- | --- |
| `--templates` | Also publish the storefront templates (to `resources/views/sunrice` and `resources/views/commerce`) and the theme (to `public/commerce-theme`) |
| `--demo` | Add the demo store (once) |
| `--no-regions` | Don't import regions (it asks otherwise; non-interactive runs import) |
| `--regions=` | How deep: `province`, `city`, `district` (default) or `village` |
| `--force` | Overwrite the published config and templates |

## commerce:doctor

Runs the store's health checks (the dashboard's "Needs attention" card) and prints each result.
Exits with an error when a check fails, so you can use it in deploy scripts.

## commerce:tick

The every-minute work: unpaid orders and quotes expire, flash sales start and end, open shipments
are tracked (courier extensions), and the scheduler heartbeat is recorded. Extensions add steps
with `Commerce::onTick()`. A failing step is reported and the others still run.

## commerce:prune

Daily clean-up: abandoned carts (`cart.prune_days`), unattached uploads, old payment proofs
(`payments.proof_retention_days`) and IP addresses (`privacy.ip_retention_days`). Extensions add
steps with `Commerce::onPrune()`.

## commerce:stats

```bash
php artisan commerce:stats [--rebuild] [--from=2026-01-01]
```

Recomputes the daily sales statistics. Without options it redoes yesterday and today (the nightly
run). `--rebuild` recomputes from the first order; `--from` from a date. Views and clicks are
counters and are kept. See [analytics.md](analytics.md).

## commerce:scaffold

```bash
php artisan commerce:scaffold [--dry-run] [--force]
```

Creates or updates the store structure in Sunrice: the products collection and blueprint, product
categories, tags and brands, the inquiry form, legal pages (when a `pages` collection exists) and
the `shop` menu. Items changed in the admin are reported and left alone unless you pass `--force`;
`--dry-run` reports without saving.

## commerce:sync-products

```bash
php artisan commerce:sync-products [--entry=12 --entry=13] [--force]
```

Projects product entries into the commerce tables (products, variants, options, prices, stock). It
runs automatically when a product is published; use it after importing entries directly or to
repair. `--force` re-projects unchanged entries.

## commerce:regions:import

```bash
php artisan commerce:regions:import [--level=district]
```

Imports the bundled Indonesian regions (Kemendagri codes) down to `province`, `city`, `district` or
`village`. Running it again updates names; regions no longer in the data become inactive (saved
addresses keep them). See [regions.md](regions.md).

## commerce:seed-roles

Creates the **Shop Manager** and **Customer** roles and gives Shop Manager (and Sunrice's
Administrator) every store permission, including ones added by an upgrade or by new attribute
taxonomies. It only adds: permissions you gave these roles in the admin stay, but ones you took
away are given back, so build custom roles for narrower access.

## commerce:publish-assets

Copies the prebuilt admin bundle to `public/vendor/commerce`. Run it after every upgrade
([upgrading.md](upgrading.md)).

## Load testing the package

For developing commerce itself (not for stores): the workbench has a large-store seeder,
`Workbench\Database\Seeders\LoadTestSeeder`. On top of the demo store it adds 2,000 products
(simple, variable with up to three attribute options and 100 variants, digital and bundles, every
tenth with a very long name), categories four levels deep, 150 brands, tags, 300 vouchers, flash
sales (one running), 30 pricing rules, 5,000 customers with addresses, 20,000 orders over the past
year in every status (with payments, shipments, events and voucher discounts; a few with 50–200
lines) and a year of product view counters, plus the customer account `customer@example.com` /
`password`. Catalog and promotions go through the same actions as the admin; customers and orders
are bulk inserted. Scale it with `LOADTEST_PRODUCTS`, `LOADTEST_ORDERS`, `LOADTEST_CUSTOMERS` and
`LOADTEST_SEED`:

```bash
vendor/bin/testbench workbench:build
LOADTEST_ORDERS=20000 vendor/bin/testbench db:seed --class='Workbench\Database\Seeders\LoadTestSeeder'
vendor/bin/testbench commerce:stats --rebuild
```

At the default size it takes about four minutes and 110 MB in PostgreSQL. Point the workbench at
PostgreSQL or MySQL with the usual `DB_*` variables in the environment.
