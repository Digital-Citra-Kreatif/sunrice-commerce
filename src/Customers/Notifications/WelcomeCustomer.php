<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Sunrice\Commerce\Notifications\ConfiguredEmail;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

class WelcomeCustomer extends Notification implements ShouldQueue
{
    use ConfiguredEmail, Queueable;

    public function __construct(public readonly string $lang = 'id') {}

    protected function emailKey(): string
    {
        return 'account_welcome';
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->configuredSubject(__('commerce::account.welcome.subject', ['store' => commerce_store_name()], $this->lang)))
            ->greeting(__('commerce::account.welcome.greeting', ['name' => $notifiable->getAttribute('name')], $this->lang))
            ->line(__('commerce::account.welcome.intro', ['store' => commerce_store_name()], $this->lang))
            ->action(__('commerce::account.welcome.action', [], $this->lang), StorefrontRoutes::url('commerce.account', [], $this->lang));
    }
}
