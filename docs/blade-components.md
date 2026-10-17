# Blade components

Commerce's Blade components put store blocks into any template: a product's buy box on a landing
page, a product grid on the home page, the mini cart in your header. They hold the logic only. The
markup is in a partial, found app first like every store view, so a published
`resources/views/commerce/partials/…` copy changes the component everywhere (see
[templates.md](templates.md#publishing-templates)).

```blade
<x-commerce::products category="shirts" sort="newest" :limit="8" :paginate="false" />
```

Pass strings as plain attributes and everything else (booleans, numbers, models) with a colon.
Constructor arguments in camelCase are kebab-case attributes: `onSale` is `on-sale`.

## Contents

- [Overview](#overview)
- [`commerce::slot`](#commerceslot)
- [`commerce::product`](#commerceproduct)
- [`commerce::price`](#commerceprice)
- [`commerce::products`](#commerceproducts)
- [`commerce::product-filter`](#commerceproduct-filter)
- [`commerce::flash-sale`](#commerceflash-sale)
- [`commerce::cart`](#commercecart)
- [`commerce::mini-cart`](#commercemini-cart)
- [`commerce::wishlist-button`](#commercewishlist-button)
- [`commerce::compare-button`](#commercecompare-button)
- [`@commerceFeature`](#commercefeature)

## Overview

| Component | Attributes | Renders | Shows nothing when |
| --- | --- | --- | --- |
| `<x-commerce::slot>` | `name`, any others | Partials registered for the slot | Nothing is registered |
| `<x-commerce::product>` | `entry` | `partials.buy` | The entry has no product |
| `<x-commerce::price>` | `entry` or `product` | `partials.price` | No product |
| `<x-commerce::products>` | `category`, `brand`, `tag`, `sort`, `featured`, `on-sale`, `limit`, `paginate`, `filters`, `query` | `partials.products` | — (an empty message) |
| `<x-commerce::product-filter>` | `query`, `without` | `partials.filters` | — |
| `<x-commerce::flash-sale>` | `slug`, `limit` | `partials.flash-sale` | `flash_sales` is off, or no sale runs |
| `<x-commerce::cart>` | `cart` | `partials.cart` | `cart` is off |
| `<x-commerce::mini-cart>` | — | `partials.mini-cart` | `cart` is off |
| `<x-commerce::wishlist-button>` | `entry` | `partials.wishlist-button` | `wishlist` is off, or no product |
| `<x-commerce::compare-button>` | `entry` | `partials.compare-button` | `compare` is off, or no product |

"No product" means the entry isn't a synced product of a product collection
([catalog.md](catalog.md)).

## commerce::slot

Renders the partials extensions registered for a slot, in order. Every attribute except `name` is
passed to each partial as a variable.

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `name` | string | required | The slot name |
| anything else | mixed | — | Variables for the partials |

```blade
<x-commerce::slot name="product.after_add_to_cart" :entry="$entry" />
```

The slots the templates render, and their variables, are listed in
[extending.md](extending.md#storefront-slots). You can add your own slot names to your templates;
extensions register partials for them with `Commerce::registerStorefrontSlot()`.

## commerce::product

The buying block of a product, as on the product page:

- badges and the price;
- the flash sale strip (its badge or name, the countdown, the sold progress);
- the bulk price table;
- for products sold by cart: the add-to-cart form with the variant picker and quantity (minimum,
  step and maximum from the variant), and the add button, or "Sign in to see prices";
- otherwise the call to action: WhatsApp, external shop links or an inquiry;
- the stock line and the SKU (simple products).

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `entry` | `Sunrice\Models\Entry` | required | The product entry |

```blade
<x-commerce::product :entry="$entry" />
```

In the partial, `$entry` is the entry and `$product` its [ProductView](helpers.md#productview).
The form posts to the cart without JavaScript; with `commerce.js` it adds by AJAX
([templates.md](templates.md#theme-assets)).

## commerce::price

The product's price: the sale price with the compare-at price struck through, a range or "from"
price for variable products, and the tax suffix. When prices are hidden it shows "Sign in to see
prices" (linked to sign-in) or "Price on request".

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `entry` | `?Sunrice\Models\Entry` | `null` | The product entry |
| `product` | `?ProductView` | `null` | A product view you already have; wins over `entry` |

```blade
<x-commerce::price :entry="$entry" />

@php($product = commerce_product($entry))
<x-commerce::price :product="$product" />
```

## commerce::products

A grid of product cards (`partials.product-card`: image, title, badges, price) with pagination.

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `category` | `?string` | `null` | A category slug or id; its child categories are included |
| `brand` | `?string` | `null` | A brand slug or id |
| `tag` | `?string` | `null` | A tag slug or id |
| `sort` | `?string` | `null` | `featured`, `newest`, `price`, `-price`, `best_selling` or `name`; a `sort` in the query string wins |
| `featured` | bool | `false` | Only featured products |
| `on-sale` | bool | `false` | Only products on sale (also `?on_sale=1`) |
| `limit` | int | `24` | Products per page |
| `paginate` | bool | `true` | Read filters from the query string and show page links |
| `filters` | bool | `false` | Show `<x-commerce::product-filter>` above the grid |
| `query` | `?ProductQuery` | `null` | A query you built; the attributes above are added to it |

With `paginate` (the default), the grid starts from the query string, so the filter form, sorting
and page links work. Without it, the grid ignores the query string's filters and shows the first
`limit` products, for blocks such as "New arrivals". It shows "No products found" when nothing
matches.

```blade
{{-- A shop page with filters --}}
<x-commerce::products :filters="true" />

{{-- A home page block --}}
<x-commerce::products :featured="true" :limit="4" :paginate="false" />
<x-commerce::products brand="acme" sort="best_selling" :limit="8" :paginate="false" />
```

To share one query with the filter form, build it once and pass it to both, as the category, brand
and tag templates do:

```blade
@php($query = \Sunrice\Commerce\Catalog\ProductQuery::fromRequest(request())->category($term->id))
<x-commerce::product-filter :query="$query" without="category" />
<x-commerce::products :query="$query" />
```

The partial gets `$products` (a paginator of product entries), `$query`, `$limit`, `$paginate`
and `$filters`. Listings load prices, stock and sale data in bulk, so the number of queries doesn't
grow with the page size. See [catalog.md](catalog.md) for search and listing rules.

## commerce::product-filter

The filter form: a GET form on the current page that works without JavaScript.

- One group of checkboxes per facet, with counts: categories, brands, tags and the attribute
  taxonomies chosen in the catalog settings.
- Minimum and maximum price, in the currency's main unit (only while prices are visible).
- In stock, and on sale (only while prices are visible).
- The sort select (price sorts only while prices are visible), Apply and a Reset link.
- The search text (`q`) is kept.

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `query` | `?ProductQuery` | the current request's | The query whose facets to show |
| `without` | string | `''` | Leave out one facet: `category`, `brand`, `tag` or `attr[<taxonomy>]` |

```blade
<x-commerce::product-filter without="brand" />
```

The form sends `category[]`, `brand[]`, `tag[]`, `attr[<taxonomy>][]` (term ids), `min_price`,
`max_price`, `in_stock`, `on_sale` and `sort`. Links like `/products?category[]=shoes&sort=-price`
also work with slugs. In the partial: `$facets` (`terms` per taxonomy, each
`{id, name, slug, count, selected}`, and `price` `{min, max}` or null), `$titles` (taxonomy titles),
`$prices` (whether prices are visible), `$without` and `$param($taxonomy)` (the query-string name
of a taxonomy).

## commerce::flash-sale

The running flash sale with its countdown and products, linking to its page. Nothing while the
`flash_sales` feature is off or no sale runs.

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `slug` | `?string` | `null` | A particular sale; without it, the running sale that ends first |
| `limit` | int | `8` | How many products to show |

```blade
<x-commerce::flash-sale />
<x-commerce::flash-sale slug="payday" :limit="4" />
```

The countdown shows only when the sale has it on. The partial gets `$sale`, `$products` (product
entries) and `$limit`. See [pricing.md](pricing.md) for flash sales.

## commerce::cart

The cart page's body: lines with quantity and remove buttons, the voucher field (while `vouchers`
is on), totals, the checkout button and up to four cross-sells. It renders the `cart.after_items`
and `cart.totals_after` slots.

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `cart` | `?Sunrice\Commerce\Cart\CartView` | the visitor's cart | The cart to show |

```blade
<x-commerce::cart />
```

The forms post to the cart routes and come back with a message. See [checkout.md](checkout.md).

## commerce::mini-cart

A link to the cart with the item count, for your header. It takes no attributes.

```blade
<x-commerce::mini-cart />
```

The count is hidden while the cart is empty. The component also adds the cart drawer (a
`<dialog>`, once per page). With `commerce.js`, the link opens the drawer and the count follows AJAX
adds; without it, the link goes to the cart page. `partials.header-links` includes it, with the
account and wishlist links.

## commerce::wishlist-button

Adds a product to the wishlist, or removes it when it's saved already.

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `entry` | `Sunrice\Models\Entry` | required | The product entry |

```blade
<x-commerce::wishlist-button :entry="$entry" />
```

It's a form that posts and comes back. The button has `aria-pressed`. The partial gets
`$productId` and `$saved`.

## commerce::compare-button

Adds a product to the comparison, or removes it.

| Attribute | Type | Default | |
| --- | --- | --- | --- |
| `entry` | `Sunrice\Models\Entry` | required | The product entry |

```blade
<x-commerce::compare-button :entry="$entry" />
```

It's a form that posts and comes back. The button has `aria-pressed`. The partial gets
`$productId` and `$added`.

## @commerceFeature

Shows a block only while a store module is on (Settings → Store → Features, see
[features.md](features.md)). It's a Blade `if` directive, so `@elsecommerceFeature` and
`@unlesscommerceFeature` work too.

```blade
@commerceFeature('wishlist')
    <a href="{{ commerce_url('commerce.wishlist') }}">Wishlist</a>
@endcommerceFeature

@commerceFeature('accounts')
    <a href="{{ commerce_url('commerce.account') }}">My account</a>
@else
    <a href="{{ commerce_url('commerce.track-order') }}">Track your order</a>
@endcommerceFeature
```

In PHP, use [`commerce_feature()`](helpers.md#commerce_feature). Links to a route whose feature is
off would 404, so wrap them in the directive.
