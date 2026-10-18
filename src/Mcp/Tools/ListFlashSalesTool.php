<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;

#[IsReadOnly]
#[Description('List flash sales with their dates, state (upcoming, running, ended or off), item count and units sold. Change one with save_flash_sale (id).')]
class ListFlashSalesTool extends CommerceTool
{
    protected string $name = 'list_flash_sales';

    protected ?string $feature = 'flash_sales';

    protected ?string $permission = 'commerce.flash-sales.manage';

    protected function run(Request $request): Response
    {
        $sales = FlashSale::query()->withCount('items')->withSum('items', 'sold_quantity')->latest('starts_at')->limit(50)->get();

        return $this->json(['flash_sales' => $sales->map(fn (FlashSale $s) => [
            'id' => $s->id, 'name' => $s->name, 'slug' => $s->slug,
            'state' => ! $s->active ? 'off' : (now()->lt($s->starts_at) ? 'upcoming' : (now()->gte($s->ends_at) ? 'ended' : 'running')),
            'starts_at' => $s->starts_at->toIso8601String(), 'ends_at' => $s->ends_at->toIso8601String(),
            'items' => (int) $s->getAttribute('items_count'), 'sold' => (int) $s->getAttribute('items_sum_sold_quantity'),
        ])->all()]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
