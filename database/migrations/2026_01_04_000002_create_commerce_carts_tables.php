<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_carts', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->foreignId('customer_id')->nullable()->constrained('commerce_customers')->nullOnDelete();
            $table->string('currency', 3)->default('IDR');
            $table->string('locale', 10)->nullable();
            $table->json('vouchers')->nullable();
            $table->json('checkout')->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->unsignedBigInteger('order_id')->nullable()->index();
            $table->timestamp('last_activity_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('commerce_cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('commerce_carts')->cascadeOnDelete();
            $table->foreignId('variant_id')->constrained('commerce_variants')->cascadeOnDelete();
            $table->unsignedInteger('quantity');
            $table->bigInteger('unit_price_seen')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->unique(['cart_id', 'variant_id']);
        });

        Schema::create('commerce_wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained('commerce_customers')->cascadeOnDelete();
            $table->string('token', 64)->nullable()->unique();
            $table->string('share_token', 64)->unique();
            $table->boolean('is_shared')->default(false);
            $table->timestamps();
        });

        Schema::create('commerce_wishlist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wishlist_id')->constrained('commerce_wishlists')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('commerce_products')->cascadeOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('commerce_variants')->cascadeOnDelete();
            $table->timestamp('created_at')->nullable();
            $table->unique(['wishlist_id', 'product_id', 'variant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_wishlist_items');
        Schema::dropIfExists('commerce_wishlists');
        Schema::dropIfExists('commerce_cart_items');
        Schema::dropIfExists('commerce_carts');
    }
};
