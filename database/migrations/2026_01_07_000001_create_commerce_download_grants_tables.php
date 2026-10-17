<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_download_grants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('commerce_orders')->cascadeOnDelete();
            $table->foreignId('order_item_id')->constrained('commerce_order_items')->cascadeOnDelete();
            $table->foreignId('download_file_id')->constrained('commerce_download_files')->cascadeOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->string('email')->nullable();
            $table->string('token', 64)->unique();
            $table->unsignedInteger('downloads_remaining')->nullable();
            $table->unsignedInteger('download_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamp('last_downloaded_at')->nullable();
            $table->timestamps();
            $table->unique(['order_item_id', 'download_file_id']);
        });

        Schema::create('commerce_download_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grant_id')->constrained('commerce_download_grants')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_download_logs');
        Schema::dropIfExists('commerce_download_grants');
    }
};
