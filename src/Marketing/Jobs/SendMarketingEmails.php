<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Marketing\Consent;
use Sunrice\Commerce\Marketing\MarketingMail;
use Sunrice\Commerce\Marketing\MessageBuilder;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Commerce\Marketing\Models\CampaignSend;
use Throwable;

/**
 * Sends a batch of a marketing email's queued rows. Each row is claimed
 * before it is sent, so a retried job never sends twice; consent is
 * checked again at sending (someone may have unsubscribed meanwhile).
 */
class SendMarketingEmails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries = 3;

    /** @param  array<int, int>  $sendIds */
    public function __construct(public int $campaignId, public array $sendIds) {}

    public function handle(MessageBuilder $builder): void
    {
        $campaign = Campaign::query()->find($this->campaignId);
        if ($campaign === null || ! app(Features::class)->active('marketing') || in_array($campaign->status, ['cancelled', 'paused'], true)) {
            // Left queued: a paused automation's emails go when it is resumed.
            if ($campaign !== null && $campaign->status === 'cancelled') {
                CampaignSend::query()->whereIn('id', $this->sendIds)->where('status', 'queued')->update(['status' => 'skipped', 'error' => 'Cancelled']);
            }

            return;
        }
        $mailer = config('commerce.marketing.mailer');
        $previous = App::getLocale();
        try {
            foreach ($this->sendIds as $id) {
                // Claim it: only one worker moves a row out of "queued".
                if (CampaignSend::query()->whereKey($id)->where('status', 'queued')->update(['status' => 'sending']) !== 1) {
                    continue;
                }
                $send = CampaignSend::query()->with('customer')->findOrFail($id);
                $context = (array) $send->context;
                $customer = $send->customer ?? Customer::query()->where('email', $send->email)->first();
                if (! Consent::allows($customer, (bool) ($context['ticked'] ?? false))) {
                    $send->forceFill(['status' => 'skipped', 'error' => 'No longer accepts marketing'])->save();

                    continue;
                }
                try {
                    App::setLocale((string) $send->locale);
                    $message = $builder->build($campaign, $customer, $send->email, (string) $send->locale, $send->token, $context);
                    Mail::mailer(is_string($mailer) && $mailer !== '' ? $mailer : null)
                        ->to($send->email)->send(new MarketingMail($message['subject'], $message['html'], $message['text'], $message['unsubscribe_url']));
                    $send->forceFill(['status' => 'sent', 'sent_at' => now(), 'error' => null])->save();
                    Campaign::query()->whereKey($campaign->id)->increment('sent_count');
                } catch (Throwable $e) {
                    report($e);
                    $send->forceFill(['status' => 'failed', 'error' => mb_substr($e->getMessage(), 0, 250)])->save();
                    Campaign::query()->whereKey($campaign->id)->increment('failed_count');
                }
            }
        } finally {
            App::setLocale($previous);
        }

        // The last batch of a campaign closes it.
        if ($campaign->type === Campaign::CAMPAIGN && $campaign->status === 'sending'
            && ! CampaignSend::query()->where('campaign_id', $campaign->id)->whereIn('status', ['queued', 'sending'])->exists()) {
            Campaign::query()->whereKey($campaign->id)->where('status', 'sending')->update(['status' => 'sent', 'finished_at' => now()]);
        }
    }
}
