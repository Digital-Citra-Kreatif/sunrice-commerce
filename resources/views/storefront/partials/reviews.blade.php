{{--
    <x-commerce::reviews>: the product's rating, its approved reviews and the
    form. $product (rating_count, rating_average), $reviews (paginator),
    $breakdown (rating => count), $blocked (sign_in | buyers_only | null),
    $guest, $captcha (widget or null).
--}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($stars = fn (float $rating) => str_repeat('★', (int) round($rating)).str_repeat('☆', 5 - (int) round($rating)))
<section class="commerce-reviews" id="reviews" aria-labelledby="reviews-title">
    <h2 id="reviews-title">{{ __('commerce::storefront.reviews.title') }}</h2>
    @if ($product->rating_count > 0)
        <div class="commerce-reviews__summary">
            <p class="commerce-rating">
                <span aria-hidden="true">{{ $stars((float) $product->rating_average) }}</span>
                <span>{{ __('commerce::storefront.reviews.average', ['rating' => number_format((float) $product->rating_average, 1, app()->getLocale() === 'id' ? ',' : '.', ''), 'count' => $product->rating_count]) }}</span>
            </p>
            <dl class="commerce-reviews__breakdown">
                @foreach ($breakdown as $rating => $count)
                    <div><dt>{{ trans_choice('commerce::storefront.reviews.stars', $rating, ['count' => $rating]) }}</dt>
                        <dd><meter min="0" max="{{ $product->rating_count }}" value="{{ $count }}"></meter> {{ $count }}</dd></div>
                @endforeach
            </dl>
        </div>
    @else
        <p class="commerce-reviews__empty">{{ __('commerce::storefront.reviews.none') }}</p>
    @endif

    @foreach ($reviews as $review)
        <article class="commerce-review">
            <header>
                <p class="commerce-rating" aria-label="{{ trans_choice('commerce::storefront.reviews.stars', $review->rating, ['count' => $review->rating]) }}"><span aria-hidden="true">{{ $stars($review->rating) }}</span></p>
                @if ($review->title)<h3>{{ $review->title }}</h3>@endif
                <p class="commerce-review__meta">
                    {{ $review->name }} · <time datetime="{{ $review->created_at?->toDateString() }}">{{ $review->created_at?->isoFormat('D MMM YYYY') }}</time>
                    @if ($review->verified()) · <span class="commerce-review__verified">{{ __('commerce::storefront.reviews.verified') }}</span>@endif
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

    <h3>{{ __('commerce::storefront.reviews.write') }}</h3>
    @if ($blocked === 'sign_in')
        <p>{!! __('commerce::storefront.reviews.sign_in_link', ['url' => e(commerce_url('commerce.account.login'))]) !!}</p>
    @elseif ($blocked === 'buyers_only')
        <p>{{ __('commerce::storefront.reviews.buyers_only') }}</p>
    @else
        @include($L::view('partials.messages'))
        @include($L::view('partials.field-error'), ['name' => 'review'])
        <form method="POST" action="{{ commerce_url('commerce.reviews.store', ['product' => $product->id]) }}" class="commerce-reviews__form">
            @csrf <x-honeypot />
            <fieldset class="commerce-field commerce-reviews__stars">
                <legend>{{ __('commerce::storefront.reviews.rating') }} *</legend>
                @foreach ([5, 4, 3, 2, 1] as $rating)
                    <label><input type="radio" name="rating" value="{{ $rating }}" required @checked((int) old('rating') === $rating)> {{ trans_choice('commerce::storefront.reviews.stars', $rating, ['count' => $rating]) }}</label>
                @endforeach
                @include($L::view('partials.field-error'), ['name' => 'rating'])
            </fieldset>
            @if ($guest)
                <label class="commerce-field" for="review-name"><span>{{ __('commerce::storefront.reviews.name') }} *</span>
                    <input id="review-name" name="name" value="{{ old('name') }}" maxlength="100" required autocomplete="name">
                    @include($L::view('partials.field-error'), ['name' => 'name'])</label>
                <label class="commerce-field" for="review-email"><span>{{ __('commerce::storefront.reviews.email') }} *</span>
                    <input id="review-email" type="email" name="email" value="{{ old('email') }}" maxlength="255" required autocomplete="email">
                    <small>{{ __('commerce::storefront.reviews.email_private') }}</small>
                    @include($L::view('partials.field-error'), ['name' => 'email'])</label>
            @endif
            <label class="commerce-field" for="review-title"><span>{{ __('commerce::storefront.reviews.review_title') }}</span>
                <input id="review-title" name="title" value="{{ old('title') }}" maxlength="150">
                @include($L::view('partials.field-error'), ['name' => 'title'])</label>
            <label class="commerce-field" for="review-body"><span>{{ __('commerce::storefront.reviews.body') }} *</span>
                <textarea id="review-body" name="body" rows="5" minlength="10" maxlength="5000" required>{{ old('body') }}</textarea>
                @include($L::view('partials.field-error'), ['name' => 'body'])</label>
            @if (filled((string) $captcha))
                {{ $captcha }}
                @include($L::view('partials.field-error'), ['name' => 'captcha'])
            @endif
            <button type="submit" class="commerce-button">{{ __('commerce::storefront.reviews.submit') }}</button>
        </form>
    @endif
</section>
