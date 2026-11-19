<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Webhooks\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;
use Sunrice\Commerce\Webhooks\EndpointUrl;
use Sunrice\Commerce\Webhooks\Models\Webhook;
use Sunrice\Commerce\Webhooks\Models\WebhookDelivery;
use Sunrice\Commerce\Webhooks\Webhooks;
use Throwable;

/**
 * Sends one delivery: a signed JSON POST that must answer 2xx within
 * `commerce.webhooks.timeout` seconds, without following redirects.
 * Failures are retried with growing waits (1 minute up to 6 hours, seven
 * attempts in all); each attempt is recorded on the delivery.
 */
class DeliverWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public const ATTEMPTS = 7;

    /** Seconds before each retry. */
    public const BACKOFF = [60, 300, 1800, 3600, 10800, 21600];

    public int $tries = self::ATTEMPTS;

    public function __construct(public int $deliveryId) {}

    public function handle(): void
    {
        $delivery = WebhookDelivery::query()->with('webhook')->find($this->deliveryId);
        if ($delivery === null || $delivery->status === 'delivered') {
            return;
        }
        $webhook = $delivery->webhook;
        if (! $webhook->active) {
            $delivery->forceFill(['status' => 'failed', 'error' => 'The endpoint is switched off.'])->save();

            return;
        }
        $delivery->increment('attempts');
        try {
            $status = $this->post($webhook, $delivery);
        } catch (Throwable $e) {
            $this->failed($delivery, null, $e->getMessage());

            return;
        }
        if ($status < 200 || $status > 299) {
            $this->failed($delivery, $status, "The endpoint answered {$status}.");

            return;
        }
        $delivery->forceFill(['status' => 'delivered', 'response_status' => $status, 'error' => null, 'delivered_at' => now()])->save();
        if ($webhook->failures > 0) {
            $webhook->forceFill(['failures' => 0])->save();
        }
    }

    protected function post(Webhook $webhook, WebhookDelivery $delivery): int
    {
        if (($problem = EndpointUrl::problem($webhook->url)) !== null) {
            throw new RuntimeException($problem);
        }
        $body = (string) json_encode($delivery->payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        $time = now()->getTimestamp();

        return Http::withoutRedirecting()
            ->timeout((int) config('commerce.webhooks.timeout', 10))
            ->withUserAgent('Sunrice-Commerce-Webhooks')
            ->withHeaders([
                'X-Sunrice-Event' => $delivery->event,
                'X-Sunrice-Delivery' => $delivery->uuid,
                'X-Sunrice-Signature' => Webhooks::signature($webhook->secret, $time, $body),
            ])
            ->withBody($body, 'application/json')
            ->post($webhook->url)
            ->status();
    }

    /**
     * Records a failed attempt and puts the delivery back on the queue for the next one
     * (a failure never reaches whatever caused the event). The last attempt marks it
     * failed and counts towards switching the endpoint off.
     */
    protected function failed(WebhookDelivery $delivery, ?int $status, string $error): void
    {
        $last = $delivery->attempts >= self::ATTEMPTS;
        $delivery->forceFill([
            'status' => $last ? 'failed' : 'pending', 'response_status' => $status, 'error' => Str::limit($error, 480),
        ])->save();
        if (! $last) {
            $this->release(self::BACKOFF[$delivery->attempts - 1] ?? 21600);

            return;
        }
        $webhook = $delivery->webhook;
        $webhook->increment('failures');
        if ($webhook->failures >= (int) config('commerce.webhooks.disable_after', 20)) {
            $webhook->forceFill(['active' => false, 'disabled_at' => now()])->save();
        }
    }
}
