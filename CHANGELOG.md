# Changelog

## Unreleased

- Keep the `BooksShipments` and `BookingResult` shipping APIs used by Biteship 0.3.
- Install the basic demo store when region import is skipped on a fresh app.

- **Breaking: customer accounts are built on `sunrice/account`, and guest checkout is gone.**
  This project is not in production use, so there is no data migration: set accounts up again
  after updating.

  **What an app must do**

  1. Before updating Composer, remove the `HasOneTimePasswords` trait and its import from the user
     model if they were added for Commerce, and remove any reference to the old Users resource.
     Commerce requires `sunrice/account` (^0.2.1). See [Upgrading](docs/upgrading.md#customer-accounts-on-sunriceaccount)
     for the dependency update.
  2. In the panel provider, add the account plugin before commerce and use its Users screen
     (`Sunrice\Commerce\Admin\StaffUserResource` is removed):

     ```php
     $panel->userResource(\Sunrice\Account\Admin\AccountUserResource::class)
         ->plugin(CmsPlugin::make())->plugin(AccountPlugin::make())->plugin(CommercePlugin::make());
     ```

     `CommercePlugin::requires()` now includes the account plugin.
  3. Run `php artisan migrate` and `php artisan account:install`.
  4. Set up sign-in in **Settings → Accounts** (the account package's): registration, email
     verification, the emailed code (on by default), Google, the default roles of new accounts
     and the account emails.

  **Accounts (1)**

  - Removed from commerce, now the account package's: the sign-in, registration, forgot and reset
    password, emailed-code and Google controllers, routes and views; the profile, password,
    deletion-request and announcement pages; the account navigation registry; the welcome,
    verification, password reset, sign-in code and deletion-request emails (`account_welcome`,
    `verify_email`, `login_code`, `password_reset`, `staff_deletion_request`); the accounts health
    check; `Customers\Events\AccountDeletionRequested`.
  - Removed config: `commerce.auth` (the `commerce` guard and password broker), `commerce.google`,
    and the storefront paths `account` and `track_order`. The signed-in customer is the account
    package's guard (`Sunrice\Account\Auth\SiteGuard::name()`, `account` by default);
    `commerce_customer()` and `CurrentCustomer::guard()` return it. The `commerce.auth` middleware
    is removed: use `sunrice.account.auth`.
  - Removed settings: the Settings → Store → Accounts section (`accounts.registration`,
    `accounts.verify_email`, `accounts.require_phone`, `accounts.customer_roles`,
    `accounts.code_minutes` and the announcement settings). New customers get the account
    package's default roles, not `accounts.customer_roles`.
  - Removed features: `passwordless_login` and `google_login`.
  - Commerce's My Account pages (orders, quotes, downloads, points, addresses, and the wishlist
    link) are registered with the account package's `Account::routes()` and `Account::page()`.
    `/account` opens Orders. `Commerce::registerAccountPage()` still exists and forwards to
    `Account::page()`.
  - Route name `commerce.account.order` is now `commerce.account.orders.show`. The routes
    `commerce.account`, `commerce.account.login`, `.register`, `.profile`, `.announcement` and
    the password and code routes are gone; link to sign-in with
    `\Sunrice\Account\Facades\Account::signInUrl()`.
  - Cart and wishlist merging and the customer record hang on the account package's `SignedIn`
    and `Registered` events. Removing an account's personal data (the account package's
    `AnonymizeAccount`) clears the store's records through `AnonymizeCustomer`; Shop → Customers'
    anonymize, password link and "mark verified" actions call the account package.

  **Every order belongs to an account (2)**

  - Checkout is behind `sunrice.account.auth` and `sunrice.account.verified`. A visitor who opens
    `/checkout` is sent to sign in and comes back with their cart; with the emailed code, one
    email field signs in or creates the account. Browsing, the cart, the wishlist and comparing
    still work without an account. The feature `checkout` now requires `accounts`.
  - Removed checkout settings: "Who can check out" (`checkout.access`, and the older
    `checkout.guest_checkout` and `checkout.require_verified_account`) and "Accounts at checkout"
    (`checkout.create_account`). Removed: the checkout email-code pages (`/checkout/access`),
    `VerifiedAccountCheckout`, `SignInWithCheckoutCode`, and the marketing-consent checkbox and
    the password and "create an account" fields at checkout. The contact section shows the
    account's email read-only, and the order always goes to that email.
  - Removed: the track-order page and its emailed code (`/track-order`, `OrderAccessChallenge`,
    `GuestOrderCode`), the confirm-payment lookup form, `LinkGuestOrders`,
    `Order::wasPlacedAsGuest()` and the `placed_as_guest` and `checkout_account_requested` order
    meta.
  - `/order/{key}`, its pay, invoice, cancel and quote pages and `/confirm-payment?order={key}`
    open only for the order's signed-in account (`Orders\OrderAccess`): a visitor is sent to sign
    in and comes back, anyone else gets 404. The gateway return (`/order/{key}/payment/return`)
    still checks the payment for anyone, then sends a visitor to sign in and on to the order.
  - Order emails link to the account's order page (`/account/orders/{id}`).
  - A customer without an account now exists only when staff create a manual order for an email
    (Orders → New). Those orders join the account once someone signs in with that address
    verified.

  **Published storefront templates**

  - The account sign-in templates are gone: `account/login`, `register`, `code`,
    `forgot-password`, `reset-password`, `profile`, `navigation`, `announcement`,
    `announcement-banner`, and `checkout-access` and `track-order`. Delete your copies; the
    account package's views are published with `--tag=sunrice-account-views`.
  - Account pages fill `@section('commerce-account')` instead of `@section('account')`;
    `account/layout` now extends the account package's layout.
  - The checkout partials no longer get `$guest`, `$offerAccount`, `$accountRequired` or
    `$verifiedCheckoutEmail` (`checkout`, `checkout/contact`, `checkout/shipping-address`,
    `checkout/submit`). `confirm-payment` has no lookup form, and `order` no longer gets
    `$invite` or `$registerUrl`.

