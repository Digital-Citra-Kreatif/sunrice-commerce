<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_webhooks', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('url', 2000);
            $table->json('events');
            $table->text('secret');
            $table->boolean('active')->default(true);
            $table->unsignedInteger('failures')->default(0);
            $table->timestamp('disabled_at')->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_webhook_deliveries', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('webhook_id')->constrained('commerce_webhooks')->cascadeOnDelete();
            $table->string('event', 60);
            $table->json('payload');
            $table->string('status', 20)->default('pending');
            $table->unsignedSmallInteger('attempts')->default(0);
            $table->unsignedSmallInteger('response_status')->nullable();
            $table->string('error', 500)->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            $table->index(['webhook_id', 'id']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_webhook_deliveries');
        Schema::dropIfExists('commerce_webhooks');
    }
};
