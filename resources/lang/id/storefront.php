<?php

declare(strict_types=1);

return [
    'whatsapp' => [
        'product_message' => "Halo, saya tertarik dengan {product} {variant}\n{url}",
        'order_message' => "Halo, saya ingin memesan (#{order_number}):\n{items}\nTotal: {total}\n\nNama: {name}\nTelepon: {phone}\nAlamat: {address}\nPengiriman: {shipping}\nCatatan: {notes}\n{url}",
    ],
    'price' => [
        'from' => 'Mulai :price',
        'sale' => 'Promo',
        'new' => 'Baru',
        'featured' => 'Unggulan',
        'tiers' => 'Beli banyak lebih hemat',
        'tier_row' => 'Mulai :qty pcs',
    ],
    'product' => [
        'quantity' => 'Jumlah',
        'choose' => 'Pilih :option',
        'unavailable' => 'Kombinasi ini tidak tersedia.',
        'sku' => 'SKU',
        'specifications' => 'Spesifikasi',
        'faq' => 'Tanya jawab',
        'size_guide' => 'Panduan ukuran',
        'related' => 'Produk terkait',
        'inquiry' => 'Tanya produk ini',
    ],
    'cta' => [
        'cart' => 'Tambah ke keranjang',
        'inquiry' => 'Tanya produk ini',
        'whatsapp' => 'Pesan lewat WhatsApp',
        'external' => 'Beli di :shop',
        'sign_in_for_price' => 'Masuk untuk melihat harga',
        'price_on_request' => 'Harga atas permintaan',
    ],
    'stock' => [
        'in_stock' => 'Tersedia',
        'out_of_stock' => 'Stok habis',
        'backorder' => 'Bisa dipesan (pre-order)',
        'count' => 'Stok :count',
        'low' => 'Tinggal :count lagi',
    ],
    'availability' => [
        'not_published' => 'Produk ini sudah tidak tersedia.',
        'sync_failed' => 'Produk ini belum bisa dibeli.',
        'inactive_variant' => 'Pilihan ini sudah tidak tersedia.',
        'purchase_mode' => 'Produk ini tidak bisa dimasukkan ke keranjang.',
        'price_hidden' => 'Masuk untuk membeli produk ini.',
        'feature_off' => 'Keranjang sedang ditutup.',
        'out_of_stock' => 'Stok :product habis.',
        'not_enough_stock' => 'Stok :product tinggal :count.',
        'qty_rules' => ':product: pilih jumlah yang valid.',
        'flash_sale_limit' => 'Anda bisa membeli :count lagi :product dengan harga promo.',
    ],
];
