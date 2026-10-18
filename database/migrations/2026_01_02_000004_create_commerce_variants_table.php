<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('commerce_products')->cascadeOnDelete();
            $table->string('uid', 32);
            $table->string('sku', 100)->nullable()->unique();
            $table->string('barcode', 100)->nullable();
            $table->string('title')->default('');
            $table->bigInteger('price')->default(0);
            $table->bigInteger('compare_at_price')->nullable();
            $table->bigInteger('cost')->nullable();
            $table->unsignedInteger('weight')->nullable();
            $table->unsignedInteger('length')->nullable();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedBigInteger('image_asset_id')->nullable();
            $table->boolean('requires_shipping')->nullable();
            $table->boolean('downloadable')->nullable();
            $table->boolean('track_stock')->default(false);
            $table->integer('stock_quantity')->nullable();
            $table->string('stock_status', 20)->default('in_stock');
            $table->string('backorders', 10)->default('no');
            $table->unsignedInteger('low_stock_threshold')->nullable();
            $table->unsignedInteger('min_qty')->default(1);
            $table->unsignedInteger('max_qty')->nullable();
            $table->unsignedInteger('qty_step')->default(1);
            $table->integer('position')->default(0);
            $table->boolean('is_default')->default(false);
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['product_id', 'uid']);
            $table->index(['product_id', 'active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_variants');
    }
};
