@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    <section class="commerce-auth">
        <h1>{{ __('commerce::account.code.title') }}</h1>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
        <form method="POST" action="{{ commerce_url('commerce.account.code.consume') }}" class="commerce-form">
            @csrf
            <label class="commerce-field"><span>{{ __('commerce::account.code.label') }}</span>
                <input type="text" name="code" required inputmode="numeric" autocomplete="one-time-code" maxlength="20" autofocus>
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'code'])
            </label>
            <label class="commerce-check"><input type="checkbox" name="remember" value="1"> {{ __('commerce::account.login.remember') }}</label>
            <button type="submit">{{ __('commerce::account.code.submit') }}</button>
        </form>
        <form method="POST" action="{{ commerce_url('commerce.account.code.send') }}">
            @csrf <x-honeypot />
            <input type="hidden" name="email" value="{{ $email }}">
            <button type="submit" class="commerce-link">{{ __('commerce::account.code.resend') }}</button>
        </form>
        @if (app(\Sunrice\Commerce\Settings\StoreSettings::class)->get('accounts.registration', true))
            <p><a href="{{ commerce_url('commerce.account.register') }}">{{ __('commerce::account.code.no_account') }}</a></p>
        @endif
    </section>
@endsection
