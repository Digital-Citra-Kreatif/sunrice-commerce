<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Support\Collection as Support;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;

/** Product tools: listed for users who may see a product collection, like Shop → Products. */
abstract class ProductTool extends CommerceTool
{
    protected ?string $feature = 'catalog';

    public function shouldRegister(): bool
    {
        return parent::shouldRegister() && $this->collections()->isNotEmpty();
    }

    /** @return Support<int, Collection> the product collections the user may see */
    protected function collections(): Support
    {
        $user = auth()->user();

        return Collection::query()->whereIn('handle', (array) config('commerce.catalog.collections', ['products']))->get()
            ->filter(fn (Collection $c) => $user !== null && $user->can('viewAny', [Entry::class, $c->id]))->values();
    }
}
