# Helpers

Global functions for templates, defined in `src/helpers.php`. Each is wrapped in
`function_exists()`, so an app can define its own first. For Blade components, see
[blade-components.md](blade-components.md).

## Contents

- [Overview](#overview)
- [`commerce_money`](#commerce_money)
- [`commerce_feature`](#commerce_feature)
- [`commerce_url`](#commerce_url)
- [`commerce_customer`](#commerce_customer)
- [`commerce_product`](#commerce_product)
- [`commerce_store_name`](#commerce_store_name)
- [ProductView](#productview)
- [The Commerce facade](#the-commerce-facade)

## Overview

| Helper | Returns |
| --- | --- |
| `commerce_money(int $amount, bool $withSymbol = true)` | `string`: the amount in the store currency |
| `commerce_feature(string $feature)` | `bool`: whether a store module is on |
| `commerce_url(string $name, array $parameters = [], ?string $locale = null)` | `string`: a store page URL in the visitor's language |
| `commerce_customer()` | `?Authenticatable`: the user signed in to the storefront |
| `commerce_product(Entry\|int $entry)` | `?ProductView`: what templates show for a product |
| `commerce_store_name()` | `string`: the store's name |

## commerce_money

```php
commerce_money(int $amount, bool $withSymbol = true): string
```

Formats an amount in the currency's smallest unit with the store's currency settings (symbol, its
position and spacing, separators, decimals; Settings → Store → General). Every amount in commerce
is an integer in the smallest unit.

```blade
{{ commerce_money(150000) }}          {{-- Rp150.000 --}}
{{ commerce_money(150000, false) }}   {{-- 150.000 --}}
{{ commerce_money(-25000) }}          {{-- -Rp25.000 --}}
```

See [pricing.md](pricing.md).

## commerce_feature

```php
commerce_feature(string $feature): bool
```

Whether a store module is on (Settings → Store → Features). Feature keys are listed in
[features.md](features.md); extensions add their own.

```blade
@if (commerce_feature('wishlist'))
    <x-commerce::wishlist-button :entry="$entry" />
@endif
```

In Blade, [`@commerceFeature`](blade-components.md#commercefeature) reads better.

## commerce_url

```php
commerce_url(string $name, array $parameters = [], ?string $locale = null): string
```

The full URL of a store page in the current language, or in `$locale`. Pass the route name without
the language suffix: on pages in another language it picks the `.locale` route.

```blade
<a href="{{ commerce_url('commerce.cart') }}">Cart</a>            {{-- https://shop.test/cart, or /en/cart on English pages --}}
<a href="{{ commerce_url('commerce.order', ['key' => $order->order_key]) }}">Your order</a>
<a href="{{ commerce_url('commerce.checkout', locale: 'en') }}">Checkout</a>
```

It follows `commerce.storefront.paths`, so links survive a path change. Route names are listed in
[templates.md](templates.md#which-pages-commerce-renders).

## commerce_customer

```php
commerce_customer(): ?Illuminate\Contracts\Auth\Authenticatable
```

The user signed in to the storefront, on the store's own guard (`commerce.auth.guard`, default
`commerce`), or null. Signing in to the admin doesn't sign in to the store.

```blade
@if ($user = commerce_customer())
    Hello, {{ $user->name }}
@else
    <a href="{{ commerce_url('commerce.account.login') }}">Sign in</a>
@endif
```

This is the user model. For the customer record (addresses, stats), use `Commerce::customer()`,
which returns a `Customers\Models\Customer` or null. See [accounts.md](accounts.md).

## commerce_product

```php
commerce_product(Sunrice\Models\Entry|int $entry): ?Sunrice\Commerce\Catalog\ProductView
```

The [ProductView](#productview) of a product entry, by model or id: price display, badges, stock,
call to action, bulk prices and variant data, for the current visitor (their prices, their price
visibility). Null when the entry isn't a product or the id doesn't exist.

```blade
@php($product = commerce_product($entry))
@if ($product)
    <p>{{ $product->price['formatted'] }}</p>
    @if ($product->hasBadge('sale'))<span class="badge">Sale</span>@endif
    <p>{{ $product->stock['message'] }}</p>
@endif
```

Views are memoized per request. Listings built with `<x-commerce::products>` or `ProductQuery` load
the views of a whole page in bulk, so calling `commerce_product()` in a product card costs no extra
queries. In a draft preview, the view is built from the draft, without saving anything.

## commerce_store_name

```php
commerce_store_name(): string
```

The store's name from Settings → Store → General, or `config('app.name')` when it's empty.

```blade
<p>© {{ date('Y') }} {{ commerce_store_name() }}</p>
```

## ProductView

`Sunrice\Commerce\Catalog\ProductView` is what templates show for a product. It's read only. Get
one from `commerce_product($entry)`; `<x-commerce::product>`, `<x-commerce::price>` and the product
partials receive it as `$product`.

### Properties

| Property | Type | |
| --- | --- | --- |
| `entry` | `Sunrice\Models\Entry` | The product entry |
| `product` | `Catalog\Models\Product` | The product, with its variants |
| `type` | string | `simple`, `variable` or `bundle` |
| `price` | array | The price display (below) |
| `badges` | `string[]` | Any of `sale`, `new`, `out_of_stock`, `backorder`, `featured` |
| `stock` | array | `status` (`in_stock`, `backorder` or `out_of_stock`), `quantity` (simple products that track stock, else null), `message` ("In stock", "Only 3 left"…) |
| `cta` | array | The call to action: `type` (`cart`, `whatsapp`, `inquiry`, `external` or `none`), `label`, `url`, `links` (`[{label, url}]` for external shops) |
| `tiers` | array | Bulk prices of the first variant: `[{min_qty, label, price}]`; empty while prices are hidden |
| `options` | array | Picker options: `[{id, name, values: [{id, label}]}]` |
| `variants` | array | Picker variants: `[{id, uid, title, sku, options, price, price_formatted, compare_at, stock, min_qty, max_qty, qty_step, image}]`. Built the first time it's read, so cards that only show the price don't pay for it |
| `flashSale` | `?array` | The running flash sale: `id`, `name`, `badge`, `ends_at` (ISO 8601), `countdown`, `sold`, `limit`, `sold_percent`, `url`; null when none |
| `purchasable` | bool | False when out of stock or the product failed to sync |

`price` has:

| Key | |
| --- | --- |
| `amount` | The price in the smallest unit (null for a range, or while hidden) |
| `compareAt` | The compare-at price, or null |
| `isRange` | Whether variants have different prices |
| `from`, `to` | The range's lowest and highest prices |
| `formatted` | Ready to show: `Rp150.000`, `Rp100.000 – Rp150.000` or "From Rp100.000" (catalog setting) |
| `compareFormatted` | The compare-at price, formatted, or null |
| `taxSuffix` | "incl. tax" or "excl. tax" while taxes are on, else null |
| `hidden` | Prices are hidden from this visitor ([pricing.md](pricing.md)) |
| `signIn` | Hidden until the visitor signs in ("Sign in to see prices") |

While `hidden` is true, every amount is null and `formatted` is empty.

### Methods

| Method | Returns |
| --- | --- |
| `id()` | `int`: the product id (not the entry id) |
| `title()` | `string`: the entry's title |
| `url()` | `?string`: the entry's URL |
| `isVariable()` | `bool` |
| `hasBadge(string $badge)` | `bool` |
| `canAddToCart()` | `bool`: sold by cart, purchasable and prices visible |
| `defaultVariant()` | `?Variant`: the first active variant (or the first one) |
| `variantsJson()` | `string`: `options` and `variants` as JSON, safe inside an HTML attribute |
| `structuredData()` | `array`: schema.org `Product`, with `Offer` or `AggregateOffer` only while prices are visible |
| `with(...$changes)` | `ProductView`: a copy with some properties changed |
| `jsonSerialize()` | `array`: the view as JSON (`id`, `entry_id`, `title`, `url`, `type`, `price`, `badges`, `stock`, `cta`, `tiers`, `options`, `variants`, `flash_sale`) |

```blade
@php($product = commerce_product($entry))
@if ($product?->canAddToCart())
    <x-commerce::product :entry="$entry" />
@elseif ($product?->cta['url'])
    <a href="{{ $product->cta['url'] }}">{{ $product->cta['label'] }}</a>
@endif

<script type="application/ld+json">{!! json_encode($product->structuredData(), JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}</script>
```

Extensions can change every view before it's returned with
`ProductViewFactory::extendUsing(fn (ProductView $view) => $view->with(...))`. Commerce adds the
flash sale data this way.

## The Commerce facade

In PHP code (controllers, view composers, listeners), use the facade's read helpers:
`Commerce::active()`, `Commerce::settings()`, `Commerce::cart()`, `Commerce::customer()`,
`Commerce::money()` and more. They are listed in [extending.md](extending.md#read-helpers).

```php
use Sunrice\Commerce\Facades\Commerce;

Commerce::money(150000)->format();          // "Rp150.000", same as commerce_money(150000)
Commerce::settings()->get('general.name');  // commerce_store_name() falls back to app.name
```
