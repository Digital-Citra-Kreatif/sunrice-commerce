<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_product_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('commerce_products')->cascadeOnDelete();
            $table->string('uid', 32);
            $table->string('name');
            $table->unsignedBigInteger('taxonomy_id')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->unique(['product_id', 'uid']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_product_options');
    }
};
