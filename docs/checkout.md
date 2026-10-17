# Checkout

The checkout is one page that turns the visitor's cart into an order, a quote request or a
WhatsApp order, depending on the store's selling mode. Everything is recalculated on the server
when the customer places the order; nothing the browser sends is trusted for prices or totals.

## Contents

- [Selling modes and how checkout ends](#selling-modes-and-how-checkout-ends)
- [The checkout page](#the-checkout-page)
- [Checkout settings](#checkout-settings)
- [Guests and accounts](#guests-and-accounts)
- [Addresses](#addresses)
- [Shipping and payment choice](#shipping-and-payment-choice)
- [The totals hash](#the-totals-hash)
- [Placing an order, step by step](#placing-an-order-step-by-step)
- [Quote requests](#quote-requests)
- [WhatsApp orders](#whatsapp-orders)
- [Rate limits and spam protection](#rate-limits-and-spam-protection)
- [Extra fields and custom completions](#extra-fields-and-custom-completions)

## Selling modes and how checkout ends

Settings → Store → General → **Selling mode** (`general.selling_mode`) decides what the checkout
does. Each mode has a completion strategy in `src/Checkout/Completion/`:

| Mode | Completion | Creates | First states (status / payment) | Reserves stock | Payment chosen at checkout |
| --- | --- | --- | --- | --- | --- |
| Online store (`shop`) | `order` (`OrderCompletion`) | An order | Pending payment / Unpaid | yes | yes |
| Quotation (`quote`) | `quote` (`QuoteCompletion`) | A quote request | Requested / Unpaid | no | no |
| WhatsApp order (`whatsapp`) | `whatsapp` (`WhatsAppCompletion`) | An order | Pending payment / Unpaid, "Arranged via WhatsApp" | yes | no |
| Catalog (`catalog`) | — | Nothing: there is no cart | — | — | — |

In Online store mode two cases skip Pending payment:

- a **zero total** starts as Processing / Paid;
- **cash on delivery** (`cod`) starts as Processing / Unpaid. Staff mark it paid when the cash
  arrives.

The fulfilment status starts as Unfulfilled when something in the cart needs shipping, and Not
required otherwise.

After placing, the customer goes to the order page (`Order::url()`), or to the gateway when the
payment method starts with a redirect. WhatsApp orders go to the order page with `?whatsapp=1`,
which opens WhatsApp.

A mode needs its modules: Online store needs Cart, Orders, Checkout and Payments; Quotation and
WhatsApp need Cart, Orders and Checkout. Saving a mode whose modules are off is refused with the
reason. See [features.md](features.md).

**Pause orders** (`general.pause_orders`) keeps the catalog and cart open but refuses new orders
with `general.pause_message` (or a default text).

## The checkout page

| Route | Name | What it does |
| --- | --- | --- |
| `GET /checkout` | `commerce.checkout` | Shows the page. Redirects to the cart when it is empty. |
| `POST /checkout` | `commerce.checkout.submit` | Saves the form. With `action=place` it places the order; with `action=update` it saves and recalculates shipping (the no-JavaScript "Update shipping" button). |
| `POST /checkout/refresh` | `commerce.checkout.refresh` | JSON: saves what was entered and returns rates, payment methods, totals, notices, the new hash and rendered partials. |

The path comes from `commerce.storefront.paths.checkout`; other languages get the `/{locale}`
prefix. The routes need the `checkout` feature and are `noindex`.

The page has these sections, in order:

1. contact: name, email, phone (and company and tax number when asked), the account choice;
2. shipping address, when something needs shipping and Shipping is on: saved addresses for
   signed-in customers, "save this address", "billing is the same";
3. billing address, when it differs;
4. shipping method, with the "Update shipping" button;
5. payment method (Online store mode, when the total is more than zero);
6. order notes, dropshipper and extra fields;
7. order summary, voucher, marketing consent (guests), terms;
8. the submit button: "Place order", "Request a quote" or "Order via WhatsApp".

What the customer types is kept on the cart (`commerce_carts.checkout`, see
`Checkout\CheckoutData::KEYS`), so a reload keeps it. Passwords are never stored there. Signed-in
customers start with their profile and default shipping address. The first view sets
`started_at` and dispatches `Checkout\Events\CheckoutStarted`.

Storefront slots let packages add to the page: `checkout.before`, `checkout.after_contact`,
`checkout.after_shipping`, `checkout.after_payment` and `checkout.before_submit`. See
[extending.md](extending.md#storefront-slots).

## Checkout settings

Settings → Store → Checkout (section `checkout`, permission `commerce.settings.checkout`):

| Setting | Key | Default | Effect |
| --- | --- | --- | --- |
| Allow checkout without an account | `guest_checkout` | on | Off: guests are sent to sign in. |
| Accounts at checkout | `create_account` | `offer` | `never`, `offer` (a checkbox) or `always` (guests must set a password). |
| Require a phone number | `require_phone` | on | Contact phone and address phone are required. |
| Ask for a company name and tax number | `company_fields` | off | Adds `fields.company` and `fields.tax_id`. |
| Second address line | `address_line2` | on | Shows `line2`. |
| Require a postal code | `require_postal_code` | off | |
| Ask for the village (kelurahan/desa) | `village_level` | off | Adds the fourth region select and requires it for Indonesia. |
| Order notes | `order_notes` | on | A notes box (up to 1,000 characters). |
| Dropshipper details | `dropshipper` | off | Sender name and phone, saved on the order (`dropship`) and printed on the packing slip. |
| Minimum order | `minimum_order` | `0` | See below. |
| Terms page | `terms_page` | none | An entry; customers must tick that they accept it. |

The same section holds order settings: customer cancelling, order and quote numbers, quote
validity and auto-complete. They are described in [orders.md](orders.md).

**Minimum order.** Checkout refuses a cart whose subtotal minus line discounts is below
`minimum_order`. Shipping and fees don't count. `0` turns it off.

## Guests and accounts

- With `guest_checkout` off, a guest who opens checkout is sent to the sign-in page (when the
  Accounts module is on) and comes back afterwards. Placing as a guest is refused with "Please sign
  in to check out."
- A guest who asks for an account (or `create_account` is `always`) enters a password (8
  characters or more). The account is made inside the placing transaction, unless that email
  already has one.
  - With `accounts.verify_email` on, the customer is emailed a verification link and the order is
    a guest order until then; it is linked to the account once the email is verified.
  - With it off, the customer is signed in straight away and the order belongs to the account.
- Either way the order gets a `Customer` record, found by email for guests. Name, phone and
  locale are filled in when empty. Ticking marketing consent sets `accepts_marketing`.
- Signed-in customers who tick "save this address" get it in their address book (not for pickup).

See [accounts.md](accounts.md).

## Addresses

An address is a `Support\Address`: `name`, `phone`, `company`, `country`, the four region codes,
their names, `state`, `postal_code`, `line1`, `line2` and `notes`.

- **Indonesia** (`country` `ID`) uses cascading selects: province → city/regency → district →
  village (village only with `village_level`). The selects load from the regions JSON endpoint.
  Choosing a village fills an empty postal code.
- **Other countries** use free text for city (required) and state.

`Support\AddressRules` validates an address under a prefix:

```php
$rules = AddressRules::rules('shipping_address', ['phone' => true, 'postal_code' => false, 'village' => false]);
$validator->after(fn ($v) => AddressRules::after($v, 'shipping_address'));
$address = AddressRules::normalize($input); // names from the region table, phone in E.164
```

- `rules()`: name and `line1` required; country must be an ISO code; for Indonesia province, city
  and district codes are required (village when asked); outside Indonesia `city` is required.
- `after()`: the Indonesian codes must exist, be active and form one chain (the city is in the
  province, and so on).
- `normalize()`: fills `province`, `city`, `district` and `village` from the codes, fills the
  postal code from the village when empty, and normalizes the phone.

The order keeps the address as a snapshot, codes and names together. See [regions.md](regions.md).

## Shipping and payment choice

- **Shipping** is asked when a line needs shipping and the Shipping module is on. Rates come from
  the matched zone, plus pickup rates from any zone; see [shipping.md](shipping.md).
  - In Online store and WhatsApp modes a rate must be chosen, and it must be one of the current
    rates. "We can't ship to this address yet." shows when an address gets no rates.
  - In Quotation mode the rate is optional: staff can set shipping in the quote.
  - Choosing a pickup rate (`pickup:…`) hides the shipping address. The order keeps no shipping
    address and stores the location in `meta.pickup`.
- **Payment** is chosen in Online store mode when the total is more than zero. The method must be
  available for the order (active, its module on, its rules met); see [payments.md](payments.md).
  The chosen method's fee is part of the totals.
- Orders with nothing to ship (digital products) skip both the address and shipping.

Vouchers are applied from the summary; see [pricing.md](pricing.md).

## The totals hash

The page carries a hidden `totals_hash`: `CalculationState::hash()`, a SHA-256 of the lines
(variant, quantity, unit price, discount, tax), the adjustments, the chosen rate and its cost,
and the totals. `checkout/refresh` returns a new one whenever the totals change.

When the order is placed, a fresh calculation must give the same hash. If anything changed since
the customer last saw the totals (a price, a sale ending, a voucher no longer valid, a shipping
rate, stock), the order is not placed: `Checkout\CheckoutChanged` is thrown with what changed
(from the calculation's notices), and checkout shows those changes and the new totals.

Staff code and tests can pass `null` as the hash to skip the check.

## Placing an order, step by step

`Checkout\Actions\PlaceOrder::handle(Cart $cart, CheckoutData $data, ?string $totalsHash, array $extra = [], array $client = [])`
does it all in one database transaction (retried up to three times), and returns a
`Checkout\PlacedOrder` (`order`, `response`, `created`).

1. **Lock the cart.** The cart row is locked. If it was already converted, or an order exists with
   its checkout token, that order is returned (`created: false`). A double submit gives one order.
2. **Paused?** With `general.pause_orders` on, `CheckoutRefused` is thrown with the pause message.
3. **Calculate.** A fresh calculation of the cart with the entered destination, rate and payment
   method.
4. **Validate.** `Checkout\CheckoutValidator` runs the rules: contact, account, addresses, the
   rate among the current rates, an available payment method, the minimum order, terms, notes,
   dropshipper and extension fields. Field errors throw a `ValidationException`.
5. **Compare the hash.** A different hash throws `CheckoutChanged`.
6. **The customer.** The account is created if asked; the `Customer` is found or made; the address
   is saved if asked.
7. **Insert the order.** The number comes from `Orders\Numbering` (`order` or `quote`). The order
   gets its states, addresses, shipping method snapshot, totals, notes, dropshipper, extra fields
   and applied codes; then its lines (bundle components as child lines), adjustments (discounts,
   shipping discounts, fees, taxes by name) and a "placed" timeline line.
   - For a bank transfer with a unique code, the code is picked here and added to the total as a
     `unique_code` adjustment.
   - With a payment method, a `Payment` is created (`pending`, with the method's deadline) and the
     order's `expires_at` set.
8. **Reserve**, when the completion reserves stock (orders, not quotes), all or nothing:
   1. stock, through `Contracts\Inventory::reserve()`;
   2. flash sale quantities, by sale item id;
   3. voucher uses, in voucher id order;
   4. extension providers that implement `Pricing\Contracts\ReservesDiscounts` (`commit()`).

   Any failure throws `CheckoutRefused` and rolls the whole order back. What was reserved is
   recorded in the order's meta (`reserved.*`), so cancelling releases exactly that.
9. **Convert the cart.** The cart becomes `converted` with the order id.

After the commit:

10. **Events.** `QuoteRequested` for quotes, `OrderPlaced` for orders, and `OrderPaid` when it is
    already paid (a zero total). These send the "order received" and "new order" emails.
11. **Start the payment.** `Payments\Actions\StartPayment` hands the order to its method: it stores
    instructions on the payment, records an immediate payment, or returns a redirect. A failing
    gateway leaves the order Pending; the pay page offers another try.
12. **Respond.** A redirect start sends the customer to the gateway; otherwise the completion's
    `afterPlaced()` gives the URL.

The checkout controller turns `CheckoutChanged` and `CheckoutRefused` into a message on the
checkout page, forgets the cart cookie on success, and remembers the order key in the session.

## Quote requests

In Quotation mode the customer sends the cart as a quote request:

- it gets a quote number (`Q-{Y}{m}-{seq:4}` by default) and no order number;
- nothing is reserved and no payment is created;
- the customer is emailed "quote request received" and staff "new quote request";
- the thank-you page is the quote page, `/quote/{key}`.

Staff then price it and send it; the customer accepts or declines on the quote page. Accepting
reserves stock at the quoted prices and turns it into an order. See
[orders.md](orders.md#quotes).

## WhatsApp orders

In WhatsApp mode the order is recorded as Pending with payment "Arranged via WhatsApp"
(`payment_method` `whatsapp`, no payment row, no deadline). Stock is reserved.

After placing, the next WhatsApp number in rotation (`general.whatsapp.numbers`, random or
round-robin) is chosen, and a `https://wa.me/{number}?text=…` link is built from the per-language
`order_message` template. Placeholders: `{order_number}`, `{items}`, `{total}`, `{name}`,
`{phone}`, `{address}`, `{shipping}`, `{notes}`, `{url}`. The link is kept on the order
(`meta.whatsapp_url`), so reloading the order page doesn't switch to another number. The order
page opens it and also shows a button in case it didn't open.

Staff mark the order paid from the admin once payment is settled in the chat.

## Rate limits and spam protection

| Limiter | Limit | Used by |
| --- | --- | --- |
| `commerce-checkout` | 20 a minute per IP | `POST /checkout`, `POST /order/{key}/pay` |
| `commerce-cart` | 120 a minute per IP | `POST /checkout/refresh`, cancelling an order, accepting or declining a quote, the cart JSON API |
| `commerce-voucher` | 10 a minute per cart and IP | Applying a voucher code |
| `commerce-confirm` | 10 an hour per order and IP | Submitting a payment confirmation |

The order lookup at `/track-order` and the payment confirmation lookup allow 10 misses per email
and IP and 20 per IP in 10 minutes, and have a honeypot. See [payments.md](payments.md) for the
confirmation form.

## Extra fields and custom completions

Packages add fields with `Commerce::checkoutFieldsUsing()` (in the `contact`, `shipping` or
`extra` section). Values are validated with their `rules` and saved on the order in `fields`. A
package can also replace how a mode ends with `Commerce::registerCheckoutCompletion()`. See
[extending.md](extending.md#checkout).
