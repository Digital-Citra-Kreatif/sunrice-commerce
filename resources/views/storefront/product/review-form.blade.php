{{-- $product, $blocked and the signed-in buyer's $ownReview, when available. --}}
@php
    $L = \Sunrice\Commerce\Storefront\Layout::class;
    $ownReview = $ownReview ?? null;
@endphp
@if ($blocked === 'sign_in')
    <p class="commerce-reviews__eligibility">{!! __('commerce::storefront.reviews.sign_in_link', ['url' => e(\Sunrice\Account\Facades\Account::signInUrl())]) !!}</p>
@elseif ($blocked === 'buyers_only')
    <p class="commerce-reviews__eligibility">{{ __('commerce::storefront.reviews.buyers_only') }}</p>
@else
    @if ($ownReview)
        <div @class(['commerce-reviews__receipt', 'commerce-reviews__receipt--pending' => $ownReview->status === 'pending'])>
            <div>
                <strong>{{ __('commerce::storefront.reviews.receipt.'.$ownReview->status) }}</strong>
                @if ($ownReview->status === 'pending')
                    <p>{{ __('commerce::storefront.reviews.pending_hint') }}</p>
                @endif
            </div>
            <span class="commerce-reviews__own-score" aria-label="{{ trans_choice('commerce::storefront.reviews.stars', $ownReview->rating) }}">{{ $ownReview->rating }}/5 <span aria-hidden="true">★</span></span>
        </div>
    @endif
    <details class="commerce-reviews__write" @if ($errors->hasAny(['review', 'rating', 'title', 'body'])) open @endif>
        <summary class="commerce-link commerce-link--action">{{ __('commerce::storefront.reviews.'.($ownReview ? 'edit' : 'write')) }}</summary>
        @include($L::view('partials.field-error'), ['name' => 'review'])
        <form method="POST" action="{{ commerce_url('commerce.reviews.store', ['product' => $product->id]) }}" class="commerce-reviews__form">
            @csrf <x-honeypot />
            <fieldset class="commerce-field commerce-reviews__stars">
                <legend>{{ __('commerce::storefront.reviews.rating') }} *</legend>
                <div class="commerce-reviews__star-options">
                    @foreach (range(1, 5) as $rating)
                        <label>
                            <input class="commerce-visually-hidden" type="radio" name="rating" value="{{ $rating }}" required
                                aria-label="{{ trans_choice('commerce::storefront.reviews.stars', $rating) }}" @checked((int) old('rating', $ownReview?->rating) === $rating)>
                            <span aria-hidden="true"></span>
                        </label>
                    @endforeach
                </div>
                @include($L::view('partials.field-error'), ['name' => 'rating'])
            </fieldset>
            <label class="commerce-field" for="review-title"><span>{{ __('commerce::storefront.reviews.review_title') }}</span>
                <input id="review-title" name="title" value="{{ old('title', $ownReview?->title) }}" maxlength="150">
                @include($L::view('partials.field-error'), ['name' => 'title'])</label>
            <label class="commerce-field" for="review-body"><span>{{ __('commerce::storefront.reviews.body') }} *</span>
                <textarea id="review-body" name="body" rows="4" minlength="10" maxlength="5000" required>{{ old('body', $ownReview?->body) }}</textarea>
                @include($L::view('partials.field-error'), ['name' => 'body'])</label>
            <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::storefront.reviews.'.($ownReview ? 'save_changes' : 'submit')) }}</button>
        </form>
    </details>
@endif
