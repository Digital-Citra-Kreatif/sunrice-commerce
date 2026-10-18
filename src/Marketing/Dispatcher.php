<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Sunrice\Commerce\Marketing\Jobs\SendMarketingEmails;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Support\Locales;

/**
 * Queues a marketing email for recipients: one row each (skipping anyone
 * who already got it, by email and dedupe key), sent by queued jobs in
 * batches (commerce.marketing.batch_size), spread out when
 * commerce.marketing.per_minute is set.
 */
class Dispatcher
{
    /** Batches queued by this dispatcher so far (to space them out). */
    protected int $batches = 0;

    /**
     * @param  iterable<Recipient>  $recipients
     * @return int how many were queued
     */
    public function queue(Campaign $campaign, iterable $recipients): int
    {
        $this->batches = 0;
        $queued = 0;
        $rows = [];
        foreach ($recipients as $recipient) {
            $rows[] = [
                'campaign_id' => $campaign->id,
                'customer_id' => $recipient->customer?->id,
                'email' => mb_strtolower($recipient->email),
                'locale' => in_array($recipient->locale, Locales::available(), true) ? $recipient->locale : Locales::main(),
                'dedupe_key' => $recipient->dedupeKey,
                'token' => Str::random(40),
                'status' => 'queued',
                'context' => $recipient->context === [] ? null : json_encode($recipient->context),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            if (count($rows) >= 500) {
                $queued += $this->flush($campaign, $rows);
                $rows = [];
            }
        }
        if ($rows !== []) {
            $queued += $this->flush($campaign, $rows);
        }
        if ($queued > 0) {
            Campaign::query()->whereKey($campaign->id)->increment('recipients_count', $queued);
        }

        return $queued;
    }

    /** @param  array<int, array<string, mixed>>  $rows */
    protected function flush(Campaign $campaign, array $rows): int
    {
        DB::table('commerce_campaign_sends')->insertOrIgnore($rows);
        // Rows already there (same email and dedupe key) were ignored: only the new tokens come back.
        $ids = DB::table('commerce_campaign_sends')->whereIn('token', array_column($rows, 'token'))->orderBy('id')->pluck('id')->all();
        $size = max(1, (int) config('commerce.marketing.batch_size', 50));
        $perMinute = (int) config('commerce.marketing.per_minute', 0);
        foreach (array_chunk($ids, $size) as $batch) {
            $job = SendMarketingEmails::dispatch($campaign->id, $batch)->onQueue(config('commerce.marketing.queue'));
            if ($perMinute > 0) {
                $job->delay(now()->addSeconds((int) floor($this->batches * $size / $perMinute * 60)));
            }
            $this->batches++;
        }

        return count($ids);
    }
}
