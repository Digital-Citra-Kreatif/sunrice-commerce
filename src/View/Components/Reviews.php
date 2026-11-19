<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\HtmlString;
use Illuminate\View\Component;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Catalog\LiveEntries;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Reviews\Actions\SubmitReview;
use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\PageCache;

/**
 * <x-commerce::reviews :entry="$entry" />: the product's rating, its
 * approved reviews (10 a page, ?reviews=2…) and the form to write one.
 */
class Reviews extends Component
{
    public ?Product $product;

    /** @var LengthAwarePaginator<int, Review>|null */
    public ?LengthAwarePaginator $reviews = null;

    /** @var array<int, int> */
    public array $breakdown = [];

    /** sign_in | buyers_only | null (the form shows) */
    public ?string $blocked = null;

    public ?Review $ownReview = null;

    /** Kept for published review templates from earlier versions. */
    public bool $guest = false;

    public ?HtmlString $captcha = null;

    public function __construct(Entry|EntryTranslation $entry, ?Product $projectedProduct = null)
    {
        $this->product = $projectedProduct ?? Product::query()->where('entry_id', LiveEntries::id($entry))->first();
        if (! $this->shouldRender() || $this->product === null) {
            return;
        }
        $this->reviews = Review::query()->approved()->where('product_id', $this->product->id)->latest()
            ->paginate(10, ['*'], 'reviews')->fragment('reviews');
        $this->breakdown = $this->product->rating_count > 0 ? ProductRating::breakdown($this->product->id) : [];

        $customer = app(CurrentCustomer::class)->get();
        $this->blocked = match (true) {
            $customer === null => commerce_feature('accounts') ? 'sign_in' : 'buyers_only',
            app(SubmitReview::class)->purchase($this->product, $customer) === null => 'buyers_only',
            default => null,
        };
        if ($customer !== null && $this->blocked === null) {
            PageCache::markDynamic();
            $this->ownReview = Review::query()->where('product_id', $this->product->id)->where('customer_id', $customer->id)->first();
        }
    }

    public function shouldRender(): bool
    {
        return $this->product !== null && commerce_feature('reviews');
    }

    public function render(): View
    {
        return view(Layout::view('partials.reviews'));
    }
}
