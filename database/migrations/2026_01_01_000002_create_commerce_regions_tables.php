<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Indonesian administrative regions, keyed by the official Kemendagri code.
        Schema::create('commerce_regions', function (Blueprint $table) {
            $table->string('code', 13)->primary();
            $table->string('parent_code', 13)->nullable()->index();
            $table->unsignedTinyInteger('level');
            $table->string('name');
            $table->string('kind', 20);
            $table->string('postal_code', 5)->nullable();
            $table->boolean('active')->default(true);
            $table->string('dataset', 60)->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['level', 'active']);
        });

        // Carrier and integration location ids for region codes.
        Schema::create('commerce_region_mappings', function (Blueprint $table) {
            $table->id();
            $table->string('provider', 60);
            $table->string('region_code', 13)->index();
            $table->string('external_id');
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->unique(['provider', 'region_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_region_mappings');
        Schema::dropIfExists('commerce_regions');
    }
};
