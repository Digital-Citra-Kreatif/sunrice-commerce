<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Illuminate\Database\Eloquent\Model;

/**
 * A customer (or email) a voucher is for (audience "customers").
 *
 * @property int $id
 * @property int $voucher_id
 * @property int|null $customer_id
 * @property string|null $email
 */
class VoucherCustomer extends Model
{
    public $timestamps = false;

    protected $table = 'commerce_voucher_customers';

    protected $guarded = [];
}
