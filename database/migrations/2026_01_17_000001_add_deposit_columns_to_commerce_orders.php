<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Deposits: an order paid in two parts. deposit_total is what was asked at
 * checkout (0 for an order paid in full); the balance (total − paid_total)
 * is due by balance_due_at.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commerce_orders', function (Blueprint $table) {
            $table->bigInteger('deposit_total')->default(0)->after('paid_total');
            $table->timestamp('balance_due_at')->nullable()->after('deposit_total');
            $table->index(['payment_status', 'balance_due_at']);
        });
    }

    public function down(): void
    {
        Schema::table('commerce_orders', function (Blueprint $table) {
            $table->dropIndex(['payment_status', 'balance_due_at']);
            $table->dropColumn(['deposit_total', 'balance_due_at']);
        });
    }
};
