<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commerce_price_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('active')->default(true);
            $table->integer('priority')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->string('audience', 20)->default('everyone');
            $table->json('roles')->nullable();
            $table->string('scope', 20)->default('all');
            $table->string('quantity_basis', 20)->default('variant');
            $table->json('tiers');
            $table->timestamps();
        });

        Schema::create('commerce_price_rule_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rule_id')->constrained('commerce_price_rules')->cascadeOnDelete();
            $table->string('target_type', 20);
            $table->unsignedBigInteger('target_id');
            $table->index(['target_type', 'target_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_price_rule_targets');
        Schema::dropIfExists('commerce_price_rules');
    }
};
