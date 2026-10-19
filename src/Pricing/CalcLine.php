<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing;

use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;

/** A line of a calculation: a variant and quantity, its unit price and what was taken off. */
final class CalcLine
{
    public int $unitPrice = 0;

    public int $regularUnitPrice = 0;

    /** @var array{type: string, id?: int|string|null, label?: string|null} */
    public array $priceSource = ['type' => 'base'];

    /** @var array<string, mixed> */
    public array $priceMeta = [];

    public int $subtotal = 0;

    /** @var array<string, int> adjustment key => amount taken off this line */
    public array $discounts = [];

    /** @var array<int, array{name: string, rate: int, amount: int, compound: bool}> */
    public array $taxes = [];

    public bool $onSale = false;

    public bool $requiresShipping = true;

    public bool $downloadable = false;

    public ?string $taxClass = null;

    /**
     * @param  array<string, mixed>  $meta  e.g. customer notes per line, cart item id
     */
    public function __construct(
        public readonly string $key,
        public Variant $variant,
        public int $quantity,
        public array $meta = [],
    ) {}

    public function product(): Product
    {
        return $this->variant->product;
    }

    protected ?int $basePrice = null;

    /**
     * The unit price promotions start from: the variant's price, or a
     * bundle's from its pricing mode (a bundle priced from its components
     * has a variant price of 0).
     */
    public function basePrice(): int
    {
        $product = $this->product();

        return $this->basePrice ??= $product->isBundle() ? app(Bundles::class)->price($product, $this->variant) : $this->variant->price;
    }

    public function discount(): int
    {
        return array_sum($this->discounts);
    }

    /** Subtotal after discounts. */
    public function net(): int
    {
        return max(0, $this->subtotal - $this->discount());
    }

    public function tax(): int
    {
        return array_sum(array_column($this->taxes, 'amount'));
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'variant_id' => $this->variant->id,
            'product_id' => $this->variant->product_id,
            'sku' => $this->variant->sku,
            'quantity' => $this->quantity,
            'unit_price' => $this->unitPrice,
            'regular_unit_price' => $this->regularUnitPrice,
            'price_source' => $this->priceSource,
            'subtotal' => $this->subtotal,
            'discount' => $this->discount(),
            'discounts' => $this->discounts,
            'tax' => $this->tax(),
            'total' => $this->net(),
            'on_sale' => $this->onSale,
            'requires_shipping' => $this->requiresShipping,
            'downloadable' => $this->downloadable,
            'meta' => $this->meta,
        ];
    }
}
