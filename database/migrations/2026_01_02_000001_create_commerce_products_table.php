<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('entry_id')->unique();
            $table->unsignedBigInteger('collection_id')->index();
            $table->string('type', 20)->default('simple');
            $table->string('purchase_mode', 20)->default('default');
            $table->json('external_links')->nullable();
            $table->boolean('requires_shipping')->default(true);
            $table->boolean('downloadable')->default(false);
            $table->boolean('featured')->default(false)->index();
            $table->string('tax_class', 40)->nullable();
            $table->string('bundle_pricing', 20)->nullable();
            $table->bigInteger('bundle_value')->nullable();
            $table->json('delivery')->nullable();
            $table->bigInteger('min_price')->nullable()->index();
            $table->bigInteger('max_price')->nullable()->index();
            $table->bigInteger('min_regular_price')->nullable();
            $table->bigInteger('max_regular_price')->nullable();
            $table->boolean('on_sale')->default(false)->index();
            $table->boolean('in_stock')->default(true)->index();
            $table->unsignedInteger('sales_count')->default(0);
            $table->string('data_hash', 64)->nullable();
            $table->string('sync_status', 20)->default('ok')->index();
            $table->text('sync_error')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamp('removed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_products');
    }
};
