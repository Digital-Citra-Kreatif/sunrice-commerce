<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Settings;

use Illuminate\Support\Arr;
use Sunrice\Commerce\Support\Defaults;
use Sunrice\Models\Setting;
use Throwable;

/**
 * The settings edited in Settings → Store: one `commerce` row in Sunrice's
 * settings table, laid over the defaults in config('commerce.defaults').
 * Read once per request (Sunrice's Setting::get()).
 *
 *     app(StoreSettings::class)->get('checkout.guest_checkout');
 *     app(StoreSettings::class)->section('general');
 */
class StoreSettings
{
    public const KEY = 'commerce';

    /** @var array<string, mixed>|null */
    protected ?array $resolved = null;

    /**
     * The stored values only (empty before anything is saved or before the
     * tables exist).
     *
     * @return array<string, mixed>
     */
    public function stored(): array
    {
        try {
            return (array) Setting::get(self::KEY, []);
        } catch (Throwable) {
            return [];
        }
    }

    /** @return array<string, mixed> */
    public function all(): array
    {
        return $this->resolved ??= Defaults::merge((array) config('commerce.defaults', []), $this->stored());
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return Arr::get($this->all(), $key, $default);
    }

    /** @return array<string, mixed> */
    public function section(string $section): array
    {
        return (array) $this->get($section, []);
    }

    /**
     * Replace one section's stored values (keys not given keep their
     * stored or default values).
     *
     * @param  array<string, mixed>  $values
     */
    public function saveSection(string $section, array $values): void
    {
        $stored = $this->stored();
        $stored[$section] = array_replace((array) ($stored[$section] ?? []), $values);
        Setting::set(self::KEY, $stored);
        $this->flush();
    }

    /** Forget what this request has read (after a save, or between queued jobs). */
    public function flush(): void
    {
        $this->resolved = null;
    }
}
