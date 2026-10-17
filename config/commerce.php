<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Catalog
    |--------------------------------------------------------------------------
    |
    | Which Sunrice structure holds the store. Products are entries of these
    | collections; their commerce data lives in the `field` handle of the
    | product blueprint. Category, tag and brand taxonomies feed filters and
    | term pages; attribute taxonomies (e.g. "colors") can be used as global
    | product options.
    |
    */

    'catalog' => [
        'collections' => ['products'],
        'field' => 'product',
        'category_taxonomy' => 'product_categories',
        'tag_taxonomy' => 'product_tags',
        'brand_taxonomy' => 'brands',
        'attribute_taxonomies' => [],
        'inquiry_form' => 'product_inquiry',
        'max_options' => 3,
        'max_variants' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Customer accounts
    |--------------------------------------------------------------------------
    |
    | Customers sign in on the storefront with their own session guard, on the
    | same user table as Sunrice's admin, so a storefront sign-in never opens
    | the admin. The guard is registered automatically when it doesn't exist.
    | `passwords` is the password broker used for customer password resets.
    |
    */

    'auth' => [
        'guard' => 'commerce',
        'passwords' => 'users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Storefront
    |--------------------------------------------------------------------------
    |
    | URL paths of the store pages (without a language prefix; other languages
    | get Sunrice's /{locale} prefix). `layout` is the site layout store pages
    | extend; when it doesn't exist, commerce's minimal layout is used.
    |
    */

    'storefront' => [
        'paths' => [
            'cart' => 'cart',
            'checkout' => 'checkout',
            'order' => 'order',
            'confirm_payment' => 'confirm-payment',
            'track_order' => 'track-order',
            'quote' => 'quote',
            'account' => 'account',
            'wishlist' => 'wishlist',
            'compare' => 'compare',
            'brands' => 'brands',
            'flash_sale' => 'flash-sale',
            'downloads' => 'downloads',
            'go' => 'go',
            'api' => 'commerce/api',
            'webhooks' => 'commerce/webhooks',
        ],
        'layout' => 'sunrice.layouts.app',
    ],

    /*
    |--------------------------------------------------------------------------
    | Cart
    |--------------------------------------------------------------------------
    */

    'cart' => [
        'cookie' => 'commerce_cart',
        'lifetime_days' => 30,
        // Untouched carts are marked abandoned after this many days, and
        // deleted after the same number of days again.
        'prune_days' => 30,
    ],

    /*
    |--------------------------------------------------------------------------
    | Digital downloads
    |--------------------------------------------------------------------------
    |
    | Files of digital products are stored on a private disk and only ever
    | served through download tokens.
    |
    */

    'downloads' => [
        'disk' => 'local',
        'attachment_max_mb' => 10,
        'max_upload_mb' => 512,
    ],

    /*
    |--------------------------------------------------------------------------
    | Payments
    |--------------------------------------------------------------------------
    |
    | Payment proofs customers upload with a transfer confirmation (private
    | disk, size limit in KB, deleted after the retention period).
    |
    */

    'payments' => [
        'proof_disk' => 'local',
        'proof_max_kb' => 5120,
        'proof_retention_days' => 365,
        'banks' => [
            'bca' => 'BCA',
            'mandiri' => 'Bank Mandiri',
            'bni' => 'BNI',
            'bri' => 'BRI',
            'bsi' => 'BSI',
            'cimb' => 'CIMB Niaga',
            'permata' => 'PermataBank',
            'danamon' => 'Danamon',
            'btn' => 'BTN',
            'jago' => 'Bank Jago',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    |
    | Courier presets for shipments: name and tracking URL ({tracking} is
    | replaced with the tracking number). Packages and apps add their own
    | with Commerce::registerCourier().
    |
    */

    'shipping' => [
        'volumetric_divisor' => 6000,
        'couriers' => [
            'jne' => ['name' => 'JNE', 'tracking_url' => 'https://www.jne.co.id/tracking-package?awb={tracking}'],
            'jnt' => ['name' => 'J&T Express', 'tracking_url' => 'https://jet.co.id/track?awb={tracking}'],
            'sicepat' => ['name' => 'SiCepat', 'tracking_url' => 'https://www.sicepat.com/checkAwb?awb={tracking}'],
            'anteraja' => ['name' => 'AnterAja', 'tracking_url' => 'https://anteraja.id/tracking/{tracking}'],
            'pos' => ['name' => 'POS Indonesia', 'tracking_url' => 'https://www.posindonesia.co.id/id/tracking?barcode={tracking}'],
            'ninja' => ['name' => 'Ninja Xpress', 'tracking_url' => 'https://www.ninjaxpress.co/id-id/tracking?id={tracking}'],
            'lion' => ['name' => 'Lion Parcel', 'tracking_url' => 'https://lionparcel.com/track/stt?q={tracking}'],
            'idexpress' => ['name' => 'ID Express', 'tracking_url' => null],
            'gosend' => ['name' => 'GoSend', 'tracking_url' => null],
            'grab' => ['name' => 'GrabExpress', 'tracking_url' => null],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Analytics
    |--------------------------------------------------------------------------
    */

    'analytics' => [
        'track_views' => true,
        // Visits whose user agent contains one of these are not counted.
        'bot_user_agents' => ['bot', 'crawl', 'spider', 'slurp', 'facebookexternalhit', 'preview', 'curl', 'wget', 'python', 'headless'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Privacy
    |--------------------------------------------------------------------------
    */

    'privacy' => [
        // IP addresses on download logs are cleared after this many days.
        'ip_retention_days' => 365,
    ],

    /*
    |--------------------------------------------------------------------------
    | Store settings defaults
    |--------------------------------------------------------------------------
    |
    | Defaults of the settings edited in Settings → Store. Saved values
    | override these (stored in Sunrice's settings table, key "commerce").
    |
    */

    'defaults' => [
        'general' => [
            'name' => null,
            'email' => null,
            'phone' => null,
            'logo' => null,
            'address' => [],
            'tax_id' => null,
            'selling_mode' => 'shop',
            'pause_orders' => false,
            'pause_message' => null,
            'whatsapp' => [
                'numbers' => [],
                'rotation' => 'random',
                'product_message' => [],
                'order_message' => [],
            ],
            'currency' => [
                'code' => 'IDR',
                'symbol' => 'Rp',
                'position' => 'left',
                'space' => false,
                'thousands' => '.',
                'decimal' => ',',
                'decimals' => 0,
            ],
            'weight_unit' => 'kg',
            'dimension_unit' => 'cm',
        ],
        'features' => [],
        'catalog' => [
            'price_visibility' => 'everyone',
            'price_visibility_roles' => [],
            'call_to_action' => 'inquiry',
            'show_stock' => 'low',
            'low_stock_threshold' => 5,
            'hide_out_of_stock' => false,
            'new_badge_days' => 14,
            'compare_max' => 4,
            'compare_fields' => [],
            'price_range' => 'range',
            'attribute_taxonomies' => [],
        ],
        'checkout' => [
            'guest_checkout' => true,
            'create_account' => 'offer',
            'require_phone' => true,
            'company_fields' => false,
            'address_line2' => true,
            'require_postal_code' => false,
            'village_level' => false,
            'minimum_order' => 0,
            'order_notes' => true,
            'dropshipper' => false,
            'terms_page' => null,
            'customer_cancel' => true,
            'order_number_format' => 'ORD-{Y}{m}{d}-{seq:4}',
            'order_number_reset' => 'daily',
            'quote_number_format' => 'Q-{Y}{m}-{seq:4}',
            'quote_number_reset' => 'monthly',
            'quote_valid_days' => 14,
            'auto_complete_shipped' => false,
            'auto_complete_digital' => true,
        ],
        'accounts' => [
            'registration' => true,
            'verify_email' => true,
            'require_phone' => false,
            'customer_roles' => ['Customer'],
            'code_minutes' => 10,
        ],
        'taxes' => [
            'prices_include_tax' => true,
            'display_prices' => 'incl',
            'based_on' => 'shipping',
            'classes' => ['standard'],
        ],
        'documents' => [
            'invoice_number_format' => 'INV/{Y}/{m}/{seq:4}',
            'invoice_number_reset' => 'monthly',
            'invoice_assigned_on' => 'placed',
            'customer_invoice_download' => true,
            'footer' => null,
        ],
        'digital' => [
            'delivery' => ['link', 'account'],
            'grant_on' => 'paid',
            'download_limit' => null,
            'expiry_days' => null,
        ],
        'payments' => [
            'methods' => [],
            'order' => [],
        ],
        'emails' => [],
        'analytics' => [],
    ],
];
