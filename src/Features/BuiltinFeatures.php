<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Features;

/** The modules of SPEC.md § Feature modules. */
final class BuiltinFeatures
{
    /** Groups in display order: key => label. */
    public const GROUPS = [
        'catalog' => 'Catalog',
        'selling' => 'Selling',
        'payments' => 'Payments',
        'shipping' => 'Shipping',
        'promotions' => 'Promotions',
        'customers' => 'Customers',
        'insights' => 'Insights & AI',
        'integrations' => 'Integrations',
    ];

    /** @return array<int, Feature> */
    public static function all(): array
    {
        $cart = ['shop', 'quote', 'whatsapp'];

        return [
            new Feature('catalog', 'catalog', 'Products, prices and product pages', 'The product catalog. Always on.', core: true),
            new Feature('variants', 'catalog', 'Variable products', 'Options (size, color…) and their variants, each with its own SKU, price and stock.', ['catalog']),
            new Feature('bundles', 'catalog', 'Bundles', 'Products made of other products, sold together.', ['catalog']),
            new Feature('digital', 'catalog', 'Digital products', 'Downloadable files and links, delivered by email or in My Account.', ['orders']),
            new Feature('brands', 'catalog', 'Brands', 'Brand pages, filters and the brands index.', ['catalog']),
            new Feature('inventory', 'catalog', 'Stock tracking', 'Stock quantities, statuses, backorders and low-stock alerts.', ['catalog']),

            new Feature('cart', 'selling', 'Cart and mini cart', 'Customers collect products in a cart.', ['catalog'], $cart),
            new Feature('orders', 'selling', 'Orders', 'Orders, quotes and manual orders in the admin.', ['catalog']),
            new Feature('checkout', 'selling', 'Checkout', 'Customers check out: an order, a quote request or a WhatsApp order, by selling mode.', ['cart', 'orders'], $cart, ['shop' => ['payments']]),
            new Feature('documents', 'selling', 'Invoices and packing slips', 'PDF invoices, packing slips and quotations.', ['orders']),
            new Feature('taxes', 'selling', 'Taxes', 'Tax classes and rates.', ['catalog'], default: false),

            new Feature('payments', 'payments', 'Payment methods', 'Payment at checkout and the pay page.', ['orders'], ['shop', 'quote']),
            new Feature('manual_payments', 'payments', 'Bank transfer, QRIS and cash on delivery', 'Manual payment methods with payment confirmation.', ['payments'], ['shop', 'quote']),

            new Feature('shipping', 'shipping', 'Shipping', 'Shipping zones, rates and shipments.', ['orders']),

            new Feature('pricing_rules', 'promotions', 'Pricing rules', 'Bulk, tier and customer-role prices.', ['catalog']),
            new Feature('flash_sales', 'promotions', 'Flash sales', 'Time-boxed sale prices with countdowns and quantity caps.', ['catalog']),
            new Feature('vouchers', 'promotions', 'Vouchers', 'Discount codes and automatic discounts.', ['cart'], $cart),

            new Feature('accounts', 'customers', 'Customer accounts', 'Registration, sign-in and My Account.', ['catalog']),
            new Feature('passwordless_login', 'customers', 'Sign in with an emailed code', 'One-time codes instead of a password.', ['accounts'], default: false),
            new Feature('google_login', 'customers', 'Sign in with Google', 'Needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.', ['accounts'], default: false),
            new Feature('wishlist', 'customers', 'Wishlist', 'Customers save products for later.', ['catalog']),
            new Feature('compare', 'customers', 'Product comparison', 'Compare products side by side.', ['catalog']),
            new Feature('marketing', 'customers', 'Marketing emails', 'Campaigns and automatic emails (abandoned cart, win back…) to customers who accept marketing, with open and click tracking.', ['catalog'], default: false),

            new Feature('analytics', 'insights', 'Store analytics', 'Dashboard figures and reports.', ['catalog']),
            new Feature('ai_tools', 'insights', 'Store tools for AI agents', 'Commerce tools on Sunrice\'s MCP server.', ['catalog']),
        ];
    }
}
