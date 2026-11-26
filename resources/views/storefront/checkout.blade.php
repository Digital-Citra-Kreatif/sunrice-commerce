{{--
    The one-page checkout. $cart (CartView), $state (CalculationState), $data (CheckoutData), $mode (CheckoutMode), $settings,
    $needsAddress, $paymentMethods, $savedAddresses, $loyaltyPoints, $extraFields, $termsUrl, $termsContent, $submitLabel.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    <section class="commerce-checkout-page">
        <h1 class="commerce-page-title">{{ __('commerce::checkout.title') }}</h1>
        <ol class="commerce-steps" aria-label="{{ __('commerce::storefront.theme.checkout_steps') }}">
            <li><a href="{{ commerce_url('commerce.cart') }}">{{ __('commerce::storefront.cart.title') }}</a></li>
            <li aria-current="step"><a href="#contact">{{ __('commerce::checkout.sections.contact') }}</a></li>
            @if ($needsAddress)<li><a href="#shipping">{{ __('commerce::checkout.sections.shipping') }}</a></li>@endif
            @if ($mode->payment())
                <li data-commerce-payment-step @if ($state->totals['total'] <= 0) hidden @endif><a href="#payment">{{ __('commerce::checkout.sections.payment') }}</a></li>
            @endif
        </ol>
        @include($L::view('partials.messages'))
        @if (session('commerce.changes'))
            <div class="commerce-notice commerce-notice--changed" role="alert">
                <p>{{ __('commerce::checkout.changed_intro') }}</p>
                <ul>@foreach (session('commerce.changes') as $change)<li>{{ $change }}</li>@endforeach</ul>
            </div>
        @endif
        @error('cart')<p class="commerce-message commerce-message--error" role="alert">{{ $message }}</p>@enderror

        <form method="POST" action="{{ commerce_url('commerce.checkout.submit') }}" class="commerce-checkout" data-commerce-checkout data-refresh="{{ commerce_url('commerce.checkout.refresh') }}" novalidate>
            @csrf
            <input type="hidden" name="totals_hash" value="{{ $state->hash() }}" data-commerce-hash>
            <x-commerce::slot name="checkout.before" />
            <div class="commerce-checkout__main">
                @include($L::view('checkout.contact'))
                <x-commerce::slot name="checkout.after_contact" :state="$state" />

                @if ($needsAddress)
                    @include($L::view('checkout.shipping-address'))

                    @include($L::view('checkout.billing-address'))

                    @include($L::view('checkout.delivery'))
                    <x-commerce::slot name="checkout.after_shipping" :state="$state" />
                @else
                    <input type="hidden" name="billing_same" value="1">
                @endif

                <input type="hidden" name="use_points" value="0">
                @if ($mode->payment() && ($loyaltyPoints ?? 0) > 0)
                    @include($L::view('checkout.points'))
                @endif

                @if (commerce_feature('vouchers'))
                    @include($L::view('partials.checkout-vouchers'))
                @endif

                @if ($mode->payment())
                    @include($L::view('checkout.payment'))
                @endif
                @if ($mode->payment() && $state->totals['total'] > 0)
                    <x-commerce::slot name="checkout.after_payment" :state="$state" />
                @endif

                @include($L::view('checkout.notes'))
            </div>

            <div class="commerce-checkout__side">
                @include($L::view('checkout.summary'))
                @include($L::view('checkout.submit'))
            </div>
        </form>
        @if ($needsAddress)
            @include($L::view('checkout.address-dialog'))
        @endif
        @if ($termsContent ?? null)
            @include($L::view('checkout.terms-dialog'))
        @endif
    </section>
@endsection
