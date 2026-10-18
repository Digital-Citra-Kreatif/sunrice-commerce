# Installation

Sunrice Commerce turns a Sunrice CMS site into a store. It needs PHP 8.4+, Laravel 13, Sunrice
CMS 1.x (with the settings tabs, users scope and structure import changes) and SQLite, MySQL or
PostgreSQL. The admin bundle is prebuilt: you don't need Node.

## Contents

- [Install](#install)
- [What the installer does](#what-the-installer-does)
- [Run the scheduler and a queue worker](#run-the-scheduler-and-a-queue-worker)
- [Mail](#mail)
- [Sign in with Google](#sign-in-with-google)
- [Set up the store](#set-up-the-store)
- [Check the setup](#check-the-setup)

## Install

```bash
composer require sunrice/commerce
php artisan commerce:install
```

Try it with sample data first:

```bash
php artisan commerce:install --demo
```

The demo adds store details, five products (simple, variable, digital, a bundle), bank transfer
and cash on delivery, shipping across Indonesia, a voucher (`KOPI10`), a flash sale and one order.

To change the storefront's markup, publish the templates as well:

```bash
php artisan commerce:install --templates
```

See [commands.md](commands.md#commerceinstall) for every option. The installer is safe to run again
(after an upgrade, for example): it only adds what is missing.

## What the installer does

1. Publishes `config/commerce.php` and the admin assets (`public/vendor/commerce`).
2. Publishes the sign-in code migration of `spatie/laravel-one-time-passwords` when its table is
   missing.
3. Runs the migrations.
4. Adds the `HasOneTimePasswords` trait to your user model (for sign-in with an emailed code). If
   it can't edit the file, it tells you what to add.
5. Creates the store structure in Sunrice: the Products collection with its blueprint, product
   categories, tags and brands, the product inquiry form, legal pages (when a `pages` collection
   exists) and the `shop` menu (`commerce:scaffold`).
6. Syncs permissions and creates the **Shop Manager** and **Customer** roles.
7. Imports Indonesian regions for addresses and shipping zones (it asks; `--no-regions` skips it).
8. With `--templates`, publishes the storefront templates.
9. With `--demo`, adds the demo store.
10. Prints the next steps.

## Run the scheduler and a queue worker

Commerce does time-based work every minute (`commerce:tick`: unpaid orders expire, flash sales
start and end, couriers are asked for tracking) and daily (`commerce:prune`, `commerce:stats`).
Add Laravel's scheduler to cron:

```cron
* * * * * cd /path/to/site && php artisan schedule:run >> /dev/null 2>&1
```

Order emails and statistics are queued. Run a worker (Supervisor, systemd or your host's
equivalent):

```bash
php artisan queue:work
```

The dashboard warns when the scheduler or the queue hasn't run recently.

## Mail

Customers get order emails and sign-in codes by email, so configure a real mailer in `.env`
(`MAIL_MAILER`, `MAIL_HOST`…). With the `log` mailer the dashboard shows a warning. See
[emails.md](emails.md).

## Sign in with Google

Optional. Create an OAuth client in Google Cloud and set:

```env
GOOGLE_CLIENT_ID=…
GOOGLE_CLIENT_SECRET=…
```

The redirect URL is `https://your-site/account/login/google/callback`. Then switch on **Sign in with
Google** in Settings → Store → Features. See [accounts.md](accounts.md).

## Set up the store

Everything the store needs sits in the admin sidebar's **Shop** group: the dashboard, orders,
payments to verify, products with their categories, brands and tags, customers, promotions,
inventory, reports and Store settings. The product collection and taxonomies leave Content and
Taxonomies for it.

Open the admin → **Shop → Dashboard**. Until everything is done, a checklist leads you through:

- the store details (name, email, address: Settings → Store → General);
- products (Shop → Products);
- payment methods (Settings → Store → Payments);
- shipping zones (Settings → Store → Shipping);
- the terms page for checkout (Settings → Store → Checkout);
- a test order.

Choose the **selling mode** in Settings → Store → General: an online store with checkout, quotation
requests, WhatsApp orders or a catalog without ordering. Switch modules on and off in Settings →
Store → Features ([features.md](features.md)).

Give staff the **Shop Manager** role (Users → Roles), or build your own roles from the `Store: …`
permissions.

## Check the setup

```bash
php artisan commerce:doctor
```

It runs the same health checks as the dashboard (payments, shipping, mail, queue, scheduler,
regions, sign-in, full-page cache) and fails when something is broken.
