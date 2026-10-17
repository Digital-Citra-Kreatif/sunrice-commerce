<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * The button(s) a product shows: the resolved purchase mode with its
 * label and links. Links to WhatsApp, other shops and the inquiry form go
 * through /go/{type}/{entry}, which counts the click.
 */
class CallToAction
{
    public function __construct(protected StoreSettings $settings, protected Features $features) {}

    /**
     * @return array{type: string, label: string, url: string|null, links: array<int, array{label: string, url: string}>}
     */
    public function for(Product $product): array
    {
        $type = PurchaseModes::resolve(
            (string) $this->settings->get('general.selling_mode', 'shop'),
            $product->purchase_mode,
            $this->features->active('cart'),
            (string) $this->settings->get('catalog.call_to_action', 'inquiry'),
            (array) $product->external_links,
        );
        $go = fn (string $kind, array $query = []) => commerce_url('commerce.go', ['type' => $kind, 'entry' => $product->entry_id, ...$query]);

        return match ($type) {
            'cart' => ['type' => 'cart', 'label' => __('commerce::storefront.cta.cart'), 'url' => null, 'links' => []],
            'whatsapp' => ['type' => 'whatsapp', 'label' => __('commerce::storefront.cta.whatsapp'), 'url' => $go('whatsapp'), 'links' => []],
            'inquiry' => ['type' => 'inquiry', 'label' => __('commerce::storefront.cta.inquiry'), 'url' => $go('inquiry'), 'links' => []],
            'external' => ['type' => 'external', 'label' => '', 'url' => null, 'links' => array_values(array_map(fn (array $link, int $i) => [
                'label' => (string) ($link['label'] ?: __('commerce::storefront.cta.external', ['shop' => ProductValue::LINK_PRESETS[$link['preset'] ?? ''] ?? parse_url((string) $link['url'], PHP_URL_HOST)])),
                'url' => $go('external', ['link' => $i]),
            ], (array) $product->external_links, array_keys((array) $product->external_links)))],
            default => ['type' => 'none', 'label' => '', 'url' => null, 'links' => []],
        };
    }
}
