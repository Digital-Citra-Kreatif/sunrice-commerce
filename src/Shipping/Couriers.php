<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use Illuminate\Support\Str;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Courier presets for shipments: name and tracking URL with {tracking}.
 *
 * The code's presets (config commerce.shipping.couriers plus
 * Commerce::registerCourier()) are the starting list; once staff save the
 * list in Settings → Shipping → Couriers (store settings `couriers.list`),
 * that list decides names, links, order and which are offered. A preset
 * from code that staff removed (`couriers.removed`) stays away; one added
 * by code later (a new package) joins at the end. Presets switched off
 * are not offered for new shipments but still name and link old ones.
 */
class Couriers
{
    /** @var array<string, array{name: string, tracking_url: string|null}> */
    protected array $registered = [];

    public function register(string $key, string $name, ?string $trackingUrl = null): void
    {
        $this->registered[$key] = ['name' => $name, 'tracking_url' => $trackingUrl];
    }

    /**
     * The presets from code (config and registered), as they ship.
     *
     * @return array<string, array{name: string, tracking_url: string|null}>
     */
    public function fromCode(): array
    {
        return [...(array) config('commerce.shipping.couriers', []), ...$this->registered];
    }

    /**
     * Every preset, offered or not, in the order staff gave them.
     *
     * @return array<string, array{name: string, tracking_url: string|null, active: bool}>
     */
    public function all(): array
    {
        $code = $this->fromCode();
        $stored = app(StoreSettings::class)->stored()['couriers'] ?? null;
        $list = is_array($stored) && is_array($stored['list'] ?? null) ? $stored['list'] : null;
        if ($list === null) {
            return array_map(fn (array $c) => ['name' => (string) $c['name'], 'tracking_url' => $c['tracking_url'] ?? null, 'active' => true], $code);
        }

        $out = [];
        foreach ($list as $row) {
            $key = is_array($row) ? (string) ($row['key'] ?? '') : '';
            if ($key === '' || trim((string) ($row['name'] ?? '')) === '') {
                continue;
            }
            $url = trim((string) ($row['tracking_url'] ?? ''));
            $out[$key] = ['name' => (string) $row['name'], 'tracking_url' => $url !== '' ? $url : null, 'active' => (bool) ($row['active'] ?? true)];
        }
        $removed = array_map('strval', (array) ($stored['removed'] ?? []));
        foreach ($code as $key => $c) {
            if (! isset($out[$key]) && ! in_array((string) $key, $removed, true)) {
                $out[$key] = ['name' => (string) $c['name'], 'tracking_url' => $c['tracking_url'] ?? null, 'active' => true];
            }
        }

        return $out;
    }

    /**
     * The presets offered for new shipments.
     *
     * @return array<string, array{name: string, tracking_url: string|null, active: bool}>
     */
    public function offered(): array
    {
        return array_filter($this->all(), fn (array $c) => $c['active']);
    }

    /** @return array{name: string, tracking_url: string|null, active: bool}|null */
    public function get(string $key): ?array
    {
        return $this->all()[$key] ?? null;
    }

    public function trackingUrl(?string $courier, ?string $tracking): ?string
    {
        $template = $courier === null ? null : ($this->get($courier)['tracking_url'] ?? null);
        if ($template === null || $tracking === null || $tracking === '') {
            return null;
        }

        return str_replace('{tracking}', rawurlencode($tracking), $template);
    }

    /**
     * Store the list staff edited: each row {key, name, tracking_url, active};
     * a row without a key gets one from its name. Presets from code left out
     * are remembered as removed.
     *
     * @param  array<int, array<string, mixed>>  $rows
     */
    public function save(array $rows): void
    {
        $list = [];
        $taken = [];
        foreach ($rows as $row) {
            $name = trim((string) ($row['name'] ?? ''));
            if ($name === '') {
                continue;
            }
            $key = Str::slug(trim((string) ($row['key'] ?? '')) ?: $name, '_') ?: 'courier';
            $base = $key;
            for ($i = 2; in_array($key, $taken, true); $i++) {
                $key = "{$base}_{$i}";
            }
            $taken[] = $key;
            $url = trim((string) ($row['tracking_url'] ?? ''));
            $list[] = ['key' => $key, 'name' => $name, 'tracking_url' => $url !== '' ? $url : null, 'active' => (bool) ($row['active'] ?? true)];
        }
        $removed = array_values(array_diff(array_map('strval', array_keys($this->fromCode())), $taken));
        app(StoreSettings::class)->saveSection('couriers', ['list' => $list, 'removed' => $removed]);
    }
}
