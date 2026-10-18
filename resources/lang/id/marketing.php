<?php

declare(strict_types=1);

return [
    'footer' => 'Anda menerima email ini karena setuju menerima kabar dari :store.',
    'unsubscribe' => 'Berhenti berlangganan',
    'unsubscribe_text' => 'Berhenti berlangganan: :url',
    'unsubscribe_page' => [
        'title' => 'Berhenti berlangganan',
        'question' => 'Berhenti menerima email promosi dari :store di :email?',
        'note' => 'Anda tetap menerima email tentang pesanan Anda.',
        'confirm' => 'Berhenti berlangganan',
        'done' => 'Anda sudah berhenti berlangganan. :store tidak akan mengirim email promosi lagi.',
        'unknown' => 'Tautan ini sudah tidak berlaku.',
    ],

    'templates' => [
        'abandoned_cart' => [
            'subject' => '{first_name|Halo}, ada barang yang tertinggal di keranjang Anda',
            'preheader' => 'Keranjang Anda tersimpan dan siap kapan saja.',
            'body' => '<p>Halo {first_name|Kak},</p><p>Barang-barang ini masih ada di keranjang Anda di {store_name}:</p>{cart_items}<p>Semuanya masih menunggu. Lanjutkan belanja kapan pun Anda siap.</p>',
            'button_label' => 'Kembali ke keranjang',
            'button_url' => '{cart_url}',
        ],
        'win_back' => [
            'subject' => 'Kami kangen, {first_name|Kak}',
            'preheader' => 'Sudah lama tidak mampir. Ini yang baru.',
            'body' => '<p>Halo {first_name|Kak},</p><p>Sudah {days_since_last_order} hari sejak pesanan terakhir Anda di {store_name}. Banyak yang baru sejak itu. Yuk, lihat-lihat lagi.</p>',
            'button_label' => 'Lihat yang baru',
            'button_url' => '{store_url}',
        ],
        'welcome' => [
            'subject' => 'Selamat datang di {store_name}',
            'preheader' => 'Terima kasih sudah bergabung.',
            'body' => '<p>Halo {first_name|Kak},</p><p>Terima kasih sudah bergabung dengan {store_name}. Kami senang Anda di sini. Silakan lihat-lihat dan temukan yang Anda suka.</p>',
            'button_label' => 'Mulai belanja',
            'button_url' => '{store_url}',
        ],
        'first_order' => [
            'subject' => 'Siap untuk pesanan pertama, {first_name|Kak}?',
            'preheader' => 'Sedikit dorongan untuk memulai.',
            'body' => '<p>Halo {first_name|Kak},</p><p>Anda bergabung dengan {store_name} beberapa hari lalu, tetapi belum memesan. Kalau ada yang membuat ragu, balas saja email ini. Kami siap membantu.</p>',
            'button_label' => 'Belanja sekarang',
            'button_url' => '{store_url}',
        ],
        'after_order' => [
            'subject' => 'Bagaimana pesanan Anda, {first_name|Kak}?',
            'preheader' => 'Kami ingin mendengar pendapat Anda.',
            'body' => '<p>Halo {first_name|Kak},</p><p>Terima kasih sekali lagi untuk pesanan {last_order_number}. Semoga Anda menyukainya. Kalau ada yang kurang pas, balas saja email ini.</p>',
            'button_label' => 'Belanja lagi',
            'button_url' => '{store_url}',
        ],
        'announcement' => [
            'subject' => 'Kabar dari {store_name}',
            'preheader' => '',
            'body' => '<p>Halo {first_name|Kak},</p><p>Tulis kabar Anda di sini.</p>',
            'button_label' => 'Kunjungi toko',
            'button_url' => '{store_url}',
        ],
        'loyal' => [
            'subject' => 'Terima kasih untuk pelanggan setia kami',
            'preheader' => 'Khusus untuk Anda, {first_name|Kak}.',
            'body' => '<p>Halo {first_name|Kak},</p><p>Anda sudah {orders_count} kali berbelanja di {store_name}. Terima kasih! Ini hadiah khusus untuk Anda: pakai kode <strong>{voucher_code}</strong> di pesanan berikutnya.</p>',
            'button_label' => 'Belanja sekarang',
            'button_url' => '{store_url}',
        ],
    ],
];
