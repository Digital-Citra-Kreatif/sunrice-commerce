<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use JsonSerializable;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\Entry;

/**
 * What templates show for a product (ARCHITECTURE.md §7.4): its price
 * display, badges, stock, call-to-action, tiers and the variant picker
 * data. Built by ProductViewFactory; read in templates with
 * commerce_product($entry).
 */
final class ProductView implements JsonSerializable
{
    /**
     * @param  array{amount: int|null, compareAt: int|null, isRange: bool, from: int|null, to: int|null, hidden: bool, signIn: bool, formatted: string, compareFormatted: string|null}  $price
     * @param  array<int, string>  $badges  sale | new | out_of_stock | backorder | featured
     * @param  array{status: string, quantity: int|null, message: string}  $stock
     * @param  array{type: string, label: string, url: string|null, links: array<int, array{label: string, url: string}>}  $cta
     * @param  array<int, array{min_qty: int, label: string, price: string|null}>  $tiers
     * @param  array<int, array<string, mixed>>  $options
     * @param  array<int, array<string, mixed>>  $variants
     * @param  array<string, mixed>|null  $flashSale
     */
    public function __construct(
        public readonly Entry $entry,
        public readonly Product $product,
        public readonly string $type,
        public readonly array $price,
        public readonly array $badges,
        public readonly array $stock,
        public readonly array $cta,
        public readonly array $tiers,
        public readonly array $options,
        public readonly array $variants,
        public readonly ?array $flashSale = null,
        public readonly bool $purchasable = true,
    ) {}

    public function id(): int
    {
        return $this->product->id;
    }

    public function title(): string
    {
        return (string) $this->entry->title;
    }

    public function url(): ?string
    {
        return $this->entry->url;
    }

    public function isVariable(): bool
    {
        return $this->type === 'variable';
    }

    public function hasBadge(string $badge): bool
    {
        return in_array($badge, $this->badges, true);
    }

    public function canAddToCart(): bool
    {
        return $this->cta['type'] === 'cart' && $this->purchasable && ! $this->price['hidden'];
    }

    /** The default variant (the first active one). */
    public function defaultVariant(): ?Variant
    {
        return $this->product->variants->first(fn (Variant $v) => $v->active) ?? $this->product->variants->first();
    }

    /** Variant data for the picker script, without prices when they are hidden. */
    public function variantsJson(): string
    {
        return (string) json_encode(['options' => $this->options, 'variants' => $this->variants], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * schema.org Product (JSON-LD): offers only when prices are visible.
     *
     * @return array<string, mixed>
     */
    public function structuredData(): array
    {
        $default = $this->defaultVariant();
        $images = [];
        foreach ((array) ($this->entry->get('gallery') ?? []) as $asset) {
            if (is_object($asset) && method_exists($asset, 'url')) {
                $images[] = url($asset->url());
            }
        }
        $data = array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $this->title(),
            'url' => $this->url() !== null ? url($this->url()) : null,
            'sku' => $this->isVariable() ? null : $default?->sku,
            'image' => $images ?: null,
            'description' => is_string($excerpt = $this->entry->get('excerpt')) ? $excerpt : null,
        ], fn ($v) => $v !== null);
        if (! $this->price['hidden'] && ($this->price['amount'] ?? $this->price['from']) !== null) {
            $currency = (string) app(StoreSettings::class)->get('general.currency.code', 'IDR');
            $decimals = (int) app(StoreSettings::class)->get('general.currency.decimals', 0);
            $amount = fn (int $minor) => number_format($minor / (10 ** $decimals), $decimals, '.', '');
            $availability = match ($this->stock['status']) {
                'out_of_stock' => 'https://schema.org/OutOfStock',
                'backorder' => 'https://schema.org/BackOrder',
                default => 'https://schema.org/InStock',
            };
            $data['offers'] = $this->price['isRange']
                ? ['@type' => 'AggregateOffer', 'priceCurrency' => $currency, 'lowPrice' => $amount((int) $this->price['from']), 'highPrice' => $amount((int) $this->price['to']), 'availability' => $availability, 'offerCount' => count($this->variants)]
                : ['@type' => 'Offer', 'priceCurrency' => $currency, 'price' => $amount((int) $this->price['amount']), 'availability' => $availability];
        }

        return $data;
    }

    /** @return array<string, mixed> */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->product->id, 'entry_id' => $this->entry->id, 'title' => $this->title(), 'url' => $this->url(),
            'type' => $this->type, 'price' => $this->price, 'badges' => $this->badges, 'stock' => $this->stock,
            'cta' => $this->cta, 'tiers' => $this->tiers, 'options' => $this->options, 'variants' => $this->variants,
            'flash_sale' => $this->flashSale,
        ];
    }
}
