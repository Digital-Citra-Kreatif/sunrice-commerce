<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Contracts\Tracking;
use Sunrice\Commerce\Features\Features;

/**
 * Counts storefront events into today's stats rows (no personal data):
 * product views, add-to-carts and call-to-action clicks per product, and
 * carts created and checkouts started per day. Bots, staff and previews
 * are skipped.
 */
class StatsTracking implements Tracking
{
    public const PRODUCT = [
        'view' => 'views', 'add_to_cart' => 'add_to_carts',
        'cta_whatsapp' => 'cta_whatsapp', 'cta_external' => 'cta_external', 'cta_inquiry' => 'cta_inquiry',
    ];

    public const DAILY = ['cart_created' => 'carts_created', 'checkout_started' => 'checkouts_started'];

    public function track(string $event, ?int $productId = null, array $meta = []): void
    {
        if (! app(Features::class)->active('analytics') || ! app(VisitorFilter::class)->counts(app()->bound('request') ? request() : null)) {
            return;
        }
        $date = Day::of(now());
        if (isset(self::PRODUCT[$event]) && $productId !== null) {
            $this->increment('commerce_product_stats_daily', ['date' => $date, 'product_id' => $productId], self::PRODUCT[$event]);
        } elseif (isset(self::DAILY[$event])) {
            $this->increment('commerce_stats_daily', ['date' => $date], self::DAILY[$event], timestamps: true);
        }
    }

    /** @param  array<string, mixed>  $keys */
    protected function increment(string $table, array $keys, string $column, bool $timestamps = false): void
    {
        $grammar = DB::connection()->getQueryGrammar();
        $extra = $timestamps ? ['created_at' => now(), 'updated_at' => now()] : [];
        DB::table($table)->upsert([[...$keys, $column => 1, ...$extra]], array_keys($keys),
            [$column => DB::raw($grammar->wrapTable($table).'.'.$grammar->wrap($column).' + 1'), ...($timestamps ? ['updated_at' => now()] : [])]);
    }
}
