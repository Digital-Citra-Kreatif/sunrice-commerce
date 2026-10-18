<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Days are the site's local dates (ARCHITECTURE.md §20).
        Schema::create('commerce_stats_daily', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            // Recomputed from orders and refunds.
            foreach (['orders', 'items_sold', 'gross_sales', 'discounts', 'refunds', 'net_sales', 'shipping', 'taxes', 'fees', 'total_sales',
                'new_customers', 'returning_customers', 'quotes_requested'] as $column) {
                $table->bigInteger($column)->default(0);
            }
            // Counted as they happen.
            $table->unsignedInteger('carts_created')->default(0);
            $table->unsignedInteger('checkouts_started')->default(0);
            $table->timestamps();
        });

        Schema::create('commerce_product_stats_daily', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedBigInteger('product_id')->index();
            // Counted as they happen.
            foreach (['views', 'add_to_carts', 'cta_whatsapp', 'cta_external', 'cta_inquiry'] as $column) {
                $table->unsignedInteger($column)->default(0);
            }
            // Recomputed from orders.
            $table->unsignedInteger('units_sold')->default(0);
            $table->bigInteger('revenue')->default(0);
            $table->unique(['date', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_product_stats_daily');
        Schema::dropIfExists('commerce_stats_daily');
    }
};
