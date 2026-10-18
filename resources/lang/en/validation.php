<?php

declare(strict_types=1);

return [
    'country' => 'Choose a country from the list.',
    'region' => 'Choose the province, city, district and village again: they don\'t match.',
    'voucher' => [
        'not_found' => "The code :code doesn't exist.",
        'inactive' => 'This code is no longer valid.',
        'not_started' => 'This code is valid from :date.',
        'expired' => 'This code has expired.',
        'sign_in' => 'Sign in to use this code.',
        'audience' => "This code isn't for your account.",
        'first_order' => 'This code is for a first order only.',
        'usage_limit' => 'This code has been used up.',
        'customer_limit' => 'You have already used this code.',
        'destination' => "This code isn't valid for your shipping address.",
        'payment_method' => "This code isn't valid with the chosen payment method.",
        'shipping_method' => "This code isn't valid with the chosen shipping.",
        'no_eligible_items' => 'No product in your cart qualifies for this code.',
        'min_subtotal' => 'Spend at least :amount to use this code (:missing more).',
        'max_subtotal' => 'This code is for orders up to :amount.',
        'min_quantity' => 'Buy at least :count items to use this code.',
        'not_combinable' => "This code can't be combined with :code.",
        'conditional' => ':code applies at checkout if :conditions match.',
        'condition_destination' => 'the shipping address',
        'condition_payment_method' => 'the payment method',
        'condition_shipping_method' => 'the shipping method',
        'too_many_attempts' => 'Too many attempts. Try again in a minute.',
    ],
];
