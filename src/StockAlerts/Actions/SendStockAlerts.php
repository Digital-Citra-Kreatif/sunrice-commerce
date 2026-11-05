<?php

declare(strict_types=1);

namespace Sunrice\Commerce\StockAlerts\Actions;

use Illuminate\Support\Collection as BaseCollection;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Notifications\EmailSettings;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\StockAlerts\Models\StockAlert;
use Sunrice\Commerce\StockAlerts\Restock;
use Throwable;

/**
 * commerce:tick's "stock alerts" step: emails everyone waiting for a
 * variant that can be ordered again (Restock: the checkout's own rule),
 * once, in the language they asked in. Up to 200 a tick. An alert is
 * claimed before its email is sent, so ticks running at once never send
 * it twice, and given back when sending fails, so the next tick tries again.
 */
class SendStockAlerts
{
    public const BATCH = 200;

    public function __construct(protected Notifier $notifier, protected Restock $restock, protected Catalog $catalog, protected EmailSettings $emails) {}

    public function handle(): int
    {
        // The email switched off (Settings → Emails): nothing is claimed, so the alerts wait for it.
        if (! $this->emails->enabled('back_in_stock')) {
            return 0;
        }
        // Publication as it is now, not as an earlier step of this process saw it.
        $this->catalog->flush();
        $sent = 0;
        foreach (array_chunk($this->orderable(), self::BATCH) as $variantIds) {
            StockAlert::query()->whereNull('notified_at')->whereIn('variant_id', $variantIds)
                ->with(['variant.product', 'product'])
                ->chunkById(self::BATCH, function (BaseCollection $alerts) use (&$sent): bool {
                    $pages = EntryTranslation::query()->whereIn('entry_id', $alerts->pluck('product.entry_id')->unique())->get()
                        ->filter(fn (EntryTranslation $t) => $t->isLive())->groupBy('entry_id');
                    foreach ($alerts as $alert) {
                        /** @var StockAlert $alert */
                        // Claimed before it's sent: a tick running at the same time skips it.
                        if (StockAlert::query()->whereKey($alert->id)->whereNull('notified_at')->update(['notified_at' => now()]) === 0) {
                            continue;
                        }
                        $page = ($pages[$alert->product->entry_id] ?? collect())->sortByDesc(fn (EntryTranslation $t) => $t->locale === $alert->locale)->first();
                        try {
                            $sent += $this->notifier->sendTo('back_in_stock', $alert->email, (string) ($alert->locale ?? ''), $alert->variant, [
                                'product' => trim((string) $page?->title.($alert->variant->title !== '' ? ' — '.$alert->variant->title : '')),
                                'url' => $page?->url() !== null ? url((string) $page->url()) : url('/'),
                            ]);
                        } catch (Throwable $e) {
                            // Not sent (the queue is down…): the next tick tries again.
                            StockAlert::query()->whereKey($alert->id)->update(['notified_at' => null]);

                            throw $e;
                        }
                        if ($sent >= self::BATCH) {
                            return false;
                        }
                    }

                    return true;
                });
            if ($sent >= self::BATCH) {
                break;
            }
        }

        return $sent;
    }

    /**
     * The variants people are waiting for that can be ordered again, each
     * checked once, with one publication query per collection a chunk.
     *
     * @return list<int>
     */
    protected function orderable(): array
    {
        $ids = [];
        Variant::query()->whereIn('id', StockAlert::query()->whereNull('notified_at')->select('variant_id'))
            ->with('product')
            ->chunkById(500, function (BaseCollection $variants) use (&$ids): void {
                $this->catalog->preload($variants->pluck('product')->all());
                foreach ($variants as $variant) {
                    /** @var Variant $variant */
                    if ($this->restock->orderable($variant)) {
                        $ids[] = $variant->id;
                    }
                }
            });

        return $ids;
    }
}
