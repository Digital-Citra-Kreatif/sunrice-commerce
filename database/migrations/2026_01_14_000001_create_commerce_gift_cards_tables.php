<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_gift_cards', function (Blueprint $table) {
            $table->id();
            $table->string('code', 32)->unique();
            $table->bigInteger('initial_amount');
            $table->bigInteger('balance');
            $table->string('currency', 3)->default('IDR');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('disabled_at')->nullable();
            $table->string('recipient_email')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_gift_card_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gift_card_id')->constrained('commerce_gift_cards')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('commerce_orders')->nullOnDelete();
            // issue | redeem (negative) | release | adjust
            $table->string('kind', 16);
            $table->bigInteger('amount');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['order_id', 'kind']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_gift_card_transactions');
        Schema::dropIfExists('commerce_gift_cards');
    }
};