- Security: a download that is an external link only redirects to an http(s) address. Links are
  already checked when a product is saved; `/downloads/{token}` now also answers 404 for any
  other scheme (a link stored before that check, or written to the database directly), before
  the download is counted.

- **Changed:** a gift card bought with a discount is worth what was paid for it, not its price
  before discounts. It used to be issued at the higher of the regular and the paid price, so a
  voucher, pricing rule or sale price on a gift card was a repeatable gain once the code was
  redeemed for points. Each unit's code is now worth its share of the line's total after
  discounts; a line discounted to nothing issues no code. Codes already issued keep their value.

- A payment made at the gateway after its payment was cancelled here is no longer ignored. A
  customer who chose another method on the pay page and then paid on the gateway page they had
  left open, or who paid after the order was cancelled by them or by staff, had their money taken
  with nothing recorded. A `cancelled` payment now accepts `paid`: on an open order it counts
  towards the order (timeline note, other open payments cancelled once paid in full); on a
  cancelled order it goes the "paid after cancellation" way (`PaymentAfterCancellation`,
  `staff_paid_after_cancel`). New translation `orders.timeline.paid_on_cancelled_payment`.

- Security: creating a manual order as already paid (Orders → New, and the `commerce_create_order`
  AI tool) now needs `commerce.payments.verify`, the permission "Mark as paid" takes. Staff with
  only `commerce.orders.create` could record a payment that way; they now create the order unpaid.
  Give `commerce.payments.verify` to roles that take payment at the counter.

- Privacy: a signed-in customer's cart is no longer reachable by its cookie alone. After signing
  out, the next visitor on that browser (or another customer signing in there) used to get the cart
  with the name, phone and address typed at checkout; it now waits for its owner to sign in again.
  Guest carts are unchanged.

- Security: an account that was registered but never verified loses the password it was registered
  with when its email is first proven another way (a sign-in code, a checkout code, Google). Anyone
  can register someone else's address, so that password wasn't the owner's to trust; the owner sets
  a new one from My Account without the current one. Verified accounts and staff are unaffected,
  and following the verification link keeps the password as before
  (`Customers\Auth\ConfirmMailbox`).

## 0.4.0 (2026-11-21)

**Upgrading from 0.3**: needs Sunrice 0.8. Run
`composer require sunrice/commerce:^0.4 sunrice/admin:^0.8 sunrice/cms:^0.8 -W`, then
`php artisan migrate` (gift cards, gift card recipients, variants without a price),
`php artisan commerce:publish-assets`, `php artisan sunrice:sync-permissions` and
`php artisan commerce:seed-roles` (the new `commerce.gift-cards.manage` permission). If you published
storefront templates, compare them with the package's: the cart line, checkout contact and submit,
buy button, order items, payment methods, points, totals and compare table templates changed, and
`checkout-access` and `checkout-payment-check` are new (see
[Upgrading](docs/upgrading.md#published-templates)). Update `sunrice/commerce-biteship` to 0.3 at
the same time.

- Gift cards can go straight to someone: the product form takes an optional recipient name, email
  and message (line meta `gift_card`), and once paid each code is emailed to them
  (`gift_card_received`), with a copy to the buyer. Staff can resend it. Migration
  `add_recipients_to_commerce_gift_cards`.

- Requires Sunrice 0.8 (`sunrice/admin` and `sunrice/cms` `^0.8`). Upgrade with
  `composer require sunrice/commerce sunrice/admin:^0.8 sunrice/cms:^0.8 -W`.

- Fix: the storefront's `commerce` guard took its user provider from `sunrice-admin.guard`, a config
  key that doesn't exist, so it always used the `web` guard's provider. It now uses the provider of
  the panel's guard (`$panel->guard()`), so a panel on a guard of its own shares its users with the
  shop.

- Gift cards as loyalty points: a product can be a **Gift card**. Paying for it issues a code per
  unit (emailed, `gift_card_issued`) that a customer redeems once in My Account → Points for points
  worth its value. Staff see, make and disable codes in Shop → Promotions → Gift cards
  (`commerce.gift-cards.manage`). Settings → Loyalty → Gift cards sets how long codes can be
  redeemed and how long their points last, apart from earned points. Migration
  `create_commerce_gift_cards_table`. The starter store's digital gift card now works this way.

- Tests: `phpunit.xml` raises PHP's memory limit to 1G, so `composer test` runs the whole suite
  without `-d memory_limit`, and `pest --parallel` is reliable: the template publishing tests write
  into an app folder of their own (`TestCase::isolateAppFolder()`).

- Vouchers: **Only with payment methods** and **Only with shipping methods** are searchable
  multi-selects instead of comma-separated text (comma-separated input is still read).
  `commerce_choices` gains the `payment_methods` source.

- Price on request: a variant's price can be left empty (`price` is now nullable; migration
  `allow_variants_without_a_price`). Customers who can't see prices, or products without one, can go
  into the cart when checkout can become a quote request (Quotation mode or **Customers can also
  request a quote**). Such a cart shows no prices or totals and is always sent as a quote request;
  the quote shows "To be quoted" until staff price it, and an unpriced line must be priced before the
  quote is sent. Without a quote path the cart refuses them as before.

- Checkout: in Online store mode, **Customers can also request a quote** (`checkout.quote_requests`:
  everyone, or only some customer roles) adds **Request a quote instead** below Place order. The same
  cart goes through the existing quote flow (staff price it, the customer accepts it into an order);
  My Account → Quotes shows whenever quote requests are possible.

- Fix: the header cart count counted lines that can't be bought now (for example after the store's
  button changed from Add to cart), so it showed items while the cart page was empty. It now counts
  what the cart shows; those lines stay saved for when they can be bought again. The cart notice
  names the product (":Product can't be bought online right now.").

