<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Actions;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Http\Controllers\Admin\TargetLabels;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleBoundaries;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleItem;
use Sunrice\Commerce\Promotions\FlashSales\OverlapCheck;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * Creates or updates a flash sale and its items (sold counts kept).
 * The admin form and the MCP tools both save through here, with the
 * form's values (fields()); values() gives a sale's current ones.
 */
class SaveFlashSale
{
    /** A new sale with the form's defaults (tomorrow, for a day). */
    public function blank(): FlashSale
    {
        return new FlashSale(['active' => true, 'show_countdown' => true, 'show_progress' => true, 'show_teaser' => true,
            'starts_at' => now()->addDay()->startOfHour(), 'ends_at' => now()->addDays(2)->startOfHour()]);
    }

    /** @return array<int, array<string, mixed>> */
    public function fields(): array
    {
        $descriptions = array_map(fn (string $l) => ['handle' => $l, 'type' => 'textarea', 'label' => Locales::name($l), 'translatable' => false, 'config' => ['max' => 2000]], Locales::all());

        return [
            ['handle' => 'name', 'section' => 'Sale', 'width' => 50, 'type' => 'text', 'label' => 'Name', 'required' => true, 'translatable' => false, 'config' => ['max' => 120]],
            ['handle' => 'slug', 'section' => 'Sale', 'width' => 50, 'type' => 'text', 'label' => 'URL slug', 'translatable' => false, 'instructions' => 'Its page: /flash-sale/{slug}. Empty: from the name.', 'validation' => ['regex:/^[a-z0-9-]*$/', 'max:120']],
            ['handle' => 'active', 'section' => 'Sale', 'width' => 50, 'type' => 'toggle', 'label' => 'Active'],
            ['handle' => 'dates', 'section' => 'Sale', 'type' => 'commerce_datetime_range', 'label' => 'When', 'required' => true, 'config' => ['require_start' => true, 'require_end' => true]],
            ['handle' => 'badge', 'section' => 'Sale', 'width' => 50, 'type' => 'text', 'label' => 'Badge', 'translatable' => false, 'instructions' => 'e.g. "12.12"', 'config' => ['max' => 40]],
            ['handle' => 'description', 'section' => 'Sale page', 'type' => 'group', 'label' => 'Description', 'config' => ['fields' => $descriptions]],
            ['handle' => 'banner', 'section' => 'Sale page', 'type' => 'asset', 'label' => 'Banner', 'config' => ['image_only' => true]],
            ['handle' => 'show_countdown', 'section' => 'Sale page', 'type' => 'toggle', 'label' => 'Show a countdown'],
            ['handle' => 'show_progress', 'section' => 'Sale page', 'type' => 'toggle', 'label' => 'Show how much is sold (items with a cap)'],
            ['handle' => 'show_teaser', 'section' => 'Sale page', 'type' => 'toggle', 'label' => 'Announce it before it starts'],
            ['handle' => 'per_customer_limit', 'section' => 'Sale', 'width' => 50, 'type' => 'number', 'label' => 'Units per customer', 'instructions' => 'At the sale price, per item. Empty: no limit.', 'config' => ['min' => 1], 'validation' => ['integer']],
            ['handle' => 'items', 'section' => 'Products', 'type' => 'repeater', 'label' => 'Product rule', 'required' => true,
                'config' => ['min' => 1, 'max' => 200, 'summary_targets' => 'target', 'fields' => [
                    ['handle' => 'target', 'width' => 100, 'type' => 'commerce_targets', 'label' => 'Products and variants', 'instructions' => 'Each selection gets its own price and limits.', 'required' => true, 'config' => ['types' => ['product', 'variant']]],
                    ['handle' => 'discount_type', 'width' => 50, 'type' => 'select', 'label' => 'Discount method', 'required' => true, 'config' => ['options' => [
                        ['value' => 'percent_off', 'label' => 'Percent off'], ['value' => 'amount_off', 'label' => 'Amount off'], ['value' => 'fixed_price', 'label' => 'Fixed price'],
                    ]]],
                    ['handle' => 'percent', 'width' => 50, 'condition' => ['field' => 'discount_type', 'operator' => 'equals', 'value' => 'percent_off'], 'type' => 'number', 'label' => 'Discount (%)', 'required' => true, 'config' => ['min' => 0, 'max' => 100]],
                    ['handle' => 'amount', 'width' => 50, 'condition' => ['match' => 'any', 'rules' => [
                        ['field' => 'discount_type', 'operator' => 'equals', 'value' => 'amount_off'],
                        ['field' => 'discount_type', 'operator' => 'equals', 'value' => 'fixed_price'],
                    ]], 'type' => 'commerce_money', 'required' => true, 'label' => 'Amount',
                        'instructions' => 'Enter the discount amount for Amount off, or the selling price for Fixed price.'],
                    ['handle' => 'quantity_limit', 'width' => 50, 'type' => 'number', 'label' => 'Total units at this price', 'instructions' => 'Leave blank for no total limit.', 'config' => ['min' => 1], 'validation' => ['integer']],
                    ['handle' => 'per_customer_limit', 'width' => 50, 'type' => 'number', 'label' => 'Units per customer', 'instructions' => 'Leave blank to use the sale-wide limit.', 'config' => ['min' => 1], 'validation' => ['integer']],
                ]]],
        ];
    }

