<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schema;

/*
 * Foreign key columns are indexed on every database: PostgreSQL and SQLite
 * don't index them with the constraint, so an order's items, payments or
 * events (and cascading deletes) scanned the whole table there.
 */
it('indexes the foreign key columns', function (string $table, string $column) {
    $leading = array_map(fn (array $index) => $index['columns'][0] ?? null, Schema::getIndexes($table));

    expect($leading)->toContain($column);
})->with([
    ['commerce_order_items', 'order_id'],
    ['commerce_order_items', 'variant_id'],
    ['commerce_order_items', 'product_id'],
    ['commerce_order_adjustments', 'order_id'],
    ['commerce_order_events', 'order_id'],
    ['commerce_payments', 'order_id'],
    ['commerce_shipments', 'order_id'],
    ['commerce_refunds', 'order_id'],
    ['commerce_documents', 'order_id'],
    ['commerce_addresses', 'customer_id'],
    ['commerce_cart_items', 'variant_id'],
    ['commerce_bundle_items', 'product_id'],
    ['commerce_price_tiers', 'product_id'],
]);

it('rolls the indexes back', function () {
    $migration = require __DIR__.'/../../database/migrations/2026_01_10_000001_add_commerce_foreign_key_indexes.php';
    $migration->down();
    expect(array_column(Schema::getIndexes('commerce_order_items'), 'name'))->not->toContain('commerce_order_items_order_id_index');

    $migration->up();
    $migration->up(); // again: columns already indexed are skipped
    // Covered again, by this index or (MySQL) the foreign key's own.
    expect(array_map(fn (array $index) => $index['columns'][0] ?? null, Schema::getIndexes('commerce_order_items')))->toContain('order_id');
});
