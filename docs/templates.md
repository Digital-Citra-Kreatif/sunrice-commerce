# Storefront templates

Commerce renders a working store without publishing anything. Every page is a Blade view in the
package. You can restyle it with CSS, or publish the templates and edit them. For the Blade
components the templates use, see [blade-components.md](blade-components.md). For the helpers, see
[helpers.md](helpers.md).

## Contents

- [Which pages commerce renders](#which-pages-commerce-renders)
- [The store layout](#the-store-layout)
- [Publishing templates](#publishing-templates)
- [Translations](#translations)
- [Template reference](#template-reference): pages, account pages, partials, payment partials
- [Theme assets](#theme-assets): commerce.css, commerce.js
- [Storefront slots](#storefront-slots)
- [Storefront URL paths](#storefront-url-paths)
- [SEO](#seo)
- [Accessibility](#accessibility)
- [Full-page cache](#full-page-cache)
- [Theming without publishing](#theming-without-publishing)

## Which pages commerce renders

There are two kinds of store page.

**Product, shop and term pages are Sunrice pages.** Products are Sunrice entries, so Sunrice routes
and renders them, with its SEO, translations and sitemap. Commerce only picks the template. When
Sunrice would fall back to a generic template (`sunrice.show`, `sunrice.index`,
`sunrice.taxonomies.show` or its built-in defaults), commerce swaps in its own view
(`Storefront\TemplateFallback`):

| Page | When | View |
| --- | --- | --- |
| Product page | An entry of a product collection (`commerce.catalog.collections`) | `product` |
| Shop | The product collection's listing (archive) | `shop` |
| Category page | A term of `commerce.catalog.category_taxonomy` | `category` |
| Brand page | A term of `commerce.catalog.brand_taxonomy` | `brand` |
| Tag page | A term of `commerce.catalog.tag_taxonomy` | `tag` |

Anything more specific wins and is kept: an entry's or term's own template, the collection's or
taxonomy's template setting, or a template in your app such as
`resources/views/sunrice/products/show.blade.php`. Sunrice passes these templates its usual
variables: `$entry` and `$collection` on product pages, `$entries` and `$collection` on the shop,
`$term`, `$taxonomy`, `$collection` and `$entries` on term pages, plus `$locale`, `$pageType` and
`$sunricePage`.

**Every other store page is a commerce route.** They are in `routes/storefront.php` and
`routes/account.php`, registered once without a prefix (main language) and once under `/{locale}`
for every other language, like Sunrice's pages. Route names are `commerce.*` and
`commerce.*.locale`; use [`commerce_url()`](helpers.md#commerce_url) to get the right one.

| Path (default) | Route name | View | Needs feature |
| --- | --- | --- | --- |
| `/cart` | `commerce.cart` | `cart` | `cart` |
| `/checkout` | `commerce.checkout` | `checkout` | `checkout` |
| `/order/{key}` | `commerce.order` | `order` | `orders` |
| `/order/{key}/pay` | `commerce.order.pay` | `pay` | `orders`, `payments` |
| `/order/{key}/invoice` | `commerce.order.invoice` | a PDF, once paid ([documents.md](documents.md)) | `orders`, `documents` |
| `/quote/{key}` | `commerce.quote` | `order` (as a quote) | `orders` |
| `/track-order` | `commerce.track-order` | `track-order` | `orders` |
| `/confirm-payment` | `commerce.confirm-payment` | `confirm-payment` | `manual_payments` |
| `/wishlist` | `commerce.wishlist` | `wishlist` | `wishlist` |
| `/wishlist/shared/{token}` | `commerce.wishlist.shared` | `wishlist` (read only) | `wishlist` |
| `/compare` | `commerce.compare` | `compare` | `compare` |
| `/brands` | `commerce.brands` | `brands` | `brands` |
| `/flash-sale` | `commerce.flash-sale` | `flash-sales` | `flash_sales` |
| `/flash-sale/{sale}` | `commerce.flash-sale.show` | `flash-sale` | `flash_sales` |
| `/go/{type}/{entry}` | `commerce.go` | a redirect (WhatsApp, external shop, inquiry) | — |
| `/downloads/{token}` | `commerce.download` | a file (works even while `digital` is off) | — |

My Account pages need the `accounts` feature. The pages after sign-in also need a signed-in
customer (`commerce.auth`):

| Path (default) | Route name | View |
| --- | --- | --- |
| `/account/login` | `commerce.account.login` | `account.login` |
| `/account/register` | `commerce.account.register` | `account.register` |
| `/account/forgot-password` | `commerce.account.password.request` | `account.forgot-password` |
| `/account/reset-password/{token}` | `commerce.account.password.reset` | `account.reset-password` |
| `/account/code` | `commerce.account.code` | `account.code` |
| `/account` | `commerce.account` | `account.overview` |
| `/account/profile` | `commerce.account.profile` | `account.profile` |
| `/account/addresses` | `commerce.account.addresses` | `account.addresses` |
| `/account/orders` | `commerce.account.orders` | `account.orders` (needs `orders`) |
| `/account/quotes` | `commerce.account.quotes` | `account.quotes` (needs `orders`) |
| `/account/orders/{order}` | `commerce.account.order` | `account.order` (needs `orders`) |
| `/account/downloads` | `commerce.account.downloads` | `account.downloads` |

A page whose feature is off returns 404. See [accounts.md](accounts.md) for sign-in and the account
menu, and [extending.md](extending.md#my-account-pages) to add your own account page.

Views resolve app first: `Layout::view('cart')` is `commerce.cart` when your app has
`resources/views/commerce/cart.blade.php`, else the package's `commerce::storefront.cart`. Every
template includes its partials the same way, so a published partial is used everywhere.

## The store layout

Store pages extend `Storefront\Layout::name()`:

- the view in `commerce.storefront.layout` when it exists (default `sunrice.layouts.app`, the
  layout of Sunrice's starter templates);
- else commerce's minimal layout, `commerce::layouts.store`.

```php
// config/commerce.php
'storefront' => [
    'layout' => 'layouts.site',   // your own layout
],
```

Your layout needs:

- `@yield('content')` for the page;
- `@stack('head')` in `<head>`: the theme stylesheet, the CSRF meta tag and the product JSON-LD go
  there;
- `@stack('scripts')` before `</body>`: `commerce.js`, the variant picker and the countdown go there;
- `<x-sunrice::seo :default-title="$seoTitle ?? null" />`: store pages pass their title as
  `$seoTitle`.

The minimal layout also renders the `head` slot (`<x-commerce::slot name="head" />`) and passes
`noindex` to the SEO component on private pages. Sunrice's starter layout does neither: add them
to your layout if you need them. Use `@bodyClass` on `<body>` to get the
[page classes](#theming-without-publishing).

To link the cart and account from your site header, include the header links partial. It adds the
account link, the wishlist link and the mini cart, each only while its feature is on:

```blade
@include(\Sunrice\Commerce\Storefront\Layout::view('partials.header-links'))
```

## Publishing templates

```bash
php artisan commerce:install --templates          # with the rest of the install; add --force to overwrite
php artisan vendor:publish --tag=commerce-templates
```

`Storefront\Templates::publishable()` copies:

| From | To |
| --- | --- |
| `storefront/product.blade.php` | `resources/views/sunrice/{collection}/show.blade.php` |
| `storefront/shop.blade.php` | `resources/views/sunrice/{collection}/index.blade.php` |
| `storefront/category.blade.php` | `resources/views/sunrice/taxonomies/{category taxonomy}/show.blade.php` |
| `storefront/brand.blade.php` | `resources/views/sunrice/taxonomies/{brand taxonomy}/show.blade.php` |
| `storefront/tag.blade.php` | `resources/views/sunrice/taxonomies/{tag taxonomy}/show.blade.php` |
| every other `storefront/**/*.blade.php` | `resources/views/commerce/…` (same relative path) |
| `stubs/theme/` | `public/commerce-theme/` (`commerce.css`, `commerce.js`) |

`{collection}` is the first of `commerce.catalog.collections` (default `products`). The taxonomy
folders use `commerce.catalog.*_taxonomy` (defaults `product_categories`, `brands`,
`product_tags`). The product, shop and term templates land where Sunrice's template resolution
finds them; the rest are found by `Layout::view()`.

The minimal layout (`commerce::layouts.store`) isn't published. To change the layout, point
`commerce.storefront.layout` at your own.

You can delete any published file you don't change: the package's copy is used again. Keep the
`<x-commerce::slot>` tags in templates you edit, so extensions still show up.

## Translations

All storefront text is in translation files (`commerce::storefront.cart.title`…), in English and
Indonesian:

```bash
php artisan vendor:publish --tag=commerce-translations
```

This copies `resources/lang/{en,id}/*.php` to `lang/vendor/commerce/`: `account`, `checkout`,
`digital`, `documents`, `emails`, `orders`, `payments`, `storefront` and `validation`. Edit the
lines you want; Laravel uses your copy first.

## Template reference

Each template starts with a comment listing its variables. The tables below follow those comments
and the controllers that render them. Every store page also gets `$seoTitle`.

### Pages

| Template | Variables |
| --- | --- |
| `product` | `$entry` (from Sunrice). Reads the product with `commerce_product($entry)`; shows the gallery, title, excerpt, `<x-commerce::product>`, wishlist and compare buttons, description, `specifications`, `size_guide`, `faq`, the inquiry form (when the call to action is an inquiry) and `related_products`. |
| `shop` | `$collection` (from Sunrice). A search box (`q`) and `<x-commerce::products :filters="true" />`. |
| `category` | `$term`: the category. Banner, description, child categories, filters (without its own facet) and products. |
| `brand` | `$term`: the brand. Logo, description, website, filters and products. |
| `tag` | `$term`: the tag. |
| `brands` | `$brands`: brands with live products, each `['name', 'url', 'logo', 'count']`. |
| `cart` | `$cart`: `CartView`, rendered with `<x-commerce::cart>`. |
| `checkout` | `$cart` (CartView), `$state` (CalculationState), `$data` (CheckoutData), `$mode` (CheckoutMode), `$settings`, `$needsAddress`, `$paymentMethods`, `$savedAddresses`, `$guest`, `$offerAccount`, `$accountRequired`, `$extraFields`, `$termsUrl`, `$submitLabel`. See [checkout.md](checkout.md). |
| `order` | `$order`, `$payment`, `$instructionsView`, `$payUrl`, `$whatsappUrl`, `$openWhatsApp`, `$downloads`, `$invoiceUrl`, `$canCancel`, `$invite`, `$registerUrl`. Also renders quotes. See [orders.md](orders.md). |
| `pay` | `$order`, `$methods`: pay an unpaid order, or choose another method. |
| `confirm-payment` | The lookup form, or the form for `$order` and its pending `$payment`; `$accounts` (bank accounts paid into), `$proofRequired`, `$captcha` (widget data or null). |
| `track-order` | — (find an order by number and email). |
| `wishlist` | `$wishlist`, `$products` (product entries), `$shareUrl`, `$readOnly` (true on a shared list). |
| `compare` | `$entries` (product entries side by side), `$fields` (the compared attributes), `$specLabels`. |
| `flash-sales` | `$running` and `$upcoming`: FlashSale models. |
| `flash-sale` | `$sale`: FlashSale, `$products`: product entries. |

### Account pages

Account pages extend `account.layout` and fill `@section('account')`. They all get `$customer`,
`$user`, `$navigation` (the account menu) and `$current` (the current menu key). The layout finds
both itself when you leave them out, so extension pages can extend it directly.

| Template | Variables |
| --- | --- |
| `account.layout` | The account menu beside the page, and flash messages. |
| `account.login` | Sign in with a password, an emailed code or Google (each shown while its feature is on). |
| `account.register` | Create an account. |
| `account.forgot-password` | Request a reset link. |
| `account.reset-password` | `$token`, `$email`. |
| `account.code` | `$email`: enter the emailed sign-in code. |
| `account.overview` | `$addresses`. Renders the `account.overview` slot. |
| `account.profile` | `$google`: name, email, phone, password, Google link, deleting the account. |
| `account.addresses` | `$addresses`, `$editing` (the address being edited, or null). |
| `account.orders` | `$orders` (paginated), `$type`: `order`. |
| `account.quotes` | `$orders` (paginated), `$type`: `quote`. |
| `account.order` | The `order` page's variables. |
| `account.downloads` | `$grants`: DownloadGrant models. |

### Partials

| Partial | Variables |
| --- | --- |
| `partials.assets` | — Links the published theme. Included once by every store page. |
| `partials.header-links` | — Account, wishlist and mini cart links for your header. |
| `partials.buy` | `$product` (ProductView). The body of `<x-commerce::product>`. |
| `partials.price` | `$product`. The body of `<x-commerce::price>`. |
| `partials.badges` | `$product`: sale, new, stock and featured badges. |
| `partials.stock` | `$product`: "In stock", "Only 3 left"… |
| `partials.variant-picker` | `$product`: one radio group per option. |
| `partials.cta` | `$product`: WhatsApp, external shop or inquiry, when the product isn't sold by cart. |
| `partials.inquiry-form` | `$product`: the Sunrice form `commerce.catalog.inquiry_form`. |
| `partials.structured-data` | `$product`: schema.org Product JSON-LD. |
| `partials.product-card` | `$entry`: a product in a listing. |
| `partials.products` | `$products` (paginator of entries), `$query`, `$paginate`, `$filters`, `$limit`. The body of `<x-commerce::products>`. |
| `partials.filters` | `$facets`, `$titles`, `$prices`, `$without`, `$param()`. The body of `<x-commerce::product-filter>`. |
| `partials.flash-sale` | `$sale`, `$products` (entries), `$limit`. The body of `<x-commerce::flash-sale>`. |
| `partials.countdown` | `$until`: an ISO 8601 time. |
| `partials.cart` | `$cart` (CartView). The body of `<x-commerce::cart>`. |
| `partials.mini-cart` | `$count`. The body of `<x-commerce::mini-cart>`, with the drawer. |
| `partials.wishlist-button` | `$productId`, `$saved`. |
| `partials.compare-button` | `$productId`, `$added`. |
| `partials.totals` | `$state` (CalculationState). |
| `partials.checkout-summary` | `$cart`, `$state`. |
| `partials.checkout-field` | `$field`: an extension checkout field (`handle`, `label`, `type`, `options`, `instructions`). |
| `partials.shipping-methods` | `$state`, `$data`. |
| `partials.payment-methods` | `$paymentMethods` (`[{key, title, description}]`), `$data`. |
| `partials.address-fields` | `$address`, `$prefix`: country → province → city → district (→ village) selects filled from the regions API. |
| `partials.order-items` | `$order`: the lines and totals. |
| `partials.downloads` | `$grants`. |
| `partials.messages` | — Flash messages (`commerce.success`, `commerce.error` in the session). |
| `partials.field-error` | `$name`: a field's validation message. |

The checkout partials are also rendered by `POST /checkout/refresh`, so keep their outer elements
(`data-commerce-rates`, `data-commerce-payments`, `data-commerce-summary`) when you edit them.

### Payment partials

Shown on the order and pay pages for a payment's method ([payments.md](payments.md)). Each gets
`$order` and `$payment`.

| Partial | Shows |
| --- | --- |
| `payments.bank-transfer` | The amount and accounts from the payment's snapshot, with copy buttons |
| `payments.instructions` | Instructions (QRIS, e-wallet…) from the payment's snapshot |
| `payments.cod` | Cash on delivery |
| `payments.confirm-link` | The "I have paid" link, when the method asks for a confirmation |

## Theme assets

The theme ships with the admin assets in `public/vendor/commerce/theme/` (`commerce:install` and
`commerce:publish-assets` copy it). Publishing the templates also copies it to
`public/commerce-theme/` for you to edit; `partials.assets` links that copy when it exists, else the
shipped one, with a version from the file time. Without JavaScript the store still works: forms post
normally.

**`commerce.css`** styles the `commerce-*` classes. It uses the variables of Sunrice's starter
theme (`--fg`, `--muted`, `--line`, `--accent`) and four of its own:

```css
:root { --commerce-sale: #dc2626; --commerce-ok: #16a34a; --commerce-warn: #d97706; --commerce-radius: 8px; }
```

**`commerce.js`** is plain JavaScript with no build step. It works from `data-commerce-*`
attributes:

- **Add to cart** (`[data-commerce-add]`): posts the form to the cart API and stays on the page,
  updates every `[data-commerce-cart-count]` and shows a toast. A submit button named `buy_now` still
  posts normally. On a network error the form posts normally.
- **Checkout refresh** (`[data-commerce-checkout]`): on every change (except password, notes and
  terms) it posts the form to `/checkout/refresh` and replaces the shipping rates, payment methods
  and summary. It shows and hides the parts behind toggles (billing address, dropship), hides
  the shipping address for pickup rates, fills the address from a saved one, and hides the "Update
  shipping" button that works without it.
- **Copy buttons** (`[data-commerce-copy-button]`): copy the `data-commerce-copy` value next to them
  (amounts, account numbers) to the clipboard.
- **Gallery**: when the variant picker picks a variant with its own image, that image replaces the
  first one in `[data-commerce-gallery]`.
- **Mini-cart drawer**: a click on `[data-commerce-mini-cart]` loads the cart from the API and opens
  the `<dialog>` with its lines and total. Ctrl- or Cmd-click opens the cart page. On an error it
  goes to the cart page.

After an AJAX add, it dispatches `commerce:cart-updated` (and the older `commerce:cart`) on
`document`, with the cart as `detail`:

```js
document.addEventListener('commerce:cart-updated', (event) => {
    const cart = event.detail; // { count, lines: [{ title, url, quantity, total: { formatted } }], totals, … }
    document.querySelector('.my-cart-badge').textContent = cart.count;
});
```

Two small scripts live in their partials instead, so they work without the theme: the variant
picker (it updates the price, compare-at price, SKU and button, and dispatches `commerce:variant`
with the chosen variant, bubbling from the buying block) and the countdown (it ticks every second).

## Storefront slots

Templates leave room for extensions with `<x-commerce::slot name="…" />`. The slots, where they
are and the variables they get are listed in
[extending.md](extending.md#storefront-slots).

## Storefront URL paths

Change a path in `commerce.storefront.paths`. Paths have no language prefix; other languages get
Sunrice's `/{locale}` prefix.

| Key | Default | Used by |
| --- | --- | --- |
| `cart` | `cart` | Cart |
| `checkout` | `checkout` | Checkout and its refresh |
| `order` | `order` | Order, pay, payment return, invoice, cancel |
| `confirm_payment` | `confirm-payment` | Payment confirmation |
| `track_order` | `track-order` | Track order |
| `quote` | `quote` | Quote page |
| `account` | `account` | My Account and sign-in (also Google sign-in) |
| `wishlist` | `wishlist` | Wishlist and shared wishlists |
| `compare` | `compare` | Compare |
| `brands` | `brands` | Brands index |
| `flash_sale` | `flash-sale` | Flash sales |
| `downloads` | `downloads` | Download links |
| `go` | `go` | Call-to-action redirects |
| `api` | `commerce/api` | The JSON API used by `commerce.js` and the address fields |
| `webhooks` | `commerce/webhooks` | Payment webhooks (not localized) |

```php
'storefront' => [
    'paths' => ['cart' => 'keranjang', 'checkout' => 'bayar'],
],
```

Paths must not clash with your Sunrice pages: commerce routes win over Sunrice's catch-all route.
Rebuild the route cache (`php artisan route:cache`) after a change. Always build links with `commerce_url()`, never by hand.

## SEO

- **Private pages stay out of search engines.** Cart, checkout, order, pay, quote, track order,
  payment confirmation, account, wishlist, compare, downloads, `/go` and the cart API run the
  `commerce.noindex` middleware: the response gets `X-Robots-Tag: noindex, nofollow`, and the
  minimal layout also outputs a robots meta tag. Brands and flash sale pages are indexable.
- **Product JSON-LD.** The product template pushes `partials.structured-data` to the `head` stack:
  a schema.org `Product` with name, URL, SKU (simple products), gallery images and excerpt. Offers
  are added only when prices are visible: an `Offer`, or an `AggregateOffer` with low and high
  prices for a range, with availability (`InStock`, `OutOfStock`, `BackOrder`). See
  [`structuredData()`](helpers.md#productview).
- **Canonical URLs** come from `<x-sunrice::seo>`. A product page points at the entry's URL in its
  language. A listing points at its own URL without the filter and sort parameters, keeping only
  the page number, so filtered views aren't indexed as copies.
- **Sitemap.** Products, the shop and product terms are Sunrice entries and terms, so they are in
  Sunrice's `sitemap.xml` with their translations. Commerce's own routes aren't in it.
- **Titles.** Store pages pass `$seoTitle` (the cart page passes "Cart", an order page its number).

## Accessibility

The templates aim to work for everyone, with or without JavaScript:

- Every form works without JavaScript: add to cart, the variant picker (it posts the chosen
  options), filters (a GET form), checkout (an "Update shipping" button), wishlist and compare.
- Inputs have labels; icon-only buttons (×) have an `aria-label`; the shop search has
  `role="search"`.
- The variant picker is a `fieldset` per option with radio buttons. A sold-out value is described
  with `aria-describedby`; "This combination is not available." is a polite live region.
- The mini-cart drawer is a native `<dialog>` opened with `showModal()`: focus moves to the close
  button and stays inside, Escape closes it, and focus returns to the cart link. Its body is a polite
  live region.
- Wishlist and compare buttons use `aria-pressed`. The account menu marks the current page with
  `aria-current="page"`.
- Success messages use `role="status"`; errors and field errors use `role="alert"`.
- Account and checkout fields use `autocomplete` (`email`, `name`, `tel`, `postal-code`,
  `one-time-code`, `current-password`, `new-password`…).
- Product images use the asset's alt text, or the product title. The first gallery image loads
  eagerly, the rest lazily.

Keep these when you edit published templates.

## Full-page cache

Don't turn on Sunrice's full-page cache (`sunrice.cache.full_page`) while the store is open.
Commerce can't exclude its pages from it yet, so product pages, the header cart count, prices for
signed-in customers and stock would be served stale. The store health check `full_page_cache`
warns about it on the store dashboard and in `php artisan commerce:doctor`. Prices are never cached
otherwise: Sunrice's query cache only stores entry ids.

## Theming without publishing

You don't need to publish templates to restyle the store: the shipped theme is linked on every
store page, and your own stylesheet can override the `commerce-*` classes and the variables below.

**Classes** are BEM-ish and all start with `commerce-`: a block (`commerce-product`,
`commerce-cart`, `commerce-card`, `commerce-filters`, `commerce-drawer`…), its elements
(`commerce-product__gallery`, `commerce-cart__lines`, `commerce-price__amount`) and modifiers
(`commerce-badge--sale`, `commerce-stock--out_of_stock`, `commerce-button--primary`). The minimal
layout wraps pages in `<main class="container commerce">`.

**Body classes.** On commerce routes, `@bodyClass` adds `page-commerce` and `commerce-{page}`, from
the route name without the `commerce.` prefix and the language suffix, dots turned into dashes:

| Route | Body classes |
| --- | --- |
| `commerce.cart` | `page-commerce commerce-cart` |
| `commerce.checkout` | `page-commerce commerce-checkout` |
| `commerce.account.orders` | `page-commerce commerce-account-orders` |

Product, shop and term pages are Sunrice pages and get Sunrice's own body classes.

```css
.page-commerce .commerce-add__button { background: var(--brand); border-radius: 999px; }
.commerce-badge--sale { background: #b91c1c; }
.commerce-checkout .commerce-checkout__summary { position: sticky; top: 1rem; }
```

**Text** comes from the translations: publish them to change wording without touching templates.
**Behaviour** hooks onto `data-commerce-*` attributes, so restyle freely but keep those attributes.