    /** @return array<string, mixed> */
    public function values(FlashSale $sale): array
    {
        $items = $sale->exists ? $sale->items : collect();
        $targets = TargetLabels::for($items->map(fn (FlashSaleItem $i) => $i->variant_id !== null ? ['type' => 'variant', 'id' => $i->variant_id] : ['type' => 'product', 'id' => $i->product_id])->all());
        $values = [
            'name' => $sale->name, 'slug' => $sale->slug, 'active' => $sale->active, 'badge' => $sale->badge, 'description' => $sale->description ?? [],
            'banner' => $sale->banner_asset_id, 'show_countdown' => $sale->show_countdown, 'show_progress' => $sale->show_progress, 'show_teaser' => $sale->show_teaser,
            'per_customer_limit' => $sale->per_customer_limit,
            'dates' => ['start' => $sale->starts_at->toIso8601String(), 'end' => $sale->ends_at->toIso8601String()],
            'items' => $items->values()->map(fn (FlashSaleItem $i, int $n) => [
                'target' => [$targets[$n]], 'discount_type' => $i->discount_type,
                'percent' => $i->discount_type === 'percent_off' ? $i->discount_value / 100 : null,
                'amount' => $i->discount_type !== 'percent_off' ? $i->discount_value : null,
                'quantity_limit' => $i->quantity_limit, 'per_customer_limit' => $i->per_customer_limit,
            ])->all(),
        ];

        return $values;
    }

    /**
     * @param  array<string, mixed>  $input  the form's values
     *
     * @throws ValidationException
     */
    public function handle(FlashSale $sale, array $input): FlashSale
    {
        $values = SchemaForm::make($this->fields())->validate($input, [
            'slug' => [Rule::unique('commerce_flash_sales', 'slug')->ignore($sale->id)],
        ]);
        $targets = collect((array) $values['items'])->flatMap(fn (array $row): array => $row['target'] ?? []);
        $products = Product::query()->whereNull('removed_at')->findMany($targets->where('type', 'product')->pluck('id')->unique()->values())->keyBy('id');
        $variants = Variant::query()->whereHas('product', fn ($query) => $query->whereNull('removed_at'))
            ->findMany($targets->where('type', 'variant')->pluck('id')->unique()->values())->keyBy('id');
        $items = [];
        foreach ((array) $values['items'] as $i => $item) {
            if (empty($item['target'])) {
                throw SchemaForm::prefixed(ValidationException::withMessages(["items.{$i}.target" => 'Choose at least one product or variant.']));
            }
            $type = (string) $item['discount_type'];
            $value = $type === 'percent_off' ? (int) round((float) ($item['percent'] ?? 0) * 100) : (int) ($item['amount'] ?? 0);
            if ($type === 'percent_off' && ($value <= 0 || $value > 10000)) {
                throw SchemaForm::prefixed(ValidationException::withMessages(["items.{$i}.percent" => 'Enter a percentage between 0 and 100.']));
            }
            foreach ($item['target'] as $target) {
                $variant = $target['type'] === 'variant' ? $variants->get($target['id']) : null;
                $productId = $variant->product_id ?? ($target['type'] === 'product' ? $products->get($target['id'])?->id : null);
                if ($productId === null) {
                    throw SchemaForm::prefixed(ValidationException::withMessages(["items.{$i}.target" => 'Choose an existing product or variant.']));
                }
                $key = $productId.':'.$variant?->id;
                if (isset($items[$key])) {
                    throw SchemaForm::prefixed(ValidationException::withMessages(["items.{$i}.target" => 'This product or variant already has a rule in this sale.']));
                }
                $items[$key] = [
                    'product_id' => $productId, 'variant_id' => $variant?->id,
                    'discount_type' => $type, 'discount_value' => $value,
                    'quantity_limit' => $item['quantity_limit'] ?? null, 'per_customer_limit' => $item['per_customer_limit'] ?? null, 'position' => count($items),
                ];
            }
        }
        if (count($items) > 200) {
            throw SchemaForm::prefixed(ValidationException::withMessages(['items' => 'Choose at most 200 products and variants.']));
        }
        $items = array_values($items);
        $starts = Carbon::parse($values['dates']['start']);
        $ends = Carbon::parse($values['dates']['end']);
        if ((bool) $values['active'] && ($other = OverlapCheck::conflict($items, $starts, $ends, $sale->id)) !== null) {
            throw SchemaForm::prefixed(ValidationException::withMessages(['items' => "Some of these products are in \"{$other}\" at the same time. A product can be in one flash sale at a time."]));
        }

        $before = $sale->exists ? [$sale->id] : [];
        DB::transaction(function () use ($sale, $values, $items, $starts, $ends): void {
            $sale->fill([
                'name' => $values['name'], 'slug' => $values['slug'] ?: Str::slug($values['name']).($sale->exists ? '' : '-'.Str::lower(Str::random(4))),
                'active' => (bool) $values['active'], 'starts_at' => $starts, 'ends_at' => $ends, 'badge' => $values['badge'],
                'description' => array_filter((array) $values['description']), 'banner_asset_id' => $values['banner'] ?? null,
                'show_countdown' => (bool) $values['show_countdown'], 'show_progress' => (bool) $values['show_progress'], 'show_teaser' => (bool) $values['show_teaser'],
                'per_customer_limit' => $values['per_customer_limit'] ?? null,
            ])->save();
            // Keep sold counts of items that stay.
            $existing = $sale->items()->get()->keyBy(fn (FlashSaleItem $i) => $i->product_id.':'.$i->variant_id);
            $kept = [];
            foreach ($items as $item) {
                $row = $existing->get($item['product_id'].':'.$item['variant_id']) ?? new FlashSaleItem(['flash_sale_id' => $sale->id]);
                $row->fill($item)->save();
                $kept[] = $row->id;
            }
            $sale->items()->whereNotIn('id', $kept)->delete();
        });
        FlashSaleBoundaries::refresh([...$before, $sale->id]);
        app(ActivityRecorder::class)->record($sale->wasRecentlyCreated ? 'created' : 'updated', "Flash sale: {$sale->name}", [], 'flash_sale');

        return $sale;
    }
}
