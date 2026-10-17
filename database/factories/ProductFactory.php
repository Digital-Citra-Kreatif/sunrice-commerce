<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\ProductOption;
use Sunrice\Commerce\Catalog\Models\Variant;

/** @extends Factory<Product> */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'entry_id' => fake()->unique()->numberBetween(1, 1_000_000),
            'collection_id' => 1,
            'type' => 'simple',
            'purchase_mode' => 'default',
            'requires_shipping' => true,
            'downloadable' => false,
            'featured' => false,
            'sync_status' => 'ok',
            'synced_at' => now(),
        ];
    }

    /** With one variant at this price. */
    public function simple(int $price = 100000): static
    {
        return $this->state(['type' => 'simple', 'min_price' => $price, 'max_price' => $price])
            ->has(Variant::factory()->state(['price' => $price, 'is_default' => true]), 'variants');
    }

    /**
     * A variable product with options and one variant per combination.
     *
     * @param  array<string, array<int, string>>  $options  name => value labels
     */
    public function variable(array $options = ['Size' => ['S', 'M'], 'Color' => ['Red', 'Blue']], int $price = 100000): static
    {
        return $this->state(['type' => 'variable'])->afterCreating(function (Product $product) use ($options, $price): void {
            $valueSets = [];
            $position = 0;
            foreach ($options as $name => $labels) {
                $option = ProductOption::query()->create(['product_id' => $product->id, 'uid' => (string) Str::ulid(), 'name' => $name, 'position' => $position++]);
                $valueSets[] = collect($labels)->values()->map(fn (string $label, int $i) => $option->values()->create(['uid' => (string) Str::ulid(), 'label' => $label, 'position' => $i]))->all();
            }
            $combinations = [[]];
            foreach ($valueSets as $values) {
                $next = [];
                foreach ($combinations as $combination) {
                    foreach ($values as $value) {
                        $next[] = [...$combination, $value];
                    }
                }
                $combinations = $next;
            }
            foreach ($combinations as $i => $combination) {
                $variant = Variant::factory()->for($product)->create([
                    'title' => collect($combination)->pluck('label')->implode(' / '),
                    'price' => $price,
                    'position' => $i,
                    'is_default' => $i === 0,
                ]);
                $variant->optionValues()->attach(collect($combination)->pluck('id')->all());
            }
            $product->update(['min_price' => $price, 'max_price' => $price]);
        });
    }
}
