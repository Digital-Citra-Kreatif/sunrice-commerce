<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Sunrice\Commerce\Marketing\Audience;
use Sunrice\Commerce\Marketing\Dispatcher;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Commerce\Marketing\Recipient;
use Sunrice\Support\Locales;

/** Finds a campaign's audience when it starts sending and queues an email for each. */
class StartCampaign implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public function __construct(public int $campaignId) {}

    public function uniqueId(): string
    {
        return (string) $this->campaignId;
    }

    public function handle(Audience $audience, Dispatcher $dispatcher): void
    {
        $campaign = Campaign::query()->find($this->campaignId);
        if ($campaign === null || $campaign->status !== 'sending') {
            return;
        }
        $recipients = (function () use ($audience, $campaign) {
            foreach ($audience->query($campaign->audience)->lazyById(500, 'commerce_customers.id', 'id') as $customer) {
                yield new Recipient($customer, $customer->email, (string) ($customer->locale ?? Locales::main()));
            }
        })();
        $dispatcher->queue($campaign, $recipients);

        // Nobody to send to: done at once.
        if (! $campaign->sends()->whereIn('status', ['queued', 'sending'])->exists()) {
            Campaign::query()->whereKey($campaign->id)->where('status', 'sending')->update(['status' => 'sent', 'finished_at' => now()]);
        }
    }
}
