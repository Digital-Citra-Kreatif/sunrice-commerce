# Payments

Commerce records payments; payment methods say how the customer pays. Three manual methods are
built in (bank transfer, payment instructions such as a QRIS code, and cash on delivery).
Gateways come from extension packages.

## Contents

- [Modules](#modules)
- [Payment settings](#payment-settings)
- [Bank transfer](#bank-transfer)
- [Payment instructions (QRIS, e-wallets…)](#payment-instructions-qris-e-wallets)
- [Cash on delivery](#cash-on-delivery)
- [Fees](#fees)
- [Deadlines](#deadlines)
- [The pay page](#the-pay-page)
- [Payment confirmations](#payment-confirmations)
- [Marking an order paid](#marking-an-order-paid)
- [Payment states](#payment-states)
- [Webhooks](#webhooks)
- [Gateways](#gateways)

## Modules

| Feature | Gives |
| --- | --- |
| `payments` | Payment at checkout, the pay page and webhooks. Needed by Online store mode. |
| `manual_payments` | Bank transfer, payment instructions and cash on delivery, payment confirmations and Shop → Payments to verify. Needs `payments`. |

Both are available in Online store and Quotation modes. With `payments` off no method is offered.
See [features.md](features.md).

## Payment settings

Settings → Store → Payments (`commerce.settings.payments`) lists the methods in checkout order.
Move them up and down, switch each on or off, and open one to edit it. Settings are stored in the
store settings under `payments.methods.{key}`, the order under `payments.order`.

Every method extending `Payments\PaymentMethodBase` has these fields:

| Field | Key | |
| --- | --- | --- |
| Active | `active` | Off by default. |
| Title, per language | `title` | What customers see; empty uses the method's label. |
| Description at checkout, per language | `description` | |
| Only from an order total of | `min_total` | |
| Only up to an order total of | `max_total` | `0` or empty: no limit. |
| Only for countries | `countries` | ISO codes, comma separated (`ID, SG`). Empty: everywhere. |
| Only for provinces | `provinces` | Province codes, comma separated (`31, 32`). Empty: everywhere. |
| Only with shipping method types | `shipping_methods` | Comma separated (`flat, weight, pickup`). Empty: any. |
| Only for customer roles | `roles` | Role names, comma separated. Empty: everyone. |
| Fee (fixed) | `fee_fixed` | See [Fees](#fees). |
| Fee (%) | `fee_percent` | |
| Payment deadline (hours) | `deadline_hours` | `24` by default; `0`: never. |

A method is offered when it is active, its module is on and all its rules match the order.

## Bank transfer

`Payments\Methods\BankTransfer`, key `bank_transfer`.

- **Bank accounts** (1 to 20): bank, account number, holder, branch and logo. The bank list comes
  from `config('commerce.payments.banks')` (BCA, Bank Mandiri, BNI, BRI, BSI, CIMB Niaga,
  PermataBank, Danamon, BTN, Bank Jago), plus "Other" with a free-text name.
- **Unique code** (`unique_code`): `off`, `add` or `subtract`, between `unique_min` and
  `unique_max` (1–999). See below.
- **Instructions**, per language: shown on the order page and in the "order received" email.
- **Payment confirmation** (`confirmation`): `required` (with a proof), `optional` or `off`.

The order page shows the accounts with copy buttons, the exact amount, the deadline and the
"I have paid" button.

**Unique codes.** With the code on, each open order's transfer amount is different, so you can
tell transfers apart in the bank statement. When the order is placed, `Payments\UniqueCodes`
picks a random value in the range that doesn't give the same amount as another unpaid bank
transfer order from the last 7 days (up to 20 tries). It is added to (or subtracted from) the total
as a `unique_code` adjustment labelled "Unique code". Subtracting never takes the total to zero.

```text
Total Rp150.000  →  with code 237 (add)  →  transfer Rp150.237
```

## Payment instructions (QRIS, e-wallets…)

`Payments\Methods\PaymentInstructions`, for anything that is "pay here, then tell us": a static
QRIS code, an e-wallet number, a marketplace link.

- An **image** (for example the QRIS code), **instructions** per language and the **payment
  confirmation** setting, as for bank transfer.
- You can have several: "Add" on the Payments page creates an instance with a key like
  `instructions_k3x9a` (inactive until you switch it on). Each instance has its own title,
  rules, fee and deadline. Instances can be removed.

## Cash on delivery

`Payments\Methods\CashOnDelivery`, key `cod`.

- Offered only when something needs shipping, plus the shared rules. Use "Only for provinces" and
  "Only with shipping method types" to limit where and how.
- An optional extra fee through the shared fee fields.
- The order goes straight to Processing, unpaid. There is no deadline and no confirmation. Staff
  mark it paid when the cash arrives. A cash-on-delivery order can be completed before it is
  marked paid.

## Fees

`Payments\PaymentFeeProvider` adds the chosen method's fee to the calculation as a fee adjustment
(`payment_fee:{key}`): `fee_fixed` plus `fee_percent` of the subtotal after discounts plus
shipping, less shipping discounts. The fee is part of the totals the customer sees, and of the
totals hash. Methods are offered by the amount before any payment fee.

## Deadlines

When an order is placed with a method, its `Payment` gets `expires_at` from `deadline()`:
`deadline_hours` from now (24 by default), or none for `0` and for cash on delivery. The order's
`expires_at` mirrors it.

- `commerce:tick` expires `pending` and `failed` payments past their deadline, which cancels the
  order and releases its stock, sale quantities and voucher uses (see
  [orders.md](orders.md#expiry-of-unpaid-orders)).
- While a payment confirmation awaits review, the payment is `awaiting_confirmation` and is not
  expired.
- A rejected confirmation resumes the deadline, extended by the time it spent in review.

## The pay page

`/order/{key}/pay` (`commerce.order.pay`) lets the customer pay an unpaid order again or with
another available method. The order page links it ("pay again") when the order:

- is not a quote and has a total, with nothing paid;
- is Pending payment or Failed, and unpaid or failed;
- is not a WhatsApp order.

Choosing a method (`Payments\Actions\PayWithMethod`):

- the same method with a pending payment keeps that payment;
- otherwise the open payment is cancelled, the old method's fee is taken out of the total and the
  new one's added, the order gets the new method and deadline, and a new `Payment` starts.

Accepted quotes and unpaid manual orders are paid here too. Staff can email the link with "Send
payment link" on the order page.

A gateway that sends the customer back uses `/order/{key}/payment/return`
(`commerce.order.payment-return`); methods that implement `HandlesReturn` read the result there.

## Payment confirmations

For bank transfer and payment instructions with confirmation `required` or `optional`.

**1. The customer confirms** at `/confirm-payment` (`commerce.confirm-payment`), reached from the
order page or My Account (with the order key), or by order number and email.

| Field | Rules |
| --- | --- |
| Sender name | Required |
| Sender bank | Optional |
| Amount | Required, whole amount |
| Transfer date | Required, not in the future |
| Account paid into | Required when the method has accounts |
| Proof | An image (jpg, png, webp) or PDF up to `commerce.payments.proof_max_kb` (5,120 KB); required when confirmation is `required` |
| Note | Optional |

The form has a honeypot, a rate limit of 10 an hour per order and IP, and a captcha when Sunrice
has one configured. Proofs are stored on the private `commerce.payments.proof_disk` (images are
re-encoded) and deleted by `commerce:prune` after `proof_retention_days` (365).

`Payments\Actions\SubmitPaymentConfirmation` creates the `PaymentConfirmation` (`submitted`) and
records the payment as **Awaiting confirmation**, which pauses its deadline. The customer is
emailed "payment confirmation received"; staff get "payment confirmation to verify" (the
addresses in the email's settings and users with its roles, Shop Manager by default).

**2. Staff review** in Shop → Payments to verify (`commerce.payments.verify`): the confirmations
waiting, oldest first, with the proof beside the expected amount and the order. Approved and
rejected ones can be listed too.

| Action | `Payments\Actions\ReviewPaymentConfirmation` | Result |
| --- | --- | --- |
| Approve | `approve($confirmation, $actor, anyway: false)` | The payment is recorded paid (reference `confirmation:{id}`, dated the transfer date). The order moves to Processing and the paid effects run. A smaller amount than expected needs "approve anyway". |
| Reject | `reject($confirmation, $reason, $actor)` | The payment is pending (Unpaid) again and its deadline resumes. The customer is emailed the reason and a link to confirm again. |

## Marking an order paid

Staff with `commerce.payments.verify` can mark an unpaid order paid without a confirmation (a
transfer seen in the bank app, cash collected, a WhatsApp order settled), with a reference, a date
and the account (`Orders\Actions\MarkOrderPaid`). The open payment is used, or a manual one is
created for what's left.

## Payment states

A `Payment` is one attempt to pay an order with a method:

| Status | Order payment status |
| --- | --- |
| `pending` | Unpaid |
| `awaiting_confirmation` | Awaiting confirmation |
| `paid` | Paid |
| `failed` | Failed |
| `expired`, `cancelled` | Unpaid |
| `partially_refunded`, `refunded` | Partially refunded, Refunded (by the order's totals) |

`Payments\Actions\RecordPaymentResult` is the only writer of payment state: payment rows, the
order's payment status, `paid_total` and `refunded_total`. Never update them yourself.

```php
app(RecordPaymentResult::class)->handle($payment, PaymentResult::paid($amount, $reference), Actor::gateway('midtrans'));
```

It locks the payment and the order and accepts only results that move the payment forward:

| From | Accepted results |
| --- | --- |
| `pending` | paid, awaiting confirmation, failed, expired, cancelled |
| `awaiting_confirmation` | paid, pending, failed, cancelled |
| `failed` | paid, pending, awaiting confirmation, expired, cancelled |
| `expired` | paid |
| `paid`, `partially_refunded` | refunded |
| `cancelled`, `refunded` | — |

Anything else is ignored and `handle()` returns `false`, so webhooks, returns and staff can report
the same thing twice. Each accepted result writes a timeline line and moves the order:

- paid → Processing (from Pending payment or Failed);
- failed → Failed (from Pending payment);
- pending → Pending payment (from Failed);
- expired → Cancelled (from Pending payment or Failed).

After commit it dispatches `PaymentRecorded`, and `PaymentSucceeded` with `OrderPaid`,
`PaymentFailed` or `PaymentExpired`. `OrderPaid` sends "payment received", grants downloads (with `digital.grant_on`
`paid`), and updates sales counts and customer stats.

Two results are treated with care:

- **Less than due**: a paid result whose amount is below the payment's is not recorded (the payment
  stays open); a timeline note shows both amounts, and staff can mark the order paid.
- **Paid after cancellation**: a gateway can confirm a payment after its deadline cancelled the order
  and released its stock, sale quantities and vouchers. The payment is recorded paid, but the order
  stays Cancelled and `OrderPaid` doesn't fire (no downloads, invoice or "payment received"). Instead
  `PaymentAfterCancellation` fires, the timeline says so, and staff get `staff_paid_after_cancel` to
  refund the customer or reinstate the order.

## Webhooks

`POST /commerce/webhooks/{method}` (`commerce.webhooks`; the path is
`commerce.storefront.paths.webhooks`) has no session and no CSRF, and is limited to 300 calls a
minute per IP. It needs the `payments` feature, and the method must implement `HandlesWebhooks`
(404 otherwise).

Each call is logged in `commerce_webhook_calls` (method, event id, a SHA-256 of the payload,
status, error, payment):

1. The method parses and verifies it (`parseWebhook()`). A bad signature (`InvalidWebhook`)
   answers `400` and is logged `failed`.
2. **Duplicates** are ignored: an event id already logged for this method answers `200` with
   `duplicate: true` and is logged `ignored`. A unique index catches two copies arriving at once.
3. The payment is found by method and reference; an unknown reference answers `200` and is logged
   `ignored`.
4. The result goes through `RecordPaymentResult`. The call is logged `processed`, or `ignored`
   when the result changed nothing. An exception answers `500` so the gateway retries: the failed
   call gives its event id back (kept in its error), so the retry is processed, not ignored.

## Gateways

Gateway packages register their own methods with `Commerce::registerPaymentMethod()`: redirects,
embedded widgets or virtual accounts, with returns, webhooks, refunds, cancelling, status checks
and unique codes as optional contracts. See [extending.md](extending.md#payments).

| Package | Gateway |
| --- | --- |
| [`sunrice/midtrans`](https://github.com/Digital-Citra-Kreatif/sunrice-midtrans) | Midtrans Snap: cards, e-wallets, QRIS, virtual accounts |
| [`sunrice/xendit`](https://github.com/Digital-Citra-Kreatif/sunrice-xendit) | Xendit invoices: virtual accounts, e-wallets, QRIS, cards |

Each adds a module (Settings → Store → Features, Payments) and a method under Settings → Store →
Payments; its README covers the keys and the webhook URL.
