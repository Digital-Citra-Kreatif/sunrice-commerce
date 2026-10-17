<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Sunrice\Models\Term;

/**
 * A value of an option: a label (custom options) or a term (attribute taxonomies).
 *
 * @property int $id
 * @property int $option_id
 * @property string $uid
 * @property string|null $label
 * @property int|null $term_id
 * @property int $position
 */
class ProductOptionValue extends Model
{
    protected $table = 'commerce_product_option_values';

    protected $guarded = [];

    /** @return BelongsTo<ProductOption, $this> */
    public function option(): BelongsTo
    {
        return $this->belongsTo(ProductOption::class, 'option_id');
    }

    /** @return BelongsTo<Term, $this> */
    public function term(): BelongsTo
    {
        return $this->belongsTo(Term::class);
    }

    /** @return BelongsToMany<Variant, $this> */
    public function variants(): BelongsToMany
    {
        return $this->belongsToMany(Variant::class, 'commerce_variant_option_values', 'option_value_id', 'variant_id');
    }
}
