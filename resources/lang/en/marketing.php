<?php

declare(strict_types=1);

return [
    'footer' => 'You get this email because you agreed to hear from :store.',
    'unsubscribe' => 'Unsubscribe',
    'unsubscribe_text' => 'Unsubscribe: :url',
    'unsubscribe_page' => [
        'title' => 'Unsubscribe',
        'question' => 'Stop marketing emails from :store to :email?',
        'note' => 'You will still get emails about your orders.',
        'confirm' => 'Unsubscribe',
        'done' => 'You are unsubscribed. :store won\'t send you marketing emails any more.',
        'unknown' => 'This link is no longer valid.',
    ],

    // Starting points for automations and campaigns: subject, preheader, body (HTML), button.
    'templates' => [
        'abandoned_cart' => [
            'subject' => '{first_name|Hi}, you left something in your cart',
            'preheader' => 'Your cart is saved and ready when you are.',
            'body' => '<p>Hi {first_name|there},</p><p>You left these in your cart at {store_name}:</p>{cart_items}<p>They are still waiting for you. Pick up where you left off whenever you\'re ready.</p>',
            'button_label' => 'Back to my cart',
            'button_url' => '{cart_url}',
        ],
        'win_back' => [
            'subject' => 'We miss you, {first_name|friend}',
            'preheader' => 'It\'s been a while. Here\'s what\'s new.',
            'body' => '<p>Hi {first_name|there},</p><p>It\'s been {days_since_last_order} days since your last order at {store_name}. A lot has changed since then. Come and have a look at what\'s new.</p>',
            'button_label' => 'See what\'s new',
            'button_url' => '{store_url}',
        ],
        'welcome' => [
            'subject' => 'Welcome to {store_name}',
            'preheader' => 'Thanks for joining us.',
            'body' => '<p>Hi {first_name|there},</p><p>Thanks for joining {store_name}. We\'re glad you\'re here. Take a look around and find something you love.</p>',
            'button_label' => 'Start shopping',
            'button_url' => '{store_url}',
        ],
        'first_order' => [
            'subject' => 'Ready for your first order, {first_name|friend}?',
            'preheader' => 'A little nudge to get you started.',
            'body' => '<p>Hi {first_name|there},</p><p>You joined {store_name} a few days ago but haven\'t ordered yet. If something is holding you back, just reply to this email. We\'re happy to help.</p>',
            'button_label' => 'Shop now',
            'button_url' => '{store_url}',
        ],
        'after_order' => [
            'subject' => 'How is your order, {first_name|friend}?',
            'preheader' => 'We\'d love to hear from you.',
            'body' => '<p>Hi {first_name|there},</p><p>Thanks again for order {last_order_number}. We hope you\'re enjoying it. If anything isn\'t right, just reply to this email.</p>',
            'button_label' => 'Shop again',
            'button_url' => '{store_url}',
        ],
        'announcement' => [
            'subject' => 'News from {store_name}',
            'preheader' => '',
            'body' => '<p>Hi {first_name|there},</p><p>Write your news here.</p>',
            'button_label' => 'Visit the store',
            'button_url' => '{store_url}',
        ],
        'loyal' => [
            'subject' => 'A thank-you for our best customers',
            'preheader' => 'Just for you, {first_name|friend}.',
            'body' => '<p>Hi {first_name|there},</p><p>You\'ve ordered from {store_name} {orders_count} times. Thank you! Here\'s something just for you: use the code <strong>{voucher_code}</strong> on your next order.</p>',
            'button_label' => 'Shop now',
            'button_url' => '{store_url}',
        ],
    ],
];
