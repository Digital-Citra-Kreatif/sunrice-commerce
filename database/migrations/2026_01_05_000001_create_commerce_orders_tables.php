<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_orders', function (Blueprint $table) {
            $table->id();
            $table->string('type', 10)->default('order')->index();
            $table->string('number', 60)->nullable()->unique();
            $table->string('quote_number', 60)->nullable()->unique();
            $table->string('order_key', 40)->unique();
            $table->string('checkout_token', 64)->nullable()->unique();
            $table->string('status', 30)->index();
            $table->string('payment_status', 30)->index();
            $table->string('fulfillment_status', 30)->index();
            $table->string('channel', 20)->default('storefront');
            $table->string('selling_mode', 20)->default('shop');
            $table->foreignId('customer_id')->nullable()->index()->constrained('commerce_customers')->nullOnDelete();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('phone', 32)->nullable()->index();
            $table->string('customer_name')->nullable();
            $table->json('billing_address')->nullable();
            $table->json('shipping_address')->nullable();
            $table->json('shipping_method')->nullable();
            $table->string('payment_method', 60)->nullable()->index();
            $table->string('payment_method_title')->nullable();
            $table->string('currency', 3)->default('IDR');
            $table->string('locale', 10)->nullable();
            $table->boolean('prices_include_tax')->default(true);
            foreach (['subtotal', 'discount_total', 'shipping_total', 'fee_total', 'tax_total', 'total', 'paid_total', 'refunded_total'] as $money) {
                $table->bigInteger($money)->default(0);
            }
            $table->unsignedInteger('weight')->default(0);
            $table->text('customer_note')->nullable();
            $table->json('dropship')->nullable();
            $table->json('fields')->nullable();
            $table->json('meta')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('placed_at')->nullable()->index();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamp('quote_valid_until')->nullable();
            $table->string('cancel_reason')->nullable();
            $table->unsignedInteger('version')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('commerce_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('commerce_order_items')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('commerce_products')->nullOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('commerce_variants')->nullOnDelete();
            $table->unsignedBigInteger('entry_id')->nullable();
            $table->unsignedBigInteger('flash_sale_item_id')->nullable()->index();
            $table->string('name');
            $table->string('variant_title')->nullable();
            $table->string('sku')->nullable()->index();
            $table->json('options')->nullable();
            $table->unsignedInteger('quantity');
            $table->bigInteger('unit_price')->default(0);
            $table->bigInteger('regular_unit_price')->default(0);
            $table->bigInteger('compare_at_price')->nullable();
            $table->json('price_source')->nullable();
            foreach (['subtotal', 'discount_total', 'tax_total', 'total'] as $money) {
                $table->bigInteger($money)->default(0);
            }
            $table->bigInteger('cost')->nullable();
            $table->unsignedInteger('weight')->default(0);
            $table->boolean('requires_shipping')->default(true);
            $table->boolean('downloadable')->default(false);
            $table->unsignedInteger('fulfilled_quantity')->default(0);
            $table->unsignedInteger('refunded_quantity')->default(0);
            $table->json('meta')->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_order_adjustments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained('commerce_order_items')->cascadeOnDelete();
            $table->string('kind', 30);
            $table->string('source_type', 40);
            $table->string('source_id', 64)->nullable();
            $table->string('code', 60)->nullable();
            $table->string('label')->nullable();
            $table->bigInteger('amount');
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['source_type', 'source_id']);
        });

        Schema::create('commerce_order_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->string('type', 20);
            $table->string('visibility', 10)->default('internal');
            $table->text('message')->nullable();
            $table->json('data')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('source', 20)->default('system');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('commerce_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->string('method', 60);
            $table->string('method_title')->nullable();
            $table->bigInteger('amount');
            $table->string('currency', 3)->default('IDR');
            $table->string('status', 30)->default('pending')->index();
            $table->string('reference')->nullable()->index();
            $table->json('instructions')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->bigInteger('refunded_amount')->default(0);
            $table->json('meta')->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_payment_confirmations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained('commerce_payments')->nullOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('sender_name');
            $table->string('sender_bank')->nullable();
            $table->bigInteger('amount');
            $table->date('transferred_at')->nullable();
            $table->json('destination')->nullable();
            $table->string('proof_disk')->nullable();
            $table->string('proof_path')->nullable();
            $table->string('note')->nullable();
            $table->string('status', 20)->default('submitted')->index();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->string('review_note')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->bigInteger('amount');
            $table->string('reason')->nullable();
            $table->json('items')->nullable();
            $table->boolean('restock')->default(false);
            $table->string('method', 20)->default('manual');
            $table->string('reference')->nullable();
            $table->string('status', 20)->default('completed');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->string('courier', 40)->nullable();
            $table->string('courier_name')->nullable();
            $table->string('service')->nullable();
            $table->string('tracking_number')->nullable()->index();
            $table->string('tracking_url')->nullable();
            $table->string('status', 20)->default('shipped');
            $table->json('items')->nullable();
            $table->bigInteger('cost')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->json('meta')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->string('type', 20);
            $table->string('number', 60)->nullable();
            $table->timestamp('issued_at')->nullable();
            $table->string('disk')->nullable();
            $table->string('path')->nullable();
            $table->unsignedInteger('order_version')->default(1);
            $table->timestamps();
            $table->unique(['type', 'number']);
        });
    }

    public function down(): void
    {
        foreach (['commerce_documents', 'commerce_shipments', 'commerce_refunds', 'commerce_payment_confirmations', 'commerce_payments',
            'commerce_order_events', 'commerce_order_adjustments', 'commerce_order_items', 'commerce_orders'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
