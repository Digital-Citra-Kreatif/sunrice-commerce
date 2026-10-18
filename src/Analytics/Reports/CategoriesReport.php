<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

/** Sales per product category. */
class CategoriesReport extends TermsReport
{
    public function key(): string
    {
        return 'categories';
    }

    public function label(): string
    {
        return 'Categories';
    }

    protected function taxonomy(): string
    {
        return (string) config('commerce.catalog.category_taxonomy', 'product_categories');
    }

    protected function termLabel(): string
    {
        return 'Category';
    }
}
