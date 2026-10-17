<?php

declare(strict_types=1);

return [
    'whatsapp' => [
        'product_message' => "Hello, I'm interested in {product} {variant}\n{url}",
        'order_message' => "Hello, I'd like to order (#{order_number}):\n{items}\nTotal: {total}\n\nName: {name}\nPhone: {phone}\nAddress: {address}\nShipping: {shipping}\nNotes: {notes}\n{url}",
    ],
    'price' => [
        'from' => 'From :price',
        'sale' => 'Sale',
        'new' => 'New',
        'featured' => 'Featured',
        'tiers' => 'Buy more, pay less',
        'tier_row' => 'From :qty pcs',
    ],
    'product' => [
        'quantity' => 'Quantity',
        'choose' => 'Choose :option',
        'unavailable' => 'This combination is not available.',
        'sku' => 'SKU',
        'specifications' => 'Specifications',
        'faq' => 'Questions',
        'size_guide' => 'Size guide',
        'related' => 'You may also like',
        'inquiry' => 'Ask about this product',
    ],
    'cta' => [
        'cart' => 'Add to cart',
        'inquiry' => 'Ask about this product',
        'whatsapp' => 'Order on WhatsApp',
        'external' => 'Buy on :shop',
        'sign_in_for_price' => 'Sign in to see prices',
        'price_on_request' => 'Price on request',
    ],
    'stock' => [
        'in_stock' => 'In stock',
        'out_of_stock' => 'Out of stock',
        'backorder' => 'Available on backorder',
        'count' => ':count in stock',
        'low' => 'Only :count left',
    ],
    'availability' => [
        'not_published' => 'This product is no longer available.',
        'sync_failed' => "This product can't be bought right now.",
        'inactive_variant' => 'This option is no longer available.',
        'purchase_mode' => "This product can't be added to the cart.",
        'price_hidden' => 'Sign in to buy this product.',
        'feature_off' => 'The cart is closed.',
        'out_of_stock' => ':product is out of stock.',
        'not_enough_stock' => 'Only :count of :product left.',
        'qty_rules' => ':product: choose a valid quantity.',
        'flash_sale_limit' => 'You can buy :count more of :product at the sale price.',
    ],
];
