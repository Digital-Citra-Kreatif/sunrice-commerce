<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Models\Entry;
use Sunrice\Support\Locales;

#[IsReadOnly]
#[Description('One product by entry id or SKU: its title and status, the stored Product data (the `product` field) and the variants with their ids (for create_order), live stock and prices. Products are Sunrice entries: change the title, description or images and the Product data with update_entry, sending the whole `product` field back in the shape shown under product (see `editing`).')]
class GetProductTool extends ProductTool
{
    protected string $name = 'get_product';

    public const EDITING = 'Send the whole object back as fields.product in update_entry. Keys: type (simple | variable | bundle), purchase_mode (default | cart | inquiry | whatsapp | external | none), '
        .'external_links [{preset, label, url}], requires_shipping, downloadable (digital products: downloadable true, requires_shipping false, downloads [{type: url, url, name}]), featured, tax_class, '
        .'options [{id, name, taxonomy, values [{id, label, term_id}]}] (variable products), '
        .'variants [{id (keep existing ids), options {optionId: valueId}, sku, barcode, price, compare_at_price, cost (integers, smallest currency unit), weight (grams), length/width/height (mm), '
        .'track_stock, initial_stock (only for new variants; change stock with adjust_stock), backorders (no | allow | notify), low_stock_threshold, stock_status, min_qty, max_qty, qty_step, active}], '
        .'bundle {items [{variant_id, quantity}], pricing (fixed | percent_off | amount_off), value}, tiers [{min_qty, type (percent_off | amount_off | fixed_price), value}].';

    protected function run(Request $request): Response
    {
        $key = (string) $request->get('product', '');
        $product = ctype_digit($key)
            ? Product::query()->where('entry_id', (int) $key)->first()
            : Product::query()->whereKey(Variant::query()->where('sku', $key)->value('product_id'))->first();
        $entry = $product !== null ? Entry::query()->whereIn('collection_id', $this->collections()->pluck('id'))->find($product->entry_id) : null;
        if ($product === null || $entry === null) {
            return $this->notFound('Product');
        }
        $entry->resolveFor(Locales::main());
        $variants = $product->variants()->with('optionValues')->get();

        return $this->json([
            'id' => $entry->id, 'product_id' => $product->id, 'title' => $entry->title, 'status' => $entry->status, 'url' => $entry->url !== null ? url($entry->url) : null,
            'product' => $entry->get((string) config('commerce.catalog.field', 'product')),
            'variants' => $variants->map(fn (Variant $v) => [
                'variant_id' => $v->id, 'uid' => $v->uid, 'sku' => $v->sku, 'title' => $v->title, 'price' => OrderData::money($v->price),
                'stock' => $v->track_stock ? $v->stock_quantity : null, 'stock_status' => $v->stock_status, 'active' => $v->active,
            ])->all(),
            'editing' => self::EDITING,
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return ['product' => $schema->string()->description('The product\'s entry id, or a variant SKU.')->required()];
    }
}
