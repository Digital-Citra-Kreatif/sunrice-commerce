<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Sunrice\Commerce\Catalog\Models\PriceTier;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Features\Features;

/**
 * The shape of a `commerce_product` value (ARCHITECTURE.md §7.1):
 * normalize() fills defaults, assigns ids and drops unknown keys;
 * errors() lists what is wrong with a normalized value. Used by the field
 * type, the projector and the MCP tools alike.
 */
final class ProductValue
{
    public const LINK_PRESETS = ['shopee' => 'Shopee', 'tokopedia' => 'Tokopedia', 'tiktok' => 'TikTok Shop', 'lazada' => 'Lazada', 'blibli' => 'Blibli', 'bukalapak' => 'Bukalapak', 'website' => 'Website'];

    public const BUNDLE_PRICING = ['fixed', 'percent_off', 'amount_off'];

    public const DELIVERY_MODES = ['attachment', 'link', 'account'];

    /** @return array<string, mixed> */
    public static function defaults(): array
    {
        return [
            'type' => 'simple',
            'purchase_mode' => 'default',
            'external_links' => [],
            'requires_shipping' => true,
            'downloadable' => false,
            'featured' => false,
            'tax_class' => null,
            'options' => [],
            'variants' => [self::variantDefaults()],
            'bundle' => null,
            'downloads' => [],
            'delivery' => null,
            'tiers' => [],
        ];
    }

