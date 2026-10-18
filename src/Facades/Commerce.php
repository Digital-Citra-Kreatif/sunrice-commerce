<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Sunrice\Commerce\Commerce
 */
class Commerce extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \Sunrice\Commerce\Commerce::class;
    }
}
