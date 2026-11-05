<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Feeds;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Sunrice\Admin\Media\Media;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\LiveEntries;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Catalog\ProductViewFactory;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * The product feed for Google Merchant Center and Meta catalogs: RSS 2.0
 * with Google's `g:` fields, one item per active variant of every live
 * product whose price is shown and that can be added to the cart, at the
 * price the product page shows (flash sales included). Variants of a
 * product share its `g:item_group_id`. Built 100 products at a time.
 */
class ProductFeed
{
    public const CHUNK = 100;

    public const VERSION = 'commerce:feed-version';

    public function __construct(protected StoreSettings $settings) {}

    /** The feed's cache generation: bumped whenever store content changes (PageCache::forget, CMS ContentChanged). */
    public static function version(): int
    {
        return (int) Cache::rememberForever(self::VERSION, fn () => 1);
    }

    public static function forget(): void
    {
        Cache::forever(self::VERSION, self::version() + 1);
    }

    public function xml(): string
    {
        $currency = (string) $this->settings->get('general.currency.code', 'IDR');
        $decimals = (int) $this->settings->get('general.currency.decimals', 0);
        $money = fn (int $minor) => number_format($minor / (10 ** $decimals), $decimals, '.', '').' '.$currency;
        $out = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>'
            .$this->tag('title', commerce_store_name()).$this->tag('link', url('/')).$this->tag('description', commerce_store_name());

        foreach ((array) config('commerce.catalog.collections', ['products']) as $collection) {
            if (! is_string($collection)) {
                continue;
            }
            Product::query()->whereIn('entry_id', LiveEntries::ids($collection))->whereNull('removed_at')->where('sync_status', 'ok')
                ->orderBy('id')->select(['id', 'entry_id'])->chunk(self::CHUNK, function ($products) use ($collection, $money, &$out): void {
                    $entries = LiveEntries::shown($collection, $products->pluck('entry_id')->map(fn ($id) => (int) $id)->all());
                    $views = app(ProductViewFactory::class)->forEntries($entries);
                    $brands = $this->brands(array_keys($views));
                    $images = Media::query()->whereIn('id', collect($views)->flatMap(fn (ProductView $v) => [$this->galleryId($v), ...array_column($v->variants, 'image')])->filter()->unique())->get()->keyBy('id');
                    foreach ($views as $entryId => $view) {
                        $out .= $this->items($view, $brands[$entryId] ?? null, $images, $money);
                    }
                });
        }

        return $out.'</channel></rss>';
    }

    /**
     * @param  Collection<int, Media>  $images
     * @param  \Closure(int): string  $money
     */
    protected function items(ProductView $view, ?string $brand, $images, \Closure $money): string
    {
        if (! $view->canAddToCart() || $view->url() === null) {
            return '';
        }
        $variants = $view->product->variants->keyBy('id');
        $excerpt = $view->value('excerpt');
        $description = is_string($excerpt) && $excerpt !== '' ? $excerpt : $view->title();
        $gallery = $images->get($this->galleryId($view));
        $xml = '';
        foreach ($view->variants as $row) {
            $variant = $variants->get($row['id']);
            if (! $variant instanceof Variant || ! $variant->active || $row['price'] === null) {
                continue;
            }
            $image = $images->get($row['image']) ?? $gallery;
            // A bundle without its own weight weighs its components.
            $weight = $view->product->isBundle() ? app(Bundles::class)->weight($view->product, $variant) : $variant->weight;
            $regular = max((int) $row['price'], (int) $row['regular']);
            $xml .= '<item>'
                .$this->tag('g:id', $variant->sku ?: 'V'.$variant->id)
                .($view->isVariable() ? $this->tag('g:item_group_id', 'P'.$view->product->id) : '')
                .$this->tag('g:title', trim($view->title().($view->isVariable() && $variant->title !== '' ? ' — '.$variant->title : '')))
                .$this->tag('g:description', mb_substr(strip_tags($description), 0, 5000))
                .$this->tag('g:link', url($view->url()))
                .($image instanceof Media ? $this->tag('g:image_link', url($image->url())) : '')
                .$this->tag('g:availability', match ($row['stock']) {
                    'out_of_stock' => 'out_of_stock', 'backorder' => 'backorder', default => 'in_stock'
                })
                .$this->tag('g:price', $money($regular))
                .($regular > (int) $row['price'] ? $this->tag('g:sale_price', $money((int) $row['price'])) : '')
                .($brand !== null ? $this->tag('g:brand', $brand) : '')
                .$this->tag('g:condition', 'new')
                .$this->tag('g:identifier_exists', 'no')
                .($weight !== null && $weight > 0 ? $this->tag('g:shipping_weight', $weight.' g') : '')
                .'</item>';
        }

        return $xml;
    }

    protected function galleryId(ProductView $view): ?int
    {
        $gallery = $view->value('gallery');
        $first = $gallery instanceof Media ? $gallery : (is_iterable($gallery) ? collect($gallery)->first() : null);

        return $first instanceof Media ? (int) $first->id : null;
    }

    /**
     * Each entry's brand (the first term of the brand taxonomy), in one query.
     *
     * @param  list<int>  $entryIds
     * @return array<int, string>
     */
    protected function brands(array $entryIds): array
    {
        if ($entryIds === [] || ! commerce_feature('brands')) {
            return [];
        }

        return DB::table('sunrice_entry_term as et')
            ->join('sunrice_terms as t', 't.id', '=', 'et.term_id')
            ->join('sunrice_taxonomies as x', fn ($j) => $j->on('x.id', '=', 't.taxonomy_id')->where('x.handle', (string) config('commerce.catalog.brand_taxonomy')))
            ->join('sunrice_term_translations as tt', fn ($j) => $j->on('tt.term_id', '=', 't.id')->where('tt.locale', Locales::default()))
            ->whereIn('et.entry_id', $entryIds)->orderBy('t.sort_order')->pluck('tt.title', 'et.entry_id')->all();
    }

    protected function tag(string $name, string $value): string
    {
        return "<{$name}>".htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8')."</{$name}>";
    }
}
