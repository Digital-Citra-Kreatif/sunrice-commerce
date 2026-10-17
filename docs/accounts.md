# Customer accounts

Customers sign in on the storefront, with their own pages in the site's layout. They never see the
Sunrice admin. This page covers signing in, registration, My Account, the Customers admin, privacy
and the store roles. Accounts are the `accounts` feature (on by default); see
[features.md](features.md).

## Contents

- [Customers and users](#customers-and-users)
- [The `commerce` guard](#the-commerce-guard)
- [Registration](#registration)
- [Signing in](#signing-in): password, emailed code, Google
- [Email verification](#email-verification)
- [Password reset](#password-reset)
- [Guest orders, carts and wishlists](#guest-orders-carts-and-wishlists)
- [My Account](#my-account)
- [Settings → Store → Accounts](#settings--store--accounts)
- [Shop → Customers](#shop--customers)
- [Privacy](#privacy)
- [Roles and permissions](#roles-and-permissions)

## Customers and users

A customer has two parts:

| Part | Where | Holds |
| --- | --- | --- |
| A user | Sunrice's user model (`sunrice.auth.user_model`), the same table as staff | Name, email, password, email verification, roles |
| A customer record | `commerce_customers` (`Customers\Models\Customer`) | Phone, addresses, marketing consent, language, order count, total spent, first and last order, staff note |

Guests who order get a customer record without a user (`user_id` is null). When they later create
an account with the same email, the record is linked to it. Emails are stored in lowercase and are
unique per customer record.

```php
use Sunrice\Commerce\Customers\Models\Customer;

$customer = Commerce::customer();        // the signed-in customer, or null (also while accounts are off)
$user = commerce_customer();             // the signed-in user on the commerce guard, or null
$customer = Customer::forUser($user);    // the record of a user (created on first need)
$customer->addresses;                    // the address book
```

Sunrice's **Users** screen lists staff only. A user whose roles are all customer roles (Settings →
Store → Accounts → Customer roles, `Customer` by default) is a customer and is managed in **Shop →
Customers** instead.

## The `commerce` guard

The storefront uses its own session guard, `commerce`, on the same user provider as the admin.
Signing in to the shop never opens `/cms`, and signing out of the shop leaves the admin session (and
the cart) alone. Staff can shop too: they sign in on the storefront separately.

```php
// config/commerce.php
'auth' => [
    'guard' => 'commerce',     // registered for you when config/auth.php doesn't define it
    'passwords' => 'users',    // the password broker for customer password resets
],
```

Protect your own customer pages with the `commerce.auth` middleware. It answers 404 while accounts
are off and sends guests to the sign-in page, then back.

If you set `commerce.auth.guard` to Sunrice's guard (`sunrice.auth.guard`, usually `web`), the shop
and the admin share one session. Sign-ins by emailed code and by Google are then refused for
accounts that can open the admin (`sunrice.access-admin`), so the admin stays behind a password.

## Registration

`/account/register` (`/en/account/register` in other languages). Customers give their name, email,
an optional phone number (or a required one, in settings), a password, and marketing consent.

- Registration can be switched off (Settings → Store → Accounts). The page then answers 404.
- With **Sign in with an emailed code** on, customers can tick "register without a password". They
  are emailed a code, which verifies the email and signs them in. They can set a password later in
  their profile.
- New accounts get the customer roles from settings.
- With email verification on (the default), customers are emailed a link and signed in once they
  follow it. They get the welcome email then. With verification off, they get the welcome email and
  are signed in straight away.
- If the email already has an account, the page says "check your email" as for a new account, and
  an unverified owner is sent the verification link again. Nobody can find out whether an email has
  an account.
- The forms have a honeypot. Registration is limited to 5 per hour per IP address.

Laravel's `Illuminate\Auth\Events\Registered` is dispatched for new accounts.

At checkout, guests can also create an account (Settings → Store → Checkout: offer, always or
never). See [checkout.md](checkout.md).

## Signing in

`/account/login` offers every method that is on:

| Method | Needs | Feature |
| --- | --- | --- |
| Email and password | Accounts on | `accounts` |
| An emailed one-time code | The `HasOneTimePasswords` trait on the user model | `passwordless_login` (off by default) |
| Sign in with Google | `laravel/socialite` keys | `google_login` (off by default) |

Messages never say whether an email has an account.

### Password

- Unverified accounts can't sign in while verification is required: they are sent the link again.
- "Remember me" sets a remember cookie for the `commerce` guard only.
- Throttling: 5 failed tries per email and IP address, and 30 per IP address, per minute.
- After signing in, customers go back to the page they wanted, or to My Account.

### Emailed code

Codes come from [`spatie/laravel-one-time-passwords`](https://github.com/spatie/laravel-one-time-passwords).
The user model needs its trait:

```php
use Spatie\OneTimePasswords\Models\Concerns\HasOneTimePasswords;

class User extends Authenticatable
{
    use HasOneTimePasswords;
}
```

`php artisan commerce:install` adds the trait for you when it can, and publishes the package's
`one_time_passwords` migration when the table is missing. Until the trait is there, the code option
is hidden and the dashboard's health card shows an error.

How codes work:

- The customer enters their email on the sign-in page and gets a 6-digit code by email. The code
  page is `/account/code`.
- A code is valid for 10 minutes (Settings → Store → Accounts, 5 to 60), works once and is deleted
  when used. Asking for a new code cancels the old one.
- A code works only in the browser that asked for it (same IP address and user agent).
- At most 5 tries per minute. A code can be requested once a minute per email, and 10 times an
  hour per IP address.
- Using a code marks the email verified and links earlier guest orders.
- The sign-in code email is sent straight away, not queued, so it arrives while the customer waits.

The code length, the try limit and the same-browser rule are the package's own settings
(`config/one-time-passwords.php`). Commerce signs in on the `commerce` guard itself; the package's
`attemptLoginUsingOneTimePassword()` isn't used.

### Google

1. Create an OAuth client in Google Cloud. Its redirect URL is
   `https://your-site/account/login/google/callback` (one URL, without a language prefix).
2. Add the keys to `.env`:

   ```env
   GOOGLE_CLIENT_ID=…
   GOOGLE_CLIENT_SECRET=…
   ```

3. Map them in `config/services.php` (commerce reads `services.google.client_id` and
   `services.google.client_secret`; Socialite also expects a `redirect` key, which commerce
   replaces with the callback above):

   ```php
   'google' => [
       'client_id' => env('GOOGLE_CLIENT_ID'),
       'client_secret' => env('GOOGLE_CLIENT_SECRET'),
       'redirect' => '/account/login/google/callback',
   ],
   ```

4. Switch on **Sign in with Google** in Settings → Store → Features.

Without both keys the button is hidden, the routes answer 404 and the dashboard warns.

What happens at the callback:

- A Google account linked before signs in to its user.
- Otherwise, a verified Google email that matches an account is linked to it.
- Otherwise, a new account is created (when registration is open): verified email, the customer
  roles, no password yet. The customer can set one in their profile.
- An unverified Google email never matches or creates an account.
- The customer stays signed in (remember me), and earlier guest orders with the email are linked.

Links are stored in `commerce_social_accounts`. The profile page shows the linked Google email.

## Email verification

Verification is on by default (Settings → Store → Accounts → Verify email addresses). The link is a
signed URL, `/account/verify/{id}/{hash}`, valid for 3 days. It has no language prefix and opens My
Account in the language the email was sent in.

The verification email is sent:

- after registering (with verification on);
- when an unverified account tries to sign in with its password;
- when someone registers again with an unverified email;
- when a customer changes their email in their profile (the new address must be verified).

Following the link marks the email verified, sends the welcome email (the first time), links earlier
guest orders and signs the customer in. Laravel's `Verified` event is dispatched when the user model
implements `MustVerifyEmail`.

Staff can also mark an email verified in Shop → Customers.

## Password reset

`/account/forgot-password` sends a reset link to `/account/reset-password/{token}`. It uses the
password broker in `commerce.auth.passwords` (`users`), so the link expires after
`auth.passwords.users.expire` minutes (Laravel's default is 60). The storefront link is its own
notification, never the admin's.

- The answer is the same whether or not the email has an account.
- Limits: 3 requests per email and IP address, and 10 per IP address, per 10 minutes.
- Resetting the password also marks the email verified.
- Staff can send the link from Shop → Customers.

## Guest orders, carts and wishlists

**Guest orders.** When a customer verifies an email (the verification link, a sign-in code or
Google), earlier guest orders with that email join the account (`Customers\Actions\LinkGuestOrders`).
They then appear in My Account → Orders. Signing in with a password alone doesn't link orders, so an
unverified email can't claim someone else's orders.

**Carts.** At every storefront sign-in (`Customers\Listeners\MergeOnSignIn`, on Laravel's `Login`
event for the `commerce` guard):

- the guest cart's lines move into the customer's active cart, and quantities of the same variant
  are added together;
- quantities are capped at the variant's maximum and at what is in stock;
- voucher codes from both carts are kept;
- the guest cart is marked `merged` and `Cart\Events\CartMerged` is dispatched;
- a customer without a cart simply takes over the guest cart.

**Wishlists.** The guest wishlist merges the same way, without duplicates and up to the wishlist
limit (200 items).

The customer's language is also remembered at the first sign-in, for their emails.

## My Account

`/account`, behind `commerce.auth`. The menu comes from a registry, so extensions can add pages (see
[extending.md](extending.md#my-account-pages)).

| Page | Route | Shows |
| --- | --- | --- |
| Overview | `commerce.account` | A greeting, the default shipping address and the `account.overview` slot |
| Orders | `commerce.account.orders` | The customer's orders, 10 per page (needs `orders`) |
| An order | `commerce.account.order` | Timeline, payment instructions and confirmation, tracking, invoice download, downloads, buy again, cancel |
| Quotes | `commerce.account.quotes` | Quote requests (shown in Quotation mode) |
| Downloads | `commerce.account.downloads` | The digital library (shown once the customer has downloads) |
| Addresses | `commerce.account.addresses` | Add, edit and delete addresses; default shipping and billing |
| Profile | `commerce.account.profile` | Name, email, phone, marketing consent, the linked Google account, password, account deletion |

Details:

- **Buy again** puts the order's items back in the cart. Items that can't be bought any more are
  named.
- **Cancel** follows the checkout setting "Customers can cancel unpaid orders". See
  [orders.md](orders.md).
- **Invoice download** shows on paid orders when the `documents` feature and the setting are on. See
  [documents.md](documents.md).
- **Addresses** are checked against the region list. The first address becomes the default for both
  shipping and billing.
- **Password**: changing it needs the current password. Accounts made with a code or Google set
  their first password without one.
- **Account deletion**: the customer ticks a box and asks. Staff are emailed and anonymize the account
  in Shop → Customers (see [Privacy](#privacy)). `Customers\Events\AccountDeletionRequested` is
  dispatched.
- **Sign out** is a button in the menu. It signs out of the storefront only.

Templates are in `storefront/account/` (`overview`, `orders`, `order`, `quotes`, `downloads`,
`addresses`, `profile`, `login`, `register`, `code`, `forgot-password`, `reset-password` and the
`layout` with the menu). Publish them with `php artisan vendor:publish --tag=commerce-templates`;
see [templates.md](templates.md).

## Settings → Store → Accounts

Shown while accounts are on, for users with `commerce.settings.accounts`.

| Setting | Key | Default |
| --- | --- | --- |
| Customers can register | `accounts.registration` | on |
| Verify email addresses | `accounts.verify_email` | on |
| Ask for a phone number at registration | `accounts.require_phone` | off |
| Customer roles | `accounts.customer_roles` | `['Customer']` |
| Sign-in codes are valid for (minutes) | `accounts.code_minutes` | `10` (5 to 60) |

Customer roles are given to new customers, decide who counts as a customer (not staff) in Users, and
are the roles you can give in Shop → Customers. Use extra roles such as "Reseller" for pricing rules
and price visibility ([pricing.md](pricing.md)).

The sign-in methods themselves are features (Settings → Store → Features): **Sign in with an emailed
code** and **Sign in with Google**.

## Shop → Customers

Everyone who registered or ordered, for users with `commerce.customers.view`. Anonymized customers
aren't listed.

**The list** (`/cms/commerce/customers`): name, email, phone, orders, amount spent, last order and
account (Registered, Guest or Deletion requested).

- Search by name, email or phone.
- Filters: account (registered or guests), marketing consent, deletion requested.
- Sort by name, email, orders, amount spent, last order or sign-up date.

**A customer's page**: profile, language, addresses, statistics, the 20 latest orders, the staff
note and, for registered customers, whether the email is verified, their roles and the linked Google
account.

| Action | Permission | What it does |
| --- | --- | --- |
| Edit | `commerce.customers.edit` | Name, phone, note, marketing consent, roles |
| Send password reset link | `commerce.customers.edit` | Emails the storefront reset link (registered customers) |
| Mark email verified | `commerce.customers.edit` | Verifies the email without the link |
| Anonymize | `commerce.customers.delete` | Removes personal data (below) |

Only roles without admin access can be given here, and a staff member's admin roles are kept. Staff
accounts can't be anonymized here: they are managed in Users. Edits, verifications and
anonymizations are recorded in Sunrice's activity log (type `customer`).

AI agents can read customers too, with `list_customers` and `get_customer`
([ai-agents.md](ai-agents.md)).

## Privacy

**Anonymizing** (`Customers\Actions\AnonymizeCustomer`) removes the person and keeps the books:

- the user: name "Deleted customer", a placeholder email (`deleted-…@invalid.local`), a random
  password, no remember token, no roles; Google links and sign-in codes are deleted, so the account
  can't sign in;
- the customer record: name, phone, note, extra data and marketing consent are cleared and the email
  becomes the placeholder;
- addresses, wishlists and per-customer voucher records are deleted;
- the customer's orders keep their items and amounts, but lose the name, email, phone, addresses,
  dropshipper, checkout fields, customer note, IP address and user agent;
- payment confirmations lose the sender name, note and IP address.

Emails are never sent to the placeholder address. Extensions that store personal data on orders can
add their own clean-up with `AnonymizeCustomer::scrubOrdersUsing(fn (Customer $customer, string
$placeholderEmail) => …)`.

**Retention**, run daily by `commerce:prune` ([commands.md](commands.md)):

| Data | Kept for | Config |
| --- | --- | --- |
| IP addresses and user agents on orders and download logs, IP addresses on payment confirmations | 365 days | `privacy.ip_retention_days` |
| Payment proof images | 365 days | `payments.proof_retention_days` |

Analytics count views and clicks without personal data ([analytics.md](analytics.md)). Customer
passwords are hashed, and marketing consent is stored with its date.

## Roles and permissions

`php artisan commerce:seed-roles` creates or updates the store roles. It only adds permissions, so
your changes in Users → Roles are kept. Run it again after adding attribute taxonomies.
`commerce:install` runs it for you.

| Role | Gets |
| --- | --- |
| Shop Manager | `sunrice.access-admin`, `sunrice.view-drafts`, `sunrice.assets.view`, `.upload` and `.edit`, every entry permission of the products collection, the term permissions of the product categories, tags, brands and attribute taxonomies, the inquiry form's submission permissions, and every `commerce.*` permission |
| Customer | No admin permissions. The storefront role, used by price visibility and pricing rules |
| Administrator (Sunrice's, when it exists) | Every `commerce.*` permission as well |

Roles are created on Sunrice's guard (`sunrice.auth.guard`), like Sunrice's own.

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
| `commerce.customers.export` | Exporting customers (there is no customer export screen yet) |
| `commerce.inventory.view` | Stock levels |
| `commerce.inventory.adjust` | Adjusting stock |
| `commerce.vouchers.manage` | Vouchers and automatic discounts |
| `commerce.flash-sales.manage` | Flash sales |
| `commerce.pricing-rules.manage` | Pricing rules |
| `commerce.reports.view` | Reports |
| `commerce.reports.export` | Exporting reports |
| `commerce.settings.general`, `.features`, `.catalog`, `.checkout`, `.payments`, `.shipping`, `.taxes`, `.accounts`, `.emails`, `.documents` | One per Settings → Store section; `.features` switches modules |

Permissions are registered whatever the modules' switches, so grants survive a module being switched
off. Product content uses Sunrice's own entry and term permissions.

Suggested custom roles (not seeded):

| Role | Permissions |
| --- | --- |
| Fulfilment | `commerce.orders.view`, `commerce.shipments.manage`, `commerce.documents.view` |
| Finance | `commerce.orders.view`, `commerce.payments.verify`, `commerce.orders.refund`, `commerce.reports.view`, `commerce.reports.export` |
| Reseller | A customer role (add it to Customer roles) for pricing rules |

Give staff roles `sunrice.access-admin` too, or they can't open the admin.
