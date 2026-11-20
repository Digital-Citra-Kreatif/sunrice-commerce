@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-pay-page">
        <h1 class="commerce-page-title">{{ __('commerce::checkout.title') }}</h1>
        <p>{{ __('commerce::checkout.errors.payment_status') }}</p>
        <a class="commerce-button commerce-button--primary" href="{{ commerce_url('commerce.checkout') }}">{{ __('commerce::checkout.retry_payment_status') }}</a>
    </section>
@endsection
