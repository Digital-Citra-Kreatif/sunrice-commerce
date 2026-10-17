<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

/** Sales per brand. */
class BrandsReport extends TermsReport
{
    public function key(): string
    {
        return 'brands';
    }

    public function label(): string
    {
        return 'Brands';
    }

    public function feature(): ?string
    {
        return 'brands';
    }

    protected function taxonomy(): string
    {
        return (string) config('commerce.catalog.brand_taxonomy', 'brands');
    }

    protected function termLabel(): string
    {
        return 'Brand';
    }
}
