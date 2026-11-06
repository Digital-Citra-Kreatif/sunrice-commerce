<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commerce_customers', function (Blueprint $table) {
            // The loyalty wallet: 1 point is 1 unit (minor units) of the store's currency.
            $table->bigInteger('loyalty_points')->default(0);
        });

        Schema::create('commerce_loyalty_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('commerce_customers')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('commerce_orders')->nullOnDelete();
            // earn | redeem | release | refund | revoke | adjust | expire
            $table->string('kind', 16);
            $table->bigInteger('points');
            // Credits only: what is left of them to spend, used oldest-expiring first.
            $table->bigInteger('remaining')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->string('note', 500)->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['customer_id', 'id']);
            $table->index(['order_id', 'kind']);
            $table->index(['expires_at', 'remaining']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_loyalty_transactions');
        Schema::table('commerce_customers', function (Blueprint $table) {
            $table->dropColumn('loyalty_points');
        });
    }
};