    /** @return array<string, mixed> */
    public static function variantDefaults(): array
    {
        return [
            'id' => null, 'options' => [], 'sku' => null, 'barcode' => null,
            'price' => 0, 'compare_at_price' => null, 'cost' => null,
            'weight' => null, 'length' => null, 'width' => null, 'height' => null, 'image' => null,
            'requires_shipping' => null, 'downloadable' => null,
            'track_stock' => false, 'initial_stock' => null, 'backorders' => 'no', 'low_stock_threshold' => null,
            'stock_status' => 'in_stock', 'min_qty' => 1, 'max_qty' => null, 'qty_step' => 1, 'active' => true,
            'downloads' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function normalize(mixed $value): array
    {
        $value = is_array($value) ? $value : [];
        $out = self::defaults();

        $out['type'] = in_array($value['type'] ?? null, Product::TYPES, true) ? $value['type'] : 'simple';
        $out['purchase_mode'] = is_string($value['purchase_mode'] ?? null) ? $value['purchase_mode'] : 'default';
        foreach (['requires_shipping', 'downloadable', 'featured'] as $flag) {
            if (array_key_exists($flag, $value)) {
                $out[$flag] = self::bool($value[$flag]);
            }
        }
        $out['tax_class'] = self::str($value['tax_class'] ?? null);
        $out['external_links'] = array_values(array_map(fn ($link) => [
            'preset' => self::str(is_array($link) ? ($link['preset'] ?? null) : null),
            'label' => self::str(is_array($link) ? ($link['label'] ?? null) : null),
            'url' => self::str(is_array($link) ? ($link['url'] ?? null) : null),
        ], self::list($value['external_links'] ?? [])));

        $out['options'] = array_values(array_map(fn ($option) => [
            'id' => self::id($option['id'] ?? null),
            'name' => (string) self::str($option['name'] ?? null),
            'taxonomy' => self::str($option['taxonomy'] ?? null),
            'values' => array_values(array_map(fn ($v) => array_filter([
                'id' => self::id($v['id'] ?? null),
                'label' => self::str($v['label'] ?? null),
                'term_id' => self::int($v['term_id'] ?? null),
            ], fn ($x, $k) => $k === 'id' || $x !== null, ARRAY_FILTER_USE_BOTH), array_filter(self::list($option['values'] ?? []), 'is_array'))),
        ], array_filter(self::list($value['options'] ?? []), 'is_array')));

        $variants = array_values(array_filter(self::list($value['variants'] ?? []), 'is_array'));
        $out['variants'] = array_map(fn (array $v) => self::normalizeVariant($v), $variants === [] ? [[]] : $variants);

        // A simple product (and a bundle) is exactly one variant without options.
        if ($out['type'] !== 'variable') {
            $out['options'] = [];
            $out['variants'] = [array_replace($out['variants'][0], ['options' => []])];
        }

        if ($out['type'] === 'bundle') {
            $bundle = is_array($value['bundle'] ?? null) ? $value['bundle'] : [];
            $out['bundle'] = [
                'pricing' => in_array($bundle['pricing'] ?? null, self::BUNDLE_PRICING, true) ? $bundle['pricing'] : 'fixed',
                'value' => self::int($bundle['value'] ?? null) ?? 0,
                'items' => array_values(array_map(fn ($item) => [
                    'variant_id' => self::int($item['variant_id'] ?? null),
                    'quantity' => max(1, self::int($item['quantity'] ?? null) ?? 1),
                ], array_filter(self::list($bundle['items'] ?? []), 'is_array'))),
            ];
        }

        $out['downloads'] = self::normalizeDownloads($value['downloads'] ?? []);
        if (is_array($value['delivery'] ?? null)) {
            $out['delivery'] = [
                'modes' => array_values(array_intersect(self::DELIVERY_MODES, self::list($value['delivery']['modes'] ?? []))),
                'download_limit' => self::int($value['delivery']['download_limit'] ?? null),
                'expiry_days' => self::int($value['delivery']['expiry_days'] ?? null),
            ];
        }

        $out['tiers'] = array_values(array_map(fn ($tier) => [
            'min_qty' => self::int($tier['min_qty'] ?? null) ?? 0,
            'type' => self::str($tier['type'] ?? null) ?? 'percent_off',
            'value' => self::int($tier['value'] ?? null) ?? 0,
            'variant' => self::str($tier['variant'] ?? null),
        ], array_filter(self::list($value['tiers'] ?? []), 'is_array')));
        usort($out['tiers'], fn (array $a, array $b) => $a['min_qty'] <=> $b['min_qty']);

        return $out;
    }

    /**
     * @param  array<string, mixed>  $v
     * @return array<string, mixed>
     */
    protected static function normalizeVariant(array $v): array
    {
        $out = self::variantDefaults();
        $out['id'] = self::id($v['id'] ?? null);
        $out['options'] = [];
        foreach ((array) ($v['options'] ?? []) as $option => $valueId) {
            if (is_string($option) && is_string($valueId) && $valueId !== '') {
                $out['options'][$option] = $valueId;
            }
        }
        foreach (['sku', 'barcode', 'backorders', 'stock_status'] as $key) {
            if (array_key_exists($key, $v)) {
                $out[$key] = self::str($v[$key]) ?? $out[$key];
            }
        }
        $out['sku'] = $out['sku'] !== null ? trim($out['sku']) : null;
        foreach (['price', 'compare_at_price', 'cost', 'weight', 'length', 'width', 'height', 'image', 'initial_stock', 'low_stock_threshold', 'max_qty'] as $key) {
            if (array_key_exists($key, $v)) {
                $out[$key] = self::int($v[$key]);
            }
        }
        $out['price'] ??= 0;
        foreach (['min_qty', 'qty_step'] as $key) {
            $out[$key] = max(1, self::int($v[$key] ?? null) ?? 1);
        }
        foreach (['track_stock', 'active'] as $key) {
            if (array_key_exists($key, $v)) {
                $out[$key] = self::bool($v[$key]);
            }
        }
        foreach (['requires_shipping', 'downloadable'] as $key) {
            $out[$key] = array_key_exists($key, $v) && $v[$key] !== null ? self::bool($v[$key]) : null;
        }
        $out['downloads'] = self::normalizeDownloads($v['downloads'] ?? []);

        return $out;
    }

    /** @return array<int, array<string, mixed>> */
    protected static function normalizeDownloads(mixed $downloads): array
    {
        return array_values(array_map(fn ($d) => [
            'id' => self::id($d['id'] ?? null),
            'type' => ($d['type'] ?? 'file') === 'url' ? 'url' : 'file',
            'file_id' => self::int($d['file_id'] ?? null),
            'url' => self::str($d['url'] ?? null),
            'name' => (string) self::str($d['name'] ?? null),
        ], array_filter(self::list($downloads), 'is_array')));
    }

    /**
     * What is wrong with a normalized value: [path => message].
     *
     * @param  array<string, mixed>  $value
     * @param  int|null  $productId  this value's own product (its SKUs are not conflicts)
     * @return array<string, string>
     */
    public static function errors(array $value, ?int $productId = null): array
    {
        $errors = [];
        $features = app(Features::class);
        $maxOptions = (int) config('commerce.catalog.max_options', 3);
        $maxVariants = (int) config('commerce.catalog.max_variants', 100);

        if ($value['type'] === 'variable' && ! $features->active('variants')) {
            $errors['type'] = 'Variable products are switched off (Settings → Store → Features).';
        }
        if ($value['type'] === 'bundle' && ! $features->active('bundles')) {
            $errors['type'] = 'Bundles are switched off (Settings → Store → Features).';
        }
        if (! in_array($value['purchase_mode'], Product::PURCHASE_MODES, true)) {
            $errors['purchase_mode'] = 'Choose a purchase mode.';
        }
        if (count($value['external_links']) > 10) {
            $errors['external_links'] = 'At most 10 links.';
        }
        foreach ($value['external_links'] as $i => $link) {
            if ($link['url'] === null || ! preg_match('#^https?://[^\s]+$#i', $link['url'])) {
                $errors["external_links.{$i}.url"] = 'Enter a link starting with https://.';
            }
            if ($link['preset'] === null && ($link['label'] === null || $link['label'] === '')) {
                $errors["external_links.{$i}.label"] = 'Name the link.';
            }
        }
        if ($value['purchase_mode'] === 'external' && $value['external_links'] === []) {
            $errors['external_links'] = 'Add at least one link for "Links to other shops".';
        }

        // Options
        $valueIds = [];
        if (count($value['options']) > $maxOptions) {
            $errors['options'] = "At most {$maxOptions} options.";
        }
        foreach ($value['options'] as $i => $option) {
            if ($option['name'] === '' || mb_strlen($option['name']) > 60) {
                $errors["options.{$i}.name"] = 'Name the option (up to 60 characters).';
            }
            if ($option['values'] === []) {
                $errors["options.{$i}.values"] = "Add values to {$option['name']}.";
            }
            $labels = [];
            foreach ($option['values'] as $j => $v) {
                if (($v['label'] ?? null) === null && ($v['term_id'] ?? null) === null) {
                    $errors["options.{$i}.values.{$j}"] = 'Enter a value.';
                }
                $key = mb_strtolower((string) ($v['label'] ?? 'term:'.($v['term_id'] ?? '')));
                if (isset($labels[$key])) {
                    $errors["options.{$i}.values.{$j}"] = "\"{$v['label']}\" is in {$option['name']} twice.";
                }
                $labels[$key] = true;
                $valueIds[$option['id']][$v['id']] = true;
            }
        }

        // Variants
        if (count($value['variants']) > $maxVariants) {
            $errors['variants'] = "At most {$maxVariants} variants.";
        }
        $combinations = [];
        $skus = [];
        $uids = [];
        foreach ($value['variants'] as $i => $v) {
            $at = "variants.{$i}";
            $uids[] = $v['id'];
            if ($value['type'] === 'variable') {
                foreach ($value['options'] as $option) {
                    $chosen = $v['options'][$option['id']] ?? null;
                    if ($chosen === null || ! isset($valueIds[$option['id']][$chosen])) {
                        $errors["{$at}.options"] = 'Choose a value for every option.';
                    }
                }
                $combination = $v['options'];
                ksort($combination);
                $key = json_encode($combination);
                if (isset($combinations[$key])) {
                    $errors["{$at}.options"] = 'Two variants have the same options.';
                }
                $combinations[$key] = true;
            }
            foreach (['price', 'compare_at_price', 'cost', 'weight', 'length', 'width', 'height', 'initial_stock', 'low_stock_threshold'] as $key) {
                if ($v[$key] !== null && $v[$key] < 0) {
                    $errors["{$at}.{$key}"] = 'Enter 0 or more.';
                }
            }
            if ($v['price'] > 100_000_000_000_000) {
                $errors["{$at}.price"] = 'The price is too high.';
            }
            if ($v['max_qty'] !== null && $v['max_qty'] < $v['min_qty']) {
                $errors["{$at}.max_qty"] = 'The maximum is below the minimum.';
            }
            if (! in_array($v['backorders'], Variant::BACKORDERS, true)) {
                $errors["{$at}.backorders"] = 'Choose whether to allow backorders.';
            }
            if (! in_array($v['stock_status'], Variant::STOCK_STATUSES, true)) {
                $errors["{$at}.stock_status"] = 'Choose a stock status.';
            }
            if ($v['sku'] !== null && $v['sku'] !== '') {
                if (mb_strlen($v['sku']) > 100) {
                    $errors["{$at}.sku"] = 'The SKU is too long.';
                }
                $sku = mb_strtolower($v['sku']);
                if (isset($skus[$sku])) {
                    $errors["{$at}.sku"] = "SKU {$v['sku']} is used twice.";
                }
                $skus[$sku] = $i;
            }
        }
        if ($skus !== []) {
            $taken = Variant::query()
                // Case-insensitively, whatever the database's collation.
                ->where(fn ($q) => $q->whereIn(DB::raw('lower(sku)'), array_keys($skus)))
                ->when($productId !== null, fn ($q) => $q->where('product_id', '!=', $productId), fn ($q) => $q->whereNotIn('uid', array_filter($uids)))
                ->pluck('sku');
            foreach ($taken as $sku) {
                $errors['variants.'.$skus[mb_strtolower((string) $sku)].'.sku'] = "SKU {$sku} is used by another product.";
            }
        }

        // Bundle
        if ($value['type'] === 'bundle') {
            $bundle = $value['bundle'];
            if ($bundle['items'] === [] || count($bundle['items']) > 20) {
                $errors['bundle.items'] = 'Add 1 to 20 products to the bundle.';
            }
            if ($bundle['pricing'] === 'percent_off' && $bundle['value'] > 10000) {
                $errors['bundle.value'] = 'The discount is at most 100%.';
            }
            $components = Variant::query()->with('product:id,type')->whereIn('id', array_filter(array_column($bundle['items'], 'variant_id')))->get()->keyBy('id');
            foreach ($bundle['items'] as $i => $item) {
                $component = $components->get($item['variant_id']);
                if ($component === null) {
                    $errors["bundle.items.{$i}"] = 'This product no longer exists.';
                } elseif ($component->product->type === 'bundle' || $component->product_id === $productId) {
                    $errors["bundle.items.{$i}"] = "Bundles can't contain bundles.";
                }
            }
        }

        // Digital
        $downloads = [];
        foreach ($value['downloads'] as $j => $d) {
            $downloads[] = ["downloads.{$j}", $d];
        }
        foreach ($value['variants'] as $i => $v) {
            foreach ($v['downloads'] as $j => $d) {
                $downloads[] = ["variants.{$i}.downloads.{$j}", $d];
            }
        }
        foreach ($downloads as [$at, $d]) {
            if ($d['type'] === 'url' ? ! preg_match('#^https?://\S+$#i', (string) $d['url']) : $d['file_id'] === null) {
                $errors[$at] = $d['type'] === 'url' ? 'Enter a link starting with https://.' : 'Upload a file.';
            }
        }
        if ($value['delivery'] !== null) {
            foreach (['download_limit', 'expiry_days'] as $key) {
                if ($value['delivery'][$key] !== null && $value['delivery'][$key] < 1) {
                    $errors["delivery.{$key}"] = 'Enter 1 or more, or leave it empty.';
                }
            }
        }

        // Tiers
        if (count($value['tiers']) > 20) {
            $errors['tiers'] = 'At most 20 price tiers.';
        }
        foreach ($value['tiers'] as $i => $tier) {
            if ($tier['min_qty'] < 2) {
                $errors["tiers.{$i}.min_qty"] = 'Tiers start at 2 or more.';
            }
            if (! in_array($tier['type'], PriceTier::TYPES, true)) {
                $errors["tiers.{$i}.type"] = 'Choose a tier type.';
            } elseif ($tier['value'] < 0 || ($tier['type'] === 'percent_off' && $tier['value'] > 10000)) {
                $errors["tiers.{$i}.value"] = 'Enter a valid discount.';
            }
            if ($tier['variant'] !== null && ! in_array($tier['variant'], $uids, true)) {
                $errors["tiers.{$i}.variant"] = 'This variant no longer exists.';
            }
        }

        return $errors;
    }

    /**
     * Ids for new options, values, variants and downloads.
     *
     * @param  array<string, mixed>  $value
     * @return array<string, mixed>
     */
    public static function withIds(array $value): array
    {
        foreach ($value['options'] as &$option) {
            $option['id'] ??= (string) Str::ulid();
            foreach ($option['values'] as &$v) {
                $v['id'] ??= (string) Str::ulid();
            }
            unset($v);
        }
        unset($option);
        foreach ($value['variants'] as &$variant) {
            $variant['id'] ??= (string) Str::ulid();
            foreach ($variant['downloads'] as &$d) {
                $d['id'] ??= (string) Str::ulid();
            }
            unset($d);
        }
        unset($variant);
        foreach ($value['downloads'] as &$d) {
            $d['id'] ??= (string) Str::ulid();
        }
        unset($d);

        return $value;
    }

    protected static function id(mixed $value): ?string
    {
        return is_string($value) && preg_match('/^[0-9A-Za-z_-]{1,32}$/', $value) ? $value : null;
    }

    protected static function str(mixed $value): ?string
    {
        if (is_int($value) || is_float($value)) {
            $value = (string) $value;
        }

        return is_string($value) && trim($value) !== '' ? $value : null;
    }

    protected static function int(mixed $value): ?int
    {
        return is_numeric($value) ? (int) round((float) $value) : null;
    }

    protected static function bool(mixed $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    /** @return array<int|string, mixed> */
    protected static function list(mixed $value): array
    {
        return is_array($value) ? array_values($value) : [];
    }
}
