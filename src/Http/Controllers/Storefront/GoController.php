<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Contracts\Tracking;
use Sunrice\Commerce\Storefront\WhatsApp;
use Sunrice\Models\Entry;

/**
 * GET /go/{type}/{entry}: counts a call-to-action click and redirects to
 * the product's own target only (its WhatsApp message, one of its shop
 * links, or its inquiry form), never to a URL from the request.
 */
class GoController
{
    public function __invoke(Request $request, string $type, int $entry, Catalog $catalog, WhatsApp $whatsapp, Tracking $tracking): RedirectResponse
    {
        $product = Product::query()->where('entry_id', $entry)->whereNull('removed_at')->first();
        abort_if($product === null || ! $catalog->isPublished($product), 404);
        $model = Entry::query()->findOrFail($entry);
        $model->resolveFor(app()->getLocale());

        $target = match ($type) {
            'whatsapp' => $this->whatsapp($product, $model, $request, $whatsapp),
            'external' => $this->external($product, $request),
            'inquiry' => ($model->url ?? '/').'#inquiry',
            default => null,
        };
        abort_if($target === null, 404);
        $tracking->track('cta_'.$type, $product->id);

        return redirect()->away($target);
    }

    protected function whatsapp(Product $product, Entry $entry, Request $request, WhatsApp $whatsapp): ?string
    {
        $number = $whatsapp->next();
        if ($number === null) {
            return null;
        }
        $variant = $product->variants()->where('id', (int) $request->query('variant'))->first();
        $text = $whatsapp->message('product_message', [
            'product' => $entry->title,
            'variant' => $variant?->title ? "({$variant->title})" : '',
            'quantity' => max(1, (int) $request->query('qty', 1)),
            'price' => '',
            'url' => $entry->url !== null ? url($entry->url) : '',
        ]);

        return $whatsapp->url($number, $text);
    }

    protected function external(Product $product, Request $request): ?string
    {
        $link = ((array) $product->external_links)[(int) $request->query('link', 0)] ?? null;
        $url = is_array($link) ? (string) ($link['url'] ?? '') : '';

        return preg_match('#^https?://#i', $url) === 1 ? $url : null;
    }
}
