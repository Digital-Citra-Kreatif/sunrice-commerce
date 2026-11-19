{{-- $shareUrl, $sharedNotice and $sharesName. --}}
<div class="commerce-wishlist__share">
    @if ($shareUrl)
        <p class="commerce-message commerce-message--success" id="commerce-wishlist-share-notice">{{ $sharedNotice }}</p>
        <div class="commerce-inline-form">
            <label class="commerce-visually-hidden" for="commerce-share-link">{{ __('commerce::storefront.wishlist.share_link') }}</label>
            <input id="commerce-share-link" type="text" readonly value="{{ $shareUrl }}" aria-describedby="commerce-wishlist-share-notice"
                data-commerce-copy="{{ $shareUrl }}" onclick="this.select()">
            <button type="button" class="commerce-button commerce-button--secondary" data-commerce-copy-button data-copied="{{ __('commerce::payments.copied') }}">{{ __('commerce::payments.copy') }}</button>
        </div>
    @endif
    @if (! $shareUrl && ($sharesName ?? false))
        <p class="commerce-muted" id="commerce-wishlist-share-notice">{{ $sharedNotice }}</p>
    @endif
    <form method="POST" action="{{ commerce_url('commerce.wishlist.share') }}">
        @csrf
        <input type="hidden" name="on" value="{{ $shareUrl ? 0 : 1 }}">
        <button type="submit" @if (! $shareUrl && ($sharesName ?? false)) aria-describedby="commerce-wishlist-share-notice" @endif
            @class(['commerce-link commerce-link--action' => $shareUrl, 'commerce-button commerce-button--secondary' => ! $shareUrl])>{{ $shareUrl ? __('commerce::storefront.wishlist.stop_sharing') : __('commerce::storefront.wishlist.share') }}</button>
    </form>
</div>
