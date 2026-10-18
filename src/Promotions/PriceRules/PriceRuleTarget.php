<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\PriceRules;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $rule_id
 * @property string $target_type product | variant | term
 * @property int $target_id
 */
class PriceRuleTarget extends Model
{
    public $timestamps = false;

    protected $table = 'commerce_price_rule_targets';

    protected $guarded = [];
}
