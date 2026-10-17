<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sunrice\Support\Locales;

/**
 * A method of a zone: its type, title and delivery estimate per language,
 * availability (min/max subtotal, max weight) and the type's settings.
 *
 * @property int $id
 * @property int $zone_id
 * @property string $type
 * @property array<string, string|null>|null $title
 * @property array<string, string|null>|null $etd
 * @property array<string, mixed>|null $settings
 * @property bool $active
 * @property int $position
 * @property-read ShippingZone $zone
 */
class ShippingMethod extends Model
{
    protected $table = 'commerce_shipping_methods';

    protected $guarded = [];

    protected $casts = ['title' => 'array', 'etd' => 'array', 'settings' => 'array', 'active' => 'boolean', 'position' => 'integer'];

    /** @return BelongsTo<ShippingZone, $this> */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(ShippingZone::class, 'zone_id');
    }

    public function setting(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings ?? [], $key, $default);
    }

    public function titleFor(?string $locale = null): string
    {
        return $this->localized($this->title, $locale) ?? ucfirst($this->type);
    }

    public function etdFor(?string $locale = null): ?string
    {
        return $this->localized($this->etd, $locale);
    }

    /** @param  array<string, string|null>|null  $values */
    protected function localized(?array $values, ?string $locale): ?string
    {
        $values = array_filter((array) $values, fn ($v) => is_string($v) && trim($v) !== '');
        $locale ??= app()->getLocale();

        return $values[$locale] ?? $values[Locales::main()] ?? (reset($values) ?: null);
    }
}
