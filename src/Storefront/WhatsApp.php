<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * WhatsApp links: the store's numbers in rotation (random or round-robin)
 * and the per-language message templates with placeholders.
 */
class WhatsApp
{
    public function __construct(protected StoreSettings $settings) {}

    /** @return array<int, string> numbers in international form, digits only (6281234567890) */
    public function numbers(): array
    {
        return array_values(array_filter(array_map(
            fn ($n) => self::normalize((string) (is_array($n) ? ($n['number'] ?? '') : $n)),
            (array) $this->settings->get('general.whatsapp.numbers', []),
        )));
    }

    public function configured(): bool
    {
        return $this->numbers() !== [];
    }

    /** The number to use now. */
    public function next(): ?string
    {
        $numbers = $this->numbers();
        if ($numbers === []) {
            return null;
        }
        if (count($numbers) === 1) {
            return $numbers[0];
        }
        if ($this->settings->get('general.whatsapp.rotation') === 'round_robin') {
            $turn = (int) Cache::increment('commerce:whatsapp-turn');

            return $numbers[($turn - 1) % count($numbers)];
        }

        return $numbers[random_int(0, count($numbers) - 1)];
    }

    /**
     * The message from the store's template for this language (or the default text), placeholders filled.
     *
     * @param  'product_message'|'order_message'  $template
     * @param  array<string, string|int|null>  $values  placeholder => value
     */
    public function message(string $template, array $values, ?string $locale = null): string
    {
        $locale ??= app()->getLocale();
        $text = (string) ($this->settings->get("general.whatsapp.{$template}.{$locale}") ?: __('commerce::storefront.whatsapp.'.$template, [], $locale));
        $replace = [];
        foreach ($values as $key => $value) {
            $replace['{'.$key.'}'] = (string) $value;
        }
        // Unknown placeholders disappear rather than showing braces.
        $text = strtr($text, $replace);

        return trim((string) preg_replace('/\{[a-z_]+\}/', '', $text));
    }

    public function url(string $number, string $text): string
    {
        return 'https://wa.me/'.$number.'?text='.rawurlencode($text);
    }

    /** "0812-3456 7890" → "6281234567890"; "+65 9123 4567" → "6591234567". */
    public static function normalize(string $number): string
    {
        $digits = (string) preg_replace('/\D+/', '', $number);
        if (str_starts_with($digits, '0')) {
            $digits = '62'.substr($digits, 1);
        }

        return strlen($digits) >= 8 ? $digits : '';
    }
}
