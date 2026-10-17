<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $voucher_id
 * @property string $mode include | exclude | buy | get
 * @property string $target_type product | variant | term
 * @property int $target_id
 */
class VoucherTarget extends Model
{
    public $timestamps = false;

    protected $table = 'commerce_voucher_targets';

    protected $guarded = [];
}
