@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    <section class="commerce-track-page">
        <h1>{{ __('commerce::checkout.track.title') }}</h1>
        <p>{{ __('commerce::checkout.track.intro') }}</p>
        <form method="POST" action="{{ commerce_url('commerce.track-order.submit') }}" class="commerce-form">
            @csrf
            <x-honeypot />
            <label class="commerce-field"><span>{{ __('commerce::checkout.track.number') }}</span>
                <input type="text" name="number" value="{{ old('number') }}" required>
                @include($L::view('partials.field-error'), ['name' => 'number'])
            </label>
            <label class="commerce-field"><span>{{ __('commerce::checkout.fields.email') }}</span>
                <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email">
                @include($L::view('partials.field-error'), ['name' => 'email'])
            </label>
            <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::checkout.track.submit') }}</button>
        </form>
    </section>
@endsection
