<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Sunrice\Commerce\Notifications\ConfiguredEmail;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/** The storefront password reset link (not the admin's). */
class CustomerResetPassword extends Notification implements ShouldQueue
{
    use ConfiguredEmail, Queueable;

    public function __construct(public readonly string $token, public readonly string $lang = 'id') {}

    protected function emailKey(): string
    {
        return 'password_reset';
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $url = StorefrontRoutes::url('commerce.account.password.reset', ['token' => $this->token, 'email' => $notifiable->getEmailForPasswordReset()], $this->lang);

        return $this->finish((new MailMessage)
            ->subject($this->configuredSubject(__('commerce::account.reset.subject', ['store' => commerce_store_name()], $this->lang)))
            ->line(__('commerce::account.reset.intro', [], $this->lang))
            ->action(__('commerce::account.reset.action', [], $this->lang), $url)
            ->line(__('commerce::account.reset.expires', ['minutes' => config('auth.passwords.'.config('commerce.auth.passwords', 'users').'.expire', 60)], $this->lang)), ['url' => $url]);
    }
}
