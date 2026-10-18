<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use Sunrice\Commerce\Notifications\ConfiguredEmail;

/** The storefront's email verification link (a signed route, valid 3 days). */
class VerifyCustomerEmail extends Notification implements ShouldQueue
{
    use ConfiguredEmail, Queueable;

    public function __construct(public readonly string $lang = 'id') {}

    protected function emailKey(): string
    {
        return 'verify_email';
    }

    public static function url(mixed $notifiable, string $locale): string
    {
        return URL::temporarySignedRoute('commerce.account.verify', now()->addDays(3), [
            'id' => $notifiable->getKey(),
            'hash' => sha1((string) $notifiable->getAttribute('email')),
            'lang' => $locale,
        ]);
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        return $this->finish((new MailMessage)
            ->subject($this->configuredSubject(__('commerce::account.verify.subject', ['store' => commerce_store_name()], $this->lang)))
            ->line(__('commerce::account.verify.intro', [], $this->lang))
            ->action(__('commerce::account.verify.action', [], $this->lang), static::url($notifiable, $this->lang)), ['url' => static::url($notifiable, $this->lang)]);
    }
}
