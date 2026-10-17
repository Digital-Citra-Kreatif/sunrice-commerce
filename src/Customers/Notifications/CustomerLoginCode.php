<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Spatie\OneTimePasswords\Models\OneTimePassword;

/** The emailed sign-in code (sent at once: codes expire within minutes). */
class CustomerLoginCode extends Notification
{
    public function __construct(public readonly OneTimePassword $code, public readonly string $lang = 'id') {}

    /** @return array<int, string> */
    public function via(mixed $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $minutes = max(1, (int) round(now()->diffInMinutes($this->code->getAttribute('expires_at'), true)));

        return (new MailMessage)
            ->subject(__('commerce::account.code.subject', ['code' => $this->code->getAttribute('password'), 'store' => commerce_store_name()], $this->lang))
            ->line(__('commerce::account.code.intro', [], $this->lang))
            ->line('**'.$this->code->getAttribute('password').'**')
            ->line(__('commerce::account.code.expires', ['minutes' => $minutes], $this->lang))
            ->line(__('commerce::account.code.ignore', [], $this->lang));
    }
}
