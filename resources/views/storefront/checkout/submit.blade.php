{{-- $data, $guest, $termsUrl, $captcha, $submitLabel. Runs inside the checkout form. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<div class="commerce-checkout__place">
    @if (commerce_feature('accounts') && $guest)
        <label class="commerce-check"><input type="checkbox" name="accepts_marketing" value="1" @checked($data->get('accepts_marketing'))> {{ __('commerce::checkout.marketing') }}</label>
    @endif
    @if ($termsUrl)
        <label class="commerce-check"><input type="checkbox" name="terms" value="1" @checked($data->get('terms')) required>
            {!! __('commerce::checkout.terms', ['link' => '<a href="'.e($termsUrl).'" target="_blank" rel="noopener">'.e(__('commerce::checkout.terms_link')).'</a>']) !!}</label>
        @include($L::view('partials.field-error'), ['name' => 'terms'])
    @endif
    <x-commerce::slot name="checkout.before_submit" />
    @if (filled((string) ($captcha ?? '')))
        <div id="checkout-captcha">@include($L::view('partials.captcha'))</div>
    @endif
    <p role="status" class="commerce-checkout__status" data-commerce-checkout-status
        data-updating="{{ __('commerce::checkout.refresh.updating') }}"
        data-updated="{{ __('commerce::checkout.refresh.updated') }}"
        data-failed="{{ __('commerce::checkout.refresh.failed') }}"
        data-submitting="{{ __('commerce::checkout.refresh.submitting') }}"></p>
    <button type="submit" name="action" value="update" class="commerce-link commerce-checkout__update" data-commerce-update>{{ __('commerce::checkout.refresh.update') }}</button>
    <button type="submit" name="action" value="place" class="commerce-button commerce-button--accent commerce-button--block commerce-checkout__submit">{{ $submitLabel }}</button>
</div>
