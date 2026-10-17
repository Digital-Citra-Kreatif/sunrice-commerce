@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    <section class="commerce-auth">
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
            <button type="submit">{{ __('commerce::account.login.submit') }}</button>
            <a href="{{ commerce_url('commerce.account.password.request') }}">{{ __('commerce::account.login.forgot') }}</a>
        </form>
        @if (commerce_feature('passwordless_login') && app(\Sunrice\Commerce\Customers\Auth\LoginCodes::class)->supported())
            <p class="commerce-auth__or">{{ __('commerce::account.login.or') }}</p>
            <form method="POST" action="{{ commerce_url('commerce.account.code.send') }}" class="commerce-form">
                @csrf <x-honeypot />
                <label class="commerce-field"><span>{{ __('commerce::account.login.email') }}</span><input type="email" name="email" value="{{ old('email') }}" required autocomplete="email"></label>
                <button type="submit">{{ __('commerce::account.login.with_code') }}</button>
            </form>
        @endif
        @if (commerce_feature('google_login') && \Sunrice\Commerce\Http\Controllers\Account\GoogleController::configured())
            <a class="commerce-button commerce-auth__google" href="{{ commerce_url('commerce.account.google') }}">{{ __('commerce::account.login.with_google') }}</a>
        @endif
        @if (app(\Sunrice\Commerce\Settings\StoreSettings::class)->get('accounts.registration', true))
            <p><a href="{{ commerce_url('commerce.account.register') }}">{{ __('commerce::account.login.no_account') }}</a></p>
        @endif
    </section>
@endsection
