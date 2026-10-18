<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Digital\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $grant_id
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property Carbon|null $created_at
 */
class DownloadLog extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'commerce_download_logs';

    protected $guarded = [];
}
