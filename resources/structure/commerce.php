<?php

declare(strict_types=1);

/*
| The store structure commerce:scaffold creates in Sunrice (SPEC.md §
| Installation and scaffolding), in the CMS's structure import format
| (sunrice/cms docs/structure.md).
| Handles are fixed; titles can be renamed in the admin. Legal pages and
| the menu are added by ScaffoldStore.
*/

$image = fn (string $handle, string $label) => ['handle' => $handle, 'type' => 'media', 'label' => $label, 'config' => ['types' => ['image']]];

return [
    'sunrice' => 1,
    'blueprints' => [
        ['handle' => 'product', 'title' => 'Product', 'fields' => [
            ['handle' => 'product', 'type' => 'commerce_product', 'label' => 'Product data'],
            ['handle' => 'excerpt', 'type' => 'textarea', 'label' => 'Summary', 'instructions' => 'Shown on product cards and in search results.'],
            ['handle' => 'description', 'type' => 'rich_text', 'label' => 'Description'],
            ['handle' => 'gallery', 'type' => 'media', 'label' => 'Images', 'config' => ['multiple' => true, 'types' => ['image']]],
            ['handle' => 'specifications', 'type' => 'repeater', 'label' => 'Specifications', 'fields' => [
                ['handle' => 'label', 'type' => 'text', 'label' => 'Label'],
                ['handle' => 'value', 'type' => 'text', 'label' => 'Value'],
            ]],
            ['handle' => 'faq', 'type' => 'repeater', 'label' => 'Questions and answers', 'fields' => [
                ['handle' => 'question', 'type' => 'text', 'label' => 'Question'],
                ['handle' => 'answer', 'type' => 'textarea', 'label' => 'Answer'],
            ]],
            ['handle' => 'related_products', 'type' => 'entries', 'label' => 'Related products', 'config' => ['collections' => ['products'], 'multiple' => true, 'max' => 12]],
            ['handle' => 'upsells', 'type' => 'entries', 'label' => 'Upsells', 'instructions' => 'Better products shown on the product page.', 'config' => ['collections' => ['products'], 'multiple' => true, 'max' => 6]],
            ['handle' => 'cross_sells', 'type' => 'entries', 'label' => 'Cross-sells', 'instructions' => 'Shown in the cart.', 'config' => ['collections' => ['products'], 'multiple' => true, 'max' => 6]],
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
        ['handle' => 'product_inquiry', 'title' => 'Product inquiry', 'fields' => [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Name', 'required' => true],
            ['handle' => 'email', 'type' => 'text', 'label' => 'Email', 'required' => true, 'validation' => ['email']],
            ['handle' => 'phone', 'type' => 'text', 'label' => 'Phone (WhatsApp)'],
            ['handle' => 'quantity', 'type' => 'number', 'label' => 'Quantity'],
            ['handle' => 'message', 'type' => 'textarea', 'label' => 'Message', 'required' => true],
            ['handle' => 'product', 'type' => 'text', 'label' => 'Product'],
            ['handle' => 'product_url', 'type' => 'text', 'label' => 'Product link'],
            ['handle' => 'variant', 'type' => 'text', 'label' => 'Variant'],
        ]],
    ],
    'taxonomies' => [
        ['handle' => 'product_categories', 'title' => 'Product categories', 'hierarchical' => true, 'blueprint' => 'product_category',
            'route' => '/products/category/{slug}', 'collections' => ['products'], 'seo_description_field' => 'description', 'seo_image_field' => 'image'],
        ['handle' => 'product_tags', 'title' => 'Product tags', 'hierarchical' => false,
            'route' => '/products/tag/{slug}', 'collections' => ['products']],
        ['handle' => 'brands', 'title' => 'Brands', 'hierarchical' => false, 'blueprint' => 'brand',
            'route' => '/brands/{slug}', 'collections' => ['products'], 'collection_pages' => ['products' => ['single' => true]],
            'seo_description_field' => 'description', 'seo_image_field' => 'logo'],
    ],
    'collections' => [
        ['handle' => 'products', 'title' => 'Products', 'blueprint' => 'product', 'route' => '/products/{slug}', 'listing_route' => '/products',
            'translatable' => true, 'per_page' => 24, 'seo_description_field' => 'excerpt', 'seo_image_field' => 'gallery'],
    ],
    'forms' => [
        ['handle' => 'product_inquiry', 'title' => 'Product inquiry', 'blueprint' => 'product_inquiry',
            'message' => 'Thank you! We will reply soon.', 'captcha' => true],
    ],
];
