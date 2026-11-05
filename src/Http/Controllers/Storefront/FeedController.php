<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Feeds\ProductFeed;

/** GET /feeds/products.xml: the product feed (Feeds\ProductFeed), kept an hour or until the catalog changes. */
class FeedController extends Controller
{
    public function __invoke(ProductFeed $feed): Response
    {
        $xml = CatalogVersion::remember('feed:products:'.app()->getLocale(), 3600, fn (): string => $feed->xml());

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8', 'X-Robots-Tag' => 'noindex']);
    }
}
