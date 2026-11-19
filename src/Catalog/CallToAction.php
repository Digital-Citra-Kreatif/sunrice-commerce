<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Sunrice\Commerce\Catalog\Models\Product;

/**
 * The button(s) a product shows: the resolved purchase mode with its
 * label and links. Links to WhatsApp, other shops and the inquiry form go
 * through /go/{type}/{entry}, which counts the click.
 */
class CallToAction
{
    public function __construct(protected ProductDefaults $defaults) {}

    /**
     * @return array{type: string, label: string, url: string|null, links: array<int, array{label: string, url: string}>}
     */
    public function for(Product $product): array
    {
        $type = $this->defaults->purchaseMode($product->entry_id, $product->purchase_mode, (array) $product->external_links)['type'];
        $go = fn (string $kind, array $query = []) => commerce_url('commerce.go', ['type' => $kind, 'entry' => $product->entry_id, ...$query]);

        return match ($type) {
            'cart' => ['type' => 'cart', 'label' => __('commerce::storefront.cta.cart'), 'url' => null, 'links' => []],
            'whatsapp' => ['type' => 'whatsapp', 'label' => __('commerce::storefront.cta.whatsapp'), 'url' => $go('whatsapp'), 'links' => []],
            'inquiry' => ['type' => 'inquiry', 'label' => __('commerce::storefront.cta.inquiry'), 'url' => $go('inquiry'), 'links' => []],
            'external' => ['type' => 'external', 'label' => '', 'url' => null, 'links' => array_map(fn (array $link, int $i) => [
                'label' => (string) ($link['label'] ?: __('commerce::storefront.cta.external', ['shop' => ProductValue::LINK_PRESETS[$link['preset'] ?? ''] ?? parse_url((string) $link['url'], PHP_URL_HOST)])),
                'url' => $go('external', ['link' => $i]),
            ], (array) $product->external_links, array_keys((array) $product->external_links))],
            default => ['type' => 'none', 'label' => '', 'url' => null, 'links' => []],
        };
    }
}
