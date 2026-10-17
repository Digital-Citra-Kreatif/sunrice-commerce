<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Regions;

use Illuminate\Database\Eloquent\Model;

/**
 * A carrier's or integration's own location id for a region code (e.g.
 * Biteship area ids), filled by that package.
 *
 * @property string $provider
 * @property string $region_code
 * @property string $external_id
 * @property array<string, mixed>|null $meta
 */
class RegionMapping extends Model
{
    protected $table = 'commerce_region_mappings';

    protected $guarded = [];

    protected $casts = ['meta' => 'array'];

    /** The provider's id for the most specific mapped code of an address (village up to province). */
    public static function for(string $provider, string $code): ?string
    {
        $lineage = array_reverse(Region::lineage($code));
        $mappings = static::query()->where('provider', $provider)->whereIn('region_code', $lineage)->pluck('external_id', 'region_code');
        foreach ($lineage as $candidate) {
            if (isset($mappings[$candidate])) {
                return (string) $mappings[$candidate];
            }
        }

        return null;
    }
}
