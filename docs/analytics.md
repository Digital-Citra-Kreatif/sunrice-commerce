# Dashboard and analytics

Shop → Dashboard shows how the store is doing and what needs doing. Shop → Reports goes into the
detail. Figures come from daily statistics tables, so they stay fast with years of orders. Analytics
is the `analytics` feature (on by default); see [features.md](features.md).

## Contents

- [The dashboard](#the-dashboard)
- [Definitions](#definitions)
- [The statistics tables](#the-statistics-tables)
- [Views and clicks](#views-and-clicks)
- [Rebuilding statistics](#rebuilding-statistics)
- [Timezone](#timezone)
- [Reports](#reports)
- [Permissions](#permissions)
- [The Store card on Sunrice's dashboard](#the-store-card-on-sunrices-dashboard)

## The dashboard

**Shop → Dashboard** (`/cms/commerce`) needs `commerce.dashboard.view`. From top to bottom:

**Setup checklist.** Steps with a link to where each is done, ticked off as you go. The built-in steps
are the store details (name and email) and the store address (Settings → Store → General).

**Health.** Warnings about things that stop the store working, each with how to fix it. The same
checks run in `php artisan commerce:doctor` ([commands.md](commands.md)):

| Check | Warns when |
| --- | --- |
| Email | The mailer is `log` or `array`, so emails reach nobody |
| Queue worker | The queue is `sync`, or no queued job ran in the last 10 minutes |
| Scheduler | `commerce:tick` hasn't run in the last 5 minutes |
| Full-page cache | Sunrice's full-page cache is on |
| Customer sign-in | Emailed codes are on without the `HasOneTimePasswords` trait, or Google sign-in is on without its keys |

Extensions add checks with `Commerce::registerHealthCheck()` ([extending.md](extending.md#dashboard-widgets-reports-and-health-checks)).

**Figures** for today, the last 7 days (default) or the last 30 days, each against the period just
before it (the change in percent):

| Figure | |
| --- | --- |
| Total sales | What customers paid, less refunds |
| Orders | Orders counted as sales |
| Average order value | Net sales ÷ orders |
| Items sold | Units in those orders |
| New customers | Customers whose first counted order falls in the period |

**Sales chart.** Total sales per day, with the previous period as a second line. "Today" shows the
last 7 days, since one day is one point.

**Top products.** The 5 products with the most revenue in the period.

**To do**, each linking to a filtered list and shown only when there is something to do and you have
the permission:

| To do | Module | Permission |
| --- | --- | --- |
| Payment confirmations to verify | `manual_payments` | `commerce.payments.verify` |
| Orders to ship (Processing, not fully shipped) | `orders` | `commerce.orders.view` |
| Quote requests to answer | `orders` | `commerce.quotes.respond` |
| Variants low on stock | `inventory` | `commerce.inventory.view` |

**Recent orders.** The 5 latest orders (with `commerce.orders.view`).

Figures, the chart and top products need `analytics`; while it is off the dashboard keeps the
checklist, health, to-dos and recent orders. Figures and lists load after the page shows.
Extensions add figures, to-dos and widgets (see [extending.md](extending.md#dashboard-widgets-reports-and-health-checks)).

## Definitions

An order **counts as a sale** when it is an order (not a quote), was placed, isn't trashed, isn't
Cancelled or Failed, and is either paid (fully or partly refunded included) or Processing or
Completed (for example cash on delivery). It counts on the day it was **placed**.

| Figure | Is |
| --- | --- |
| Gross sales | The orders' subtotals: item totals before order-level discounts |
| Discounts | The orders' discount totals |
| Refunds | Completed refunds of counted orders, on the day each refund was made |
| Net sales | Gross − discounts − refunds |
| Shipping, Taxes, Fees | The orders' shipping, tax and fee totals |
| Total sales | The orders' totals − refunds: what customers paid. Taxes included in prices aren't added again |
| Average order value | Net sales ÷ orders (in the period's totals) |
| Items sold | Units of the orders' lines |
| New / returning customers | A customer is new on the day of their first counted order, returning on later ones |

Cancelled and failed orders, quotes and trashed orders never count, nor do their refunds. A refund on
an order placed last month lowers today's net sales, not last month's.

All amounts are integers in the currency's smallest unit.

## The statistics tables

| Table | One row per | Columns |
| --- | --- | --- |
| `commerce_stats_daily` | Day | `orders`, `items_sold`, `gross_sales`, `discounts`, `refunds`, `net_sales`, `shipping`, `taxes`, `fees`, `total_sales`, `new_customers`, `returning_customers`, `quotes_requested`, `carts_created`, `checkouts_started` |
| `commerce_product_stats_daily` | Day and product | `units_sold`, `revenue`, `views`, `add_to_carts`, `cta_whatsapp`, `cta_external`, `cta_inquiry` |

Columns come in two kinds:

- **Recomputed from orders and refunds** (`Analytics\StatsRecorder`): everything about sales —
  orders, items, gross, discounts, refunds, net, shipping, taxes, fees, total, new and returning
  customers, quotes requested, and each product's units sold and revenue. Recomputing a day is
  idempotent: running it twice, or late, gives the same row.
- **Counted as they happen** (`Analytics\StatsTracking`): carts created, checkouts started, and each
  product's views, add-to-carts and call-to-action clicks. These can't be recomputed, so rebuilding
  keeps them.

When an order is placed, paid, changes status, is edited or refunded, and when a quote is requested,
a queued job (`Analytics\Jobs\RecomputeStatsDay`, once per day however many orders change) recomputes
the day it was placed and the days of its refunds. The nightly run catches anything missed.

```php
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Stats;

$totals = app(Stats::class)->totals('2026-10-01', '2026-10-31');   // ['net_sales' => …, 'aov' => …]
$series = app(Stats::class)->series(Period::preset('30d'), ['net_sales', 'orders']);
```

## Views and clicks

Counted per product per day, with no personal data (no IP address, no cookie, no visitor id):

| Event | Counted when |
| --- | --- |
| View | A product page is served: `GET`, status 200, not a preview. Counted after the response is sent |
| Add to cart | An item is added to a cart |
| WhatsApp, external link, inquiry click | The customer follows a call-to-action. Buttons go through `/go/{type}/{entry}`, which counts the click and redirects to the product's own target |
| Cart created, checkout started | Per day, not per product |

Not counted:

- requests whose user agent is empty or contains one of `analytics.bot_user_agents` (`bot`, `crawl`,
  `spider`, `slurp`, `facebookexternalhit`, `preview`, `curl`, `wget`, `python`, `headless`);
- staff: visitors signed in to the admin with `sunrice.access-admin`;
- Sunrice previews.

Switch off product page views with `analytics.track_views`:

```php
// config/commerce.php
'analytics' => [
    'track_views' => false,
    'bot_user_agents' => ['bot', 'crawl', 'spider', /* … */],
],
```

A stored store setting `analytics.track_views` wins over the config key. Clicks, add-to-carts and
carts are counted while `analytics` is on. To send events elsewhere too (a data warehouse, an ad
pixel), bind your own `Contracts\Tracking` ([extending.md](extending.md#swappable-services)).

## Rebuilding statistics

```bash
php artisan commerce:stats                     # yesterday and today (the nightly run)
php artisan commerce:stats --from=2026-01-01   # from a date to today
php artisan commerce:stats --rebuild           # from the first order to today
```

The nightly run is scheduled at 00:20 for you; run Laravel's scheduler every minute
([installation.md](installation.md#run-the-scheduler-and-a-queue-worker)). Rebuild after importing
orders, after changing the timezone, or if the queue was down for a while. Views and clicks are
kept.

## Timezone

Days are the site's local dates: `app.timezone`, which Sunrice sets from its settings. Stored times
are local too, so "today" on the dashboard is today in the store's timezone, and a report from
`2026-10-01` to `2026-10-31` covers those local days. After changing the timezone, run
`php artisan commerce:stats --rebuild`.

## Reports

**Shop → Reports** (`/cms/commerce/reports`) needs `analytics` and `commerce.reports.view`.

| Report | Key | Shows | Needs |
| --- | --- | --- | --- |
| Sales over time | `sales` | Orders, items, gross, discounts, refunds, net, shipping, taxes, fees and total per day, week or month; a chart of net and total | — |
| Products | `products` | Units sold, revenue, views, add-to-carts and conversion per product | — |
| Categories | `categories` | Products, units, revenue, views and conversion per category | — |
| Brands | `brands` | The same per brand | `brands` |
| Vouchers | `vouchers` | Orders, discount given and revenue per code | `vouchers` |
| Customers | `customers` | New and returning customers over time; the top 100 customers by amount spent | — |
| Stock | `stock` | Tracked variants low or out of stock now, and the stock value at cost | `inventory` |
| Calls to action | `ctas` | WhatsApp, shop link and inquiry clicks per product, with the click rate | — |

Conversion is units sold per 100 product page views; the click rate is clicks per 100 views.

Every report except Stock (which is about now) takes:

| Option | Query | Values |
| --- | --- | --- |
| Date range | `period` or `from` and `to` (`Y-m-d`) | Today, last 7, 30 (default) or 90 days, this month, last month, this year, or any range |
| Comparison | `compare` | `previous` (default: the same number of days just before), `year` (the same dates a year earlier), `none` |
| Interval | `interval` | `day`, `week`, `month`; by default day up to 31 days, week up to 92, month above |

Summary figures show the change against the comparison period. The URL keeps the options, so a
report can be bookmarked or shared with a colleague.

**Drill-down**: rows link to the detail where there is one: a sales row to the orders of that day,
week or month; a product to its entry editor; a voucher to its edit page; a customer to their page; a
stock row to Inventory.

**CSV export** (with `commerce.reports.export`): the rows and the totals row, with column labels as
headers. Money is in currency units, not the smallest unit: 150000 stays `150000` in rupiah, and
becomes `1500` in a currency with two decimals. The file is named after the report and range, for example
`sales-2026-10-01-2026-10-31.csv`.

AI agents run the same reports with `sales_report` ([ai-agents.md](ai-agents.md)). Extensions add
their own with `Commerce::registerReport()` ([extending.md](extending.md#dashboard-widgets-reports-and-health-checks)).

## Permissions

| Permission | |
| --- | --- |
| `commerce.dashboard.view` | Shop → Dashboard |
| `commerce.reports.view` | Shop → Reports |
| `commerce.reports.export` | CSV export |

The to-dos and recent orders follow their own permissions (above). Shop Manager has all of them.

## The Store card on Sunrice's dashboard

On Sunrice versions with dashboard cards, Sunrice's own dashboard gets a small **Store** card for
users with `commerce.dashboard.view`: today's total sales and orders (while `analytics` is on) and
the store's to-dos. On versions without dashboard cards, there is no card; use Shop → Dashboard.
