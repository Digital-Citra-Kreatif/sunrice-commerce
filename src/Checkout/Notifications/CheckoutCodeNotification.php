<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CheckoutCodeNotification extends Notification
{
    public function __construct(public readonly string $code) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('commerce::checkout-access.mail_subject'))
            ->line(__('commerce::checkout-access.mail_code', ['code' => $this->code]))
            ->line(__('commerce::checkout-access.mail_expiry'));
    }
}
