<?php

declare(strict_types=1);

namespace Sunrice\Commerce\StockAlerts;

use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\StockAlerts\Models\StockAlert;

/**
 * commerce:tick's "stock alerts" step: emails everyone waiting for a
 * variant that can be bought again (back in stock or on backorder), once,
 * in the language they asked in. 200 at a time.
 */
class SendStockAlerts
{
    public const BATCH = 200;

    public function __construct(protected Notifier $notifier) {}

    public function __invoke(): int
    {
        $alerts = StockAlert::query()->whereNull('notified_at')
            ->whereHas('variant', fn ($q) => $q->where('active', true)->whereNull('deleted_at')->where('stock_status', '!=', 'out_of_stock'))
            ->whereHas('product', fn ($q) => $q->whereNull('removed_at'))
            ->with(['variant', 'product'])->orderBy('id')->limit(self::BATCH)->get();
        if ($alerts->isEmpty()) {
            return 0;
        }
        // Each product's page in each language asked for, in one query.
        $translations = EntryTranslation::query()->whereIn('entry_id', $alerts->pluck('product.entry_id')->unique())->get()->groupBy('entry_id');
        $sent = 0;
        foreach ($alerts as $alert) {
            // Claimed before it's sent: a tick running at the same time skips it, so nobody gets two emails.
            if (StockAlert::query()->whereKey($alert->id)->whereNull('notified_at')->update(['notified_at' => now()]) === 0) {
                continue;
            }
            $pages = $translations[$alert->product->entry_id] ?? collect();
            $page = $pages->firstWhere('locale', $alert->locale) ?? $pages->first();
            $title = trim((string) $page?->title.($alert->variant->title !== '' ? ' — '.$alert->variant->title : ''));
            $sent += $this->notifier->sendTo('back_in_stock', $alert->email, (string) ($alert->locale ?? ''), $alert->variant,
                ['product' => $title, 'url' => $page?->url() !== null ? url((string) $page->url()) : url('/')]);
        }

        return $sent;
    }
}
