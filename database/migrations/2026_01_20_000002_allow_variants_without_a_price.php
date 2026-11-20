<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/** A variant may have no price (null): "price on request", priced by staff in a quote. */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commerce_variants', function (Blueprint $table): void {
            $table->bigInteger('price')->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        DB::table('commerce_variants')->whereNull('price')->update(['price' => 0]);
        Schema::table('commerce_variants', function (Blueprint $table): void {
            $table->bigInteger('price')->default(0)->change();
        });
    }
};
