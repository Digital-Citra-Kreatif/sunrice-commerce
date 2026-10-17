<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Digital\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Orders\Models\Order;

/** New download grants for an order (the "downloads ready" email listens); also fired by staff "resend". */
class DownloadsGranted
{
    use Dispatchable;

    /** @param  array<int, DownloadGrant>  $grants */
    public function __construct(public Order $order, public array $grants, public bool $resent = false) {}
}
