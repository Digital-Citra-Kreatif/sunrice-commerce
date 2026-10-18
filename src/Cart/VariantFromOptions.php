<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart;

use Sunrice\Commerce\Catalog\Models\Variant;

/** The variant of a product matching the chosen option values (the picker posted without JavaScript). */
final class VariantFromOptions
{
    /** @param  array<string, string>  $options  option uid => value uid */
    public static function find(int $productId, array $options): ?int
    {
        $variants = Variant::query()->where('product_id', $productId)->where('active', true)->with('optionValues.option')->get();
        foreach ($variants as $variant) {
            $map = [];
            foreach ($variant->optionValues as $value) {
                $map[(string) $value->option->uid] = (string) $value->uid;
            }
            if ($map !== [] && array_diff_assoc($options, $map) === [] && count($map) === count($options)) {
                return $variant->id;
            }
        }

        return null;
    }

    /**
     * The variant id from a cart request: `variant`, or `product` with `options`.
     *
     * @param  array<string, mixed>  $input
     */
    public static function fromRequest(array $input): ?int
    {
        if (isset($input['product'], $input['options']) && is_array($input['options']) && $input['options'] !== []) {
            return self::find((int) $input['product'], array_map('strval', $input['options']));
        }

        return isset($input['variant']) && is_numeric($input['variant']) ? (int) $input['variant'] : null;
    }
}
