{{--
    <x-commerce::reviews>: the product's rating, its approved reviews and the
    form. $product (rating_count, rating_average), $reviews (paginator),
    $breakdown (rating => count), $blocked (sign_in | buyers_only | null),
    The form is available to signed-in buyers.
--}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($stars = fn (float $rating) => str_repeat('★', (int) round($rating)).str_repeat('☆', 5 - (int) round($rating)))
<section class="commerce-reviews" id="reviews" aria-labelledby="reviews-title">
    <h2 id="reviews-title">{{ __('commerce::storefront.reviews.title') }}</h2>
    @if ($product->rating_count > 0)
        @php($average = number_format((float) $product->rating_average, 1, app()->getLocale() === 'id' ? ',' : '.', ''))
        <div class="commerce-reviews__summary">
            <div class="commerce-reviews__score">
                <p class="commerce-reviews__number">
                    <strong>{{ $average }}</strong> <span>/ 5</span>
                </p>
                <span aria-hidden="true">{{ $stars((float) $product->rating_average) }}</span>
                <p>{{ trans_choice('commerce::storefront.reviews.count', $product->rating_count) }}</p>
            </div>
            <dl class="commerce-reviews__breakdown">
                @foreach ($breakdown as $rating => $count)
                    <div>
                        <dt>{{ trans_choice('commerce::storefront.reviews.stars', $rating) }}</dt>
                        <dd><meter aria-hidden="true" min="0" max="{{ $product->rating_count }}" value="{{ $count }}"></meter><span>{{ $count }}</span></dd>
                    </div>
                @endforeach
            </dl>
        </div>
    @else
        <p class="commerce-reviews__empty">{{ __('commerce::storefront.reviews.none') }}</p>
    @endif

    @foreach ($reviews as $review)
        <article class="commerce-review">
            <header>
                <p class="commerce-rating"><span class="commerce-visually-hidden">{{ trans_choice('commerce::storefront.reviews.stars', $review->rating) }}</span><span aria-hidden="true">{{ $stars($review->rating) }}</span></p>
                @if ($review->title)<h3>{{ $review->title }}</h3>@endif
                <p class="commerce-review__meta">
                    <strong>{{ $review->name }}</strong>
                    <time datetime="{{ $review->created_at?->toDateString() }}">{{ $review->created_at?->isoFormat('D MMM YYYY') }}</time>
                    @if ($review->verified()) <span class="commerce-review__verified">{{ __('commerce::storefront.reviews.verified') }}</span>@endif
                </p>
            </header>
            <p class="commerce-review__body">{!! nl2br(e($review->body)) !!}</p>
            @if ($review->reply)
                <div class="commerce-review__reply">
                    <p><strong>{{ __('commerce::storefront.reviews.reply', ['store' => commerce_store_name()]) }}</strong></p>
                    <p>{!! nl2br(e($review->reply)) !!}</p>
                </div>
            @endif
        </article>
    @endforeach
    {{ $reviews->onEachSide(1)->links($L::view('partials.pagination')) }}

    @include(\Sunrice\Commerce\Storefront\Layout::view('product.review-form'))
</section>
