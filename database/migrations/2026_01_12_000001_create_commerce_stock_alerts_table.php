<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_stock_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('commerce_products')->cascadeOnDelete();
            $table->foreignId('variant_id')->constrained('commerce_variants')->cascadeOnDelete();
            $table->string('email');
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->string('locale', 16)->nullable();
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();
            $table->unique(['variant_id', 'email']);
            // The tick's "who's waiting" and the prune.
            $table->index(['notified_at', 'variant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_stock_alerts');
    }
};
