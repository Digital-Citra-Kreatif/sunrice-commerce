<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Support\Locales;

/** An email's stored settings (emails.{key}): switch, recipients, texts per language, attachments. */
class EmailSettings
{
    public function __construct(protected StoreSettings $settings, protected Emails $emails) {}

    /** @return array<string, mixed> */
    public function for(string $key): array
    {
        return (array) $this->settings->get("emails.{$key}", []);
    }

    public function enabled(string $key): bool
    {
        $email = $this->emails->get($key);
        if ($email === null) {
            return false;
        }
        if ($email->locked) {
            return true;
        }

        return (bool) ($this->for($key)['enabled'] ?? $email->enabledByDefault);
    }

    /**
     * A text (subject, heading, intro) in a language: the stored one, else the default translation.
     *
     * @param  array<string, string|int>  $replace
     */
    public function text(string $key, string $part, string $locale, array $replace = []): string
    {
        $stored = $this->for($key)[$part][$locale] ?? null;
        if (is_string($stored) && trim($stored) !== '') {
            $out = $stored;
            foreach ($replace as $name => $value) {
                $out = str_replace([':'.$name, '{'.$name.'}'], (string) $value, $out);
            }

            return $out;
        }
        $email = $this->emails->get($key);
        $lang = ($email?->langPrefix() ?? 'commerce::emails.'.$key).'.'.$part;
        $text = __($lang, $replace, $locale);

        return $text === $lang ? '' : (string) $text;
    }

    /** @return array<int, string> */
    public function attachments(string $key): array
    {
        $email = $this->emails->get($key);
        $stored = $this->for($key)['attachments'] ?? null;

        if ($email === null) {
            return [];
        }

        return array_values(array_intersect((array) ($stored ?? $email->defaultAttachments), $email->attachments));
    }

    /** @return array<int, string> staff addresses: configured ones, or the store email */
    public function addresses(string $key): array
    {
        $addresses = $this->list($key, 'addresses');

        return $addresses !== [] || ! empty($this->for($key)['roles']) ? $addresses : array_filter([mb_strtolower((string) $this->settings->get('general.email'))]);
    }

    /**
     * Who gets a hidden copy (BCC) of a customer email; never for the locked
     * account emails, whose codes and links are the customer's alone.
     *
     * @return array<int, string>
     */
    public function copies(string $key): array
    {
        $email = $this->emails->get($key);

        return $email === null || $email->locked || $email->audience === 'staff' ? [] : $this->list($key, 'copies');
    }

    /** @return array<int, string> valid, lower-cased addresses stored under emails.{key}.{list} */
    protected function list(string $key, string $list): array
    {
        $stored = $this->for($key)[$list] ?? null;
        $addresses = is_string($stored) ? preg_split('/[\s,;]+/', $stored) : (array) $stored;

        return array_values(array_filter(array_map(fn ($a) => mb_strtolower(trim((string) $a)), (array) $addresses), fn ($a) => filter_var($a, FILTER_VALIDATE_EMAIL)));
    }

    /** @return array<int, string> */
    public function roles(string $key): array
    {
        return array_values(array_filter((array) ($this->for($key)['roles'] ?? ['Shop Manager'])));
    }

    public static function mainLocale(): string
    {
        return Locales::main();
    }
}
