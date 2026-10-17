<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Database\Eloquent\Model;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Promotions\Actions\SaveFlashSale;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;

/** @extends SaveWithFormTool<FlashSale> */
#[Description('Create or change a flash sale, like Shop → Flash sales: name, dates (start and end), and items (each a product or variant target with discount_type percent_off, amount_off or fixed_price and its percent or amount, optionally a unit cap). Call without values to see the fields, then send what changes. A product can be in one active sale at a time.')]
class SaveFlashSaleTool extends SaveWithFormTool
{
    protected string $name = 'save_flash_sale';

    protected ?string $feature = 'flash_sales';

    protected ?string $permission = 'commerce.flash-sales.manage';

    protected function action(): object
    {
        return app(SaveFlashSale::class);
    }

    protected function record(?int $id): ?Model
    {
        return $id === null ? app(SaveFlashSale::class)->blank() : FlashSale::query()->find($id);
    }

    /** @param  FlashSale  $m */
    protected function present(Model $m): array
    {
        return ['id' => $m->id, 'name' => $m->name, 'slug' => $m->slug, 'active' => (bool) $m->active, 'starts_at' => $m->starts_at->toIso8601String(), 'ends_at' => $m->ends_at->toIso8601String(), 'items' => $m->items()->count()];
    }
}
