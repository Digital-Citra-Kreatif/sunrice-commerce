{{-- $product and $blocked: the review form and eligibility notice. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
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
        <label class="commerce-field" for="review-title"><span>{{ __('commerce::storefront.reviews.review_title') }}</span>
            <input id="review-title" name="title" value="{{ old('title') }}" maxlength="150">
            @include($L::view('partials.field-error'), ['name' => 'title'])</label>
        <label class="commerce-field" for="review-body"><span>{{ __('commerce::storefront.reviews.body') }} *</span>
            <textarea id="review-body" name="body" rows="5" minlength="10" maxlength="5000" required>{{ old('body') }}</textarea>
            @include($L::view('partials.field-error'), ['name' => 'body'])</label>
        <button type="submit" class="commerce-button">{{ __('commerce::storefront.reviews.submit') }}</button>
    </form>
@endif
