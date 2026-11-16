<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A cart line is a variant plus its meta: the same variant with different
 * meta (a rental's dates, say) is two lines. line_key is a hash of the meta,
 * '' when there's none, so lines without meta merge as before.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commerce_cart_items', function (Blueprint $table) {
            $table->string('line_key', 40)->default('')->after('variant_id');
        });
        Schema::table('commerce_cart_items', function (Blueprint $table) {
            // The new index first: on MySQL the cart_id foreign key needs one.
            $table->unique(['cart_id', 'variant_id', 'line_key']);
            $table->dropUnique(['cart_id', 'variant_id']);
        });
    }

    public function down(): void
    {
        Schema::table('commerce_cart_items', function (Blueprint $table) {
            $table->unique(['cart_id', 'variant_id']);
            $table->dropUnique(['cart_id', 'variant_id', 'line_key']);
        });
        Schema::table('commerce_cart_items', function (Blueprint $table) {
            $table->dropColumn('line_key');
        });
    }
};
