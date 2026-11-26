# Customer accounts

Customer accounts come from the Accounts plugin, [`sunrice/account`](https://github.com/Digital-Citra-Kreatif/sunrice-account),
which commerce requires. It owns sign-in, registration, the emailed code, Google, email
verification, password reset, the profile page, the My Account menu and its announcement, the
account emails, **Settings → Accounts** and **Administration → Accounts**. Read
[its documentation](https://github.com/Digital-Citra-Kreatif/sunrice-account/blob/main/docs/index.md)
(`vendor/sunrice/account/docs/index.md`) for all of that.

This page covers what commerce adds: the customer record, the store's pages in My Account, Shop →
Customers, privacy and the store roles. Accounts are the `accounts` feature (on by default, and
required by checkout); see [features.md](features.md).

## Contents

- [Customers and accounts](#customers-and-accounts)
- [The signed-in customer](#the-signed-in-customer)
- [Signing in: carts, wishlists and earlier orders](#signing-in-carts-wishlists-and-earlier-orders)
- [My Account](#my-account)
- [Shop → Customers](#shop--customers)
- [Privacy](#privacy)
- [Roles and permissions](#roles-and-permissions)

## Customers and accounts

A customer has two parts:

| Part | Where | Holds |
| --- | --- | --- |
| An account | Sunrice's user model (`sunrice.auth.user_model`), the same table as staff, with the account package's profile | Name, email, password, email verification, roles |
| A customer record | `commerce_customers` (`Customers\Models\Customer`) | Phone, addresses, marketing consent, language, order count, total spent, first and last order, staff note |

An account gets its customer record when it is created (the account package's `Registered` event)
or on first need. Emails are stored in lowercase and are unique per customer record.

The customer record follows the account's profile (`Customers\Listeners\SyncCustomerFromAccount`,
on the account package's `Registered`, `ProfileUpdated`, `SignedIn` and `DeletionRequested`): name,
email, phone, language, marketing consent and a request to be deleted change on the profile page
and are copied here, where orders, audiences and Shop → Customers read them.

Every order placed at checkout belongs to an account. A customer record without an account
(`user_id` is null) exists only when staff create a manual order for an email that has none
(Orders → New). It is linked when someone signs in with that address; see
[below](#signing-in-carts-wishlists-and-earlier-orders).

```php
use Sunrice\Commerce\Customers\Models\Customer;

$customer = Commerce::customer();        // the signed-in customer, or null (also while accounts are off)
$user = commerce_customer();             // the signed-in account, or null
$customer = Customer::forUser($user);    // the record of a user (created on first need)
$customer->addresses;                    // the address book
```

Sunrice's **Users** screen lists staff only once your panel provider uses the account package's
`AccountUserResource` ([installation.md](installation.md#install)). Customers are managed in
**Shop → Customers**, and every site account in Administration → Accounts.

## The signed-in customer

Customers sign in on the account package's session guard (`Sunrice\Account\Auth\SiteGuard::name()`,
`account` by default), on the same user provider as the admin. Signing in to the shop never opens
the admin, and signing out of the shop leaves the admin session alone. `commerce_customer()` and
`Customers\CurrentCustomer::guard()` read that guard. A signed-in customer's cart is theirs: after
signing out it isn't shown to the next visitor on that browser, and it is back when they sign in
again. Staff can shop too: they sign in on the storefront separately.

Protect your own customer pages with the account package's middleware, `sunrice.account.auth`
(and `sunrice.account.verified` for a verified email). Visitors are sent to the sign-in page and
come back. Link to sign-in from a template with `\Sunrice\Account\Facades\Account::signInUrl()`,
which returns to the page it is on.

New accounts get the account package's default roles (Settings → Accounts, `member` unless you
change it). Add roles such as "Reseller" for pricing rules and price visibility
([pricing.md](pricing.md)).

## Signing in: carts, wishlists and earlier orders

At every sign-in on the site (`Customers\Listeners\MergeOnSignIn`, on the account package's
`SignedIn` event):

**Carts.**

- the visitor's cart lines move into the customer's active cart, and quantities of the same variant
  are added together;
- quantities are capped at the variant's maximum and at what is in stock;
- voucher codes from both carts are kept;
- the visitor's cart is marked `merged` and `Cart\Events\CartMerged` is dispatched;
- a customer without a cart simply takes over the visitor's cart.

**Wishlists.** The visitor's wishlist merges the same way, without duplicates and up to the
wishlist limit (200 items).

**Orders staff made.** Orders created in the admin for the customer's email before it had an
account join the account, once its email is verified. An unverified email can't claim them. They
then appear in My Account → Orders.

The customer's language is also remembered at the first sign-in, for their emails.

## My Account

The account package draws My Account: its layout, menu, Overview, Profile and sign-out. Commerce
registers the store's pages under its prefix (`/account` by default) with `Account::routes()` and
`Account::page()`, for signed-in accounts. `/account` opens Orders while the `orders` feature is
on (`Account::landingUsing()`). Extensions add pages the same way, or with
`Commerce::registerAccountPage()` (see [extending.md](extending.md#my-account-pages)).

| Page | Route | Shows |
| --- | --- | --- |
| Orders | `commerce.account.orders` | Search and filter the customer's orders, 10 per page (needs `orders`) |
| An order | `commerce.account.orders.show` | Timeline, payment instructions and confirmation, tracking, invoice download, downloads, buy again, cancel |
| Quotes | `commerce.account.quotes` | Quote requests (shown in Quotation mode, and in Online store mode when customers can also request a quote) |
| Downloads | `commerce.account.downloads` | The digital library (shown once the customer has downloads) |
| Points | `commerce.account.points` | The loyalty balance, how points are earned, the next expiry and the history (needs `loyalty`; see [pricing.md](pricing.md#loyalty-points)) |
| Wishlist | `commerce.wishlist` | The wishlist page (needs `wishlist`) |
| Addresses | `commerce.account.addresses` | An expandable address book with shipping and billing defaults |

The actions on an order are `commerce.account.orders.again`, `.orders.return` and
`.orders.cancel`; redeeming a gift card for points is `commerce.account.points.redeem`.

Details:

- **Orders** can be searched by all or part of the order number or product name. Combine the search
  with an order status or open the date range to enter either or both dates. Both dates are
  inclusive in the store's timezone. Order details link back to the full list.
  The filter values stay selected on the next page. **Reset filters** returns to the full order
  list. The GET parameters are `q`, `status`, `date_from`, `date_to` and `page`; dates use
  `YYYY-MM-DD`.
- **Buy again** puts the order's items back in the cart. Items that can't be bought any more are
  named.
- **Cancel** follows the checkout setting "Customers can cancel unpaid orders". See
  [orders.md](orders.md).
- **Invoice download** shows on paid orders when the `documents` feature and the setting are on. See
  [documents.md](documents.md).
- **Addresses** start collapsed if the customer has several. Each summary shows the label or street,
  the locality when available, and any shipping or billing default. Open an address to see its
  details and the Edit and Delete actions. With one address, its details are open by default.
  **Add an address** opens the form. Save or Cancel returns to the list. The first saved address
  becomes the default for shipping and billing. New Indonesian addresses require JavaScript to
  populate the region choices. See [Regions](regions.md#the-regions-json-endpoint).
- **Downloads** lists grants for orders belonging to the signed-in customer. The file itself is
  served through a personal link. See [Digital products](catalog.md#digital-products).

Templates are in `storefront/account/` (`orders`, `order`, `quotes`, `downloads`, `addresses`,
`points` and `layout`). `commerce::storefront.account.layout` extends the account package's layout,
and the pages fill `@section('commerce-account')`. Publish them with `php artisan vendor:publish
--tag=commerce-templates`; see [templates.md](templates.md). The sign-in, registration and profile
templates are the account package's.

## Shop → Customers

Everyone who has an account or an order, for users with `commerce.customers.view`. Anonymized
customers aren't listed.

**The list** (`/cms/commerce/customers`): name, email, phone, orders, amount spent, last order and
account (Registered, or Guest for a customer staff made for a manual order who hasn't signed in yet).

- Search by name, email or phone.
- Filters: account (registered or guests), role (the default roles of new accounts), number of orders (none, 1,
  2 or more, 5 or more), total spent, sign-up date (last 7 or 30 days, this month, this year),
  marketing consent, deletion requested.
- **Export CSV** (with `commerce.customers.export`) downloads the list as it is filtered and
  searched: name, email, phone, account, orders, spent (smallest currency unit), last order,
  marketing consent, sign-up date, city and province. Exports are recorded in the activity log.
- Sort by name, email, orders, amount spent, last order or sign-up date.

**A customer's page**: profile, language, addresses, statistics, the 20 latest orders, the staff
note and, for registered customers, whether the email is verified, their roles and the linked Google
account.

| Action | Permission | What it does |
| --- | --- | --- |
| Edit | `commerce.customers.edit` | Name, phone, note, marketing consent, roles |
| Send password reset link | `commerce.customers.edit` | Emails the account package's reset link (registered customers) |
| Mark email verified | `commerce.customers.edit` | Verifies the email without the link, as the account package does it |
| Anonymize | `commerce.customers.delete` | Removes personal data (below) |

Only roles without admin access, and with less access than your own (Sunrice's
[who can manage whom](https://github.com/Digital-Citra-Kreatif/sunrice-cms/blob/main/docs/permissions.md#who-can-manage-whom)),
can be given or taken away here; the account's other roles, including staff roles, are kept. Staff
accounts can't be anonymized here: they are managed in Users. Edits, verifications and
anonymizations are recorded in Sunrice's activity log (type `customer`).

AI agents can read customers too, with `commerce_list_customers` and `commerce_get_customer`
([ai-agents.md](ai-agents.md)).

## Privacy

**Anonymizing** removes the person and keeps the books. The account's own data (name, email,
password, roles, profile, Google links, sessions) is removed by the account package's
`AnonymizeAccount`; its `Anonymized` event then runs commerce's `Customers\Actions\AnonymizeCustomer`
for the store's records. It works the same from Shop → Customers and from Administration →
Accounts. For a customer without an account, Shop → Customers runs `AnonymizeCustomer` alone. The
store's records:

- the customer record: name, phone, note, extra data and marketing consent are cleared and the email
  becomes the placeholder;
- addresses, wishlists and per-customer voucher records are deleted;
- the customer's orders keep their items and amounts, but lose the name, phone, addresses,
  dropshipper, checkout fields, customer note, IP address and user agent, and their email becomes
  the placeholder;
- payment confirmations lose the sender name, note and IP address;
- the loyalty wallet is emptied (its ledger keeps the amounts, without notes);
- returns keep their items and status, but lose the customer's details and the note to them;
- stock alerts and records of marketing emails sent are deleted, and reviews stay without the name
  and email.

Emails are never sent to the placeholder address. Extensions that store personal data on orders can
add their own clean-up with `AnonymizeCustomer::scrubOrdersUsing(fn (Customer $customer, string
$placeholderEmail) => …)`.

**Retention**, run daily by `commerce:prune` ([commands.md](commands.md)):

| Data | Kept for | Config |
| --- | --- | --- |
| IP addresses and user agents on orders and download logs, IP addresses on payment confirmations | 365 days | `privacy.ip_retention_days` |
| Payment proof images | 365 days | `payments.proof_retention_days` |

Analytics count views and clicks without personal data ([analytics.md](analytics.md)). Marketing
consent is stored with its date.

## Roles and permissions

`php artisan commerce:seed-roles` creates or updates the store roles. It only adds permissions, so
your changes in Users → Roles are kept. Run it again after adding attribute taxonomies.
`commerce:install` runs it for you.

| Role | Gets |
| --- | --- |
| Shop Manager | `sunrice.access`, `cms.entries.view-drafts`, `sunrice.assets.view`, `.upload` and `.edit`, every entry permission of the products collection, the term permissions of the product categories, tags, brands and attribute taxonomies, the inquiry form's submission permissions, and every `commerce.*` permission |
| Customer | No admin permissions. A storefront role for price visibility and pricing rules. New accounts get it only if you add it to the default roles in Settings → Accounts |
| Administrator (Sunrice's, when it exists) | Every `commerce.*` permission as well |

Roles are created on the panel's guard (`$panel->guard()`), like Sunrice's own.

The commerce permissions (`Permissions\CommercePermissions`), in Users → Roles under the "Store"
groups:

| Permission | Grants |
| --- | --- |
| `commerce.dashboard.view` | The store dashboard |
| `commerce.orders.view` | Viewing orders and quotes |
| `commerce.orders.create` | Creating manual orders |
| `commerce.orders.edit` | Editing orders and changing their status |
| `commerce.orders.override-prices` | Changing unit prices in manual and unpaid orders |
| `commerce.orders.cancel` | Cancelling orders |
| `commerce.orders.refund` | Recording refunds |
| `commerce.orders.delete` | Trashing orders |
| `commerce.orders.export` | Exporting orders |
| `commerce.quotes.respond` | Pricing and sending quotes |
| `commerce.payments.verify` | Approving payment confirmations and marking orders paid |
| `commerce.shipments.manage` | Adding shipments and tracking |
| `commerce.documents.view` | Downloading invoices, packing slips and quotations |
| `commerce.customers.view` | Viewing customers |
| `commerce.customers.edit` | Editing customers |
| `commerce.customers.delete` | Anonymizing customers |
| `commerce.customers.export` | Exporting customers (Shop → Customers → Export CSV) |
| `commerce.inventory.view` | Stock levels |
| `commerce.inventory.adjust` | Adjusting stock |
| `commerce.vouchers.manage` | Vouchers and automatic discounts |
| `commerce.marketing.manage` | Email campaigns and automations ([marketing.md](marketing.md)) |
| `commerce.flash-sales.manage` | Flash sales |
| `commerce.pricing-rules.manage` | Pricing rules |
| `commerce.reports.view` | Reports |
| `commerce.reports.export` | Exporting reports |
| `commerce.settings.general`, `.features`, `.catalog`, `.checkout`, `.payments`, `.shipping`, `.taxes`, `.emails`, `.documents` | One per Settings → Store section; `.features` switches modules |

Permissions are registered whatever the modules' switches, so grants survive a module being switched
off. Product content uses Sunrice's own entry and term permissions.

Suggested custom roles (not seeded):

| Role | Permissions |
| --- | --- |
| Fulfilment | `commerce.orders.view`, `commerce.shipments.manage`, `commerce.documents.view` |
| Finance | `commerce.orders.view`, `commerce.payments.verify`, `commerce.orders.refund`, `commerce.reports.view`, `commerce.reports.export` |
| Reseller | A role without admin permissions, for pricing rules (give it in Shop → Customers) |

Give staff roles `sunrice.access` too, or they can't open the admin.