- Settings → Catalog: **Default storefront button** moved to the top card and defaults to **Add to
  cart** (`catalog.default_purchase_mode` = `cart`, the same behaviour as the earlier `default`).

- Store address: optional **Map coordinates** (pasted as "latitude, longitude"), and a separate
  **Shipping origin** when **Ship from the store address** is off. Invoices keep the store address;
  `ShippingOrigins::store()` returns the origin and `ShippingOrigins::storeAddress()` the store
  address.

- Fix: the weight and dimension unit settings now apply. The product editor shows and takes
  weights and sizes in them (stored values stay grams and millimetres, so changing a unit converts
  nothing), and the storefront compare table shows weights in the weight unit.

- Tax rates: one rate can apply to several countries, and in Indonesia to several provinces and
  cities, chosen from searchable lists. It is saved as one row per place, and the form shows those
  rows as one rate again. The earlier `region` input still works.

- Settings → Emails: the customer and staff lists fold away (remembered per browser), say how many
  of their emails are sent while folded, and can be expanded or collapsed together.

- Checkout: **Who can check out** (`checkout.access`) replaces the verified-account, guest and
  account switches with one choice: `guest`, `guest_verified` (new), `account` or
  `verified_account`. With `guest_verified`, shoppers confirm their email with an emailed code and
  check out as guests, with no account made unless they ask for one. **Accounts at checkout**
  shows only for the guest choices. Existing stores keep their behaviour until the setting is
  saved.

- Loyalty: **Maximum points per order** (`loyalty.max_points`) caps what one order earns. The
  points page tells customers the cap.

- Courier presets can be managed in Settings → Shipping → Edit couriers: rename, change tracking
  links, switch off, remove, reorder and add couriers. The presets in config and from
  `Commerce::registerCourier()` are the starting list. `Couriers::all()` now includes `active`;
  `Couriers::offered()` lists the ones switched on.

