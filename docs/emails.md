# Emails

The store emails customers and staff when something happens: an order is placed, paid, shipped,
a payment confirmation arrives, stock runs low. Every email can be switched off, and its subject
and text changed per language, without touching code.

## Contents

- [The emails](#the-emails)
- [Settings → Store → Emails](#settings--store--emails)
- [Staff recipients](#staff-recipients)
- [Attachments](#attachments)
- [Languages](#languages)
- [Delivery](#delivery)
- [Customizing templates](#customizing-templates)
- [Adding an email](#adding-an-email)

## The emails

The registry is `Notifications\Emails`. An email only goes out while its module (the feature in the
table) is on and the email is switched on.

**To customers**

| Key | Email | Feature | Sent when |
| --- | --- | --- | --- |
| `order_received` | Order received | `orders` | An order is placed: the summary and how to pay |
| `payment_link` | Payment link | `payments` | Staff send a payment link (manual orders, edits) |
| `payment_confirmation_received` | Payment confirmation received | `manual_payments` | The customer submits "I have paid" |
| `payment_rejected` | Payment confirmation rejected | `manual_payments` | Staff reject a confirmation: the reason and a link to confirm again |
| `payment_failed` | Payment failed | `payments` | A pending order's payment fails (the order becomes Failed): a link to pay again or another way |
| `payment_received` | Payment received | `orders` | The order is paid (not for orders with a zero total, which `order_received` covers) |
| `order_shipped` | Order shipped | `shipping` | A shipment is added: courier and tracking link |
| `order_completed` | Order completed | `orders` | The order is completed |
| `order_cancelled` | Order cancelled | `orders` | The order is cancelled (by the customer, staff or the payment deadline), with the reason |
| `order_refunded` | Order refunded | `orders` | A refund is recorded |
| `order_updated` | Order changed | `orders` | Staff edit an unpaid order and choose to tell the customer |
| `customer_note` | Note to the customer | `orders` | Staff add a note "to the customer" on the order page |
| `downloads_ready` | Downloads ready | `digital` | Digital access is granted: links or files |
| `quote_received` | Quote request received | `orders` | A quote request is placed (Quotation mode) |
| `quote_ready` | Quote ready | `orders` | Staff send the priced quote, with the accept link |
| `account_welcome` | Welcome | `accounts` | An account's email is verified (by the link, the first emailed code or Google sign-up), or right after registering when verification is off |
| `verify_email` | Verify email | `accounts` | Registration, a sign-in attempt before verifying, an email change ([accounts.md](accounts.md#email-verification)) |
| `login_code` | Sign-in code | `passwordless_login` | The customer asks for a sign-in code |
| `password_reset` | Password reset | `accounts` | The customer (or staff, from Shop → Customers) asks for a reset link |

**To staff**

| Key | Email | Feature | Sent when |
| --- | --- | --- | --- |
| `staff_new_order` | New order | `orders` | An order is placed |
| `staff_payment_confirmation` | Payment confirmation to verify | `manual_payments` | A customer submits a payment confirmation (links to the confirmations page) |
| `staff_order_cancelled` | Order cancelled | `orders` | An order is cancelled, with the reason and who cancelled it |
| `staff_new_quote` | New quote request | `orders` | A quote request is placed |
| `staff_low_stock` | Low stock | `inventory` | A variant reaches its low-stock level |
| `staff_out_of_stock` | Out of stock | `inventory` | A variant runs out |
| `staff_deletion_request` | Account deletion request | `accounts` | A customer asks for their account to be deleted |

`verify_email`, `login_code` and `password_reset` are **locked**: they are always sent, because
customers can't sign in without them. All other emails are on by default.

Emails about an order have a button: the order page for customers (the pay page for
`payment_link` and `payment_failed`, the confirmation page for `payment_rejected`) and the admin order page for staff.

## Settings → Store → Emails

For users with `commerce.settings.emails`. The page lists the emails of the modules that are on,
with a switch for each one that isn't locked.

Open an email to change:

| Field | |
| --- | --- |
| Send this email | The switch (not on locked emails) |
| Send to, And to users with the roles | Staff emails only; see [Staff recipients](#staff-recipients) |
| Subject | Per site language |
| Heading, Text | Per site language; the heading and the opening paragraph |
| Attachments | Emails that can carry files; see [Attachments](#attachments) |

Leave a text empty to use the default. Texts can use placeholders:

| Placeholder | Becomes |
| --- | --- |
| `:number` | The order (or quote) number |
| `:store` | The store name |
| `:name` | The customer's name |

The account emails (`account_welcome`, `verify_email`, `login_code`, `password_reset`) keep their own
layout: only the switch and the subject can be changed, and they have no preview or test.

**Preview** opens the email rendered with the latest order (or a sample order when there is none),
in the main language; add `?lang=en` to the preview URL for another language.

**Test** sends the email to your own address, right away, with the same order.

Saving is recorded in the activity log. The values are stored under `emails.<key>` in the store
settings: `enabled`, `subject`, `heading` and `intro` (each `{locale: text}`), `attachments`, and for
staff emails `addresses` and `roles`.

## Staff recipients

Each staff email goes to:

- the addresses in **Send to** (comma separated); and
- every user with one of the roles in **And to users with the roles** (default: Shop Manager).

When **Send to** is empty and no roles have been saved for the email, it goes to the store email
(Settings → Store → General) and to the Shop Managers. When you choose roles but no addresses, it
goes to those users only. Each address gets the email once.

## Attachments

| Email | Can attach | By default |
| --- | --- | --- |
| `order_received` | Invoice PDF | — |
| `payment_received` | Invoice PDF | Invoice |
| `quote_ready` | Quotation PDF | Quotation |
| `staff_new_order` | Packing slip PDF | — |
| `downloads_ready` | Download files | Download files |

- PDFs are attached only while the `documents` feature is on. Attaching an invoice gives the order
  its invoice number if it has none yet. See [documents.md](documents.md).
- Download files are attached only for products delivered by attachment, and only files up to
  `downloads.attachment_max_mb` (10 MB). Larger files and external links are sent as links.
- A file that fails to attach is reported to your error log; the email still goes out.

## Languages

- Customer emails are sent in the order's language, else the customer's language, else the main
  language.
- Staff emails are in the main language.
- Default texts ship in Indonesian and English (`resources/lang/{id,en}/emails.php`, and
  `account.php` for the account emails). Publish them to change the defaults for every store:

  ```bash
  php artisan vendor:publish --tag=commerce-translations
  ```

  Texts set in Settings → Store → Emails win over the translations.

## Delivery

Store emails are Laravel notifications:

- `Notifications\Notifier` checks the module and the switch, finds the recipients, and sends one
  `Notifications\StoreEmail` per address, in that recipient's language.
- `StoreEmail` is **queued** (`ShouldQueue`), so run a queue worker
  ([installation.md](installation.md#run-the-scheduler-and-a-queue-worker)). The account emails
  (welcome, verify, password reset) are queued too; the sign-in code is sent straight away.
- Each email about an order is noted on the order's timeline ("Order received email sent"),
  visible to the customer for customer emails and internal for staff emails.
- Customer emails have the store email as Reply-To.
- Placeholder addresses of anonymized customers (`…@invalid.local`) are never emailed.

Configure a real mailer in `.env` (`MAIL_MAILER`, `MAIL_HOST`…). With the `log` mailer, or without a
running queue worker, the dashboard's health card warns.

The message is a markdown mail, `commerce::emails.store`:

```blade
# {{ $heading }}
{{ $intro }}
@includeIf('commerce::emails.parts.'.$key)     {{-- the email's own part --}}
@include('commerce::emails.parts.summary')       {{-- the order summary, for order emails --}}
<x-mail::button :url="$action['url']">…</x-mail::button>
```

The parts live in `resources/views/emails/parts/{key}.blade.php`; emails without a part show the
heading, text, summary and button only. `summary` is the items and totals, included in
`order_received`, `payment_received`, `order_completed`, `order_cancelled`, `quote_received`,
`quote_ready`, `payment_link`, `order_updated`, `staff_new_order`, `staff_new_quote` and
`staff_order_cancelled`.

Every view receives:

| Variable | |
| --- | --- |
| `$key`, `$lang` | The email key and its language |
| `$order`, `$customer`, `$variant` | What the email is about (each may be null) |
| `$context` | Extra data: `shipment` (shipped), `reason` (cancelled, rejected), `by` (staff cancelled), `refund` (refunded), `note` (customer note), `changes` (order changed), `grants` (downloads), `quantity` (low stock), `confirmation` (payment confirmation to verify) |
| `$heading`, `$intro` | The texts from settings or the defaults |
| `$action` | `['label' => …, 'url' => …]` or null |
| `$replace` | The placeholder values |
| `$store` | `['name' => …, 'url' => …]` |

## Customizing templates

Override any view by copying it into `resources/views/vendor/commerce/`, keeping its path. For one
email's body:

```bash
mkdir -p resources/views/vendor/commerce/emails/parts
cp vendor/sunrice/commerce/resources/views/emails/parts/order_shipped.blade.php \
   resources/views/vendor/commerce/emails/parts/
```

Copy `emails/store.blade.php` the same way to change the frame of every store email. A part for an
email that has none (for example `order_completed.blade.php`) is picked up too.

`php artisan vendor:publish --tag=commerce-views` copies all of commerce's views at once. Prefer
copying only the files you change, so the others keep getting updates.

The look (colours, header, footer) comes from Laravel's mail theme. Publish it with
`php artisan vendor:publish --tag=laravel-mail` and edit `resources/views/vendor/mail`.

Keep subjects and opening texts in Settings → Store → Emails where you can: the owner can then edit
them per language without a deploy.

## Adding an email

Extensions register their own email and send it with the notifier:

```php
use Sunrice\Commerce\Notifications\EmailDefinition;
use Sunrice\Commerce\Notifications\Notifier;

Commerce::registerEmail(new EmailDefinition(
    key: 'points_expiring',
    label: 'Points expiring soon',
    audience: 'customer',            // or 'staff'
    feature: 'loyalty',
    description: 'A week before points expire.',
    lang: 'loyalty::emails.points_expiring', // default texts: .subject, .heading, .intro, .action
));

app(Notifier::class)->send('points_expiring', $customer, ['points' => 120]); // an Order, Customer or Variant
```

It appears in Settings → Store → Emails with its switch, texts, preview and test. Its body part is the
view `commerce::emails.parts.points_expiring`. See [extending.md](extending.md#emails).
