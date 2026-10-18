<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_shipping_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('everywhere_else')->default(false);
            $table->timestamps();
        });

        Schema::create('commerce_shipping_zone_regions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('commerce_shipping_zones')->cascadeOnDelete();
            $table->char('country', 2);
            $table->string('region_code', 20)->nullable();
            $table->index(['country', 'region_code']);
        });

        Schema::create('commerce_shipping_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('commerce_shipping_zones')->cascadeOnDelete();
            $table->string('type', 40);
            $table->json('title')->nullable();
            $table->json('etd')->nullable();
            $table->json('settings')->nullable();
            $table->boolean('active')->default(true);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_shipping_methods');
        Schema::dropIfExists('commerce_shipping_zone_regions');
        Schema::dropIfExists('commerce_shipping_zones');
    }
};
