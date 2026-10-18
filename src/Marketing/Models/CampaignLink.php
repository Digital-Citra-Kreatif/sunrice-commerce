<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A link in a campaign's emails. Click tracking redirects only to these,
 * never to an address taken from the request.
 *
 * @property int $id
 * @property int $campaign_id
 * @property string $hash
 * @property string $url
 * @property int $clicks
 * @property int $unique_clicks
 */
class CampaignLink extends Model
{
    protected $table = 'commerce_campaign_links';

    protected $guarded = [];

    public static function hashFor(string $url): string
    {
        return substr(hash('sha256', $url), 0, 16);
    }
}
