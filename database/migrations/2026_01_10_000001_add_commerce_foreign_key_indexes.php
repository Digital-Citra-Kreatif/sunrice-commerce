<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
 * Indexes on foreign key columns. MySQL creates them with the constraint;
 * PostgreSQL and SQLite don't, so an order's items, payments or events (and
 * cascading deletes) scanned the whole table there. Columns that already
 * lead an index are skipped.
 */
return new class extends Migration
{
    /** @var array<string, array<int, string>> */
    public const COLUMNS = [
        'commerce_order_items' => ['order_id', 'parent_id', 'product_id', 'variant_id'],
        'commerce_order_adjustments' => ['order_id', 'order_item_id'],
        'commerce_order_events' => ['order_id'],
        'commerce_payments' => ['order_id'],
        'commerce_payment_confirmations' => ['order_id', 'payment_id'],
        'commerce_refunds' => ['order_id'],
        'commerce_shipments' => ['order_id'],
        'commerce_documents' => ['order_id'],
        'commerce_download_grants' => ['order_id', 'download_file_id'],
        'commerce_download_logs' => ['grant_id'],
        'commerce_addresses' => ['customer_id'],
        'commerce_carts' => ['customer_id'],
        'commerce_cart_items' => ['variant_id'],
        'commerce_wishlists' => ['customer_id'],
        'commerce_wishlist_items' => ['product_id', 'variant_id'],
        'commerce_bundle_items' => ['product_id', 'variant_id'],
        'commerce_price_tiers' => ['product_id', 'variant_id'],
        'commerce_download_files' => ['product_id', 'variant_id'],
        'commerce_variant_option_values' => ['option_value_id'],
        'commerce_price_rule_targets' => ['rule_id'],
        'commerce_flash_sale_items' => ['flash_sale_id'],
        'commerce_voucher_customers' => ['voucher_id'],
        'commerce_shipping_zone_regions' => ['zone_id'],
        'commerce_shipping_methods' => ['zone_id'],
    ];

    public function up(): void
    {
        foreach (self::COLUMNS as $table => $columns) {
            $missing = array_values(array_filter($columns, fn (string $column) => ! $this->leadsIndex($table, $column)));
            if ($missing !== []) {
                Schema::table($table, function (Blueprint $blueprint) use ($missing): void {
                    foreach ($missing as $column) {
                        $blueprint->index($column);
                    }
                });
            }
        }
    }

    public function down(): void
    {
        foreach (self::COLUMNS as $table => $columns) {
            $names = array_map(fn (string $column) => "{$table}_{$column}_index", $columns);
            $existing = array_column(Schema::getIndexes($table), 'name');
            $drop = array_values(array_intersect($names, $existing));
            if ($drop !== []) {
                Schema::table($table, function (Blueprint $blueprint) use ($drop): void {
                    foreach ($drop as $name) {
                        $blueprint->dropIndex($name);
                    }
                });
            }
        }
    }

    /** Whether an index (or the primary key) starts with this column. */
    protected function leadsIndex(string $table, string $column): bool
    {
        foreach (Schema::getIndexes($table) as $index) {
            if (($index['columns'][0] ?? null) === $column) {
                return true;
            }
        }

        return false;
    }
};
