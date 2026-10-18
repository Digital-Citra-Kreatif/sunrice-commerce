<?php

declare(strict_types=1);

return [
    'sent' => 'Email :email terkirim',
    'order_received' => [
        'subject' => 'Pesanan :number Anda di :store',
        'heading' => 'Terima kasih atas pesanan Anda',
        'intro' => 'Pesanan :number sudah kami terima.',
        'action' => 'Lihat pesanan',
    ],
    'payment_link' => [
        'subject' => 'Bayar pesanan :number',
        'heading' => 'Pesanan Anda siap dibayar',
        'intro' => 'Pesanan :number menunggu pembayaran Anda.',
        'action' => 'Bayar sekarang',
    ],
    'payment_confirmation_received' => [
        'subject' => 'Konfirmasi pembayaran :number sudah kami terima',
        'heading' => 'Terima kasih',
        'intro' => 'Pembayaran pesanan :number akan kami periksa dan kabari.',
        'action' => 'Lihat pesanan',
    ],
    'payment_failed' => [
        'subject' => 'Pembayaran pesanan :number gagal',
        'heading' => 'Pembayaran tidak berhasil',
        'intro' => 'Pembayaran untuk pesanan :number tidak berhasil. Silakan coba lagi atau gunakan metode pembayaran lain.',
        'action' => 'Bayar lagi',
    ],
    'payment_rejected' => [
        'subject' => 'Pembayaran :number belum bisa kami konfirmasi',
        'heading' => 'Pembayaran belum terkonfirmasi',
        'intro' => 'Kami belum menemukan pembayaran untuk pesanan :number. Silakan periksa lalu konfirmasi lagi.',
        'action' => 'Konfirmasi lagi',
    ],
    'payment_received' => [
        'subject' => 'Pembayaran :number sudah diterima',
        'heading' => 'Pembayaran diterima',
        'intro' => 'Terima kasih! Pembayaran pesanan :number sudah kami terima.',
        'action' => 'Lihat pesanan',
    ],
    'order_shipped' => [
        'subject' => 'Pesanan :number sedang dikirim',
        'heading' => 'Pesanan Anda dikirim',
        'intro' => 'Pesanan :number sedang dalam perjalanan.',
        'action' => 'Lihat pesanan',
    ],
    'order_completed' => [
        'subject' => 'Pesanan :number selesai',
        'heading' => 'Pesanan selesai',
        'intro' => 'Terima kasih sudah berbelanja di :store.',
        'action' => 'Lihat pesanan',
    ],
    'order_cancelled' => [
        'subject' => 'Pesanan :number dibatalkan',
        'heading' => 'Pesanan dibatalkan',
        'intro' => 'Pesanan :number dibatalkan.',
        'action' => 'Lihat pesanan',
    ],
    'order_refunded' => [
        'subject' => 'Pengembalian dana pesanan :number',
        'heading' => 'Pengembalian dana',
        'intro' => 'Kami mengembalikan sebagian atau seluruh dana pesanan :number.',
        'action' => 'Lihat pesanan',
    ],
    'order_updated' => [
        'subject' => 'Pesanan :number diubah',
        'heading' => 'Pesanan Anda berubah',
        'intro' => 'Kami memperbarui pesanan :number:',
        'action' => 'Lihat pesanan',
    ],
    'customer_note' => [
        'subject' => 'Catatan untuk pesanan :number',
        'heading' => 'Catatan tentang pesanan Anda',
        'intro' => '',
        'action' => 'Lihat pesanan',
    ],
    'downloads_ready' => [
        'subject' => 'Unduhan pesanan :number',
        'heading' => 'Unduhan Anda sudah siap',
        'intro' => '',
        'action' => 'Lihat pesanan',
        'attached' => 'terlampir di email ini',
        'in_account' => 'di Akun Saya → Unduhan',
    ],
    'quote_received' => [
        'subject' => 'Permintaan penawaran :number sudah kami terima',
        'heading' => 'Terima kasih',
        'intro' => 'Kami akan segera mengirim harga.',
        'action' => 'Lihat permintaan',
    ],
    'quote_ready' => [
        'subject' => 'Penawaran :number dari :store',
        'heading' => 'Penawaran Anda sudah siap',
        'intro' => 'Berikut harga dari kami. Terima penawaran untuk menjadikannya pesanan.',
        'action' => 'Lihat penawaran',
    ],
    'staff_new_order' => [
        'subject' => 'Pesanan baru :number',
        'heading' => 'Pesanan baru',
        'intro' => ':name membuat pesanan :number.',
        'action' => 'Buka pesanan',
    ],
    'staff_payment_confirmation' => [
        'subject' => 'Pembayaran perlu diperiksa: :number',
        'heading' => 'Pembayaran perlu diperiksa',
        'intro' => ':name mengonfirmasi pembayaran pesanan :number.',
        'action' => 'Periksa pembayaran',
    ],
    'staff_order_cancelled' => [
        'subject' => 'Pesanan :number dibatalkan',
        'heading' => 'Pesanan dibatalkan',
        'intro' => 'Pesanan :number dibatalkan.',
        'action' => 'Buka pesanan',
    ],
    'staff_new_quote' => [
        'subject' => 'Permintaan penawaran baru :number',
        'heading' => 'Permintaan penawaran baru',
        'intro' => ':name meminta penawaran.',
        'action' => 'Buka permintaan',
    ],
    'staff_low_stock' => [
        'subject' => 'Stok menipis',
        'heading' => 'Stok menipis',
        'intro' => 'Stok produk ini menipis:',
        'action' => '',
    ],
    'staff_out_of_stock' => [
        'subject' => 'Stok habis',
        'heading' => 'Stok habis',
        'intro' => 'Stok produk ini habis:',
        'action' => '',
    ],
    'staff_deletion_request' => [
        'subject' => 'Permintaan hapus akun',
        'heading' => 'Permintaan hapus akun',
        'intro' => 'Seorang pelanggan meminta akunnya dihapus:',
        'action' => '',
    ],
    'staff_paid_after_cancel' => [
        'subject' => 'Pembayaran diterima untuk pesanan batal :number',
        'heading' => 'Pembayaran untuk pesanan yang dibatalkan',
        'intro' => 'Pembayaran untuk pesanan :number masuk setelah pesanan dibatalkan. Kembalikan dana pelanggan atau aktifkan kembali pesanan.',
        'action' => 'Buka pesanan',
    ],
];
