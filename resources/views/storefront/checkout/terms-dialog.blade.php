{{-- $termsContent contains the published CMS title, locale, intro and sanitized body. --}}
<dialog id="checkout-terms-dialog" class="commerce-checkout-address-dialog commerce-checkout-terms-dialog" data-commerce-terms-dialog aria-labelledby="checkout-terms-title">
    <header>
        <h2 id="checkout-terms-title" tabindex="-1" autofocus lang="{{ str_replace('_', '-', $termsContent['locale']) }}">{{ $termsContent['title'] ?: __('commerce::checkout.terms_link') }}</h2>
    </header>
    <div class="commerce-checkout-address-dialog__body commerce-prose" lang="{{ str_replace('_', '-', $termsContent['locale']) }}" dir="auto">
        @if (filled($termsContent['intro']))
            <p>{{ $termsContent['intro'] }}</p>
        @endif
        {!! $termsContent['body'] !!}
    </div>
    <footer>
        <form method="dialog">
            <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::checkout.close_terms') }}</button>
        </form>
    </footer>
</dialog>
