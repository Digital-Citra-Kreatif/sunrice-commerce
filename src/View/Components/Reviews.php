<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\HtmlString;
use Illuminate\View\Component;
use Sunrice\Admin\Security\Captcha;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Catalog\LiveEntries;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Reviews\Actions\SubmitReview;
use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\Layout;

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

    public bool $guest = true;

    public ?HtmlString $captcha = null;

    public function __construct(Entry|EntryTranslation $entry)
    {
        $this->product = Product::query()->where('entry_id', LiveEntries::id($entry))->first();
        if (! $this->shouldRender() || $this->product === null) {
            return;
        }
        $this->reviews = Review::query()->approved()->where('product_id', $this->product->id)->latest()
            ->paginate(10, ['*'], 'reviews')->fragment('reviews');
        $this->breakdown = $this->product->rating_count > 0 ? ProductRating::breakdown($this->product->id) : [];

        $customer = app(CurrentCustomer::class)->get();
        $this->guest = $customer === null;
        $who = (string) app(StoreSettings::class)->get('catalog.reviews_who', 'everyone');
        $this->blocked = match (true) {
            $who !== 'everyone' && $customer === null => 'sign_in',
            $who === 'buyers' && $customer !== null && app(SubmitReview::class)->purchase($this->product, $customer) === null => 'buyers_only',
            default => null,
        };
        $this->captcha = $this->guest && $this->blocked === null ? app(Captcha::class)->widget(app()->getLocale()) : null;
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
