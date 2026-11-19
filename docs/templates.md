# Storefront templates

Commerce renders a working store without publishing anything. Every page is a Blade view in the
package. You can restyle it with CSS, or publish the templates and edit them. For the Blade
components the templates use, see [blade-components.md](blade-components.md). For the helpers, see
[helpers.md](helpers.md).

## Contents

- [Which pages commerce renders](#which-pages-commerce-renders)
- [The store layout](#the-store-layout)
- [Publishing templates](#publishing-templates)
- [Choosing an override](#choosing-an-override)
- [Checkout and cart areas](#checkout-and-cart-areas)
- [My Account and order areas](#my-account-and-order-areas)
- [The starter theme](#the-starter-theme)
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
`resources/views/cms/collections/products/show.blade.php`. The CMS passes these templates its usual
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
| `/account` | `commerce.account` | Redirects to Orders, the announcement tab, or Profile |
| `/account/announcement` | `commerce.account.announcement` | `account.announcement` (only for the first-tab placement) |
| `/account/profile` | `commerce.account.profile` | `account.profile` |
| `/account/addresses` | `commerce.account.addresses` | `account.addresses` |
| `/account/orders` | `commerce.account.orders` | `account.orders` (needs `orders`) |
| `/account/quotes` | `commerce.account.quotes` | `account.quotes` (needs `orders`) |
| `/account/orders/{order}` | `commerce.account.order` | `account.order` (needs `orders`) |
| `/account/downloads` | `commerce.account.downloads` | `account.downloads` |
| `/account/points` | `commerce.account.points` | `account.points` (needs `loyalty`) |

A page whose feature is off returns 404. See [accounts.md](accounts.md) for sign-in and the account
menu, and [extending.md](extending.md#my-account-pages) to add your own account page.

Views resolve app first: `Layout::view('cart')` is `commerce.cart` when your app has
`resources/views/commerce/cart.blade.php`, else the package's `commerce::storefront.cart`. Every
template includes its partials the same way, so a published partial is used everywhere.

## The store layout

Store pages extend `Storefront\Layout::name()`:

- the view in `commerce.storefront.layout` when it exists (default `cms.layout`, the site layout
  of the CMS's starter templates and of [the starter theme](#the-starter-theme),
  `resources/views/cms/layout.blade.php`);
- otherwise `resources/views/commerce/layouts/store.blade.php` when present, then the package's minimal layout.

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
- `<x-sunrice-cms::seo :default-title="$seoTitle ?? null" />`: store pages pass their title as
  `$seoTitle`.

The minimal layout also renders the `head` slot (`<x-commerce::slot name="head" />`) and passes
`noindex` to the SEO component on private pages (the starter theme's layout does too). The CMS's
starter layout does neither: add them
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
| `storefront/product.blade.php` | `resources/views/cms/collections/{collection}/show.blade.php` |
| `storefront/shop.blade.php` | `resources/views/cms/collections/{collection}/index.blade.php` |
| `storefront/category.blade.php` | `resources/views/cms/taxonomies/{category taxonomy}/show.blade.php` |
| `storefront/brand.blade.php` | `resources/views/cms/taxonomies/{brand taxonomy}/show.blade.php` |
| `storefront/tag.blade.php` | `resources/views/cms/taxonomies/{tag taxonomy}/show.blade.php` |
| `layouts/store.blade.php` | `resources/views/commerce/layouts/store.blade.php` |
| every other `storefront/**/*.blade.php` | `resources/views/commerce/…` (same relative path) |
| `stubs/theme/` | `public/commerce-theme/` (`commerce.css`, `commerce.js`) |

`{collection}` is the first of `commerce.catalog.collections` (default `products`). The taxonomy
folders use `commerce.catalog.*_taxonomy` (defaults `product_categories`, `brands`,
`product_tags`). CMS templates follow CMS resolution. Other published views are found by
`Layout::view()`. Removing an app override restores the package fallback.

## Choosing an override

| What to change | Entry point |
| --- | --- |
| Store colors, typography, or surface styles | Add a [CSS skin](#css-skins) after the default theme |
| Site header, footer, or page frame | Set `commerce.storefront.layout` or edit the [starter layout and partials](#the-starter-theme) |
| A specific store page | Copy that file from `resources/views/storefront` in the package to `resources/views/commerce` in the app |
| A product, catalog, category, or brand page | Use the corresponding [CMS template](#which-pages-commerce-renders) |
| One shopping UI block | Copy the corresponding partial to the same relative path under `resources/views/commerce` |
| Content inserted at a supported position | Register a [storefront slot](#storefront-slots) |
| Text only | [Override the translation](#translations) |
| Email templates or printed documents | See [emails.md](emails.md) and [documents.md](documents.md) |

For example, copy `resources/views/storefront/checkout/shipping-address.blade.php` from the
package to `resources/views/commerce/checkout/shipping-address.blade.php` in your app and edit
that copy. If your app already has a published checkout, cart, product, or account page, merge the
updated `@include` calls into your copy to adopt the new overrides. Publishing without `--force`
adds missing files and keeps existing copies. If the site uses full-page caching, clear the
storefront cache when checking a template change.

## Checkout and cart areas

Names below are relative to the app's `resources/views/commerce` directory. Replace the dots
with slashes and add `.blade.php`.

| View | Data and responsibility |
| --- | --- |
| `checkout` | The page frame and single checkout form. Holds the CSRF token, totals hash, feature checks and checkout slots. |
| `checkout.contact` | `$data`, `$settings`, `$guest`, `$needsAddress`, `$offerAccount`, `$accountRequired`, `$extraFields`. Contact, optional company and account fields. |
| `checkout.shipping-address` | `$data`, `$settings`, `$guest`, `$savedAddresses`, `$extraFields`. Saved addresses, the address editor and pickup contact. |
| `checkout.billing-address` | `$data`. Billing address for an order with a separate billing address. |
| `checkout.address-dialog` | Dialog shell. The storefront script mounts the shipping address editor here. |
| `checkout.delivery`, `partials.shipping-methods` | `$data`, `$state`. Delivery section and rates list. |
| `checkout.payment`, `partials.payment-methods` | `$state`, `$data`, `$paymentMethods` in the section. The list uses `$data` and `$paymentMethods` and is shared with the pay page. |
| `checkout.points`, `partials.checkout-vouchers` | Available points and voucher controls. Points use `$data` and `$loyaltyPoints`. Vouchers use `$state` and the voucher actions. |
| `checkout.notes` | `$data`, `$settings`, `$extraFields`. Order notes, dropship details and extension fields. |
| `checkout.summary`, `partials.checkout-summary` | `$cart`, `$state`. The summary wrapper and its contents, used on the page and by checkout refresh. |
| `checkout.submit` | `$data`, `$guest`, `$termsUrl`, `$termsContent`, `$captcha`, `$submitLabel`. Terms, CAPTCHA, status and submit controls. |
| `checkout.terms-dialog` | `$termsContent`. Published CMS title, locale, intro and sanitized body. The checkout terms link opens this dialog. |
| `cart`, `partials.cart` | The page and cart component frame. The component receives `$cart` and the paginated `$lines`. |
| `cart.items`, `cart.line` | The paginated lines and one row. A row receives `$row` with `line`, `item` and `entry`, plus `$money`, `$taxDisplay` and `$variantImages` keyed by media ID. The first product photo is the fallback. |
| `cart.summary`, `partials.totals` | The checkout link and cart summary use `$cart`. The shared totals view takes `$state`. |
| `cart.remove-dialog`, `cart.cross-sells` | The shared confirmation dialog and the recommendations resolved from `$cart`. |
| `partials.mini-cart` | `$count`. Header cart trigger and drawer shell. |

Keep form routes and methods, CSRF fields, field names, validation messages, and the
`data-commerce-*` hooks when reusing the built-in interactions. The refresh script replaces
`data-commerce-rates`, `data-commerce-payments`, `data-commerce-summary`, and
`data-commerce-checkout-vouchers` by their root element. Keep each hook on one root and
keep the checkout address dialog outside the main form. Cart quantity and removal use separate
forms per row. Test checkouts with a new and saved address, pickup, vouchers, and payment refresh
after overriding those areas.

## My Account and order areas

| View | Data and responsibility |
| --- | --- |
| `account.layout`, `account.navigation` | Shared signed-in frame and navigation. The navigation receives `$navigation` and the selected `$current` key. Custom account pages can extend `account.layout` and fill `@section('account')`. |
| `account.orders`, `account.quotes`, `account.order-table` | Order and quote pages and their shared table. The table receives the paginated `$orders`. |
| `account.order-filters` | `$orderFilters`, `$orderCategories` (category ID to label from the customer's orders), `$orderFilterErrors`, `$filtersActive`. Order search, status, product category and date controls. |
| `account.address-form`, `account.address-card` | `$editing` for the address form. The card takes `$address`, `$addresses`, and `$showAddressForm`. |
| `account.order`, `account.order-returns` | Account order detail and its return history and form. Returns receive `$order`, `$returns` and `$returnable`. |
| `account.announcement-banner`, `account.announcement` | Announcement above or below account content, or on its own tab. |
| `order.confirmation`, `order.sidebar` | Thank-you or quote header, order status, shipping, tracking, and order actions. Both receive `$order`. |
| `partials.order-payment`, `partials.order-items`, `partials.downloads` | Shared payment, order items, and download markup for order and account screens. |

Profile, points, downloads, sign-in, registration and password recovery are also independently
overridable. See the [account view reference](#account-pages) for their view names. Keep the
existing account POST actions and CAPTCHA where configured. Reuse the controller-provided
order and download links so the server can enforce ownership and access.

## The starter theme

The starter theme is a complete shop on top of the templates: a clean, product-first look (white
and light grey, near-black text, one red accent for sales and the main buttons, square corners,
thin lines), with Sunrice's own pages in the same style. Install it with its demo store:

```bash
php artisan commerce:install --starter --demo     # add --force to overwrite files you published before
php artisan vendor:publish --tag=commerce-starter # the files only
```

It is the same storefront theme as the templates (one set of store views and one
`commerce.css`), plus the site around them. `Storefront\Templates::starter()` copies everything in
the table above and `resources/views/starter/**` to the same paths under `resources/views`:

| File | What it is |
| --- | --- |
| `cms/layout.blade.php` | The site layout of every page, the CMS's (`@extends('cms.layout')`) and the store's (`commerce.storefront.layout` finds it); loads the theme and the font. It reads the page shown from `cms_page()` |
| `cms/partials/store-header.blade.php` | Announcement bar, sticky header: menu button, logo, department menu with mega panels (a drawer on phones), product search, account, wishlist and cart |
| `cms/partials/store-footer.blade.php` | Footer menu columns, footer text and social links, payment methods, languages |
| `cms/partials/store-languages.blade.php` | Language links (`<x-sunrice-cms::language-switcher>`, shown with more than one language) |
| `cms/home.blade.php` | The home page: full-width hero, department and category tiles, the running flash sale with its countdown, new arrivals, best sellers, brands |
| `cms/collections/pages/show.blade.php` | Content pages of the `pages` collection (About, Help, legal pages) |
| `cms/search.blade.php` | The CMS's site search: products as cards, then other pages |
| `errors/404.blade.php` | Not found, with a product search |

The files follow the CMS's template conventions (Templates in `sunrice/cms`'s `docs/site.md`):
`cms/layout` is the site layout the CMS's own starter templates use too, so
publishing the starter theme gives those pages the store's header and footer (and replaces the
CMS's starter `cms/layout.blade.php` if you published it before, with `--force`). The partials read
the menus and globals with `cms_menu()` and `cms_global()`, the page shown with `cms_page()`.

What the site shell reads, all optional:

- the global `site` (`name`, `logo`, `announcement`) and the global `footer` (`text`, `social`);
- the menus `main` (departments; their children fill the mega panel) and `footer` (each top item
  is a column);
- the home page entry's fields `hero_title`, `hero_text`, `hero_image`, `hero_button`,
  `hero_link`, `body` (blueprint `home`; the entry's template is `cms.home`);
- category terms' `image` and `banner`, brand terms' `logo`;
- colour terms' `swatch` field (a hex colour): with it, the attribute shows as swatches on cards,
  in the filters and in the variant picker. Other attribute taxonomies (sizes) show as boxes in
  their term order.

The demo store creates all of these ([installation.md](installation.md#the-starter-store)).

**Colours and font.** Change the variables at the top of `public/commerce-theme/commerce.css`:

```css
:root {
    --commerce-bg: #ffffff;        /* page */
    --commerce-surface: #f4f4f4;   /* image grounds, summaries, footer */
    --commerce-fg: #1b1b1b;        /* text, primary buttons, lines that matter */
    --commerce-muted: #666666;
    --commerce-line: #dddddd;
    --commerce-accent: #d7001d;    /* sale prices and badges, the main call to action */
    --commerce-radius: 0;          /* square corners; try 6px */
    --commerce-font: "Plus Jakarta Sans", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
}
```

The layout loads Plus Jakarta Sans from Google Fonts; delete its two `<link>`s (or point them at
another family and change `--commerce-font`) to use the system font. The store's brand colour
(Settings → Store → General) colours emails, not the storefront.

**JavaScript** (`commerce.js`, no build step) adds the menu drawer (focus kept inside, Escape
closes it; Escape also closes an open mega panel), the filter drawer on small screens, quantity
steppers (a cart line saves itself after a change), and the product gallery thumbnails on
phones. Without JavaScript the menu and filters are shown in the page. The basic form submissions
are described under [Accessibility](#accessibility).

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
| `checkout` | `$cart` (CartView), `$state` (CalculationState), `$data` (CheckoutData), `$mode` (CheckoutMode), `$settings`, `$needsAddress`, `$paymentMethods`, `$savedAddresses`, `$loyaltyPoints`, `$guest`, `$offerAccount`, `$accountRequired`, `$extraFields`, `$termsUrl`, `$submitLabel`, `$captcha` (optional widget HTML). See [checkout.md](checkout.md). |
| `order` | `$order`, `$payment`, `$instructionsView`, `$payUrl`, `$whatsappUrl`, `$openWhatsApp`, `$downloads`, `$invoiceUrl`, `$canCancel`, `$invite`, `$registerUrl`. Also renders quotes. See [orders.md](orders.md). |
| `pay` | `$order`, `$methods`: pay an unpaid order, or choose another method. |
| `confirm-payment` | The lookup form, or the form for `$order` and its pending `$payment`; `$accounts` (bank accounts paid into), `$proofRequired`, `$captcha` (widget data or null). |
| `track-order` | `$verification` switches from order lookup to email code entry. |
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
| `account.login` | Sign in with a password, an emailed code or Google (each shown while its feature is on), and `$captcha` for password sign-in. |
| `account.register` | Create an account. |
| `account.forgot-password` | Request a reset link, with `$captcha` when configured. |
| `account.reset-password` | `$token`, `$email`. |
| `account.code` | `$email`: enter the emailed sign-in code. |
| `account.announcement` | `$announcement`: the localized title and message for the first tab. |
| `account.announcement-banner` | Included by `account.layout` above or below account content according to the Store → Accounts setting. |
| `account.profile` | `$google`: name, email, phone, password, Google link, deleting the account. |
| `account.addresses` | `$addresses`, `$editing` (the address being edited, or null), `$showAddressForm` (true for `?add=1` or a valid `?edit={id}`). |
| `account.orders` | `$orders` (paginated, with filter query parameters), `$type`: `order`, `$orderFilters` (entered values), `$orderCategories`, `$orderFilterErrors` (validation messages), `$filtersActive` (whether any filters were applied). Renders the legacy `account.overview` slot. |
| `account.quotes` | `$orders` (paginated), `$type`: `quote`. |
| `account.order` | The `order` page's variables. |
| `account.downloads` | `$grants`: DownloadGrant models. |

### Partials

| Partial | Variables |
| --- | --- |
| `partials.assets` | — Links the published theme. Included once by every store page. |
| `partials.captcha` | `$captcha`: the configured Sunrice widget HTML and its form error. Include inside the form. |
| `partials.header-links` | — Account, wishlist, comparison and mini cart links for your header. |
| `partials.buy` | `$product` (ProductView). The body of `<x-commerce::product>`. |
| `partials.bulk-pricing` | `$tiers`: resolved rows with `min_qty`, the formatted unit `price` and a discount `label`. Override `resources/views/commerce/partials/bulk-pricing.blade.php` to change the display. The buying block includes it when there are tiers to show. |
| `partials.price` | `$product`. The body of `<x-commerce::price>`. |
| `partials.product-table` | `$products`: the current page of product entries. Override `resources/views/commerce/partials/product-table.blade.php` to customize the column headings and cells. Filters, sorting and pagination are handled by the listing. |
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
| `partials.cart` | `$cart` (CartView), `$lines` (this page of `$cart->lines`, a paginator: loop over it and show `$lines->links()`). The body of `<x-commerce::cart>`. |
| `partials.mini-cart` | `$count`. The body of `<x-commerce::mini-cart>`, with the drawer (`data-commerce-drawer-lines`, `data-commerce-drawer-more`). |
| `partials.wishlist-button` | `$productId`, `$saved`. |
| `partials.compare-button` | `$productId`, `$added`. |
| `partials.totals` | `$state` (CalculationState). |
| `partials.checkout-summary` | `$cart`, `$state`. Lines after `commerce.cart.preview_lines` are folded in a `<details>`. |
| `partials.checkout-field` | `$field`: an extension checkout field (`handle`, `label`, `type`, `options`, `instructions`). |
| `partials.shipping-methods` | `$state`, `$data`. |
| `partials.payment-methods` | `$paymentMethods` (`[{key, title, description}]`), `$data`. |
| `partials.address-fields` | `$address`, `$prefix`: country → province → city → district (→ village) selects filled from the regions API. |
| `partials.order-items` | `$order`: the lines and totals. |
| `partials.downloads` | `$grants`. |
| `partials.messages` | — Flash messages (`commerce.success`, `commerce.error` in the session). |
| `partials.listing` | `$query`, `$without`: the filter column (a drawer on phones), the active filters and the products. Used by the shop, category, brand and tag pages. |
| `partials.active-filters` | `$query`, `$without`: the filters in use as removable chips. |
| `partials.product-extras` | `$product`: a bundle's contents, a digital product's delivery, shipping notes. |
| `partials.product-gallery` | `$entry`, `$gallery`, `$variantImages`, `$content`. Carousel, lightbox and video. |
| `partials.product-summary`, `product.heading` | Product information and purchase section. The heading uses `$entry`, `$product`, `$brand` and `$locale`. |
| `partials.product-details`, `product.description`, `product.specifications`, `product.questions`, `product.size-guide` | The detail group and its individual panels. Description uses `$entry`. The other panels use the product's resolved `$content`. |
| `product.buy-controls`, `product.actions` | Quantity and add-to-cart controls use `$product`, `$default` and `$action`. Wishlist and Compare controls use `$entry` and `$projectedProduct`. |
| `partials.reviews`, `product.review-form` | Reviews use `$product`, `$reviews`, `$breakdown` and `$blocked`. The form uses the product and eligibility reason. |
| `product.upsells`, `product.related`, `partials.recommendations` | Each product list takes `$entry`. The shared renderer receives `$items`, `$kind` and `$heading`. Cards use `partials.product-card`. |
| `partials.compare-table`, `partials.wishlist-share` | Comparison receives `$entries`, `$fields`, `$specLabels` and `$specValues`. Sharing receives `$shareUrl` and `$sharedNotice`. |
| `partials.breadcrumbs` | `$items`: `[{label, url}]`, the last one the current page. |
| `partials.empty` | `$title`, `$text`, `$action` (`{url, label}`), `$icon`: an empty state. |
| `partials.pagination` | The page links (`$paginator->links(Layout::view('partials.pagination'))`). |
| `partials.icon` | `$name`: a decorative line icon (search, user, heart, bag, menu, close, filter…). |
| `partials.field-error` | `$name`: a field's validation message. |

The storefront script fetches the selected catalog URL and replaces the filter panel and results in
place. Keep `data-commerce-listing`, `data-commerce-filter-panel`, `data-commerce-listing-results`
and the status and filter controls when overriding the listing. The filter form and result links
also work as regular GET navigation. Filter changes, view switches and pagination use the browser's
history so the chosen catalog URL can be bookmarked or shared.

In a category tree, the checkbox on a parent selects the category and all of its descendants.
The adjacent control expands the branch. Selecting a subcategory replaces any selected ancestors
within that branch, while filters selected in separate branches remain applied.

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
| `payments.gateway` | The payment gateway's customer instructions |

Published Commerce payment partials are used on order confirmation and in My Account.
Third-party gateways can return their own namespaced Blade view via `instructionsView()`.

## Theme assets

The theme ships with the admin assets in `public/vendor/commerce/theme/` (`commerce:install` and
`commerce:publish-assets` copy it). Publishing the templates also copies it to
`public/commerce-theme/` for you to edit; `partials.assets` links that copy when it exists, else the
shipped one, with a version from the file time. See [Upgrading](upgrading.md#published-templates)
for updates to a published theme.

**`commerce.css`** styles the `commerce-*` classes, in sections (tokens, base, header, footer,
home, components, cards, listings, product, cart, drawer, checkout, order, account, lists, pages).
Its colours, corners and font are variables (`--commerce-bg`, `--commerce-surface`,
`--commerce-fg`, `--commerce-muted`, `--commerce-line`, `--commerce-accent`, `--commerce-sale`,
`--commerce-ok`, `--commerce-warn`, `--commerce-radius`, `--commerce-font`); see
[the starter theme](#the-starter-theme). Base element styles (fonts, inputs) only apply in the
starter layout, whose `<html>` has the class `commerce-site`, so the store components fit into
your own layout's look.

**`commerce.js`** is plain JavaScript with no build step. It works from `data-commerce-*`
attributes:

- **Add to cart** (`[data-commerce-add]`): posts the form to the cart API and stays on the page,
  updates every `[data-commerce-cart-count]` and shows a toast at the top with a link to the cart after a
  successful add. A submit button named `buy_now` still posts normally. If the API response cannot
  confirm what happened, Commerce does not resend the request. Include `partials.add-recovery` in
  published add-to-cart forms for the success toast link and the inline recovery notice.
- **Floating product controls** appear at the bottom of a `.commerce-product` page when
  `data-commerce-buy-controls` scrolls out of view. Both sets share the selected quantity and
  submit the same form. The controls disappear again when the original controls return to view.
- **Wishlist and Compare** use the existing form routes. The storefront updates the selection
  without reloading product and listing pages, then shows a shortcut in the success toast.
  The starter header links to Compare through the mobile menu or the desktop comparison icon.
- **Cart removal** uses a trash button and a shared confirmation dialog from `partials.cart`.
  With JavaScript off, the trash control opens an inline confirmation.
- **Checkout refresh** (`[data-commerce-checkout]`): changes to pricing inputs post the form to
  `/checkout/refresh` and replace the shipping rates, payment methods and summary. Choosing pickup
  keeps the shipping address visible and shows `data-commerce-pickup-note`. Applying or removing
  a voucher updates both the voucher panel and totals. The checkout keeps the latest selections when
  requests overlap, announces progress via `data-commerce-checkout-status` and shows the
  `data-commerce-update` form button if refreshing fails.
- **Copy buttons** (`[data-commerce-copy-button]`): copy the `data-commerce-copy` value next to them
  (amounts, account numbers) to the clipboard.
- **Gallery**: when the variant picker picks a variant with its own image, that image replaces the
  first one in `[data-commerce-gallery]`.
- **Starter theme**: the menu drawer and mega panels, the filter drawer on small screens, quantity
  steppers (`[data-commerce-stepper]`; with `data-commerce-autosubmit` a cart line saves itself)
  and the phone gallery thumbnails ([the starter theme](#the-starter-theme)).
- **Mini-cart drawer**: a click on `[data-commerce-mini-cart]` loads the cart from the API and opens
  the `<dialog>` with its first lines (`data-commerce-drawer-lines` on the dialog, from
  `commerce.cart.preview_lines`), "and 3 more" linking to the cart page, and the total. Ctrl- or
  Cmd-click opens the cart page. On an error it goes to the cart page.

After an AJAX add, it dispatches `commerce:cart-updated` (and the older `commerce:cart`) on
`document`, with the cart as `detail`:

```js
document.addEventListener('commerce:cart-updated', (event) => {
    const cart = event.detail; // { count, line_count, lines: [{ title, url, quantity, total: { formatted } }], totals, … }
    document.querySelector('.my-cart-badge').textContent = cart.count;
});
```

Two small scripts live in their partials instead, so they work without the theme: the variant
picker (it updates the price, compare-at price, SKU and button, and dispatches `commerce:variant`
with the chosen variant, bubbling from the buying block) and the countdown (it ticks every second).

### CSS skins

Save a stylesheet such as `public/themes/studio.css`, then set `'skin' => 'themes/studio.css'`
in the `storefront` array of `config/commerce.php`. Commerce loads it after the base stylesheet and
adds the file's modification time to its URL. The starter layout loads it across CMS and Commerce
pages. If your own layout loads assets, include `partials.assets` before its head and scripts
stacks render. Clear Laravel's config cache when changing the configured path.

```css
:root {
    --commerce-accent: #294b40;
    --commerce-radius: 6px;
}

.commerce-quantity-offer {
    border-radius: var(--commerce-radius);
}
```

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
- **Canonical URLs** come from `<x-sunrice-cms::seo>`. A product page points at the entry's URL in its
  language. A listing points at its own URL without the filter and sort parameters, keeping only
  the page number, so filtered views aren't indexed as copies.
- **Sitemap.** Products, the shop and product terms are Sunrice entries and terms, so they are in
  Sunrice's `sitemap.xml` with their translations. Commerce's own routes aren't in it.
- **Titles.** Store pages pass `$seoTitle` (the cart page passes "Cart", an order page its number).

## Accessibility

- Add to cart, the variant picker, wishlist and compare have standard form submissions. Product
  filters and My Account order filters use GET forms. Address summaries expand with native HTML
  and the address book opens the add or edit form through a normal link.
- Checkout offers a standard **Update total** submission. Entering a new Indonesian address
  in checkout or My Account requires JavaScript to load provinces, cities and districts. See
  [Regions](regions.md#the-regions-json-endpoint).
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

On Sunrice versions with full-page cache control, you can keep Sunrice's full-page cache
(`sunrice.cache.full_page`) on. Commerce decides what it may keep
(`Sunrice\Commerce\Storefront\PageCache`):

- **Commerce's own pages** (cart, checkout, account, order pages…) are never cached.
- **Visitors with something of their own** — a cart, a wishlist, a comparison, or signed in as a
  customer — always get a freshly rendered page, and theirs isn't kept. So a cached page is always
  the one an anonymous visitor sees: no one is shown another shopper's cart count or account.
- **Product, shop and product term pages**, and any page that shows a product (a products block on
  the home page), are cached for anonymous visitors for `commerce.cache.product_pages_ttl` seconds
  (default 300; `0` leaves them out). They're cleared at once when a product sells out, runs low or
  comes back in stock, when a product is saved, and when pricing rules or flash sales change or a
  flash sale starts or ends. A stock count shown on the page ("Only 3 left") and a pricing rule
  that starts or ends on a schedule catch up within the lifetime. Prices, stock and the totals check
  at checkout always use live data.

A custom component that shows prices or stock calls `PageCache::markDynamic()`, so its page gets
the shorter lifetime. Keeping product pages in the cache needs Sunrice's
`Sunrice::bypassPageCacheUsing()`; on Sunrice versions without it, product pages and the visitors
above are left out as before. This works with Sunrice's cache profile
(`Sunrice\Cache\FullPageCacheProfile`, used unless your site set its own
`responsecache.cache_profile`).

On older Sunrice versions, or with another cache profile, keep the full-page cache off while the
store is open: product pages, the header cart count, prices for signed-in customers and stock would
be served stale. The store health check `full_page_cache` warns about it on the store dashboard and
in `php artisan commerce:doctor`. Prices are never cached otherwise: Sunrice's query cache only
stores entry ids.

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
