<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A time-boxed sale: sale prices for chosen products or variants, with
 * optional quantity caps and per-customer limits.
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property Carbon $starts_at
 * @property Carbon $ends_at
 * @property bool $active
 * @property string|null $badge
 * @property array<string, string>|null $description per locale
 * @property bool $show_countdown
 * @property bool $show_progress
 * @property bool $show_teaser
 * @property int|null $per_customer_limit
 * @property int|null $banner_asset_id
 */
class FlashSale extends Model
{
    protected $table = 'commerce_flash_sales';

    protected $guarded = [];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'active' => 'boolean',
        'description' => 'array',
        'show_countdown' => 'boolean',
        'show_progress' => 'boolean',
        'show_teaser' => 'boolean',
    ];

    /** @return HasMany<FlashSaleItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(FlashSaleItem::class)->orderBy('position');
    }

    /**
     * @param  Builder<FlashSale>  $query
     * @return Builder<FlashSale>
     */
    public function scopeRunning(Builder $query, ?\DateTimeInterface $at = null): Builder
    {
        $at ??= now();

        return $query->where('active', true)->where('starts_at', '<=', $at)->where('ends_at', '>', $at);
    }

    /**
     * @param  Builder<FlashSale>  $query
     * @return Builder<FlashSale>
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('active', true)->where('starts_at', '>', now());
    }

    public function isRunning(?\DateTimeInterface $at = null): bool
    {
        $at ??= now();

        return $this->active && $this->starts_at <= $at && $this->ends_at > $at;
    }

    public function descriptionFor(?string $locale = null): string
    {
        $all = (array) $this->description;

        return (string) ($all[$locale ?? app()->getLocale()] ?? reset($all) ?: '');
    }
}
