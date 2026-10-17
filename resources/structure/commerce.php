<?php

declare(strict_types=1);

/*
| The store structure commerce:scaffold creates in Sunrice (SPEC.md §
| Installation and scaffolding), in Sunrice's structure import format.
| Handles are fixed; titles can be renamed in the admin. Legal pages and
| the menu are added by ScaffoldStore.
*/

$image = fn (string $handle, string $label) => ['handle' => $handle, 'type' => 'asset', 'label' => $label, 'config' => ['image_only' => true]];

return [
    'blueprints' => [
        ['handle' => 'product', 'title' => 'Product', 'fields' => [
            ['handle' => 'product', 'type' => 'commerce_product', 'label' => 'Product data'],
            ['handle' => 'excerpt', 'type' => 'textarea', 'label' => 'Summary', 'instructions' => 'Shown on product cards and in search results.'],
            ['handle' => 'description', 'type' => 'rich_text', 'label' => 'Description'],
            ['handle' => 'gallery', 'type' => 'asset', 'label' => 'Images', 'config' => ['multiple' => true, 'image_only' => true]],
            ['handle' => 'specifications', 'type' => 'repeater', 'label' => 'Specifications', 'config' => ['fields' => [
                ['handle' => 'label', 'type' => 'text', 'label' => 'Label'],
                ['handle' => 'value', 'type' => 'text', 'label' => 'Value'],
            ]]],
            ['handle' => 'faq', 'type' => 'repeater', 'label' => 'Questions and answers', 'config' => ['fields' => [
                ['handle' => 'question', 'type' => 'text', 'label' => 'Question'],
                ['handle' => 'answer', 'type' => 'textarea', 'label' => 'Answer'],
            ]]],
            ['handle' => 'related_products', 'type' => 'entries', 'label' => 'Related products', 'config' => ['collections' => ['products'], 'max' => 12]],
            ['handle' => 'upsells', 'type' => 'entries', 'label' => 'Upsells', 'instructions' => 'Better products shown on the product page.', 'config' => ['collections' => ['products'], 'max' => 6]],
            ['handle' => 'cross_sells', 'type' => 'entries', 'label' => 'Cross-sells', 'instructions' => 'Shown in the cart.', 'config' => ['collections' => ['products'], 'max' => 6]],
            ['handle' => 'size_guide', 'type' => 'rich_text', 'label' => 'Size guide'],
        ]],
        ['handle' => 'product_category', 'title' => 'Product category', 'fields' => [
            $image('image', 'Image'),
            $image('banner', 'Banner'),
            ['handle' => 'description', 'type' => 'rich_text', 'label' => 'Description'],
        ]],
        ['handle' => 'brand', 'title' => 'Brand', 'fields' => [
            $image('logo', 'Logo'),
            $image('banner', 'Banner'),
            ['handle' => 'description', 'type' => 'rich_text', 'label' => 'Description'],
            ['handle' => 'website', 'type' => 'text', 'label' => 'Website', 'translatable' => false],
        ]],
    ],
    'taxonomies' => [
        ['handle' => 'product_categories', 'title' => 'Product categories', 'hierarchical' => true, 'blueprint' => 'product_category',
            'settings' => ['has_archive' => true, 'route' => '/products/category/{slug}']],
        ['handle' => 'product_tags', 'title' => 'Product tags', 'hierarchical' => false,
            'settings' => ['has_archive' => true, 'route' => '/products/tag/{slug}']],
        ['handle' => 'brands', 'title' => 'Brands', 'hierarchical' => false, 'blueprint' => 'brand',
            'settings' => ['has_archive' => true, 'route' => '/brands/{slug}']],
    ],
    'collections' => [
        ['handle' => 'products', 'title' => 'Products', 'blueprint' => 'product', 'taxonomies' => ['product_categories', 'product_tags', 'brands'],
            'settings' => ['route' => '/products/{slug}', 'has_archive' => true, 'archive_route' => '/products', 'translatable' => true,
                'icon' => 'shopping-bag', 'per_page' => 24, 'seo' => ['description_field' => 'excerpt', 'image_field' => 'gallery']]],
    ],
    'forms' => [
        ['handle' => 'product_inquiry', 'title' => 'Product inquiry', 'fields' => [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Name', 'required' => true],
            ['handle' => 'email', 'type' => 'text', 'label' => 'Email', 'required' => true, 'validation' => ['email']],
            ['handle' => 'phone', 'type' => 'text', 'label' => 'Phone (WhatsApp)'],
            ['handle' => 'quantity', 'type' => 'number', 'label' => 'Quantity'],
            ['handle' => 'message', 'type' => 'textarea', 'label' => 'Message', 'required' => true],
            ['handle' => 'product', 'type' => 'text', 'label' => 'Product', 'config' => ['hidden' => true]],
            ['handle' => 'product_url', 'type' => 'text', 'label' => 'Product link', 'config' => ['hidden' => true]],
            ['handle' => 'variant', 'type' => 'text', 'label' => 'Variant', 'config' => ['hidden' => true]],
        ], 'settings' => ['success_message' => 'Thank you! We will reply soon.', 'captcha' => true]],
    ],
];
