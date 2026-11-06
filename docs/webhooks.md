# Webhooks

Webhooks send the store's events to other systems as they happen: an accounting app when an order
is paid, a warehouse when it is placed, an automation tool when stock runs out. Switch on the
**Webhooks** module (Settings → Features), then add endpoints in **Settings → Webhooks**
(permission `commerce.settings.webhooks`).

## Contents

- [Endpoints](#endpoints)
- [Events](#events)
- [What is sent](#what-is-sent)
- [Checking the signature](#checking-the-signature)
- [Retries and the delivery log](#retries-and-the-delivery-log)
- [Security](#security)

## Endpoints

Each endpoint has a name, a URL, the events it receives and a **signing secret** (`whsec_…`), made
when it is saved and shown on its page. "New signing secret" replaces the secret; update the
receiving end right away, since deliveries are signed with the new one from then on.

Deliveries need a queue worker (see [installation.md](installation.md#run-the-scheduler-and-a-queue-worker)):
each one is a queued job that runs once the change that caused it is saved, so a change that is
rolled back sends nothing.

## Events

| Event | When | `data` |
| --- | --- | --- |
| `order.placed` | An order is placed (checkout, a manual order, an accepted quote) | `order` |
| `order.paid` | An order is paid in full | `order` |
| `order.status_changed` | An order's status changes | `order`, `from`, `to` |
| `order.cancelled` | An order is cancelled | `order` |
| `order.completed` | An order is completed | `order` |
| `order.refunded` | Staff record a refund, or the payment provider reports one | `order`, `refund` (`amount`, `reason`) |
| `shipment.created` | A shipment is added to an order | `shipment`, `order` |
| `shipment.delivered` | A shipment is delivered | `shipment`, `order` |
| `stock.low` | A variant's stock falls to the low-stock threshold | `variant` |
| `stock.out` | A variant sells out | `variant` |
| `stock.back_in` | A sold-out variant is back in stock | `variant` |

## What is sent

A `POST` with a JSON body, as the data was when the event happened:

```json
{
    "event": "order.paid",
    "created_at": "2026-11-06T09:12:44+07:00",
    "data": {
        "order": {
            "id": 42, "number": "INV/2026/11/0042", "status": "processing", "payment_status": "paid",
            "email": "rina@example.com", "total": {"amount": 110000, "formatted": "Rp110.000"},
            "items": [{"name": "Mug", "sku": "MUG-1", "quantity": 2, "unit_price": {"amount": 50000, "formatted": "Rp50.000"}}]
        }
    }
}
```

Money is an integer in the currency's minor unit (`amount`) plus a formatted string. An order has
its items, totals, addresses, shipping and payment methods, shipments and refunds. A variant has
`id`, `product_id`, `sku`, `title`, `product` (its name), `stock_status`, `stock_before` and
`stock`.

Headers:

| Header | |
| --- | --- |
| `X-Sunrice-Event` | The event, as in the body |
| `X-Sunrice-Delivery` | The delivery's id: the same on every retry, so the receiver can skip one it already handled |
| `X-Sunrice-Signature` | `t=<unix time>,v1=<signature>` |
| `User-Agent` | `Sunrice-Commerce-Webhooks` |

The endpoint must answer with a 2xx status within `commerce.webhooks.timeout` seconds (10).
Redirects are not followed.

## Checking the signature

`v1` is the hex HMAC-SHA256 of `<t>.<raw body>` with the endpoint's signing secret. Check it against
the raw body (before parsing it), compare in constant time, and refuse old timestamps to stop
replays:

```php
[$t, $v1] = sscanf($request->header('X-Sunrice-Signature'), 't=%d,v1=%s');
$expected = hash_hmac('sha256', $t.'.'.$request->getContent(), config('services.store.webhook_secret'));

abort_unless(hash_equals($expected, (string) $v1) && abs(time() - $t) < 300, 401);
```

```js
const [, t, v1] = req.get('X-Sunrice-Signature').match(/^t=(\d+),v1=([0-9a-f]+)$/);
const expected = crypto.createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
const ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1)) && Math.abs(Date.now() / 1000 - t) < 300;
```

## Retries and the delivery log

A delivery that doesn't get a 2xx answer is tried again after 1 minute, 5 minutes, 30 minutes,
1 hour, 3 hours and 6 hours: seven attempts in all, then it is marked failed. After
`commerce.webhooks.disable_after` (20) failed deliveries in a row an endpoint is switched off;
switch it back on in its settings once it works. A delivered one resets the count.

The endpoint's page lists its recent deliveries with their status and last error. The log is kept
for `commerce.webhooks.keep_days` (30) days; `commerce:prune` removes older ones.

## Security

- Endpoints must be public `https://` URLs. Local, private, loopback, link-local and reserved
  addresses are refused when the endpoint is saved and again before each delivery, after the host
  is resolved, so an endpoint can't reach the server's own network. `commerce.webhooks.allow_private`
  lifts this for development only.
- The signing secret is stored encrypted and shown only to staff with `commerce.settings.webhooks`.
- Bodies hold customers' names, emails, phone numbers and addresses: send them only to systems you
  trust with that data.
