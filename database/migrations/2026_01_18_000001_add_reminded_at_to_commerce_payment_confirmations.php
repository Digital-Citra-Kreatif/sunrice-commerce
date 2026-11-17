<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** When staff were reminded of a payment confirmation still waiting for review (once). */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commerce_payment_confirmations', function (Blueprint $table) {
            $table->timestamp('reminded_at')->nullable()->after('reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::table('commerce_payment_confirmations', function (Blueprint $table) {
            $table->dropColumn('reminded_at');
        });
    }
};
