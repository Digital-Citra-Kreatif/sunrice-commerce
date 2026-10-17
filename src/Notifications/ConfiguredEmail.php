<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

/**
 * For the account emails (welcome, verify, code, reset): they keep their
 * own notification classes, and take their switch and subject from
 * Settings → Emails like the store emails.
 */
trait ConfiguredEmail
{
    abstract protected function emailKey(): string;

    /** @return array<int, string> */
    public function via(mixed $notifiable): array
    {
        return app(EmailSettings::class)->enabled($this->emailKey()) ? ['mail'] : [];
    }

    /** The subject set in Settings → Emails for this language, or the default. */
    protected function configuredSubject(string $default): string
    {
        $stored = app(EmailSettings::class)->for($this->emailKey())['subject'][$this->lang] ?? null;

        return is_string($stored) && trim($stored) !== '' ? str_replace([':store', '{store}'], commerce_store_name(), $stored) : $default;
    }
}
