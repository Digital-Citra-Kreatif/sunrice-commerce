<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_tax_rates', function (Blueprint $table) {
            $table->id();
            $table->string('tax_class', 40)->default('standard');
            $table->char('country', 2)->nullable();
            $table->string('region_code', 20)->nullable();
            $table->string('name', 80);
            $table->unsignedInteger('rate');
            $table->boolean('compound')->default(false);
            $table->boolean('shipping')->default(true);
            $table->integer('priority')->default(0);
            $table->timestamps();
            $table->index(['tax_class', 'country']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_tax_rates');
    }
};
