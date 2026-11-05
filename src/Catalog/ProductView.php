<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Closure;
use JsonSerializable;
use LogicException;
use Sunrice\Admin\Media\Media;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * What templates show for a product (ARCHITECTURE.md §7.4): its price
 * display, badges, stock, call-to-action, tiers and the variant picker
 * data. Built by ProductViewFactory; read in templates with
 * commerce_product($entry).
 *
 * @property-read array<int, array<string, mixed>> $variants
 */
final class ProductView implements JsonSerializable
{
    /**
     * The picker rows, or what builds them the first time $variants is read.
     *
     * @var array<int, array<string, mixed>>|Closure(): array<int, array<string, mixed>>
     */
    private array|Closure $variantRows;

    /**
     * Picker variants (`$view->variants`), one row per active variant. Built
     * when first read, so listing cards and cart lines that show one price
     * don't pay for them.
     */
    public function __get(string $name): mixed
    {
        if ($name !== 'variants') {
            throw new LogicException('Undefined property: '.self::class.'::$'.$name);
        }
        if ($this->variantRows instanceof Closure) {
            $this->variantRows = ($this->variantRows)();
        }

        return $this->variantRows;
    }

    public function __isset(string $name): bool
    {
        return $name === 'variants';
    }

    /**
     * @param  array{amount: int|null, compareAt: int|null, isRange: bool, from: int|null, to: int|null, hidden: bool, signIn: bool, formatted: string, compareFormatted: string|null}  $price
     * @param  array<int, string>  $badges  sale | new | out_of_stock | backorder | featured
     * @param  array{status: string, quantity: int|null, message: string}  $stock
     * @param  array{type: string, label: string, url: string|null, links: array<int, array{label: string, url: string}>}  $cta
     * @param  array<int, array{min_qty: int, label: string, price: string|null}>  $tiers
     * @param  array<int, array<string, mixed>>  $options
     * @param  array<int, array<string, mixed>>|Closure(): array<int, array<string, mixed>>  $variants  the rows, or a closure building them when first read
     * @param  array<string, mixed>|null  $flashSale
     */
    public function __construct(
        public readonly EntryTranslation $entry,
        public readonly Product $product,
        public readonly string $type,
        public readonly array $price,
        public readonly array $badges,
        public readonly array $stock,
        public readonly array $cta,
        public readonly array $tiers,
        public readonly array $options,
        array|Closure $variants,
        public readonly ?array $flashSale = null,
        public readonly bool $purchasable = true,
    ) {
        $this->variantRows = $variants;
    }

    /** A copy with some properties changed (for ProductViewFactory::extendUsing). Rows not yet built stay unbuilt. */
    public function with(mixed ...$changes): self
    {
        return new self(...[
            'entry' => $this->entry, 'product' => $this->product, 'type' => $this->type, 'price' => $this->price,
            'badges' => $this->badges, 'stock' => $this->stock, 'cta' => $this->cta, 'tiers' => $this->tiers,
            'options' => $this->options, 'variants' => $this->variantRows, 'flashSale' => $this->flashSale,
            'purchasable' => $this->purchasable, ...$changes,
        ]);
    }

    /**
     * Serialized with its rows built (a closure can't be serialized).
     *
     * @return array<string, mixed>
     */
    public function __serialize(): array
    {
        $data = get_object_vars($this);

        return [...$data, 'variantRows' => $this->variants];
    }

    /** @param  array<string, mixed>  $data */
    public function __unserialize(array $data): void
    {
        foreach ($data as $property => $value) {
            $this->{$property} = $value;
        }
    }

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
        return $this->entry->url();
    }

    /** The entry's fields as templates get them (`values()`), by handle. */
    public function value(string $handle): mixed
    {
        return $this->entry->values()[$handle] ?? null;
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
     * schema.org Product (JSON-LD): offers only when prices are visible, the
     * rating when the product has approved reviews.
     *
     * @return array<string, mixed>
     */
    public function structuredData(): array
    {
        $default = $this->defaultVariant();
        $images = [];
        $gallery = $this->value('gallery');
        foreach ($gallery instanceof Media ? [$gallery] : (is_iterable($gallery) ? $gallery : []) as $media) {
            if ($media instanceof Media) {
                $images[] = url($media->url());
            }
        }
        $data = array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $this->title(),
            'url' => $this->url() !== null ? url($this->url()) : null,
            'sku' => $this->isVariable() ? null : $default?->sku,
            'image' => $images ?: null,
            'description' => is_string($excerpt = $this->value('excerpt')) ? $excerpt : null,
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
        // The rating of the approved reviews the page shows (<x-commerce::reviews>).
        if ($this->product->rating_count > 0 && commerce_feature('reviews')) {
            $data['aggregateRating'] = ['@type' => 'AggregateRating', 'ratingValue' => number_format((float) $this->product->rating_average, 1, '.', ''),
                'reviewCount' => $this->product->rating_count, 'bestRating' => '5', 'worstRating' => '1'];
        }

        return $data;
    }

    /** @return array<string, mixed> */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->product->id, 'entry_id' => $this->entry->entry_id, 'title' => $this->title(), 'url' => $this->url(),
            'type' => $this->type, 'price' => $this->price, 'badges' => $this->badges, 'stock' => $this->stock,
            'cta' => $this->cta, 'tiers' => $this->tiers, 'options' => $this->options, 'variants' => $this->variants,
            'flash_sale' => $this->flashSale,
        ];
    }
}
