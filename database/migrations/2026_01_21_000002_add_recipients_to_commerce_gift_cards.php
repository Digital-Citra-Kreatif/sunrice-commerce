<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Who a bought gift card is for: it is emailed to them, with the buyer's message. */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commerce_gift_cards', function (Blueprint $table) {
            $table->string('recipient_name', 120)->nullable();
            $table->string('recipient_email', 190)->nullable();
            $table->string('message', 500)->nullable();
            $table->timestamp('sent_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('commerce_gift_cards', function (Blueprint $table) {
            $table->dropColumn(['recipient_name', 'recipient_email', 'message', 'sent_at']);
        });
    }
};
