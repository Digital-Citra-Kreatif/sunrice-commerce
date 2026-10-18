<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Actions;

use Carbon\CarbonInterface;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Marketing\Audience;
use Sunrice\Commerce\Marketing\Jobs\StartCampaign;
use Sunrice\Commerce\Marketing\Models\Campaign;

/** Sends a campaign now, or schedules it (commerce:tick starts it when due); or takes it back to draft. */
class LaunchCampaign
{
    /** @throws ValidationException */
    public function handle(Campaign $campaign, ?CarbonInterface $at = null): Campaign
    {
        if ($campaign->isAutomation() || ! in_array($campaign->status, ['draft', 'scheduled'], true)) {
            throw ValidationException::withMessages(['campaign' => 'Only a draft or scheduled campaign can be sent.']);
        }
        if (app(Audience::class)->count($campaign->audience) === 0) {
            throw ValidationException::withMessages(['campaign' => 'Nobody matches the audience yet. Only customers who accept marketing can be emailed.']);
        }
        if ($at !== null && $at->isFuture()) {
            $campaign->forceFill(['status' => 'scheduled', 'scheduled_at' => $at])->save();

            return $campaign;
        }
        $this->start($campaign);

        return $campaign;
    }

    /** Start sending (now, or when a scheduled campaign is due). */
    public function start(Campaign $campaign): void
    {
        $started = Campaign::query()->whereKey($campaign->id)->whereIn('status', ['draft', 'scheduled'])
            ->update(['status' => 'sending', 'started_at' => now(), 'scheduled_at' => $campaign->scheduled_at ?? now()]);
        if ($started === 1) {
            StartCampaign::dispatch($campaign->id)->onQueue(config('commerce.marketing.queue'));
        }
        $campaign->refresh();
    }

    public function unschedule(Campaign $campaign): void
    {
        Campaign::query()->whereKey($campaign->id)->where('status', 'scheduled')->update(['status' => 'draft', 'scheduled_at' => null]);
    }

    /** Stop a campaign that is sending: emails not yet sent are skipped. */
    public function cancel(Campaign $campaign): void
    {
        Campaign::query()->whereKey($campaign->id)->where('status', 'sending')->update(['status' => 'cancelled', 'finished_at' => now()]);
        $campaign->sends()->where('status', 'queued')->update(['status' => 'skipped', 'error' => 'Cancelled']);
    }
}
