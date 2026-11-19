{{--
    Find an order by its number and email.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    <section class="commerce-track-page">
        @if ($verification ?? false)
            <h1 class="commerce-page-title">{{ __('commerce::checkout.track.verify_title') }}</h1>
            <p>{{ __('commerce::checkout.track.verify_intro') }}</p>
            <form method="POST" action="{{ commerce_url('commerce.track-order.verify') }}" class="commerce-form">
                @csrf
                <label class="commerce-field"><span>{{ __('commerce::checkout.track.code') }}</span>
                    <input type="text" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" maxlength="8" required>
                    @include($L::view('partials.field-error'), ['name' => 'code'])
                </label>
                <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::checkout.track.verify') }}</button>
                <a class="commerce-link" href="{{ commerce_url('commerce.track-order') }}">{{ __('commerce::checkout.track.start_over') }}</a>
            </form>
        @else
            <h1 class="commerce-page-title">{{ __('commerce::checkout.track.title') }}</h1>
            <p>{{ __('commerce::checkout.track.intro') }}</p>
            <form method="POST" action="{{ commerce_url('commerce.track-order.submit') }}" class="commerce-form">
                @csrf
                <x-honeypot />
                <label class="commerce-field"><span>{{ __('commerce::checkout.track.number') }}</span>
                    <input type="text" name="number" value="{{ old('number', request()->string('number')->limit(60)->toString()) }}" required>
                    @include($L::view('partials.field-error'), ['name' => 'number'])
                </label>
                <label class="commerce-field"><span>{{ __('commerce::checkout.fields.email') }}</span>
                    <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email">
                    @include($L::view('partials.field-error'), ['name' => 'email'])
                </label>
                <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::checkout.track.submit') }}</button>
            </form>
        @endif
    </section>
@endsection
