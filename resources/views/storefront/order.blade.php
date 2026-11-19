{{--
    The order or quote page (by its key), also the thank-you page after checkout.
    $order, $payment, $instructionsView, $payUrl, $whatsappUrl, $openWhatsApp,
    $downloads, $invoiceUrl, $canCancel, $accountRequested, $invite, $registerUrl.
    A confirmation header, then what to do next (how to pay, downloads),
    the items and totals, and a side column with the order's states,
    addresses, shipments and actions.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    @php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
    @php($cancelled = in_array($order->status, [$S::CANCELLED, $S::FAILED, $S::DECLINED, $S::EXPIRED], true))
    <section class="commerce-order-page" data-commerce-order="{{ $order->order_key }}">
        @include($L::view('partials.messages'))
        @include($L::view('order.confirmation'))

        <div class="commerce-order__layout">
            <div class="commerce-order__main">
                @if ($whatsappUrl)
                    <p class="commerce-order__whatsapp">
                        <a class="commerce-button commerce-button--whatsapp" href="{{ $whatsappUrl }}" target="_blank" rel="noopener" data-commerce-whatsapp @if ($openWhatsApp) data-open="1" @endif>{{ __('commerce::checkout.order.whatsapp') }}</a>
                    </p>
                    @if ($openWhatsApp)
                        @push('scripts')<script>(function(){var a=document.querySelector('[data-commerce-whatsapp][data-open]');if(a){window.location.href=a.href;}})();</script>@endpush
                    @endif
                @endif

                @include($L::view('partials.order-payment'))
                <x-commerce::slot name="order.after_payment" />

                @if ($downloads->isNotEmpty())
                    <div class="commerce-order__box">
                        <h2>{{ __('commerce::digital.ready') }}</h2>
                        @include($L::view('partials.downloads'), ['grants' => $downloads])
                    </div>
                @endif

                <div class="commerce-order__box">
                    <h2>{{ __('commerce::checkout.order.items') }}</h2>
                    @include($L::view('partials.order-items'), ['order' => $order])
                    <x-commerce::slot name="order.after_summary" :order="$order" />
                </div>
            </div>

            @include($L::view('order.sidebar'))
        </div>
        <x-commerce::slot name="order.after" />
        <p class="commerce-order__continue"><a class="commerce-button commerce-button--primary" href="{{ app(\Sunrice\Commerce\Storefront\ShoppingDestination::class)->url() }}">{{ __('commerce::storefront.cart.continue') }}</a></p>
    </section>
@endsection
