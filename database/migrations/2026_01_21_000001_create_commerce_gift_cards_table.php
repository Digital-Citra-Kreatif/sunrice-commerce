<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Gift cards: codes a customer redeems in My Account → Points for loyalty
 * points (1 point is 1 unit of the store's currency). Issued when a gift
 * card product is paid, or made by staff.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commerce_products', function (Blueprint $table) {
            // Paying for it issues a gift card worth its price (per unit).
            $table->boolean('gift_card')->default(false);
        });

        Schema::create('commerce_gift_cards', function (Blueprint $table) {
            $table->id();
            $table->string('code', 32)->unique();
            // In minor units: the points it adds when redeemed.
            $table->bigInteger('value');
            // active | redeemed | disabled
            $table->string('status', 16)->default('active');
            // Redeem by (null: any time).
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('order_id')->nullable()->constrained('commerce_orders')->nullOnDelete();
            $table->unsignedBigInteger('order_item_id')->nullable();
            $table->foreignId('redeemed_by')->nullable()->constrained('commerce_customers')->nullOnDelete();
            $table->timestamp('redeemed_at')->nullable();
            $table->string('note', 500)->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
            $table->index(['order_id']);
            $table->index(['status', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_gift_cards');
        Schema::table('commerce_products', function (Blueprint $table) {
            $table->dropColumn('gift_card');
        });
    }
};
