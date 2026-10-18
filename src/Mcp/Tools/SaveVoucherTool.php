<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Database\Eloquent\Model;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Promotions\Actions\SaveVoucher;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;

/** @extends SaveWithFormTool<Voucher> */
#[Description('Create or change a voucher (a code) or an automatic discount, like Shop → Vouchers. Call without values to see the fields and current values, then send only what changes. Types: percent, fixed_cart, fixed_item, free_shipping, buy_x_get_y.')]
class SaveVoucherTool extends SaveWithFormTool
{
    protected string $name = 'save_voucher';

    protected ?string $feature = 'vouchers';

    protected ?string $permission = 'commerce.vouchers.manage';

    protected function action(): object
    {
        return app(SaveVoucher::class);
    }

    protected function record(?int $id): ?Model
    {
        return $id === null ? app(SaveVoucher::class)->blank() : Voucher::query()->find($id);
    }

    /** @param  Voucher  $m */
    protected function present(Model $m): array
    {
        return ['id' => $m->id, 'code' => $m->code, 'name' => $m->name, 'active' => (bool) $m->active, 'automatic' => (bool) $m->automatic, 'type' => $m->type];
    }
}
