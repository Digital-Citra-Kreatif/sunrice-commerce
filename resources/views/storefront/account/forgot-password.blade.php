{{--
    Request a password reset link.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-auth">
        <h1>{{ __('commerce::account.reset.title') }}</h1>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
        <form method="POST" action="{{ commerce_url('commerce.account.password.email') }}" class="commerce-form">
            @csrf <x-honeypot />
            <label class="commerce-field"><span>{{ __('commerce::account.login.email') }}</span>
                <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'email'])
            </label>
            <button type="submit" class="commerce-button commerce-button--primary commerce-button--block">{{ __('commerce::account.reset.send') }}</button>
        </form>
    </section>
@endsection