- Email settings: the subject, heading and text show their default wording (an unchanged default
  isn't stored, so it keeps following translations), placeholders are chips that insert at the
  cursor, and copy, staff address and role recipients are chosen as chips. The order received email
  attaches the invoice by default when the customer pays by transfer, QRIS or another manual method
  (`invoice_to_pay`); the payment link email attaches it by default, and order completed can.

- Payment method settings: countries, provinces, shipping method types and customer roles are now
  searchable multi-select dropdowns (new `commerce_choices` field type) that also accept values
  not in the list. Payment method and email settings pages link back to their list in the
  breadcrumbs and header.

- Redesigned the store dashboard with clearer period comparisons, highlighted total sales,
  and tables for top products and recent orders. Today compares directly with yesterday.

- Added optional media library logos to each payment method’s checkout and pay-page rows.

- Added support for cancellable hosted checkout sessions. Shoppers can return to their saved
  checkout before they start payment. Confirmed pending and paid transactions place the order.

- Added an opt-in verified-account checkout with an emailed code, automatic account creation after
  email verification, and a password sign-in option for returning shoppers. See
  [Verified-account checkout](docs/checkout.md#verified-account-checkout).

## 0.3.1 (2026-11-19)

A fix for orders with more than one payment. Update with `composer update sunrice/commerce`; nothing
else to run.

- Fix: the newest payment of an order is used where it should be. `Order::payments()` is ordered by
  id, so `->latest('id')` on it still returned the oldest payment: the gateway return checked an
  earlier payment after the customer switched method or paid a deposit's balance, and Mark paid,
  refunds via the gateway and payment confirmations could pick an older payment. Refunds were also
  spread over the payments oldest first instead of newest first. They now use
  `->reorder('id', 'desc')`.

## 0.3.0 (2026-11-19)

**Upgrading from 0.2**: still on Sunrice 0.7. Run `composer require sunrice/commerce:^0.3 -W`, then
`php artisan migrate` (deposits, cart line keys, confirmation reminders, product presentation
fields), `php artisan commerce:publish-assets`, `php artisan sunrice:sync-permissions` and
`php artisan commerce:seed-roles` (the new `commerce.products.export` and
`commerce.reviews.manage` permissions). If you published storefront templates, compare them with
the package's: account, cart, checkout, order, product and `track-order` templates changed (see
[Upgrading](docs/upgrading.md#published-templates)). Update the gateways at the same time:
`sunrice/commerce-midtrans` and `-xendit` 0.1.2 and `sunrice/commerce-biteship` 0.2.0 accept
commerce 0.3.

**Behaviour changes to check.**

- **Order pages need ownership or verification**: an account's orders open for its owner only; a
  guest's order opens in the checkout browser for an hour, then after an emailed code on Track
  order. Links in emails go through Track order. A customer returning from a payment gateway
  without access has the payment checked, then is asked to verify or sign in.
- **Product CSV exports need `commerce.products.export`** (they include internal cost); reviews
  need `commerce.reviews.manage`. Sync permissions and reseed roles after upgrading.

**Highlights.**

- **Deposits**: an extension asks for part of the total at checkout and the balance by a due date,
  with reminders and an overdue notice (`DepositPaid`, `BalanceOverdue`).
- **Branches**: ship from another origin (`Commerce::shippingOriginUsing()`), limit staff to their
  orders (`Commerce::scopeAdminOrders()`), extension catalog filters and line details.
- **Payments**: gateway amount mismatches are noted on the order; staff are reminded of waiting
  payment confirmations.
- **Storefront**: catalog table view, product image carousel and video, reusable product
  specifications, FAQ and size guides, a points balance with expiry and history, an account
  announcement, and individually overridable checkout, cart, product, account and order sections.

- Note on the order's timeline when a payment gateway reports a paid amount that isn't the
  payment's (once per amount; the payment stays unpaid), so staff see it without the webhook log.
  Gateway packages built on `GatewayMethod` (Midtrans, Xendit) get it without changes.

- Record a gateway return even when the customer can't open the order there (a guest whose access
  lapsed while paying, or who came back in another browser), then send them to verify the order
  or sign in instead of a not-found page. The published `track-order` template now shows flash
  messages.

- Share the empty cart message and Continue shopping link with the cart drawer, and hide its checkout actions when empty.

- Make checkout, cart, product, account, and order sections individually overridable and load an optional app CSS skin.
- Select the first available delivery option when checkout has no valid delivery selection, keeping store pickup explicit.
- List payment confirmations in the standard admin table and reuse the review dialog in order detail.
- Put available order status changes in a visible action in the order header.

- Let apps override the bulk pricing presentation through its own Blade partial.

- Use icon-only catalog view links and offer a separate Blade override for the table columns.

- Keep Apply visible while catalog filters scroll, and offer a paginated table beside the grid view.
- Make Store settings sections visible in a vertical menu and open the Shop overview for shop managers.
- Identify saved bundle components that can no longer be sold and withhold incomplete price totals.
- Show shipping zones that are wholly or partly covered by earlier zones. Put the regional starter zone first.
- Show store defaults and active pricing rule links on category and brand editors in CMS versions that support editor presentation.

- Reuse storefront collection and taxonomy records and preload category banners with other home media.

- Default downloadable variants to one unit per order and name saved checkout addresses from the
  street when the shopper leaves the title blank.

- Default the variant option name to the selected taxonomy title.
- Show product and variant images in one carousel with thumbnails and a lightbox. Selecting a
  variant opens its image in the carousel.

- Require a dedicated permission for product CSV exports, which include internal cost. Sync
  permissions and reseed the default shop manager role after upgrading.
- Authenticate Commerce admin requests before resolving order and customer models.
- Keep region API responses private to the browser and send the JSON no-sniff header.
- Warn when dated reports may be stale due to a missing queue heartbeat.
- Batch image queries on the starter homepage and product page, reject unreadable payment
  images, and return successful reviews to their product page.
- Show a localized stock message if inventory changes while placing an order or accepting a quote.

- Group product settings separately from content. Reuse specifications, questions and size guides
  across store, category and brand defaults. Product editors can override or hide sections.
- Reorder product images in the CMS and add a local or external product video. Existing product
  blueprints pick up the new controls after migrations run.
- Downloadable items skip shipping, including existing items with a legacy shipping flag.
- Hide the live search results link when there are zero matches.
- Require a positive cart quantity and keep item removal on the separate trash action.

- When a guest checks out with an existing verified account's email, open the new order and
  payment pages in the checkout browser and offer email-code recovery through Track order.

- Preselect the first available payment method at checkout and include its fees in the initial total.

- Show a localized product count and a results link after a one-second pause in storefront search.

- Share a compact payment panel between the confirmation and account order pages. Simplify the
  return form and surface the share link above the Wishlist products.

- My Account opens Orders, with compact filters, a collapsible date range, and a back link from
  order details. Points has a balance summary, expiry and history. Staff can publish a localized
  announcement as the first tab or above or below account content. Update published account
  templates and the starter stylesheet to pick up the changes.

- Only verified buyers can submit storefront reviews. Staff can add a review linked to a buyer's
  paid order and edit or delete reviews in Shop → Products → Reviews.

- Keep the sticky product purchase panel within the product gallery and details so it clears the
  review form and related products. Update the published product template and starter stylesheet.

- Continue shopping links in Compare, Wishlist, Cart, and order confirmation share a Catalog
  setting. Automatic uses the localized catalog with a homepage fallback. Staff can choose a
  published CMS page or collection listing.

- Add space inside the scrollable catalog sidebar so checkbox borders and keyboard focus rings
  stay visible when zoomed.

- New checkout addresses can have an editable title. The checkout uses the title in the address
  picker and keeps it when the customer saves the address to their account.

- Show the voucher field directly before payment in a dedicated checkout panel. Order notes use
  the storefront’s accordion styling.

- Require order ownership or a verified guest session for storefront orders, payment pages,
  invoices and quote actions. Guests can verify their email with a short-lived one-time code.
  Update the published track-order template when upgrading.

- Product buttons inherit across Store, Category, Brand, and Product. The product editor shows
  the inherited action and its source, and cart eligibility uses the same rule.
- Flash Sale separates product selection, pricing and quantity limits. A rule now applies to
  every selected product and variant.

- Keep Shop → Products selected in the product editor. Align labels and controls across the
  editor and let permitted staff record stock adjustments there without saving the product draft.

- Wishlist and Compare confirmations include shortcuts to their pages. The starter header
  also links to Compare. Merge the updated storefront templates and theme assets into published
  copies and include the new `partials/collection-button.blade.php` partial.

- Storefront buttons use tighter padding. Secondary actions in grouped controls use a link style,
  including Cancel in the cart and checkout dialogs. Merge the changed storefront templates and
  theme assets into published copies.

- The product page keeps quantity and Add to cart within reach when the original controls are
  outside the viewport. Add-to-cart confirmations appear at the top. Merge the updated buying
  and variant picker partials and storefront theme assets into published copies.

- Cart items use denser rows, with a trash icon and a confirmation dialog before removal.
  Merge the updated cart and icon partials, storefront translations and theme assets into published copies.

- The add-to-cart success toast includes a shortcut to the cart. Merge the updated
  `partials/add-recovery.blade.php` and storefront theme assets into published copies.

- Shoppers can apply or remove vouchers before payment in checkout. Selecting pickup keeps the
  delivery address and courier options available. If automatic recalculation fails, **Update total**
  submits the current selections. Merge the updated checkout, cart and checkout partials, the new
  `partials/checkout-vouchers.blade.php`, checkout translations and theme assets into published copies.

- Password sign-in, password-reset requests and final checkout submissions support the configured
  Sunrice captcha. Merge the three form templates, `partials/captcha.blade.php` and the storefront
  script into published copies.

- Delivery collects the recipient name and phone with the shipping address. Checkout uses a
  compact saved-address selector, an Add address link and a collapsible notes field. Merge
  `checkout.blade.php`, the new `partials/checkout-contact-fields.blade.php`, checkout translations
  and the storefront theme assets into published copies.

- Back-in-stock alerts follow the selected variant, and the product's Add to cart button has more
  padding. Merge the product buying, stock, stock-alert and variant-picker partials and theme CSS
  into published copies.

- Checkout shows an address summary and lets shoppers pick a saved address or enter a new one in a
  dialog. Merge the updated `checkout.blade.php`, checkout translations and storefront theme assets
  into published copies.

- The option to pay with loyalty points now sits next to the payment methods at checkout. The
  cart shows the order before payment choices. Merge your published `checkout.blade.php`,
  `partials/cart.blade.php` and the checkout and account translations to show the new option.

- My Account now opens the address form on demand and shows saved addresses in expandable rows.
  The order history supports search by order number or product name, an order status filter and
  an inclusive date range, with filters preserved between pages. If you maintain published
  storefront copies, merge `account/addresses.blade.php`, `account/orders.blade.php`,
  `commerce.css` and the new account translation keys. See
  [Published templates](docs/upgrading.md#published-templates).

- Checkout totals follow the billing address when the shopper unchecks the shared address. Payment
  methods appear if shipping makes a free cart payable. Choosing a saved address updates its region
  codes and clears any optional fields missing from that address.

- Checkout labels totals as estimated before shipping is selected, and preserves the latest selections while refreshing.

- The add-to-cart form links customers to their cart if the response is interrupted. For published
  storefronts, merge the updated checkout and address partials, `commerce.js` and the
  `partials/add-recovery.blade.php` notice. See [Theme assets](docs/templates.md#theme-assets).

- The load-test seeder uses the current Sunrice CMS APIs. The workbench build publishes the
  Sunrice Admin assets for the demo. See [Load testing](docs/commands.md#load-testing-the-package).

- **The product import can create products**: tick "Create products for SKUs no product has" and rows with new SKUs and a `product` title become products (rows with the same title one product with variants by `variant`, named by `option`; `category` by name or slug), as drafts or published.
- **Nothing stays held after a cancellation**: if giving back a cancelled order's stock, sale quantities, vouchers or extension reservations fails, `commerce:tick` tries again (30 days). **Confirmations waiting for review** are sent to staff again after `checkout.confirmation_reminder_hours` (24). Run `php artisan migrate` (`commerce_payment_confirmations.reminded_at`).

- **Shipping origins**: `Commerce::shippingOriginUsing()` lets an extension quote a cart's rates from another address than the store's (a branch); the order keeps it, `Order::shippingOrigin()` returns it for carriers. `Address` gains `latitude` and `longitude`.
- **Order scopes for staff**: `Commerce::scopeAdminOrders()` limits the orders a staff member sees in the admin (list, export, bulk actions, dashboard, customer page, payment confirmations); orders outside it are not found.
- **Catalog filters**: `Commerce::registerCatalogFilter($key, $read, $apply)` adds a filter of an extension's to product listings, search and facet counts, read from the query string; `ProductQuery::filter($key, $value)` sets one in code.

- **Deposits**: an extension's calculation stage can ask for a deposit (`CalculationState::$deposit`). The order is paid in two parts: the deposit at checkout, the balance on the pay page by `balance_due_at`. New payment status **Partially paid**, events `DepositPaid` and `BalanceOverdue`, emails `balance_reminder` and `staff_balance_overdue`, and the setting Checkout → "Remind of an unpaid balance". `OrderPaid` still fires once, when the total is paid. Run `php artisan migrate` (`commerce_orders.deposit_total`, `balance_due_at`). See [payments.md](docs/payments.md#deposits).
- **A cart line is a variant and its meta.** `AddToCart::handle($variantId, $qty, $meta)` with other
  meta adds another line of the same variant (a rental on other dates, say); the same meta adds to
  its line. Lines without meta merge by variant as before. Stock and quantity rules count all of a
  variant's lines, and signing in merges by variant and meta. Run `php artisan migrate`
  (`commerce_cart_items.line_key`).
- **Line details**: `Commerce::describeLinesUsing()` turns a line's meta into short lines shown under it in the cart, at checkout, on the order page, in emails, on documents and in the admin (`OrderItem::details()`).

## 0.2.0 (2026-11-07)

**Upgrading from 0.1**: commerce now needs Sunrice 0.7. Run `composer require sunrice/commerce:^0.2 sunrice/admin:^0.7 sunrice/cms:^0.7 -W`, then `php artisan migrate` (the webhook tables) and `php artisan sunrice:assets`. Update the gateways at the same time: `sunrice/commerce-midtrans` and `-xendit` 0.1.1 and `sunrice/commerce-biteship` 0.1.0 accept commerce 0.2.

**Highlights.**

- **Outgoing webhooks**: signed, queued, retried and logged, for orders, shipments and stock.
- **The admin matches the panel**: page headers, menus and widths are the panel's. Settings sections are tabs, and nothing shifts while a page loads.
- **Forms fold and sum themselves up**: cards show a one-line summary when folded, with Expand all / Collapse all. Groups are headings, repeater rows fold, and text in each language goes in language tabs.
- **Products show once in the sidebar**, under Shop. With several product collections, New product asks which one.
- **The order timeline reads in each reader's language.**

- **Forms fold and sum themselves up, as the panel's do**: a folded card (Settings, vouchers,
  pricing rules, flash sales, shipping, payments) says in one line what it holds. Forms with two or
  more cards get Expand all / Collapse all. A group is a small heading with a rule, not another
  label over a box. Repeater rows (bank accounts, price tiers, pickup locations, weight tables) fold
  to a one-line summary; new rows and rows with errors stay open. Text in each language (payment
  titles and instructions, shipping method titles, email subjects, WhatsApp messages) is in language
  tabs instead of one input per language. The region picker uses the panel's Select. The six
  copies of the per-language builder are now one, `SchemaForm::perLanguage()`; see
  [Extending](docs/extending.md).

- **Products and their taxonomies show once in the sidebar**: with Sunrice 0.7 (now required), the
  product collections and the product categories, brands, tags and attribute taxonomies are listed
  only under Shop → Products (`ContentNavigation::listElsewhere()`), not again under Content and
  Taxonomies; the attribute taxonomies (Settings → Catalog) join that submenu. With several product collections, **New product** asks which one, offering only those the user may add to.

- **The order timeline reads in each reader's language**: entries were written once, in the store's
  language, so an English admin read "Status berubah dari Diproses ke Selesai". Commerce now records
  what it says as an `Orders\TimelineText` (`Timeline::text($key, $replace)`, with labels as nested
  texts and `->then()` for tracking numbers and reasons), kept with the entry and translated when the
  admin order page or the AI tools read it (`OrderEvent::text()`); notes people wrote stay as they
  are, and entries recorded before keep their text. Return, download and payment link entries have
  translations of their own now.

- **The admin looks and works like the rest of the panel**: Shop pages use the panel's page header
  (the title in its display style, one primary action, the rest in a "⋮" menu, a back button), the
  panel's width and spacing (lists, dashboards and order pages full width; forms at the forms'
  width, left-aligned) instead of their own padding and centred columns, and the panel's lists (a
  search box, `Status: all` filters with the rest under "More filters", a Columns menu, the table in
  a card with its pages at the foot, rows that open when clicked). Forms put Save in the header and
  warn before leaving with unsaved changes, lay out in titled cards that fold away, with fields side
  by side and shown only when they apply (the CMS's `width` and `condition`, plus a field's
  `section`; vouchers, pricing rules, flash sales and Settings → General use them), and use the
  panel's selects and checkboxes. Store settings show their sections as tabs, so one menu stays at
  the side. On an order, the status badges sit by its number, its next steps are buttons and the
  rest (customer view, edit items, refund, cancel, trash) is in the "⋮" menu. The Shop group comes
  first in the sidebar and its dashboard is called Overview. The dashboard's loading placeholders
  are as large as what replaces them, so nothing moves while it loads.

- `webhooks` module (off by default): Settings → Webhooks (`commerce.settings.webhooks`) sends
  orders (`order.placed`, `order.paid`, `order.status_changed`, `order.cancelled`,
  `order.completed`, `order.refunded`), shipments (`shipment.created`, `shipment.delivered`) and
  stock changes (`stock.low`, `stock.out`, `stock.back_in`) to endpoints as signed JSON POSTs,
  queued after the change is saved, retried for about 11 hours and logged; endpoints that keep
  failing are switched off. Public HTTPS addresses only. Config `commerce.webhooks.*`; new tables
  `commerce_webhooks` and `commerce_webhook_deliveries`. See [docs/webhooks.md](docs/webhooks.md).

## 0.1.0 (2026-11-06)

The first release, for `sunrice/admin` and `sunrice/cms` 0.6. Until 1.0, minor versions (0.2, 0.3…) may change
the public API; each change is listed here with the steps to take. Commerce is a plugin for the Sunrice panel (`sunrice/admin`) and CMS
(`sunrice/cms`), on PHP 8.4 and Laravel 13: products are CMS entries edited in the CMS's entry
editor, the store's admin pages live in the panel under Shop, and the storefront renders through
the CMS's templates and full-page cache.

### Fixes
- `commerce:install` stops with instructions when the app has no Sunrice panel or the panel
  doesn't have `CommercePlugin`, instead of failing on the store structure with "The selected
  type is invalid". The quick start runs `sunrice:install --plugins` first.

### Loyalty points
- `loyalty` module (off by default, Online store mode): a points wallet on each customer account
  (1 point is 1 unit of the store's currency). Settings → Loyalty sets one store-wide rule (a
  percentage of the products after discounts, products to include or leave out, a minimum order,
  an expiry in days); completed orders earn and refunds take back their share. Signed-in customers
  pay with their points in the cart, after tax, up to the balance (a new last calculation stage,
  `Loyalty\Loyalty`, and `totals.points`); points are taken when the order is placed, given back
  when it's cancelled, and refunds beyond the money paid go back onto the wallet. My Account →
  Points; Shop → Customers → Loyalty points (`commerce.loyalty.manage`) to see and adjust balances;
  expiry in `commerce:prune`. New column `commerce_customers.loyalty_points` and table
  `commerce_loyalty_transactions`.
- Refunds lock the order while they're worked out, and send only the money part to the payment
  provider.

### Returns
- `returns` module (off by default): customers request returns of completed orders within
  `checkout.returns_days` from My Account (items, quantities, reason, details); staff review them
  in Shop → Orders → Returns (`commerce.returns.manage`) with a note emailed to the customer; the
  "Return requested" (staff) and "Return updated" emails; entries on the order's timeline. New
  tables `commerce_returns` and `commerce_return_items`.

### Product CSV
- Shop → Products → Export CSV (every variant) and Import CSV: bulk price, compare-at price, cost,
  stock, weight and active changes by SKU, previewed with every change and every unusable row before
  they apply, through the product field (live value and draft) and stock movements ("import").

### Product feeds
- `product_feeds` module (off by default): `/feeds/products.xml` for Google Merchant Center and
  Meta catalogs (RSS 2.0 with `g:` fields), one item per buyable variant at the price the product
  page shows; its address on the Store health page.

### Back-in-stock alerts
- `stock_alerts` module (needs Stock tracking): "Email me when it's back" on sold-out products and
  variants, the "Back in stock" store email sent once by `commerce:tick` when the variant can be
  ordered again, customers waiting per variant in Shop → Inventory, pruning and anonymisation. New
  table `commerce_stock_alerts`; `Notifications\Notifier::sendTo()` sends a store email to an
  address of its own.

### Reviews
- Product reviews and ratings (`reviews` module): a 1–5 star rating and text on the product page
  (`<x-commerce::reviews>`), verified purchases, who may review and whether reviews need approval
  (Settings → Store → Catalog), moderation and replies in Shop → Products → Reviews
  (`commerce.reviews.manage`), the rating on cards and in the product's JSON-LD
  (`aggregateRating`), a honeypot, captcha for guests and a rate limit, and anonymisation with the
  customer. New table `commerce_reviews`; `commerce_products` gets `rating_count` and
  `rating_average`.

### Starter theme
- `commerce:install --starter` (tag `commerce-starter`) publishes a complete shop: the storefront
  templates plus Sunrice's layout, a sticky header with a department mega menu (a drawer on phones),
  product search, account, wishlist and cart icons, a footer, the home page (hero, category tiles,
  flash sale with countdown, new arrivals, best sellers, brands), content pages, search results
  and a 404 page.
- The storefront theme is restyled in a clean, product-first look and its templates gained:
  breadcrumbs, a product gallery with thumbnails, colour swatches in the variant picker, on cards
  and in the filters (from a colour term's `swatch` field), size boxes, collapsible product
  details, bundle contents and digital delivery details, upsells; a listing layout with a filter
  column (a drawer on phones), a category tree, active-filter chips, product counts and empty
  states; a two-column cart and checkout with step indicator, line images and a sticky summary;
  a thank-you page; account pages, sign-in with a "new customer" panel, wishlist add-to-cart.
  New partials: `listing`, `active-filters`, `product-extras`, `breadcrumbs`, `empty`,
  `pagination`, `icon`. Slots, `data-commerce-*` hooks and class names are kept.
- `commerce.css` uses design tokens (`--commerce-fg`, `--commerce-accent`, `--commerce-font`…);
  `commerce.js` adds the menu and filter drawers, quantity steppers and gallery thumbnails.
- Invoices, packing slips, quotations and store emails share the look.
- `StarterStoreSeeder` (`--starter --demo`): an apparel store with about 50 products, variants,
  placeholder artwork, bundles, digital products, promotions, shipping, payments, pages, menus and
  a demo customer (`customer@example.com` / `password`) with orders and a wishlist.

### Store
- Products as Sunrice entries with a Product data field: simple, variable (up to 3 options),
  bundle and digital products; external links and calls to action (WhatsApp, inquiry, shop links);
  stock with backorders, low-stock alerts and history; brands, categories, tags and attribute
  taxonomies with filters; wishlist and compare.
- Pricing pipeline: tier prices, pricing rules by audience, flash sales with caps and per-customer
  limits, vouchers and automatic discounts (percent, fixed, free shipping, buy X get Y), taxes,
  fees and staff overrides.
- Cart (guest and signed in, merged at sign-in), checkout for four selling modes (online store,
  quotation, WhatsApp order, catalog), Indonesian addresses down to the village, and a totals check
  so customers never pay a price they didn't see.
- Orders and quotes with a state machine, timeline, manual orders, editing unpaid orders,
  shipments, refunds, numbering formats, expiry of unpaid orders, and invoices, packing slips and
  quotations as PDFs.
- Payments: bank transfer with unique codes and payment confirmations, payment instructions
  (QRIS and others), cash on delivery, and the gateway contracts with signed, idempotent webhooks.
- Shipping: zones over Indonesian regions, flat, weight-based, free and pickup methods, courier
  presets and tracking.
- Customer accounts: password, emailed sign-in codes and Google; orders, quotes, downloads,
  addresses and deletion requests; anonymization for staff.
- Taxes by shipping, billing or store address, with prices shown including or excluding tax.
- Emails for every order event, editable in Settings → Store → Emails, with the store logo and
  brand color.
- My Account overview with recent orders and quick links; terms and captcha at registration.
- Everything the store needs in the admin's Shop group: products with their categories, brands
  and tags, and Store settings.
- Hidden copies of customer emails; `Commerce::emailTemplate()`, `emailTheme()` and
  `documentTemplate()` replace email bodies, the email frame, account emails, invoices, packing
  slips and quotations with a site's or package's own views.
- Customers admin with filters by role, orders, spending and sign-up date, and CSV export.
- Analytics: daily statistics, a dashboard with KPIs, a sales chart and to-dos, eight reports with
  CSV export, and view and click tracking without personal data.
- 23 store tools for AI agents on Sunrice's MCP server; refunds, payment reviews, cancelling,
  store features and price-changing saves need `confirm: true`.
- Storefront templates (publishable), Blade components, slots, SEO (JSON-LD, canonical URLs,
  noindex on private pages) and query budgets guarded by tests.

### For developers
- The `Commerce` registration API, contracts for payments, shipping, pricing (including
  `ReservesDiscounts`), checkout completions, inventory, taxes and documents, events, and
  `window.SunriceCommerce` for the admin; documented in `docs/extending.md`.
- `Payments\Methods\GatewayMethod`, the base for redirect gateway packages
  (`sunrice/commerce-midtrans`, `sunrice/commerce-xendit`): sandbox keys from `.env`, a payment
  page created once per payment, status checks on return, and the amount checked against the
  payment.
- `commerce:install [--templates] [--demo]`, `commerce:doctor`, `commerce:stats` and the other
  commands in `docs/commands.md`.
- Documentation in `docs/`.
- Template helpers `commerce_values($entryOrTerm)` (a CMS entry translation's or term's field
  values, worked out once per request) and `commerce_body_classes()`; see `docs/helpers.md`.
- `ProductView::$variants` (the picker rows) is built the first time it's read, and the variants'
  option values load then, in one query for the page. Listing cards, cart lines and checkout no
  longer build a row per variant, which made pages of products with many variants slow (24
  products with 100 variants: about 550 ms to 190 ms on SQLite; a 200-line cart about 870 ms to
  470 ms; `COMMERCE_BENCH=1 vendor/bin/pest tests/Feature/Catalog/ProductViewBenchmarkTest.php`). The rows, `variantsJson()`, `jsonSerialize()` and the JSON-LD `offerCount` are
  unchanged. `ProductView`'s constructor and `with(variants: …)` also take a closure that builds
  the rows.

### Marketing emails
- New `marketing` module (off by default): email campaigns to customers who accept marketing, with
  audience rules (days since the last order, recent buyers, new customers, spending, products
  bought, location, engagement…) and a live count; automations with templates (abandoned cart,
  welcome, no first order yet, after an order, win back); texts per language with smart tags,
  preview and test sends; open and click tracking with per-link results; one-click unsubscribe.
  Sent by queued jobs in batches (`commerce.marketing.*`). Permission `commerce.marketing.manage`;
  run `php artisan migrate` and `php artisan commerce:seed-roles` (Shop Manager gets it). See
  [docs/marketing.md](docs/marketing.md).
- `Commerce::registerMarketingTrigger()` adds automation triggers from packages.

### Fixes
- CSV exports (orders, customers, reports) write text that starts like a formula as plain text, so a
  customer's name can't run in Excel or Sheets.
- Changing or resetting a storefront password signs out "remember me" on other devices, and
  changing the email needs the current password. Sites that published `account/profile.blade.php`
  need its new `current_password` field (`php artisan vendor:publish --tag=commerce-templates`, or
  copy it in).
- The customer page only gives or takes away roles with less access than the staff member's own
  (Sunrice's permission ranking); other roles the account has are kept.
- The Shop Manager role gets `sunrice.guide.view` (run `php artisan commerce:seed-roles`).
- Full-page cache: product, shop and product term pages are cached for anonymous visitors for
  `commerce.cache.product_pages_ttl` seconds (300), and cleared when a product sells out, runs
  low or comes back, and when prices change. Visitors with a cart, wishlist, comparison or
  customer account are never served a cached page, so they don't see someone else's header or an
  empty cart count. Needs Sunrice's `bypassPageCacheUsing()`; on older versions product pages
  stay out of the cache.
- A gateway payment confirmed after its deadline cancelled the order is recorded paid, but the order
  stays cancelled and isn't fulfilled (no downloads, invoice number or "payment received"):
  `PaymentAfterCancellation` fires and staff get the new `staff_paid_after_cancel` email.
- A gateway reporting less than the amount due no longer marks the order paid; the timeline notes it.
- A webhook that fails while recording gives its event id back, so the gateway's retry is processed
  instead of ignored as a duplicate.
- Cancelling, refunding with restock or editing an order returns the components a bundle was sold
  with, even after the bundle's contents changed.
- One payment or quote that fails to expire no longer stops the others in `commerce:tick`.
- Guest orders join an account only when its email is verified (or the account was made by that
  checkout), so registering someone else's address doesn't collect their orders.
- With the storefront sharing the admin's guard and Sunrice's two-factor login on, staff can't sign
  in with their password on the storefront (it skipped the code step).
- The SKU check, variant search and targets picker APIs check permissions (product editing, order
  editing, or managing vouchers, flash sales or pricing rules).
- Bulk packing slips are rendered 25 orders at a time (`commerce.documents.batch_size`) into one
  PDF, so 200 orders no longer run out of PHP's memory. Renderers can do the same by implementing
  `Documents\BatchRenderer`.
- A cart holds up to 500 different products (`commerce.cart.max_lines`); adding another is refused
  with a message (`cart_full`), on the add-to-cart form, the cart API, "Buy again" and the sign-in
  merge. More of a product already in the cart is still fine. The cart page shows 25 lines a page
  (`commerce.cart.per_page`, `?page=`) with the whole cart's totals, and the drawer and checkout
  summary list the first 10 (`commerce.cart.preview_lines`) and then "and 3 more". The cart JSON
  has `line_count`, and `GET {api}/cart?lines=10` lists only the first lines. Changed templates:
  `partials/cart`, `partials/mini-cart`, `partials/checkout-summary`, and the theme's `commerce.js`
  and `commerce.css`; published copies keep showing every line until updated.
