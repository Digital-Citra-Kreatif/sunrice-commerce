<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;

/** Where the product feed is (for Google Merchant Center and Meta), or that the module is off. */
class ProductFeedCheck implements HealthCheck
{
    public function key(): string
    {
        return 'product_feed';
    }

    public function label(): string
    {
        return 'Product feed';
    }

    public function run(): HealthResult
    {
        return commerce_feature('product_feeds')
            ? HealthResult::ok('Give Google Merchant Center or Meta this address: '.commerce_url('commerce.feeds.products'))
            : HealthResult::ok('Off. Switch on Product feeds in Settings → Store → Features to list your products on Google Shopping or Meta.');
    }
}
