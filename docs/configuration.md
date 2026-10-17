# Configuration

Commerce has two kinds of settings:

- **Config** (`config/commerce.php`): how the package is wired into your app — paths, guards,
  disks, limits. Developers set these; they live in the code.
- **Store settings** (Settings → Store in the admin): how the store behaves — name, currency,
  checkout, taxes, payments, shipping, emails. The owner changes them; they live in the database.
  `defaults` in the config file gives their starting values.

Read either in code: `config('commerce.cart.cookie')`, `Commerce::settings()->get('checkout.minimum_order')`.

## Contents

- [Config keys](#config-keys)
- [Store settings sections](#store-settings-sections)
- [Number formats](#number-formats)

## Config keys

Publish the file with `php artisan vendor:publish --tag=commerce-config` (the installer does).

### catalog

| Key | Default | |
| --- | --- | --- |
| `catalog.collections` | `['products']` | Sunrice collections whose entries are products |
| `catalog.field` | `product` | The handle of the Product data field in their blueprint |
| `catalog.category_taxonomy` | `product_categories` | Feeds category pages and filters |
| `catalog.tag_taxonomy` | `product_tags` | |
| `catalog.brand_taxonomy` | `brands` | Brand pages and the brands index |
| `catalog.attribute_taxonomies` | `[]` | Extra taxonomies offered as variant option values and filters |
| `catalog.inquiry_form` | `product_inquiry` | The Sunrice form behind "Ask about this product" |
| `catalog.max_options` | `3` | Options per variable product |
| `catalog.max_variants` | `100` | Variants per product |

### auth

| Key | Default | |
| --- | --- | --- |
| `auth.guard` | `commerce` | The guard customers sign in with (registered by commerce, session based) |
| `auth.passwords` | `users` | The password broker for customer password resets |

### storefront

| Key | Default | |
| --- | --- | --- |
| `storefront.paths.*` | `cart`, `checkout`, `order`, `confirm-payment`, `track-order`, `quote`, `account`, `wishlist`, `compare`, `brands`, `flash-sale`, `downloads`, `go`, `commerce/api`, `commerce/webhooks` | URL segments of the store's pages (translated paths per language come from Sunrice) |
| `storefront.layout` | `sunrice.layouts.app` | The layout store pages extend when your theme has no `commerce` layout |

### cart

| Key | Default | |
| --- | --- | --- |
| `cart.cookie` | `commerce_cart` | The guest cart cookie |
| `cart.lifetime_days` | `30` | How long the cookie lives |
| `cart.prune_days` | `30` | Abandoned carts older than this are deleted by `commerce:prune` |

### downloads

| Key | Default | |
| --- | --- | --- |
| `downloads.disk` | `local` | Where digital product files are stored (keep it private) |
| `downloads.attachment_max_mb` | `10` | Files up to this size can be attached to emails |
| `downloads.max_upload_mb` | `512` | Largest upload in the product editor |

### payments

| Key | Default | |
| --- | --- | --- |
| `payments.proof_disk` | `local` | Where payment proofs are stored (private) |
| `payments.proof_max_kb` | `5120` | Largest proof upload |
| `payments.proof_retention_days` | `365` | Proofs older than this are deleted by `commerce:prune` |
| `payments.banks` | BCA, Mandiri, BNI, BRI, BSI, CIMB Niaga, Permata, Danamon, BTN, Jago | Banks offered for bank transfer accounts and confirmations (`key => name`) |

### shipping

| Key | Default | |
| --- | --- | --- |
| `shipping.volumetric_divisor` | `6000` | L×W×H (cm) ÷ this = volumetric weight (kg) |
| `shipping.couriers.*` | JNE, J&T, SiCepat, AnterAja, POS, Ninja, Lion, ID Express, GoSend, Grab | Courier presets for shipments: `key => ['name' => …, 'tracking_url' => '…{tracking}…']` |

### analytics and privacy

| Key | Default | |
| --- | --- | --- |
| `analytics.track_views` | `true` | Count product page views (no personal data) |
| `analytics.bot_user_agents` | `bot`, `crawl`, `spider`, … | Visits whose user agent contains one of these aren't counted |
| `privacy.ip_retention_days` | `365` | IP addresses (and user agents) on orders, download logs and payment confirmations are cleared after this many days by `commerce:prune` |

### defaults

`defaults.<section>.<key>` are the starting values of the store settings below, for example
`defaults.general.currency.code` (`IDR`) or `defaults.checkout.quote_valid_days` (`14`). Values the
owner saved in the admin win.

## Store settings sections

Each section is a page under Settings → Store with its own permission
(`commerce.settings.<section>`). Extensions add sections ([extending.md](extending.md#settings-sections)).

| Section | Keys |
| --- | --- |
| `general` (General) | `name`, `logo`, `email`, `phone`, `tax_id`, `address` (`line1`, `line2`, `region`, `postal_code`), `selling_mode` (`shop`, `quote`, `whatsapp`, `catalog`), `pause_orders`, `pause_message`, `whatsapp` (`numbers`, `rotation`, `product_message`, `order_message`), `currency` (`code`, `symbol`, `position`, `space`, `thousands`, `decimal`, `decimals`), `weight_unit`, `dimension_unit` |
| `features` (Features) | One switch per module — see [features.md](features.md) |
| `catalog` (Catalog) | `price_visibility`, `price_visibility_roles`, `call_to_action`, `show_stock`, `low_stock_threshold`, `hide_out_of_stock`, `new_badge_days`, `price_range`, `attribute_taxonomies`, `compare_max`, `compare_fields` |
| `digital` (Digital products; catalog permission) | `delivery`, `grant_on`, `download_limit`, `expiry_days` |
| `checkout` (Checkout) | `guest_checkout`, `create_account`, `require_phone`, `company_fields`, `address_line2`, `require_postal_code`, `village_level`, `order_notes`, `dropshipper`, `minimum_order`, `terms_page`, `customer_cancel`, `order_number_format`, `order_number_reset`, `quote_number_format`, `quote_number_reset`, `quote_valid_days`, `auto_complete_shipped`, `auto_complete_digital` |
| `payments` (Payments page) | `methods.<key>` (each method's settings, `active`, `title`…), `order` — see [payments.md](payments.md) |
| `shipping` (Shipping page) | Zones and methods are database records — see [shipping.md](shipping.md) |
| `taxes` (Taxes) | `prices_include_tax`, `display_prices`, `based_on`, `classes`; rates on their own page |
| `accounts` (Accounts) | `registration`, `verify_email`, `require_phone`, `customer_roles`, `code_minutes` |
| `emails` (Emails page) | `<key>` per email: enabled, subject, text — see [emails.md](emails.md) |
| `documents` (Documents) | `invoice_number_format`, `invoice_number_reset`, `invoice_assigned_on`, `customer_invoice_download`, `footer` |
| `analytics` | `track_views` (overrides the config key) |

Saving a section dispatches `StoreSettingsSaved` and is recorded in the activity log. Some values
are locked once orders exist (the currency).

## Number formats

Order, quote and invoice numbers use a format with placeholders:

| Placeholder | |
| --- | --- |
| `{Y}`, `{y}` | Year (2026, 26) |
| `{m}`, `{d}` | Month, day |
| `{seq}`, `{seq:N}` | The counter, padded to N digits |

The counter restarts `daily`, `monthly`, `yearly` or `never` (`*_number_reset`). A format needs
`{seq}` and is at most 60 characters. Developers can replace order numbering entirely with
`Commerce::orderNumberUsing()`.
