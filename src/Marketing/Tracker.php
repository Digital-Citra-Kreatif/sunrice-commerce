<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Commerce\Marketing\Models\CampaignLink;
use Sunrice\Commerce\Marketing\Models\CampaignSend;

/**
 * Counts opens (the email's tracking image loaded), clicks (a tracked
 * link followed; a click also counts as an open, for clients that block
 * images) and unsubscribes. Each counts once per email on the campaign.
 */
class Tracker
{
    public function open(string $token): void
    {
        $send = $this->find($token);
        if ($send !== null) {
            $this->markOpened($send);
        }
    }

    /** @return string|null the link's address, or null for an unknown token or link */
    public function click(string $token, string $hash): ?string
    {
        $send = $this->find($token);
        $link = $send === null ? null : CampaignLink::query()->where('campaign_id', $send->campaign_id)->where('hash', $hash)->first();
        if ($send === null || $link === null) {
            return null;
        }
        $this->markOpened($send);
        $context = (array) $send->context;
        $clicked = (array) ($context['clicked'] ?? []);
        $first = ! in_array($hash, $clicked, true);
        if ($first) {
            $context['clicked'] = [...$clicked, $hash];
            $send->context = $context;
        }
        if ($send->clicked_at === null) {
            Campaign::query()->whereKey($send->campaign_id)->increment('clicked_count');
            $send->clicked_at = now();
        }
        $send->click_count++;
        $send->save();
        $link->increment('clicks', 1, $first ? ['unique_clicks' => $link->unique_clicks + 1] : []);

        return $link->url;
    }

    public function unsubscribe(string $token): ?CampaignSend
    {
        $send = $this->find($token);
        if ($send === null) {
            return null;
        }
        Consent::withdraw($send->customer, $send->email);
        if ($send->unsubscribed_at === null) {
            $send->forceFill(['unsubscribed_at' => now()])->save();
            Campaign::query()->whereKey($send->campaign_id)->increment('unsubscribed_count');
        }

        return $send;
    }

    public function find(string $token): ?CampaignSend
    {
        return strlen($token) === 40 ? CampaignSend::query()->with('customer')->where('token', $token)->where('status', 'sent')->first() : null;
    }

    protected function markOpened(CampaignSend $send): void
    {
        if ($send->opened_at === null) {
            Campaign::query()->whereKey($send->campaign_id)->increment('opened_count');
            $send->opened_at = now();
        }
        $send->open_count++;
        $send->save();
    }
}
