<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Support\Collection as Support;
use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Support\Access;
use Sunrice\Commerce\Mcp\CommerceTool;

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
            ->filter(fn (Collection $c) => $user instanceof Authorizable && Access::entries($user, 'view', $c))->values();
    }
}
