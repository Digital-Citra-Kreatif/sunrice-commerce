<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_webhook_calls', function (Blueprint $table) {
            $table->id();
            $table->string('method', 60);
            $table->string('event_id', 120)->nullable();
            $table->string('payload_hash', 64);
            $table->unsignedBigInteger('payment_id')->nullable()->index();
            $table->string('status', 20)->default('received')->index();
            $table->text('error')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->unique(['method', 'event_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_webhook_calls');
    }
};
