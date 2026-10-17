<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

/**
 * Courier presets for shipments (config commerce.shipping.couriers plus
 * Commerce::registerCourier()): name and tracking URL with {tracking}.
 */
class Couriers
{
    /** @var array<string, array{name: string, tracking_url: string|null}> */
    protected array $registered = [];

    public function register(string $key, string $name, ?string $trackingUrl = null): void
    {
        $this->registered[$key] = ['name' => $name, 'tracking_url' => $trackingUrl];
    }

    /** @return array<string, array{name: string, tracking_url: string|null}> */
    public function all(): array
    {
        return [...(array) config('commerce.shipping.couriers', []), ...$this->registered];
    }

    /** @return array{name: string, tracking_url: string|null}|null */
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
}
