<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Spatie\OneTimePasswords\Models\OneTimePassword;
use Sunrice\Commerce\Notifications\ConfiguredEmail;

/** The emailed sign-in code (sent at once: codes expire within minutes). */
class CustomerLoginCode extends Notification
{
    use ConfiguredEmail;

    public function __construct(public readonly OneTimePassword $code, public readonly string $lang = 'id') {}

    protected function emailKey(): string
    {
        return 'login_code';
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $minutes = max(1, (int) round(now()->diffInMinutes($this->code->getAttribute('expires_at'), true)));

        return (new MailMessage)
            ->subject($this->configuredSubject(__('commerce::account.code.subject', ['code' => $this->code->getAttribute('password'), 'store' => commerce_store_name()], $this->lang)))
            ->line(__('commerce::account.code.intro', [], $this->lang))
            ->line('**'.$this->code->getAttribute('password').'**')
            ->line(__('commerce::account.code.expires', ['minutes' => $minutes], $this->lang))
            ->line(__('commerce::account.code.ignore', [], $this->lang));
    }
}
