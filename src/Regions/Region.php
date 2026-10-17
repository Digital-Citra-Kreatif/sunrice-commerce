<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Regions;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * An Indonesian province (level 1), city/regency (2), district (3) or
 * village (4), keyed by its Kemendagri code ("32.73.01").
 *
 * @property string $code
 * @property string|null $parent_code
 * @property int $level
 * @property string $name
 * @property string $kind
 * @property string|null $postal_code
 * @property bool $active
 */
class Region extends Model
{
    public const LEVELS = ['province' => 1, 'city' => 2, 'district' => 3, 'village' => 4];

    public const CREATED_AT = null;

    protected $table = 'commerce_regions';

    protected $primaryKey = 'code';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    protected $casts = ['level' => 'integer', 'active' => 'boolean'];

    /** @return BelongsTo<Region, $this> */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_code', 'code');
    }

    /** @return HasMany<Region, $this> */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_code', 'code');
    }

    /**
     * @param  Builder<Region>  $query
     * @return Builder<Region>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    /**
     * The province, city, district and village codes contained in a code.
     *
     * @return array<int, string> top-down
     */
    public static function lineage(string $code): array
    {
        $parts = explode('.', $code);
        $codes = [];
        foreach (array_keys($parts) as $i) {
            $codes[] = implode('.', array_slice($parts, 0, $i + 1));
        }

        return $codes;
    }

    public static function levelOf(string $code): int
    {
        return count(explode('.', $code));
    }
}
