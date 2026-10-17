<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variant_id')->constrained('commerce_variants')->cascadeOnDelete();
            $table->integer('delta');
            $table->integer('quantity_after')->nullable();
            $table->string('reason', 20);
            $table->nullableMorphs('reference');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('note')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['variant_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_stock_movements');
    }
};
