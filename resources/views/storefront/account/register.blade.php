{{--
    Create an account (signing up by emailed code is offered while that feature is on).
    $termsUrl (the terms page to agree to, or null), $captcha (widget data or null).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-auth">
        <h1>{{ __('commerce::account.register.title') }}</h1>
        <form method="POST" action="{{ commerce_url('commerce.account.register.store') }}" class="commerce-form">
            @csrf <x-honeypot />
            <label class="commerce-field"><span>{{ __('commerce::account.register.name') }}</span>
                <input type="text" name="name" value="{{ old('name') }}" required autocomplete="name">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'name'])
            </label>
            <label class="commerce-field"><span>{{ __('commerce::account.login.email') }}</span>
                <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'email'])
            </label>
            <label class="commerce-field"><span>{{ __('commerce::account.register.phone') }}</span>
                <input type="tel" name="phone" value="{{ old('phone') }}" autocomplete="tel" @required(app(\Sunrice\Commerce\Settings\StoreSettings::class)->get('accounts.require_phone'))>
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'phone'])
            </label>
            @if (commerce_feature('passwordless_login'))
                <label class="commerce-check"><input type="checkbox" name="passwordless" value="1" @checked(old('passwordless'))> {{ __('commerce::account.register.passwordless') }}</label>
            @endif
            <label class="commerce-field"><span>{{ __('commerce::account.login.password') }}</span>
                <input type="password" name="password" autocomplete="new-password">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'password'])
            </label>
            <label class="commerce-field"><span>{{ __('commerce::account.register.password_confirmation') }}</span>
                <input type="password" name="password_confirmation" autocomplete="new-password">
            </label>
            <label class="commerce-check"><input type="checkbox" name="accepts_marketing" value="1" @checked(old('accepts_marketing'))> {{ __('commerce::account.register.marketing') }}</label>
            @if ($termsUrl ?? null)
                <label class="commerce-check"><input type="checkbox" name="terms" value="1" @checked(old('terms')) required>
                    {!! __('commerce::checkout.terms', ['link' => '<a href="'.e($termsUrl).'" target="_blank" rel="noopener">'.e(__('commerce::checkout.terms_link')).'</a>']) !!}</label>
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'terms'])
            @endif
            @if ($captcha ?? null)
                <script src="{{ $captcha['script'] }}" async defer></script>
                <div class="{{ $captcha['class'] }}" data-sitekey="{{ $captcha['site_key'] }}"></div>
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'captcha'])
            @endif
            <button type="submit">{{ __('commerce::account.register.submit') }}</button>
        </form>
        <p><a href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::account.register.have_account') }}</a></p>
    </section>
@endsection
