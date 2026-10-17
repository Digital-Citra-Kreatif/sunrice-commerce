@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    <section class="commerce-auth">
        <h1>{{ __('commerce::account.reset.title') }}</h1>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
        <form method="POST" action="{{ commerce_url('commerce.account.password.email') }}" class="commerce-form">
            @csrf <x-honeypot />
            <label class="commerce-field"><span>{{ __('commerce::account.login.email') }}</span>
                <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'email'])
            </label>
            <button type="submit">{{ __('commerce::account.reset.send') }}</button>
        </form>
    </section>
@endsection
