# Shipping

Shipping prices come from zones and their methods. A zone says where (countries, and in Indonesia
provinces, cities and districts); its methods say how much (free, flat, by weight, pickup, or a
carrier's live rates from an extension). Shipments record what was sent and how to track it.

## Contents

- [Setting up](#setting-up)
- [Zones and how they match](#zones-and-how-they-match)
- [Methods](#methods)
- [Method types](#method-types)
- [Rates and the rate id](#rates-and-the-rate-id)
- [Digital-only orders](#digital-only-orders)
- [Shipping discounts](#shipping-discounts)
- [Couriers and tracking links](#couriers-and-tracking-links)
- [Shipments and tracking](#shipments-and-tracking)
- [Extension couriers](#extension-couriers)

## Setting up

1. Switch on the Shipping module (`shipping`, Settings → Store → Features).
2. Set the store address in Settings → Store → General: it is the shipping origin.
3. Import regions if you ship within Indonesia (`php artisan commerce:regions:import`, see
   [regions.md](regions.md)).
4. In Settings → Store → Shipping (`commerce.settings.shipping`) add zones, then methods to each
   zone. Use the arrows to order zones and, inside a zone, methods.

Examples: free shipping everywhere is one "everywhere else" zone with a free method; a price per
province is one zone per province (or group of provinces) with a flat method each.

## Zones and how they match

A zone has a name, an **Everywhere else** switch and regions. A region is a country, or in
Indonesia a province, city/regency or district, and covers everything inside it.

`Shipping\ZoneMatcher::match(Address $destination)` checks zones in order:

1. Skip "everywhere else" zones (the first one is kept as the fallback).
2. A zone matches when one of its regions has the destination's country and:
   - no region code (the whole country), or
   - a code equal to one of the address's codes (village, district, city, province), or a code the
     address's codes sit under (`32.73` matches `32.73.01` and `32.73.01.1001`).
3. The first matching zone wins; otherwise the "everywhere else" zone; otherwise none, and
   checkout shows "We can't ship to this address yet."

Region codes are prefixes of each other, so a zone for province `32` catches every address in
West Java, and a zone for `32.73` placed above it catches Bandung first.

## Methods

Each method belongs to a zone and has:

| Field | |
| --- | --- |
| Title, per language | Required in the main language. |
| Estimated delivery, per language | For example "2–3 days". |
| Active | |
| The type's settings | See below. |
| Only from a subtotal of (`min_subtotal`) | The cart subtotal after discounts. |
| Only up to a subtotal of (`max_subtotal`) | `0` or empty: no limit. |
| Only up to a weight of (`max_weight`, kg) | The actual weight of what ships. `0` or empty: no limit. |

`Shipping\ShippingManager` offers the matched zone's active methods that pass these rules. Local
pickup methods of every zone are offered too, even before an address is entered, after the
zone's own methods.

## Method types

| Type | Key | Settings | Cost |
| --- | --- | --- | --- |
| Free shipping | `free` | `requires`: `always`, `min_subtotal` (with `min_subtotal`, after discounts) or `voucher` | `0`, when the condition holds; otherwise no rate |
| Flat rate | `flat` | `cost` per order, `per_item` | `cost + per_item × units shipped` |
| By weight | `weight` | `mode`: `per_kg` or `table`; see below | |
| Local pickup | `pickup` | `cost` (usually free), `locations` (name, address, instructions; 1 to 30) | One rate per location |

**By weight** uses the weight of the lines that ship (variant weights in grams).

- `per_kg`: `price_per_kg` × the charged kg. The charged kg is the whole kg, plus one when the rest
  is more than `tolerance` grams, and at least `min_weight` kg (1 when not set).

  | Weight | Tolerance 300 g | Charged |
  | --- | --- | --- |
  | 1.30 kg | 300 g over 1 kg | 1 kg |
  | 1.31 kg | 310 g over 1 kg | 2 kg |
  | 0.25 kg | 250 g, within the tolerance; minimum 1 kg | 1 kg |

- `table`: rows of "up to X kg costs Y"; the first row the weight fits is used. A package heavier
  than the last row gets no rate.
- `volumetric` on: the larger of the actual and volumetric weight is charged. Volumetric weight is
  L × W × H (cm) ÷ `divisor` per unit, with the divisor from the method or
  `config('commerce.shipping.volumetric_divisor')` (6000).

**Local pickup** needs no shipping address: choosing it hides the address at checkout, the order
keeps no shipping address, and the location is saved in the order's `meta.pickup`. The order
still counts as something to fulfil.

## Rates and the rate id

A `Shipping\ShippingRate` has an id of the form `type:methodId:service`:

| Id | |
| --- | --- |
| `flat:3:default` | Flat method 3 |
| `weight:7:default` | By-weight method 7 |
| `pickup:9:loc0` | Pickup method 9, its first location |
| `biteship:12:jne_reg` | An extension type with its own services |

Because the type comes first, vouchers and payment methods can be limited to method types from the
id alone. As an array a rate has `id`, `method` (the type), `method_id`, `service`, `label`,
`cost`, `eta` and `meta`. The order stores the chosen one in `shipping_method` (plus `title`).

At checkout the chosen id must be one of the rates quoted for the current cart and address; see
[checkout.md](checkout.md#shipping-and-payment-choice).

## Digital-only orders

A line needs shipping when its variant (or product) requires shipping. When no line does:

- checkout asks for no address and no shipping method;
- the order's fulfilment status is Not required;
- with `checkout.auto_complete_digital` on (default), it is completed as soon as it is paid.

Mixed carts ship the physical lines; the package only counts lines that ship.

## Shipping discounts

Shipping discounts run after shipping is priced (stage 60) and only when something ships.

- **Free-shipping vouchers** take off the shipping cost, capped by the voucher's value when it has
  one. A voucher limited to shipping method types doesn't apply to other rates. A free method set to
  "A free-shipping voucher is used" appears when such a voucher is applied.
- Vouchers can also be limited to **destinations** (a country, province or city).

See [pricing.md](pricing.md). Extensions add their own with
`Commerce::registerShippingDiscountProvider()` ([extending.md](extending.md#pricing)).

## Couriers and tracking links

Courier presets give shipments a name and a tracking URL with `{tracking}` replaced by the
tracking number:

```php
// config/commerce.php
'shipping' => [
    'couriers' => [
        'jne' => ['name' => 'JNE', 'tracking_url' => 'https://www.jne.co.id/tracking-package?awb={tracking}'],
        // jnt, sicepat, anteraja, pos, ninja, lion, idexpress, gosend, grab
    ],
],
```

The bundled presets are JNE, J&T Express, SiCepat, AnterAja, POS Indonesia, Ninja Xpress and
Lion Parcel with tracking links, and ID Express, GoSend and GrabExpress without. Add your own in
the config, or from a package:

```php
Commerce::registerCourier('rpx', 'RPX', 'https://www.rpx.co.id/track/{tracking}');
```

A shipment with a free-text courier name has no tracking link.

## Shipments and tracking

Staff with `commerce.shipments.manage` add shipments on the order page, for orders that are
Processing, Completed or On hold and have something to ship:

- courier (a preset or free text), service, tracking number, cost;
- the items and quantities in this parcel; several parcels are fine (Partially shipped, then
  Shipped).

The customer is emailed "order shipped" with the tracking link and sees it on the order page.
With `checkout.auto_complete_shipped` on, a paid order is completed once it is fully shipped.

A shipment's status is `shipped`, `in_transit`, `delivered`, `returned` or `cancelled`. Staff mark
it delivered (`ShipmentDelivered`).

`Shipping\ShipmentTracker` runs in `commerce:tick`. For open shipments (`shipped` or
`in_transit`) with a tracking number, shipped in the last 60 days, whose order's shipping method
type implements `TracksShipments`, it asks for tracking at most once an hour per parcel (up to 50
a tick). The status and history go in the shipment's `meta.tracking`; a parcel with history moves
to `in_transit`; a delivered one is marked delivered.

See [orders.md](orders.md#shipments) for the actions behind this.

## Extension couriers

Carrier packages register method types that ask the carrier's API for live rates, optional
tracking and booking, and courier presets:

```php
Commerce::registerShippingMethodType(BiteshipRates::class);
```

Rates of extension types are cached for ten minutes per request. Packages map region codes to
their own location ids in `commerce_region_mappings` (see [regions.md](regions.md)). See
[extending.md](extending.md#shipping).
