<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Feeds\ProductFeed;

/**
 * GET /feeds/products.xml: the product feed (Feeds\ProductFeed), kept an
 * hour or until store content changes. Shared by everyone who fetches it,
 * so it is built as a guest sees the store: never a signed-in customer's
 * prices or visibility.
 */
class FeedController extends Controller
{
    public function __invoke(ProductFeed $feed): Response
    {
        $xml = CatalogVersion::remember('feed:products:'.ProductFeed::version().':'.app()->getLocale(), 3600, fn (): string => CurrentCustomer::asGuest(fn () => $feed->xml()));

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8', 'X-Robots-Tag' => 'noindex']);
    }
}
