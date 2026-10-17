<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_product_option_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('option_id')->constrained('commerce_product_options')->cascadeOnDelete();
            $table->string('uid', 32);
            $table->string('label')->nullable();
            $table->unsignedBigInteger('term_id')->nullable()->index();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->unique(['option_id', 'uid']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_product_option_values');
    }
};
