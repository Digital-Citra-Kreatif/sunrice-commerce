<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\View\Component;
use Sunrice\Commerce\Storefront\Slots;

/** <x-commerce::slot name="product.after_add_to_cart" :product="$product" /> */
class Slot extends Component
{
    /** @var array<int, string> */
    public array $views;

    public function __construct(public string $name)
    {
        $this->views = app(Slots::class)->views($name);
    }

    public function render(): string
    {
        return <<<'BLADE'
            @foreach ($views as $view)
                @include($view, $attributes->getAttributes())
            @endforeach
            BLADE;
    }
}
