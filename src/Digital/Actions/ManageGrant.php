<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Digital\Actions;

use Sunrice\Commerce\Digital\Events\DownloadsGranted;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Timeline;

/** Staff actions on a download grant: extend, reset the count, revoke; resend the links. */
class ManageGrant
{
    public function __construct(protected Timeline $timeline) {}

    public function extend(DownloadGrant $grant, int $days, Actor $actor): DownloadGrant
    {
        $from = $grant->expires_at !== null && $grant->expires_at->isFuture() ? $grant->expires_at : now();
        $grant->forceFill(['expires_at' => $from->copy()->addDays($days)])->save();
        $this->timeline->record($grant->order, 'system', "Download of {$grant->file->name} extended by {$days} days", [], $actor);

        return $grant;
    }

    public function reset(DownloadGrant $grant, ?int $limit, Actor $actor): DownloadGrant
    {
        $grant->forceFill(['downloads_remaining' => $limit, 'revoked_at' => null])->save();
        $this->timeline->record($grant->order, 'system', "Download count of {$grant->file->name} reset", [], $actor);

        return $grant;
    }

    public function revoke(DownloadGrant $grant, Actor $actor): DownloadGrant
    {
        $grant->forceFill(['revoked_at' => now()])->save();
        $this->timeline->record($grant->order, 'system', "Download of {$grant->file->name} revoked", [], $actor);

        return $grant;
    }

    public function resend(DownloadGrant $grant, Actor $actor): void
    {
        DownloadsGranted::dispatch($grant->order, $grant->order->hasMany(DownloadGrant::class)->whereNull('revoked_at')->get()->all(), true);
        $this->timeline->record($grant->order, 'email', 'Download links sent again', [], $actor, 'customer');
    }
}
