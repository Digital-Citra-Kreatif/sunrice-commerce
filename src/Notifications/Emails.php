<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

/** The emails the store can send (Commerce::registerEmail() adds a package's). */
class Emails
{
    /** @var array<string, EmailDefinition> */
    protected array $emails = [];

    public function __construct()
    {
        foreach ([
            new EmailDefinition('order_received', 'Order received', feature: 'orders', attachments: ['invoice'], description: 'When an order is placed: the summary and how to pay.'),
            new EmailDefinition('payment_link', 'Payment link', feature: 'payments', description: 'Sent by staff for manual orders and edits: the link to pay.'),
            new EmailDefinition('payment_confirmation_received', 'Payment confirmation received', feature: 'manual_payments', description: 'The customer\'s "I have paid" was received.'),
            new EmailDefinition('payment_rejected', 'Payment confirmation rejected', feature: 'manual_payments', description: 'With the reason and a link to confirm again.'),
            new EmailDefinition('payment_failed', 'Payment failed', feature: 'payments', description: 'The payment didn\'t go through: a link to try again or pay another way.'),
            new EmailDefinition('payment_received', 'Payment received', feature: 'orders', attachments: ['invoice'], defaultAttachments: ['invoice']),
            new EmailDefinition('order_shipped', 'Order shipped', feature: 'shipping', description: 'With the courier and tracking link.'),
            new EmailDefinition('order_completed', 'Order completed', feature: 'orders'),
            new EmailDefinition('order_cancelled', 'Order cancelled', feature: 'orders'),
            new EmailDefinition('order_refunded', 'Order refunded', feature: 'orders'),
            new EmailDefinition('order_updated', 'Order changed', feature: 'orders', description: 'When staff edit an unpaid order and choose to tell the customer.'),
            new EmailDefinition('customer_note', 'Note to the customer', feature: 'orders', description: 'Notes staff send from the order page.'),
            new EmailDefinition('downloads_ready', 'Downloads ready', feature: 'digital', attachments: ['downloads'], defaultAttachments: ['downloads']),
            new EmailDefinition('quote_received', 'Quote request received', feature: 'orders'),
            new EmailDefinition('quote_ready', 'Quote ready', feature: 'orders', attachments: ['quotation'], defaultAttachments: ['quotation']),
            new EmailDefinition('account_welcome', 'Welcome', feature: 'accounts', lang: 'commerce::account.welcome'),
            new EmailDefinition('verify_email', 'Verify email', feature: 'accounts', locked: true, lang: 'commerce::account.verify'),
            new EmailDefinition('login_code', 'Sign-in code', feature: 'passwordless_login', locked: true, lang: 'commerce::account.code'),
            new EmailDefinition('password_reset', 'Password reset', feature: 'accounts', locked: true, lang: 'commerce::account.reset'),

            new EmailDefinition('staff_new_order', 'New order', 'staff', 'orders', attachments: ['packing_slip']),
            new EmailDefinition('staff_payment_confirmation', 'Payment confirmation to verify', 'staff', 'manual_payments'),
            new EmailDefinition('staff_order_cancelled', 'Order cancelled', 'staff', 'orders'),
            new EmailDefinition('staff_new_quote', 'New quote request', 'staff', 'orders'),
            new EmailDefinition('staff_low_stock', 'Low stock', 'staff', 'inventory'),
            new EmailDefinition('staff_out_of_stock', 'Out of stock', 'staff', 'inventory'),
            new EmailDefinition('staff_deletion_request', 'Account deletion request', 'staff', 'accounts'),
        ] as $email) {
            $this->emails[$email->key] = $email;
        }
    }

    public function register(EmailDefinition $email): void
    {
        $this->emails[$email->key] = $email;
    }

    public function get(string $key): ?EmailDefinition
    {
        return $this->emails[$key] ?? null;
    }

    /** @return array<string, EmailDefinition> */
    public function all(): array
    {
        return $this->emails;
    }
}
