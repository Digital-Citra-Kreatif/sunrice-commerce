<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_price_tiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('commerce_products')->cascadeOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('commerce_variants')->cascadeOnDelete();
            $table->unsignedInteger('min_qty');
            $table->string('type', 20);
            $table->bigInteger('value');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_price_tiers');
    }
};
