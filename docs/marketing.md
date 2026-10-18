# Marketing emails

The `marketing` module (off by default; Settings → Store → Features → Marketing emails) sends
emails to customers who accept marketing:

- **Campaigns** (Shop → Marketing → Campaigns): one email to an audience you choose, now or at a
  time you set.
- **Automations** (Shop → Marketing → Automations): an email sent by itself to each customer a trigger finds,
  such as a cart left behind or a customer who hasn't ordered for 60 days.

Both count opens and clicks, carry an unsubscribe link, and are sent by the queue, so the store
never waits for them. Staff need the permission `commerce.marketing.manage`.

## Contents

- [Who gets marketing email](#who-gets-marketing-email)
- [Audiences](#audiences)
- [Writing the email](#writing-the-email)
- [Campaigns](#campaigns)
- [Automations](#automations)
- [Tracking and results](#tracking-and-results)
- [Unsubscribing](#unsubscribing)
- [Sending: queue, batches and limits](#sending-queue-batches-and-limits)
- [Privacy](#privacy)
- [Adding a trigger](#adding-a-trigger)

## Who gets marketing email

Only customers with marketing consent (`accepts_marketing`: the checkbox at checkout and
registration, the profile page, or staff on the customer page). Never anonymized customers,
customers who asked to be deleted, or placeholder addresses. Consent is checked again when each
email is sent, so someone who unsubscribes after a campaign was queued doesn't get it.

One exception: the abandoned-cart automation also emails a guest who typed their email at checkout
and ticked "send me news and offers" there, unless that address unsubscribed before.

## Audiences

Rules narrow the customers who accept marketing; all of them must match, or any one of them
(`Match: any rule`). The editor counts the matching customers as you change the rules.

| Rule | Matches customers who… |
| --- | --- |
| Hasn't ordered for (days) | ordered before, but not in the last N days |
| Ordered in the last (days) | ordered in the last N days |
| Has never ordered | have no orders |
| Orders: at least / at most | have that many orders |
| Total spent: at least / at most | spent that much (in whole currency units) |
| Bought one of the products | ordered one of the chosen products (cancelled and failed orders don't count) |
| Bought from the categories or brands | ordered a product in one of the chosen categories or brands |
| Became a customer in the last (days) | joined (registered or first ordered) in the last N days |
| Customer for more than (days) | joined more than N days ago |
| Account | registered, or guests who ordered without an account |
| Has the role | have the customer role (Settings → Store → Accounts → Customer roles) |
| Language | use that language (the main language includes customers without one) |
| Province / City (address) | have a saved address in it (part of the name is enough) |
| Has products in their cart | have an active cart with products (signed-in customers) |
| Has products in their wishlist | have a wishlist with products (signed-in customers) |
| Opened a marketing email in the last (days) | opened any marketing email recently |
| Hasn't opened a marketing email in the last (days) | didn't open one recently |
| Received / Didn't receive the campaign | got (or didn't get) an earlier campaign |

`Sunrice\Commerce\Marketing\Audience` builds the query: `app(Audience::class)->query($audience)`.

## Writing the email

Each language has a subject, a preview text (shown after the subject in most inboxes), the text
(the rich text editor) and an optional button. A customer gets their language; empty parts use the
main language's. The email uses the store's frame, logo and brand color, like the store emails.

**Smart tags** are replaced for each customer. Add a fallback for empty values after a bar:
`{first_name|there}`. Unknown tags are sent as typed (the editor warns about them).

| Tag | Value |
| --- | --- |
| `{first_name}`, `{name}`, `{email}` | the customer |
| `{store_name}`, `{store_url}`, `{account_url}` | the store, its home page, My Account |
| `{orders_count}`, `{total_spent}` | their orders and spending |
| `{last_order_number}`, `{last_order_date}`, `{days_since_last_order}` | their last order |
| `{cart_url}`, `{cart_items}`, `{cart_total}` | their cart (abandoned-cart emails); `{cart_url}` brings a guest's cart back on any browser |
| `{voucher_code}` | the email's voucher code (Details → Voucher code; create the voucher in Shop → Vouchers) |
| `{unsubscribe_url}` | the unsubscribe page (every email already has an unsubscribe link at the bottom) |

**Preview** renders the email with the first matching customer; **Send me a test** sends it to you,
with the subject marked `[Test]`. Neither needs saving first.

## Campaigns

New campaigns start from a template (announcement, we miss you, first order nudge, thank our best
customers, recent buyers) that fills in the audience and the texts.

- **Send…** sends it now or at a time you choose (`commerce:tick` starts it when due). The audience is
  counted again when sending starts; each customer gets a campaign once, even if it is started twice.
- A scheduled campaign can be changed or taken back to draft until it starts.
- **Stop sending** cancels the emails not yet sent.
- A sent campaign can't be changed; **Duplicate** it to send a similar one.

Statuses: draft, scheduled, sending, sent, cancelled.

## Automations

An automation has a trigger, a delay, optional audience rules on top, and its email. It starts
from the trigger's template.

| Trigger | Sends… | One email per |
| --- | --- | --- |
| Abandoned cart | N hours (default 3) after a cart with products was last changed, if no order came of it | cart |
| Welcome | N hours (default 1) after someone becomes a customer | customer |
| No first order yet | N days (default 7) after registering, to customers who haven't ordered | customer |
| After an order | N days (default 7) after an order | order |
| Win back | N days (default 60) after the last order, if they haven't ordered since | last order |

Every minute `commerce:tick` queues a job (`RunAutomations`) that asks each active automation's
trigger who became due since it last asked (at most a week back, after downtime). Turning an
automation on starts from that moment: customers who were already due don't get it. A paused
automation keeps its place and catches up when it is turned on again.

## Tracking and results

- **Opens**: each email carries a 1×1 image; loading it counts an open. Opens are approximate: some
  inboxes load images for everyone (Apple Mail Privacy Protection), some never.
- **Clicks**: every `http(s)` link (the unsubscribe link aside) goes through a short redirect that
  counts the click, then to the link. A click also counts as an open. Redirects only ever go to the
  email's own links, so the redirect can't be used to send people elsewhere.
- **Results** (open a sent campaign, or Results on an automation): sent, failed, open and click
  rates, unsubscribes, clicks per link and the latest recipients.

Set `commerce.marketing.track` to `false` to stop counting opens (clicks still redirect).

## Unsubscribing

Every email has an unsubscribe link at the bottom and `List-Unsubscribe` headers with one-click
unsubscribe (RFC 8058), which Gmail and others show next to the sender. The link opens a page that
asks to confirm, so link checkers in mail systems don't unsubscribe anyone. Unsubscribing removes
the marketing consent; order emails keep coming. Customers can opt in again from their profile.

The tracking and unsubscribe links live under `/mail/` (`commerce.marketing.path`), work without a
session or cookies, and keep working while the module is off.

## Sending: queue, batches and limits

Run a queue worker (`php artisan queue:work`); the store health check warns when none is running.

1. Starting a campaign queues `StartCampaign`, which finds the audience in chunks and adds one row
   per recipient (`commerce_campaign_sends`; a unique key stops duplicates).
2. The rows are sent by `SendMarketingEmails` jobs in batches of `batch_size` (50). Each row is
   claimed before it is sent, so a retried job never sends an email twice.
3. With `per_minute` set, batches are spread out to stay under your mail provider's limit.

| Config | Default | |
| --- | --- | --- |
| `marketing.queue` | `null` (`COMMERCE_MARKETING_QUEUE`) | Queue for the marketing jobs (e.g. `marketing`, so order emails never wait behind a campaign) |
| `marketing.mailer` | `null` (`COMMERCE_MARKETING_MAILER`) | Mailer for marketing emails (e.g. a separate provider or IP); null is the default mailer |
| `marketing.batch_size` | `50` | Emails per job |
| `marketing.per_minute` | `0` (`COMMERCE_MARKETING_PER_MINUTE`) | Spread batches to about this many emails a minute; 0 sends as fast as the workers can |
| `marketing.track` | `true` | Count opens |
| `marketing.path` | `mail` | Path of the tracking and unsubscribe links |
| `marketing.keep_days` | `365` | Recipient rows older than this are pruned (`commerce:prune`); campaigns keep their totals |

## Privacy

Recipient rows keep the email address, status and open/click times. Anonymizing a customer deletes
their rows (the campaigns' totals stay). No IP addresses or user agents are stored for opens or
clicks.

## Adding a trigger

Implement `Sunrice\Commerce\Marketing\Automations\Trigger` (or extend `CustomerTrigger` for a date
on the customer record) and register it:

```php
Commerce::registerMarketingTrigger(new BirthdayTrigger);
```

`recipients($delay, $from, $to)` yields a `Recipient` for everyone whose moment fell in
`($from, $to]`, with a dedupe key (one email per key) and context. Add its starting texts as
`commerce::marketing.templates.{template()}` translations, or your package's own.
