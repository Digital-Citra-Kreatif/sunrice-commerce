@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    <section class="commerce-pay-page">
        <h1>{{ __('commerce::payments.pay_title', ['number' => $order->displayNumber()]) }}</h1>
        @include($L::view('partials.messages'))
        <p>{{ __('commerce::checkout.order.amount_due', ['amount' => $money->format($order->total)]) }}</p>
        <form method="POST" action="{{ commerce_url('commerce.order.pay.submit', ['key' => $order->order_key]) }}" class="commerce-form">
            @csrf
            @php($data = new \Sunrice\Commerce\Checkout\CheckoutData(['payment_method' => $order->payment_method]))
            @include($L::view('partials.payment-methods'), ['paymentMethods' => $methods, 'data' => $data])
            <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::payments.pay') }}</button>
        </form>
        <p><a href="{{ $order->url() }}">{{ __('commerce::payments.back_to_order') }}</a></p>
    </section>
@endsection
