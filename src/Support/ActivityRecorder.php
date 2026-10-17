<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Illuminate\Database\Eloquent\Model;
use Sunrice\Activity\ActivityLogger;

/**
 * Commerce lines in Sunrice's activity log (Manage → Activity log), with
 * types such as order, voucher, stock, store_setting.
 */
class ActivityRecorder
{
    /** @param  array<string, mixed>  $properties  `changes` (list of what changed) and/or `note` */
    public function record(string $action, Model|string $subject, array $properties = [], ?string $type = null): void
    {
        app(ActivityLogger::class)->record($action, $subject, $properties, $type);
    }
}
