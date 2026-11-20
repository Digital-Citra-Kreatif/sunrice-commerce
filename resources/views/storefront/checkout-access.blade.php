@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))

    <section class="commerce-auth commerce-checkout-access__panel">
        <h1>{{ __('commerce::checkout-access.'.($step === 'code' ? 'code_title' : 'title')) }}</h1>

        @if ($step === 'code')
            <p>{{ __('commerce::checkout-access.code_intro', ['email' => $email]) }}</p>
            <form method="POST" action="{{ commerce_url('commerce.checkout-access.verify') }}" class="commerce-form">
                @csrf
                <label class="commerce-field">
                    <span>{{ __('commerce::checkout-access.code') }}</span>
                    <input type="text" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" maxlength="8" required>
                    @include($L::view('partials.field-error'), ['name' => 'code'])
                </label>
                <button type="submit" class="commerce-button commerce-button--primary commerce-button--block">{{ __('commerce::checkout-access.continue') }}</button>
            </form>
            <div class="commerce-checkout-access__actions">
                <form method="POST" action="{{ commerce_url('commerce.checkout-access.send') }}">
                    @csrf <x-honeypot />
                    <input type="hidden" name="email" value="{{ $email }}">
                    <button type="submit" class="commerce-link">{{ __('commerce::checkout-access.resend') }}</button>
                </form>
                <a href="{{ commerce_url('commerce.checkout-access') }}">{{ __('commerce::checkout-access.change_email') }}</a>
            </div>
            @include($L::view('partials.field-error'), ['name' => 'email'])
        @else
            <p>{{ __('commerce::checkout-access.'.($step === 'password' ? 'password_intro' : 'intro')) }}</p>
            <form method="POST" action="{{ commerce_url($step === 'password' ? 'commerce.account.login.attempt' : 'commerce.checkout-access.send') }}" class="commerce-form">
                @csrf <x-honeypot />
                <label class="commerce-field">
                    <span>{{ __('commerce::checkout.fields.email') }}</span>
                    <input type="email" name="email" value="{{ old('email', $email) }}" autocomplete="email" required>
                    @include($L::view('partials.field-error'), ['name' => 'email'])
                </label>
                @if ($step === 'password')
                    <label class="commerce-field">
                        <span>{{ __('commerce::account.login.password') }}</span>
                        <input type="password" name="password" autocomplete="current-password" required>
                    </label>
                    @include($L::view('partials.captcha'))
                @endif
                <button type="submit" class="commerce-button commerce-button--primary commerce-button--block">
                    {{ __('commerce::checkout-access.'.($step === 'password' ? 'continue' : 'send')) }}
                </button>
            </form>
        @endif

        <div class="commerce-checkout-access__actions">
            @if ($step === 'password')
                <a href="{{ commerce_url('commerce.checkout-access') }}">{{ __('commerce::checkout-access.use_code') }}</a>
                <a href="{{ commerce_url('commerce.account.password.request') }}">{{ __('commerce::account.login.forgot') }}</a>
            @else
                <a href="{{ commerce_url('commerce.checkout-access.password') }}">{{ __('commerce::checkout-access.use_password') }}</a>
            @endif
        </div>
    </section>
@endsection
