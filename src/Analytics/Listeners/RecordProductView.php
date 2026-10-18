<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Listeners;

use Illuminate\Foundation\Http\Events\RequestHandled;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Contracts\Tracking;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Frontend\TemplateContext;

/**
 * A product page served (200, GET, not a preview) counts a view, after
 * the response is sent (ARCHITECTURE.md §20): the listener notes the
 * entry, and flush() — run once per request from the app's terminating
 * callbacks — counts it.
 */
class RecordProductView
{
    protected ?int $pending = null;

    public function handle(RequestHandled $event): void
    {
        $page = $event->request->attributes->get('sunrice.page');
        if (! $page instanceof TemplateContext || $page->pageType !== 'entry' || $page->entry === null
            || ! $event->request->isMethod('GET') || $event->response->getStatusCode() !== 200
            || $event->request->attributes->get('sunrice.preview') === true
            || ! commerce_feature('analytics')
            || ! (bool) app(StoreSettings::class)->get('analytics.track_views', config('commerce.analytics.track_views', true))) {
            return;
        }
        $this->pending = (int) $page->entry->id;
    }

    public function flush(): void
    {
        if ($this->pending === null) {
            return;
        }
        $entryId = $this->pending;
        $this->pending = null;
        $productId = Product::query()->where('entry_id', $entryId)->whereNull('removed_at')->value('id');
        if ($productId !== null) {
            app(Tracking::class)->track('view', (int) $productId);
        }
    }
}
