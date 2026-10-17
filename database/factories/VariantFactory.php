<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;

/** @extends Factory<Variant> */
class VariantFactory extends Factory
{
    protected $model = Variant::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'uid' => (string) Str::ulid(),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####-??')),
            'title' => '',
            'price' => 100000,
            'track_stock' => false,
            'stock_status' => 'in_stock',
            'backorders' => 'no',
            'min_qty' => 1,
            'qty_step' => 1,
            'active' => true,
        ];
    }

    public function tracked(int $quantity, string $backorders = 'no'): static
    {
        return $this->state(['track_stock' => true, 'stock_quantity' => $quantity, 'backorders' => $backorders,
            'stock_status' => $quantity > 0 ? 'in_stock' : ($backorders === 'no' ? 'out_of_stock' : 'backorder')]);
    }
}
