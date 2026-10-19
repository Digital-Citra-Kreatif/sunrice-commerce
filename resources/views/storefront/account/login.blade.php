{{--
    Sign in: password, emailed code and Google (each shown while its feature is on).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-auth commerce-auth--split">
        <div class="commerce-auth__panel">
        <h1>{{ __('commerce::account.login.title') }}</h1>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
        <form method="POST" action="{{ commerce_url('commerce.account.login.attempt') }}" class="commerce-form">
            @csrf <x-honeypot />
            <label class="commerce-field"><span>{{ __('commerce::account.login.email') }}</span>
                <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'email'])
            </label>
            <label class="commerce-field"><span>{{ __('commerce::account.login.password') }}</span>
                <input type="password" name="password" required autocomplete="current-password">
            </label>
            <label class="commerce-check"><input type="checkbox" name="remember" value="1"> {{ __('commerce::account.login.remember') }}</label>
            <button type="submit" class="commerce-button commerce-button--primary commerce-button--block">{{ __('commerce::account.login.submit') }}</button>
            <a class="commerce-auth__forgot" href="{{ commerce_url('commerce.account.password.request') }}">{{ __('commerce::account.login.forgot') }}</a>
        </form>
        @if (commerce_feature('passwordless_login') && app(\Sunrice\Commerce\Customers\Auth\LoginCodes::class)->supported())
            <p class="commerce-auth__or">{{ __('commerce::account.login.or') }}</p>
            <form method="POST" action="{{ commerce_url('commerce.account.code.send') }}" class="commerce-form">
                @csrf <x-honeypot />
                <label class="commerce-field"><span>{{ __('commerce::account.login.email') }}</span><input type="email" name="email" value="{{ old('email') }}" required autocomplete="email"></label>
                <button type="submit" class="commerce-button commerce-button--secondary commerce-button--block">{{ __('commerce::account.login.with_code') }}</button>
            </form>
        @endif
        @if (commerce_feature('google_login') && \Sunrice\Commerce\Http\Controllers\Account\GoogleController::configured())
            <a class="commerce-button commerce-auth__google" href="{{ commerce_url('commerce.account.google') }}">{{ __('commerce::account.login.with_google') }}</a>
        @endif
        </div>
        @if (app(\Sunrice\Commerce\Settings\StoreSettings::class)->get('accounts.registration', true))
            <div class="commerce-auth__panel commerce-auth__panel--aside">
                <h2>{{ __('commerce::storefront.theme.new_customer') }}</h2>
                <ul class="commerce-auth__benefits">
                    <li>{{ __('commerce::storefront.theme.benefit_orders') }}</li>
                    <li>{{ __('commerce::storefront.theme.benefit_checkout') }}</li>
                    <li>{{ __('commerce::storefront.theme.benefit_wishlist') }}</li>
                </ul>
                <a class="commerce-button commerce-button--secondary commerce-button--block" href="{{ commerce_url('commerce.account.register') }}">{{ __('commerce::account.login.no_account') }}</a>
            </div>
        @endif
    </section>
@endsection
