<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Sunrice\Support\Locales;

/**
 * A marketing email: a campaign (type campaign, sent once to an audience,
 * now or at scheduled_at) or an automation (type automation, sent to each
 * customer its trigger finds while it is active).
 *
 * Campaign statuses: draft | scheduled | sending | sent | cancelled.
 * Automation statuses: draft | active | paused.
 *
 * @property int $id
 * @property string $type
 * @property string $name
 * @property string $status
 * @property string|null $trigger
 * @property array<string, mixed>|null $trigger_config
 * @property array{match?: string, rules?: array<int, array{rule: string, value?: mixed}>}|null $audience
 * @property array<string, array<string, string|null>>|null $content locale => subject, preheader, body, button_label, button_url
 * @property Carbon|null $scheduled_at
 * @property Carbon|null $started_at
 * @property Carbon|null $finished_at
 * @property Carbon|null $last_run_at
 * @property int $recipients_count
 * @property int $sent_count
 * @property int $failed_count
 * @property int $opened_count
 * @property int $clicked_count
 * @property int $unsubscribed_count
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Campaign extends Model
{
    public const CAMPAIGN = 'campaign';

    public const AUTOMATION = 'automation';

    protected $table = 'commerce_campaigns';

    protected $guarded = [];

    protected $casts = [
        'trigger_config' => 'array',
        'audience' => 'array',
        'content' => 'array',
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'last_run_at' => 'datetime',
    ];

    /** @return HasMany<CampaignSend, $this> */
    public function sends(): HasMany
    {
        return $this->hasMany(CampaignSend::class);
    }

    /** @return HasMany<CampaignLink, $this> */
    public function links(): HasMany
    {
        return $this->hasMany(CampaignLink::class);
    }

    public function isAutomation(): bool
    {
        return $this->type === self::AUTOMATION;
    }

    /** Whether its content and audience can still be changed. */
    public function editable(): bool
    {
        return $this->isAutomation() || in_array($this->status, ['draft', 'scheduled'], true);
    }

    /**
     * The content for a language, each part falling back to the main language's.
     *
     * @return array{subject: string, preheader: string, body: string, button_label: string, button_url: string}
     */
    public function contentFor(string $locale): array
    {
        $content = (array) $this->content;
        $main = (array) ($content[Locales::main()] ?? []);
        $own = (array) ($content[$locale] ?? []);
        $out = [];
        foreach (['subject', 'preheader', 'body', 'button_label', 'button_url'] as $part) {
            $value = trim((string) ($own[$part] ?? ''));
            $out[$part] = $value !== '' && $value !== '<p></p>' ? $value : trim((string) ($main[$part] ?? ''));
        }

        return $out;
    }

    public function openRate(): float
    {
        return $this->sent_count > 0 ? round($this->opened_count / $this->sent_count * 100, 1) : 0.0;
    }

    public function clickRate(): float
    {
        return $this->sent_count > 0 ? round($this->clicked_count / $this->sent_count * 100, 1) : 0.0;
    }
}
