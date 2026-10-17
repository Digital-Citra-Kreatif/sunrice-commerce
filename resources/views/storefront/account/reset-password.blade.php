@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    <section class="commerce-auth">
        <h1>{{ __('commerce::account.reset.title') }}</h1>
        <form method="POST" action="{{ commerce_url('commerce.account.password.update') }}" class="commerce-form">
            @csrf
            <input type="hidden" name="token" value="{{ $token }}">
            <label class="commerce-field"><span>{{ __('commerce::account.login.email') }}</span>
                <input type="email" name="email" value="{{ old('email', $email) }}" required autocomplete="email">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'email'])
            </label>
            <label class="commerce-field"><span>{{ __('commerce::account.reset.new_password') }}</span>
                <input type="password" name="password" required autocomplete="new-password">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'password'])
            </label>
            <label class="commerce-field"><span>{{ __('commerce::account.register.password_confirmation') }}</span>
                <input type="password" name="password_confirmation" required autocomplete="new-password">
            </label>
            <button type="submit">{{ __('commerce::account.reset.submit') }}</button>
        </form>
    </section>
@endsection
