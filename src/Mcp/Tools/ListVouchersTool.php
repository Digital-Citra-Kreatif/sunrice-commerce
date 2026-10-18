<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;

#[IsReadOnly]
#[Description('List vouchers and automatic discounts: code, name, type and value, dates, uses and whether active. Search by code or name. Change one with save_voucher (id).')]
class ListVouchersTool extends CommerceTool
{
    protected string $name = 'list_vouchers';

    protected ?string $feature = 'vouchers';

    protected ?string $permission = 'commerce.vouchers.manage';

    protected function run(Request $request): Response
    {
        $args = $request->validate(['search' => ['nullable', 'string', 'max:64'], 'active' => ['nullable', 'boolean'], 'limit' => ['nullable', 'integer', 'min:1', 'max:100']]);
        $query = Voucher::query()->latest('id');
        if (! empty($args['search'])) {
            $like = '%'.$args['search'].'%';
            $query->where(fn (Builder $q) => $q->whereLike('code', $like)->orWhereLike('name', $like));
        }
        if (isset($args['active'])) {
            $query->where('active', (bool) $args['active']);
        }

        return $this->json(['vouchers' => $query->limit((int) ($args['limit'] ?? 50))->get()->map(fn (Voucher $v) => [
            'id' => $v->id, 'code' => $v->code, 'name' => $v->name, 'automatic' => (bool) $v->automatic, 'active' => (bool) $v->active, 'type' => $v->type,
            'value' => match ($v->type) {
                'percent' => ($v->value / 100).'%', 'buy_x_get_y', 'free_shipping' => null, default => OrderData::money($v->value)['formatted']
            },
            'starts_at' => $v->starts_at?->toIso8601String(), 'ends_at' => $v->ends_at?->toIso8601String(),
            'used' => $v->times_used, 'usage_limit' => $v->usage_limit,
        ])->all()]);
    }

    public function schema(JsonSchema $schema): array
    {
        return ['search' => $schema->string()->description('Code or name.'), 'active' => $schema->boolean(), 'limit' => $schema->integer()];
    }
}
