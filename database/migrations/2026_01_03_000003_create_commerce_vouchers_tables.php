<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 64)->nullable()->unique();
            $table->string('name');
            $table->string('description', 500)->nullable();
            $table->boolean('automatic')->default(false)->index();
            $table->string('type', 20);
            $table->bigInteger('value')->default(0);
            $table->bigInteger('max_discount')->nullable();
            $table->json('bxgy')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->bigInteger('min_subtotal')->nullable();
            $table->bigInteger('max_subtotal')->nullable();
            $table->string('subtotal_basis', 20)->default('cart');
            $table->unsignedInteger('min_quantity')->nullable();
            $table->boolean('exclude_sale_items')->default(false);
            $table->string('audience', 20)->default('everyone');
            $table->json('roles')->nullable();
            $table->json('payment_methods')->nullable();
            $table->json('shipping_methods')->nullable();
            $table->json('destinations')->nullable();
            $table->unsignedInteger('usage_limit')->nullable();
            $table->unsignedInteger('usage_limit_per_customer')->nullable();
            $table->unsignedInteger('times_used')->default(0);
            $table->boolean('combinable')->default(true);
            $table->boolean('exclusive')->default(false);
            $table->integer('priority')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('commerce_voucher_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voucher_id')->constrained('commerce_vouchers')->cascadeOnDelete();
            $table->string('mode', 10);
            $table->string('target_type', 20);
            $table->unsignedBigInteger('target_id');
            $table->index(['voucher_id', 'mode']);
        });

        Schema::create('commerce_voucher_customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voucher_id')->constrained('commerce_vouchers')->cascadeOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->string('email')->nullable()->index();
        });

        // order_id points at commerce_orders (created later; not constrained here).
        Schema::create('commerce_voucher_redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voucher_id')->constrained('commerce_vouchers');
            $table->unsignedBigInteger('order_id')->index();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 40)->nullable();
            $table->string('code', 64)->nullable();
            $table->bigInteger('amount')->default(0);
            $table->timestamp('released_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['voucher_id', 'customer_id']);
            $table->index(['voucher_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_voucher_redemptions');
        Schema::dropIfExists('commerce_voucher_customers');
        Schema::dropIfExists('commerce_voucher_targets');
        Schema::dropIfExists('commerce_vouchers');
    }
};
