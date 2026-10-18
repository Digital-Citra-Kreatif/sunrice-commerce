<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->unique();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('phone', 32)->nullable()->index();
            $table->boolean('accepts_marketing')->default(false);
            $table->timestamp('marketing_consent_at')->nullable();
            $table->string('locale', 10)->nullable();
            $table->unsignedInteger('orders_count')->default(0);
            $table->bigInteger('total_spent')->default(0);
            $table->timestamp('first_order_at')->nullable();
            $table->timestamp('last_order_at')->nullable();
            $table->text('note')->nullable();
            $table->timestamp('deletion_requested_at')->nullable();
            $table->timestamp('anonymized_at')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });

        Schema::create('commerce_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('commerce_customers')->cascadeOnDelete();
            $table->string('label', 60)->nullable();
            $table->string('name');
            $table->string('phone', 32)->nullable();
            $table->string('company')->nullable();
            $table->char('country', 2)->default('ID');
            foreach (['province', 'city', 'district', 'village'] as $level) {
                $table->string("{$level}_code", 20)->nullable();
                $table->string($level)->nullable();
            }
            $table->string('state')->nullable();
            $table->string('postal_code', 12)->nullable();
            $table->string('line1');
            $table->string('line2')->nullable();
            $table->string('notes')->nullable();
            $table->boolean('default_shipping')->default(false);
            $table->boolean('default_billing')->default(false);
            $table->timestamps();
        });

        Schema::create('commerce_social_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('provider', 30);
            $table->string('provider_id');
            $table->string('email')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamps();
            $table->unique(['provider', 'provider_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_social_accounts');
        Schema::dropIfExists('commerce_addresses');
        Schema::dropIfExists('commerce_customers');
    }
};
