<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Digital\Listeners;

use Illuminate\Support\Str;
use Sunrice\Commerce\Catalog\Models\DownloadFile;
use Sunrice\Commerce\Digital\Events\DownloadsGranted;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Orders\Events\OrderCompleted;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Creates the download grants of an order's downloadable lines when it is
 * paid (or completed, by the digital.grant_on setting): one per file of
 * the product (and of the bought variant), with the product's or store's
 * count limit and expiry. Runs once per line and file.
 */
class GrantDownloads
{
    public function __construct(protected StoreSettings $settings) {}

    public function handle(OrderPaid|OrderCompleted $event): void
    {
        if (! commerce_feature('digital')) {
            return;
        }
        $on = (string) $this->settings->get('digital.grant_on', 'paid');
        if (($on === 'completed') !== ($event instanceof OrderCompleted)) {
            return;
        }
        $this->grant($event->order);
    }

    /** @return array<int, DownloadGrant> the new grants */
    public function grant(Order $order): array
    {
        $new = [];
        foreach ($order->items()->where('downloadable', true)->with('product')->get() as $item) {
            if ($item->product_id === null) {
                continue;
            }
            $delivery = (array) ($item->product->delivery ?? []);
            $limit = $delivery['download_limit'] ?? $this->settings->get('digital.download_limit');
            $days = $delivery['expiry_days'] ?? $this->settings->get('digital.expiry_days');
            $files = DownloadFile::query()->where('product_id', $item->product_id)
                ->where(fn ($q) => $q->whereNull('variant_id')->orWhere('variant_id', $item->variant_id))->get();
            foreach ($files as $file) {
                $grant = DownloadGrant::query()->firstOrCreate(
                    ['order_item_id' => $item->id, 'download_file_id' => $file->id],
                    [
                        'order_id' => $order->id, 'customer_id' => $order->customer_id, 'email' => $order->email,
                        'token' => Str::random(64),
                        'downloads_remaining' => $limit !== null ? (int) $limit * $item->quantity : null,
                        'expires_at' => $days !== null ? now()->addDays((int) $days) : null,
                    ],
                );
                if ($grant->wasRecentlyCreated) {
                    $new[] = $grant;
                }
            }
        }
        if ($new !== []) {
            DownloadsGranted::dispatch($order, $new);
        }

        return $new;
    }
}
