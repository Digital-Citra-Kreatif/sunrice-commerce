@php($codes = (array) ($cart->cart?->vouchers ?? []))
@php($voucherError = $voucherError ?? session('voucherError'))
@php($voucherMessage = $voucherMessage ?? session('voucherMessage'))
@php($voucherCode = $voucherCode ?? session('voucherCode'))
<section id="checkout-vouchers" class="commerce-checkout__vouchers" data-commerce-checkout-vouchers>
    <details @if ($codes !== [] || $voucherError || $voucherMessage) open @endif>
        <summary>{{ __('commerce::checkout.voucher.title') }}</summary>
        @if ($voucherError)
            <p class="commerce-field__error" role="alert" id="checkout-voucher-error">{{ $voucherError }}</p>
        @elseif ($voucherMessage)
            <p class="commerce-notice" role="status">{{ $voucherMessage }}</p>
        @endif
        @if ($codes !== [])
            <ul class="commerce-checkout__voucher-codes">
                @foreach ($codes as $code)
                    <li class="commerce-voucher-chip">
                        <span>{{ $code }}</span>
                        <button type="submit" formaction="{{ commerce_url('commerce.checkout.voucher') }}" name="remove_voucher" value="{{ $code }}"
                            data-commerce-voucher-submit aria-label="{{ __('commerce::checkout.voucher.remove', ['code' => $code]) }}">×</button>
                    </li>
                @endforeach
            </ul>
        @endif
        <label for="checkout-voucher-code" class="commerce-visually-hidden">{{ __('commerce::checkout.voucher.code') }}</label>
        <div class="commerce-inline-form">
            <input type="text" id="checkout-voucher-code" name="voucher_code" value="{{ $voucherCode }}" autocomplete="off" maxlength="64" autocapitalize="characters"
                placeholder="{{ __('commerce::checkout.voucher.code') }}" @if ($voucherError) aria-invalid="true" aria-describedby="checkout-voucher-error" @endif>
            <button type="submit" formaction="{{ commerce_url('commerce.checkout.voucher') }}" name="apply_voucher" value="1"
                class="commerce-button commerce-button--secondary" data-commerce-voucher-submit>{{ __('commerce::storefront.cart.apply') }}</button>
        </div>
    </details>
</section>
