<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use Illuminate\Database\Eloquent\Collection;
use Sunrice\Commerce\Shipping\Models\ShippingZone;
use Sunrice\Commerce\Support\Address;

/**
 * The zone of a destination (ARCHITECTURE.md §14.2): zones in order, the
 * first whose regions match, else the "everywhere else" zone. A region
 * matches on the country and, when it has a code, the address's province,
 * city, district or village code equal to it or under it.
 */
class ZoneMatcher
{
    /** @var Collection<int, ShippingZone>|null */
    protected ?Collection $zones = null;

    public function match(Address $destination): ?ShippingZone
    {
        $codes = $destination->regionCodes();
        $fallback = null;
        foreach ($this->zones() as $zone) {
            if ($zone->everywhere_else) {
                $fallback ??= $zone;

                continue;
            }
            foreach ($zone->regions as $region) {
                if ($region->country !== $destination->country()) {
                    continue;
                }
                if ($region->region_code === null || $region->region_code === '') {
                    return $zone;
                }
                foreach ($codes as $code) {
                    if ($code === $region->region_code || str_starts_with($code, $region->region_code.'.')) {
                        return $zone;
                    }
                }
            }
        }

        return $fallback;
    }

    /** @return Collection<int, ShippingZone> */
    public function zones(): Collection
    {
        return $this->zones ??= ShippingZone::query()->with(['regions', 'methods'])->orderBy('position')->orderBy('id')->get();
    }

    public function flush(): void
    {
        $this->zones = null;
    }
}
