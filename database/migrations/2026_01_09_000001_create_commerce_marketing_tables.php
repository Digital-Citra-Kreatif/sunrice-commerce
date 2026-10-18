<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Campaigns (sent once to an audience) and automations (sent whenever a trigger fires).
        Schema::create('commerce_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('type', 20)->default('campaign')->index();
            $table->string('name');
            $table->string('status', 20)->default('draft')->index();
            $table->string('trigger', 40)->nullable();
            $table->json('trigger_config')->nullable();
            $table->json('audience')->nullable();
            $table->json('content')->nullable();
            $table->timestamp('scheduled_at')->nullable()->index();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamp('last_run_at')->nullable();
            foreach (['recipients', 'sent', 'failed', 'opened', 'clicked', 'unsubscribed'] as $counter) {
                $table->unsignedInteger("{$counter}_count")->default(0);
            }
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        // One email to one person; the token identifies it in tracking and unsubscribe links.
        Schema::create('commerce_campaign_sends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('commerce_campaigns')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('commerce_customers')->nullOnDelete();
            $table->string('email');
            $table->string('locale', 10)->nullable();
            $table->string('dedupe_key', 100)->default('');
            $table->string('token', 40)->unique();
            $table->string('status', 20)->default('queued')->index();
            $table->json('context')->nullable();
            $table->string('error')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->unsignedInteger('open_count')->default(0);
            $table->timestamp('clicked_at')->nullable();
            $table->unsignedInteger('click_count')->default(0);
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
            $table->unique(['campaign_id', 'email', 'dedupe_key']);
            $table->index(['customer_id', 'sent_at']);
        });

        // The links of a campaign's emails, so clicks only ever redirect to them.
        Schema::create('commerce_campaign_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('commerce_campaigns')->cascadeOnDelete();
            $table->string('hash', 40);
            $table->text('url');
            $table->unsignedInteger('clicks')->default(0);
            $table->unsignedInteger('unique_clicks')->default(0);
            $table->timestamps();
            $table->unique(['campaign_id', 'hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commerce_campaign_links');
        Schema::dropIfExists('commerce_campaign_sends');
        Schema::dropIfExists('commerce_campaigns');
    }
};
