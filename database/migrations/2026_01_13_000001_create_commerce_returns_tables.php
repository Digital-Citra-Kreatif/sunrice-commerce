<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->string('status', 16)->default('requested');
            $table->string('reason', 32);
            $table->text('details')->nullable();
            // To the customer with the last change of status.
            $table->text('note')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'created_at']);
        });

        Schema::create('commerce_return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_id')->constrained('commerce_returns')->cascadeOnDelete();
            $table->foreignId('order_item_id')->constrained('commerce_order_items')->cascadeOnDelete();
            $table->unsignedInteger('quantity');
            $table->unique(['return_id', 'order_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_return_items');
        Schema::dropIfExists('commerce_returns');
    }
};
