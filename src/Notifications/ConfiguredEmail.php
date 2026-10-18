<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

use Illuminate\Notifications\Messages\MailMessage;

/**
 * For the account emails (welcome, verify, code, reset): they keep their
 * own notification classes, and take their switch and subject from
 * Settings → Emails like the store emails, the store's colors, copies
 * (welcome only; codes and links stay the customer's), and a view set
 * with Commerce::emailTemplate($view, $key) in place of their lines.
 */
trait ConfiguredEmail
{
    abstract protected function emailKey(): string;

    /** @return array<int, string> */
    public function via(mixed $notifiable): array
    {
        return app(EmailSettings::class)->enabled($this->emailKey()) ? ['mail'] : [];
    }

    /**
     * The finishing touches every account email gets.
     *
     * @param  array<string, mixed>  $data  what a replacement view receives (with lang, store and brand)
     */
    protected function finish(MailMessage $mail, array $data = []): MailMessage
    {
        $templates = app(Templates::class);
        $brand = StoreEmail::brandColor();
        $mail->theme($templates->themeView());
        if (($view = $templates->replacedBody($this->emailKey())) !== null) {
            $mail->markdown($view, [...$data, 'lang' => $this->lang, 'store' => commerce_store_name(), 'brand' => $brand]);
        } else {
            $mail->viewData['brand'] = $brand;
        }
        if (($copies = app(EmailSettings::class)->copies($this->emailKey())) !== []) {
            $mail->bcc($copies);
        }

        return $mail;
    }

    /** The subject set in Settings → Emails for this language, or the default. */
    protected function configuredSubject(string $default): string
    {
        $stored = app(EmailSettings::class)->for($this->emailKey())['subject'][$this->lang] ?? null;

        return is_string($stored) && trim($stored) !== '' ? str_replace([':store', '{store}'], commerce_store_name(), $stored) : $default;
    }
}
