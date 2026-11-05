<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('commerce_products')->cascadeOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            // The order it was bought in: shown as a verified purchase.
            $table->foreignId('order_id')->nullable()->constrained('commerce_orders')->nullOnDelete();
            $table->string('name', 100);
            $table->string('email')->nullable();
            $table->unsignedTinyInteger('rating');
            $table->string('title', 150)->nullable();
            $table->text('body');
            $table->string('locale', 16)->nullable();
            $table->string('status', 16)->default('pending');
            $table->text('reply')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
            // The product page's approved reviews, newest first.
            $table->index(['product_id', 'status', 'created_at']);
            $table->index(['status', 'created_at']);
            // One review per customer and product (guests' rows have no customer, so they don't collide).
            $table->unique(['product_id', 'customer_id']);
        });

        Schema::table('commerce_products', function (Blueprint $table) {
            // Approved reviews only, kept by Reviews\ProductRating.
            $table->unsignedInteger('rating_count')->default(0);
            $table->decimal('rating_average', 3, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('commerce_products', function (Blueprint $table) {
            $table->dropColumn(['rating_count', 'rating_average']);
        });
        Schema::dropIfExists('commerce_reviews');
    }
};
