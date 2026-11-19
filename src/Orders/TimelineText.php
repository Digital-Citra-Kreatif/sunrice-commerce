<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use JsonSerializable;
use Stringable;

/**
 * A timeline entry's words, kept as a translation key and its values so
 * staff read it in their own language whatever language it was recorded
 * in ("Status changed from Processing to Completed", not the store's
 * "Status berubah dari Diproses ke Selesai"). A value may be another
 * TimelineText (a status's label); `then()` adds text as it is (a
 * tracking number, a reason). The entry also keeps it rendered when
 * recorded, for entries recorded before there was a key.
 */
final class TimelineText implements JsonSerializable, Stringable
{
    /** @param  array<string, string|int|float|self|null>  $replace */
    public function __construct(public readonly string $key, public readonly array $replace = [], public readonly string $append = '') {}

    /** @param  array<string, string|int|float|self|null>  $replace */
    public static function make(string $key, array $replace = []): self
    {
        return new self($key, $replace);
    }

    /** A status's label, by its kind (status, payment, fulfillment…), in the reader's language. */
    public static function status(string $status, string $kind = 'status'): self
    {
        return new self("commerce::orders.{$kind}.{$status}");
    }

    /** The text with more after it, as it is (empty adds nothing). */
    public function then(?string $more): self
    {
        return $more === null || $more === '' ? $this : new self($this->key, $this->replace, $this->append.$more);
    }

    /** The words in a language (the current one when null); a key with no translation reads as its last part in words. */
    public function in(?string $locale = null): string
    {
        $replace = array_map(fn (mixed $value): string => $value instanceof self ? $value->in($locale) : (string) $value, $this->replace);
        $text = __($this->key, $replace, $locale);
        if (! is_string($text) || $text === $this->key) {
            $text = ucfirst(str_replace('_', ' ', (string) last(explode('.', $this->key))));
        }

        return $text.$this->append;
    }

    /** @return array{key: string, replace: array<string, mixed>, append?: string} what the entry stores */
    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'replace' => array_map(fn (mixed $value): mixed => $value instanceof self ? ['text' => $value->toArray()] : $value, $this->replace),
        ] + ($this->append !== '' ? ['append' => $this->append] : []);
    }

    /** @param  array<string, mixed>  $stored  what toArray() gave */
    public static function fromArray(array $stored): ?self
    {
        if (! is_string($stored['key'] ?? null)) {
            return null;
        }
        $replace = [];
        foreach ((array) ($stored['replace'] ?? []) as $name => $value) {
            $replace[(string) $name] = is_array($value) && is_array($value['text'] ?? null) ? self::fromArray($value['text']) : (is_scalar($value) ? $value : null);
        }

        return new self($stored['key'], $replace, is_string($stored['append'] ?? null) ? $stored['append'] : '');
    }

    /** @return array{key: string, replace: array<string, mixed>, append?: string} */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    public function __toString(): string
    {
        return $this->in();
    }
}
