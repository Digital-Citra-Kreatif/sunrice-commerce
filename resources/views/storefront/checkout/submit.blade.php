{{-- $data, $termsUrl, $termsContent, $captcha, $submitLabel, $quoteOffered ("Request a quote" beside it). Runs inside the checkout form. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<div class="commerce-checkout__place">
    @if ($termsUrl)
        @php($termsTrigger = ($termsContent ?? null) ? ' data-commerce-open-terms aria-haspopup="dialog" aria-controls="checkout-terms-dialog"' : '')
        <label class="commerce-check"><input type="checkbox" name="terms" value="1" @checked($data->get('terms')) required>
            <span>{!! __('commerce::checkout.terms', ['link' => '<a href="'.e($termsUrl).'" target="_blank" rel="noopener"'.$termsTrigger.'>'.e(__('commerce::checkout.terms_link')).'</a>']) !!}</span>
        </label>
        @include($L::view('partials.field-error'), ['name' => 'terms'])
    @endif
    <x-commerce::slot name="checkout.before_submit" />
    @if (filled((string) ($captcha ?? '')))
        <div id="checkout-captcha">@include($L::view('partials.captcha'))</div>
    @endif
    <p role="status" class="commerce-checkout__status" data-commerce-checkout-status
        data-updating="{{ __('commerce::checkout.refresh.updating') }}"
        data-updated="{{ __('commerce::checkout.refresh.updated') }}"
        data-failed="{{ __('commerce::checkout.refresh.failed') }}"></p>
    <button type="submit" name="action" value="update" class="commerce-link commerce-checkout__update" data-commerce-update>{{ __('commerce::checkout.refresh.update') }}</button>
    <button type="submit" name="action" value="place" class="commerce-button commerce-button--accent commerce-button--block commerce-checkout__submit"
        data-processing-label="{{ __('commerce::checkout.refresh.submitting') }}"><span data-commerce-place-label>{{ $submitLabel }}</span></button>
    @if ($quoteOffered ?? false)
        <p class="commerce-checkout__quote">
            <span class="commerce-muted">{{ __('commerce::checkout.quote_instead.hint') }}</span>
            <button type="submit" name="action" value="request_quote" class="commerce-button commerce-button--block commerce-checkout__quote-submit" data-commerce-quote-submit>{{ __('commerce::checkout.quote_instead.button') }}</button>
        </p>
    @endif
</div>
