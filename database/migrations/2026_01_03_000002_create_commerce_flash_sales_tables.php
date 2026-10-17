<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_flash_sales', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamp('starts_at')->index();
            $table->timestamp('ends_at')->index();
            $table->boolean('active')->default(true);
            $table->string('badge', 40)->nullable();
            $table->json('description')->nullable();
            $table->boolean('show_countdown')->default(true);
            $table->boolean('show_progress')->default(true);
            $table->boolean('show_teaser')->default(true);
            $table->unsignedInteger('per_customer_limit')->nullable();
            $table->unsignedBigInteger('banner_asset_id')->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_flash_sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flash_sale_id')->constrained('commerce_flash_sales')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('commerce_products')->cascadeOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('commerce_variants')->cascadeOnDelete();
            $table->string('discount_type', 20);
            $table->bigInteger('discount_value');
            $table->unsignedInteger('quantity_limit')->nullable();
            $table->unsignedInteger('sold_quantity')->default(0);
            $table->unsignedInteger('per_customer_limit')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->index('variant_id');
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_flash_sale_items');
        Schema::dropIfExists('commerce_flash_sales');
    }
};
