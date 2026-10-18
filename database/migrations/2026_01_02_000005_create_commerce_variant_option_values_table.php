<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_variant_option_values', function (Blueprint $table) {
            $table->foreignId('variant_id')->constrained('commerce_variants')->cascadeOnDelete();
            $table->foreignId('option_value_id')->constrained('commerce_product_option_values')->cascadeOnDelete();
            $table->primary(['variant_id', 'option_value_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_variant_option_values');
    }
};
