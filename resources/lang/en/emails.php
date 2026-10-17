<?php

declare(strict_types=1);

return [
    'sent' => ':email email sent',
    'order_received' => [
        'subject' => 'Your order :number at :store',
        'heading' => 'Thank you for your order',
        'intro' => 'We received your order :number.',
        'action' => 'View your order',
    ],
    'payment_link' => [
        'subject' => 'Pay for order :number',
        'heading' => 'Your order is ready to pay',
        'intro' => 'Order :number is waiting for your payment.',
        'action' => 'Pay now',
    ],
    'payment_confirmation_received' => [
        'subject' => 'We received your payment confirmation for :number',
        'heading' => 'Thank you',
        'intro' => 'We will check your payment for order :number and let you know.',
        'action' => 'View your order',
    ],
    'payment_rejected' => [
        'subject' => 'We could not confirm your payment for :number',
        'heading' => 'Payment not confirmed',
        'intro' => 'We could not match your payment for order :number. Please check it and confirm again.',
        'action' => 'Confirm again',
    ],
    'payment_received' => [
        'subject' => 'Payment received for :number',
        'heading' => 'Payment received',
        'intro' => 'Thank you! We received the payment for order :number.',
        'action' => 'View your order',
    ],
    'order_shipped' => [
        'subject' => 'Order :number is on its way',
        'heading' => 'Your order has shipped',
        'intro' => 'Order :number is on its way.',
        'action' => 'View your order',
    ],
    'order_completed' => [
        'subject' => 'Order :number is complete',
        'heading' => 'Order complete',
        'intro' => 'Thank you for shopping at :store.',
        'action' => 'View your order',
    ],
    'order_cancelled' => [
        'subject' => 'Order :number was cancelled',
        'heading' => 'Order cancelled',
        'intro' => 'Order :number was cancelled.',
        'action' => 'View your order',
    ],
    'order_refunded' => [
        'subject' => 'Refund for order :number',
        'heading' => 'Refund',
        'intro' => 'We refunded part or all of order :number.',
        'action' => 'View your order',
    ],
    'order_updated' => [
        'subject' => 'Order :number was changed',
        'heading' => 'Your order changed',
        'intro' => 'We updated order :number:',
        'action' => 'View your order',
    ],
    'customer_note' => [
        'subject' => 'A note about order :number',
        'heading' => 'A note about your order',
        'intro' => '',
        'action' => 'View your order',
    ],
    'downloads_ready' => [
        'subject' => 'Your downloads for :number',
        'heading' => 'Your downloads are ready',
        'intro' => '',
        'action' => 'View your order',
        'attached' => 'attached to this email',
        'in_account' => 'in My Account → Downloads',
    ],
    'quote_received' => [
        'subject' => 'We received your quote request :number',
        'heading' => 'Thank you',
        'intro' => 'We will reply with prices soon.',
        'action' => 'View your request',
    ],
    'quote_ready' => [
        'subject' => 'Your quote :number from :store',
        'heading' => 'Your quote is ready',
        'intro' => 'Here are our prices. Accept the quote to turn it into an order.',
        'action' => 'View the quote',
    ],
    'staff_new_order' => [
        'subject' => 'New order :number',
        'heading' => 'New order',
        'intro' => ':name placed order :number.',
        'action' => 'Open the order',
    ],
    'staff_payment_confirmation' => [
        'subject' => 'Payment to verify for :number',
        'heading' => 'Payment to verify',
        'intro' => ':name confirmed a payment for order :number.',
        'action' => 'Verify payments',
    ],
    'staff_order_cancelled' => [
        'subject' => 'Order :number was cancelled',
        'heading' => 'Order cancelled',
        'intro' => 'Order :number was cancelled.',
        'action' => 'Open the order',
    ],
    'staff_new_quote' => [
        'subject' => 'New quote request :number',
        'heading' => 'New quote request',
        'intro' => ':name asked for a quote.',
        'action' => 'Open the request',
    ],
    'staff_low_stock' => [
        'subject' => 'Low stock',
        'heading' => 'Low stock',
        'intro' => 'This product is running low:',
        'action' => '',
    ],
    'staff_out_of_stock' => [
        'subject' => 'Out of stock',
        'heading' => 'Out of stock',
        'intro' => 'This product is out of stock:',
        'action' => '',
    ],
    'staff_deletion_request' => [
        'subject' => 'Account deletion request',
        'heading' => 'Account deletion request',
        'intro' => 'A customer asked to delete their account:',
        'action' => '',
    ],
];
