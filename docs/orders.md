# Orders

An order (or a quote) is a row in `commerce_orders` with its lines, adjustments, payments,
shipments, refunds and a timeline. Addresses, the shipping method and the lines are snapshots
taken when it was placed, so later changes to products or regions don't rewrite history.

## Contents

- [Three states](#three-states)
- [Status transitions](#status-transitions)
- [Payment and fulfilment statuses](#payment-and-fulfilment-statuses)
- [Expiry of unpaid orders](#expiry-of-unpaid-orders)
- [Numbers](#numbers)
- [Admin: the order list](#admin-the-order-list)
- [Admin: the order page](#admin-the-order-page)
- [Manual orders](#manual-orders)
- [Editing unpaid orders](#editing-unpaid-orders)
- [Quotes](#quotes)
- [Shipments](#shipments)
- [Refunds](#refunds)
- [Documents](#documents)
- [Trash](#trash)
- [The customer's side](#the-customers-side)
- [Actors and the timeline](#actors-and-the-timeline)
- [Events](#events)

## Three states

Each order has three states, kept and shown apart (`Orders\OrderStatus`):

| State | Column | Values |
| --- | --- | --- |
| Status | `status` | `pending` (Pending payment), `on_hold`, `processing`, `completed`, `cancelled`, `refunded`, `failed` |
| Payment | `payment_status` | `unpaid`, `awaiting_confirmation`, `paid`, `partially_refunded`, `refunded`, `failed` |
| Fulfilment | `fulfillment_status` | `unfulfilled`, `partially_shipped`, `shipped`, `not_required` |

Quotes (`type` `quote`) use their own statuses: `requested`, `quoted`, `accepted`, `declined`,
`expired`, `cancelled`.

Labels come from `commerce::orders.status.*`, `commerce::orders.payment.*` and
`commerce::orders.fulfillment.*`; `OrderStatus::label($status, $kind)` gives one.

Handy checks on `Order`: `isQuote()`, `isPaid()` (paid or refunded in part or full),
`isUnpaid()` (unpaid, awaiting confirmation or failed), `isOpen()`, `needsShipping()`,
`displayNumber()` and `url()` (the customer's page).

## Status transitions

`Orders\OrderStateMachine` is the only writer of `status`. It locks the order, checks the move,
writes it with a version bump and a timeline line in one transaction, records it in Sunrice's
activity log, and dispatches the events after commit.

```php
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\OrderStateMachine;

$states = app(OrderStateMachine::class);
$states->can($order, 'completed');        // bool
$states->refusal($order, 'cancelled');    // why not, or null
$states->transition($order, 'on_hold', Actor::admin($user), 'Waiting for stock');
```

A refused move throws `Orders\InvalidTransition` with the reason.

`OrderStateMachine::TRANSITIONS`:

| Type | From | To |
| --- | --- | --- |
| order | Pending payment | Processing, Cancelled, Failed, On hold |
| order | Failed | Pending payment, Processing, Cancelled |
| order | Processing | Completed, Cancelled, Refunded, On hold |
| order | On hold | Pending payment, Processing (only the status it came from) |
| order | Completed | Refunded |
| quote | Requested | Quoted, Declined, Cancelled |
| quote | Quoted | Accepted, Declined, Expired, Cancelled |

Guards on orders:

- **Cancelled** needs nothing left paid: a paid order must be refunded first.
- **Completed** needs the order paid, or cash on delivery, or a zero total.
- **Refunded** needs refunds that reach the amount paid.
- **On hold** remembers the status before (`meta.hold_from`); leaving it goes back to that status.

What moves orders on its own:

| Move | By |
| --- | --- |
| Pending payment or Failed → Processing | A payment recorded paid |
| Pending payment → Failed | A gateway reports a failure |
| Failed → Pending payment | The payment is pending again (the customer pays again) |
| Pending payment or Failed → Cancelled | The payment deadline passes |
| Processing → Completed | `checkout.auto_complete_digital` (paid, nothing to ship) or `checkout.auto_complete_shipped` (fully shipped and paid) |
| Processing or Completed → Refunded | Refunds reach the amount paid |
| Quoted → Expired | The quote's validity passes |

Cancelling releases what the order reserved: stock (less what refunds already restocked), flash
sale quantities, voucher uses and extension reservations. Open payments are cancelled. Each part
runs once, so repeats are harmless (`Orders\Listeners\ReleaseReservations`).

## Payment and fulfilment statuses

The payment status follows the payments; only `Payments\Actions\RecordPaymentResult` changes it,
together with `paid_total` and `refunded_total`. See [payments.md](payments.md#payment-states).

The fulfilment status follows the shipments: Shipped when every line that ships is fully sent
(less refunded quantities), Partially shipped when some is, Not required when nothing ships.

## Expiry of unpaid orders

`Orders\Expiry` runs every minute in `commerce:tick` (up to 200 at a time):

- **Payments** that are `pending` or `failed` with an `expires_at` in the past are recorded
  expired, which cancels the order (reason "expired") and releases its reservations.
  - A payment awaiting confirmation is never expired: the review pauses the deadline.
  - A gateway that implements `SupportsStatusCheck` is asked once first, so a payment its webhook
    missed isn't lost.
- **Quotes** that are Quoted with `quote_valid_until` in the past become Expired.

Deadlines come from the payment method (24 hours by default; see
[payments.md](payments.md#deadlines)). Orders without a payment deadline (cash on delivery,
WhatsApp orders) never expire on their own.

## Numbers

`Orders\Numbering` gives order, quote and invoice numbers from a format and a reset rule. Each
number is one locked row update in `commerce_sequences`, so concurrent checkouts never share one.

| Kind | Format setting | Default | Reset setting | Default |
| --- | --- | --- | --- | --- |
| Order | `checkout.order_number_format` | `ORD-{Y}{m}{d}-{seq:4}` | `checkout.order_number_reset` | `daily` |
| Quote | `checkout.quote_number_format` | `Q-{Y}{m}-{seq:4}` | `checkout.quote_number_reset` | `monthly` |
| Invoice | `documents.invoice_number_format` | `INV/{Y}/{m}/{seq:4}` | `documents.invoice_number_reset` | `monthly` |

Tokens: `{Y}` (2026), `{y}` (26), `{m}` (10), `{d}` (17), `{seq}` and `{seq:N}` (padded to N
digits), plus any fixed text. A format must contain `{seq}` or `{seq:N}` and be at most 60
characters; an invalid stored format falls back to the default. Resets: `never`, `yearly`,
`monthly`, `daily`. For example `ORD-{Y}{m}{d}-{seq:4}` gives `ORD-20261017-0001`, and the
counter starts again the next day.

Replace order numbering entirely with `Commerce::orderNumberUsing()`; see
[extending.md](extending.md#orders).

## Admin: the order list

Shop → Orders (`commerce.orders.view`) lists orders and quote requests.

- **Search**: number, quote number, name, email, phone, or a line's SKU.
- **Filters**: type, status, payment, shipping (fulfilment), payment method, shipping method type,
  date (today, last 7 or 30 days, this or last month), channel (`storefront`, `admin`,
  `whatsapp`, `mcp`, `api`), voucher code, and the trash.
- **Columns**: number, date, customer, status, payment, shipping and total by default; also items,
  payment method, shipping method, city, channel, email and phone. Column choices are saved per
  user.
- **Export** (`commerce.orders.export`): a CSV of the filtered list (`orders-{date}.csv`). Text that
  starts like a spreadsheet formula (`=`, `+`, `-`, `@`) gets a leading `'`, so what customers
  typed never runs in Excel or Sheets; the customers and report exports do the same.
- **Bulk actions**:

  | Action | Permission | |
  | --- | --- | --- |
  | Mark processing, Mark completed | `commerce.orders.edit` | Orders that can't make the move are skipped and counted. |
  | Print packing slips | `commerce.documents.view` | One PDF for up to 200 orders. |
  | Move to trash | `commerce.orders.delete` | |

## Admin: the order page

The order page shows, by panel:

- **Items**: name, options, SKU, quantities (shipped, refunded), the unit price and where it came
  from (regular price, flash sale, pricing rule, bulk price, set by staff, quoted), discounts, and
  bundle components.
- **Totals**: subtotal, discount, shipping, fees, tax (included or added), total, paid, refunded,
  and every adjustment with its label and code.
- **Customer**: name, email, phone, guest or account, link to the customer.
- **Addresses**, shipping method, pickup location, customer note, dropshipper and extra fields.
- **Payments** and **payment confirmations** (with the proof for `commerce.payments.verify`).
- **Shipments**, **refunds**, **downloads** (digital access, which staff can manage).
- **Documents**: invoice, packing slip or quotation.
- **Timeline**: newest first.
- Extension panels registered with `Commerce::registerOrderPanel()`.

Actions, each with its permission:

| Action | Permission | When |
| --- | --- | --- |
| Change status | `commerce.orders.edit`, or `commerce.orders.cancel` to cancel | The allowed moves, with the reason when one is refused. An unpaid Pending order reaches Processing by recording its payment, so that move isn't offered there. |
| Mark paid | `commerce.payments.verify` | Unpaid orders with a total, not cancelled. Takes a reference, date and account. |
| Add a note | `commerce.orders.edit` | Internal, or to the customer (emailed). |
| Edit addresses | `commerce.orders.edit` | Until something has shipped. |
| Edit items | `commerce.orders.edit` | See [Editing unpaid orders](#editing-unpaid-orders). |
| Send payment link | `commerce.orders.edit` | Open unpaid orders with a total. Emails "payment link". |
| Add a shipment | `commerce.shipments.manage` | Shipping on and something to ship. |
| Record a refund | `commerce.orders.refund` | Something paid and not refunded. |
| Trash, restore, delete for good | `commerce.orders.delete` | See [Trash](#trash). |
| Price a quote | `commerce.quotes.respond` | Requested or Quoted quotes. |

## Manual orders

Staff create an order for a customer, for example from a chat (`commerce.orders.create`,
`Orders\Actions\CreateManualOrder`):

- the customer: an existing one, or an email (and name, phone);
- lines: variants and quantities; a unit price per line needs `commerce.orders.override-prices`;
- addresses, a hand-set shipping label and cost, and a discount;
- the payment status: `unpaid` (optionally with a payment method and "send the payment link") or
  `paid` (a manual payment is recorded with a reference).

The order gets channel `admin`, an order number, reserved stock (all or nothing, as at checkout),
a timeline line and an optional internal note. It dispatches `OrderPlaced`. A zero total starts
as Processing / Paid. The editor previews totals as you type (`orders/preview`).

## Editing unpaid orders

`Orders\Actions\EditOrder` changes the lines of an order that:

- is not a quote, has nothing paid, and is unpaid;
- is Pending payment, On hold, Processing or Failed;
- hasn't shipped, even partly.

Existing lines keep their unit price; new lines get today's price; overrides need
`commerce.orders.override-prices`. The stock difference is reserved or released, the totals and the
open payment's amount follow, and the timeline gets the differences ("Total: Rp100.000 →
Rp120.000"). Ticking "notify" emails the customer "order changed" (`OrderEdited`).

## Quotes

A quote request comes from checkout in Quotation mode (see [checkout.md](checkout.md#quote-requests)).

| Step | Who | Action | Result |
| --- | --- | --- | --- |
| Respond | Staff with `commerce.quotes.respond` | `Orders\Actions\RespondToQuote` | Lines, unit prices, shipping, discount and the validity date are set. "Send" makes it Quoted and emails "quote ready" (with the quotation PDF). Saving without sending stores the prices and leaves the status. |
| Accept | The customer, on `/quote/{key}` | `Orders\Actions\AcceptQuote` | Must be Quoted and still valid, and every product still available. Stock is reserved at the quoted prices; it gets an order number and becomes an order: Pending payment (or Processing / Paid when it costs nothing). Dispatches `QuoteAccepted` and `OrderPlaced`. |
| Decline | The customer, or staff | `Orders\Actions\DeclineQuote` | Requested or Quoted → Declined, with an optional reason. |
| Expire | `commerce:tick` | `Orders\Expiry::quotes()` | Quoted → Expired after `quote_valid_until`. |
| Cancel | Staff | The state machine | Requested or Quoted → Cancelled. |

The validity defaults to `checkout.quote_valid_days` (14) days, to the end of that day. An
accepted quote is paid on the pay page; see [payments.md](payments.md#the-pay-page).

## Shipments

`Orders\Actions\CreateShipment` records a parcel for orders that are Processing, Completed or On
hold and have something to ship:

- a courier preset (or a free-text courier name), service, tracking number and cost;
- the items and quantities in it, at most what's left to ship (partial shipments are fine).

The tracking URL comes from the courier preset. The fulfilment status follows, the timeline gets a
customer-visible line, and `ShipmentCreated` emails "order shipped" with the tracking link.

`Orders\Actions\UpdateShipment` corrects the courier or tracking, sets the status (`shipped`,
`in_transit`, `returned`, `cancelled`), or marks it delivered (`ShipmentDelivered`). See
[shipping.md](shipping.md#shipments-and-tracking).

## Refunds

`Orders\Actions\RecordRefund` records money returned:

- an amount, more than zero and at most what was paid and not refunded;
- optionally items and quantities (at most what was bought) and whether to restock them;
- a reason.

It is a manual refund by default. With "via gateway", a payment method that implements
`SupportsRefunds` is asked first; a refusal stops the refund. The amount is spread over the paid
payments (newest first) through `RecordPaymentResult`. Once refunds reach the amount paid, the
order becomes Refunded. `OrderRefunded` emails "order refunded" and takes the units back from the
products' sales counts.

## Documents

With the Documents module on and `commerce.documents.view`, the order page links the invoice, the
packing slip (orders that ship) and the quotation (quotes), shown as PDFs. The invoice number is
given when the order is placed or paid (`documents.invoice_assigned_on`). Customers can download
the invoice of a paid order from the order page when `documents.customer_invoice_download` is on.
See [documents.md](documents.md).

## Trash

Trashing is a soft delete (`commerce.orders.delete`). The "Trash" filter shows trashed orders,
which can be restored. Deleting for good removes the order and everything attached to it, and is
refused for orders that received a payment, so the books stay complete.

## The customer's side

- **Order page** `/order/{key}` (`commerce.order`): the 40-character random `order_key` in the URL
  is the access, so no sign-in is needed; it is `noindex`. It shows the number, status, payment,
  items and totals, how to pay (instructions, amount, deadline, "I have paid"), a "pay again" link,
  downloads, shipments with tracking links, the invoice, cancel, and an invitation to create an
  account for guests. Quotes live at `/quote/{key}` with Accept and Decline.
- **Track order** `/track-order` (`commerce.track-order`): a guest enters the order number and
  email and is sent to the order page.
- **My Account** → Orders and Quotes: the signed-in customer's own orders (guest orders join once
  the email is verified), the same order page, "buy again" (adds the lines to the cart) and cancel.
  See [accounts.md](accounts.md).
- **Cancelling**: with `checkout.customer_cancel` on (default), a customer can cancel an order
  that is Pending payment or Failed with nothing paid. `Orders\Actions\CancelOrderByCustomer`
  checks this (`allowed()`) and cancels with an optional reason.

## Actors and the timeline

Every change says who made it with an `Orders\Actor`:

| Constructor | `source` | For |
| --- | --- | --- |
| `Actor::admin($user)` | `admin` | Staff (defaults to the signed-in admin) |
| `Actor::customer($user)` | `storefront` | The customer (defaults to the signed-in customer, or a guest) |
| `Actor::system()` | `system` | The scheduler and listeners |
| `Actor::gateway('midtrans')` | `gateway` | A payment gateway |
| `Actor::ai($user, $via)` | `ai` | AI agents through MCP tools |

`Orders\Timeline` writes `commerce_order_events`: a `type` (`status`, `payment`, `note`, `email`,
`shipment`, `refund`, `edit`…), a message, data, the actor and a `visibility` (`internal` or
`customer`). Staff notes go through `Orders\Actions\AddOrderNote`; a note to the customer is
emailed.

```php
app(Timeline::class)->record($order, 'loyalty', 'Earned 120 points', ['points' => 120], Actor::system());
```

## Events

Order events are dispatched after the transaction commits:

| Event | When |
| --- | --- |
| `OrderPlaced` | An order is placed, created by staff, or a quote is accepted |
| `QuoteRequested`, `QuoteSent`, `QuoteAccepted` | Quote steps |
| `OrderPaid` | A payment is recorded paid (or a zero-total order is placed) |
| `OrderStatusChanged` | Every status change (`from`, `to`, `actor`) |
| `OrderCancelled`, `OrderCompleted`, `OrderOnHold`, `OrderFailed`, `QuoteDeclined`, `QuoteExpired` | The matching status change (`actor`, `reason`) |
| `OrderEdited` | Lines edited (`changes`, `notify`) |
| `OrderNoteAdded` | A staff note |
| `OrderRefunded` | A refund recorded |
| `ShipmentCreated`, `ShipmentDelivered` | Shipment steps |
| `PaymentLinkRequested` | Staff send the payment link |

Payloads are in [extending.md](extending.md#events); the emails they send are in
[emails.md](emails.md).
