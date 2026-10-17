<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Contracts;

use Illuminate\Http\Request;
use Sunrice\Commerce\Payments\InvalidWebhook;
use Sunrice\Commerce\Payments\WebhookEvent;

/** Gateway notifications (POST commerce/webhooks/{method}). */
interface HandlesWebhooks
{
    /** Verify and read the call. @throws InvalidWebhook */
    public function parseWebhook(Request $request): WebhookEvent;
}
