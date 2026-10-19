{{--
    The order or quote page (by its key), also the thank-you page after checkout.
    $order, $payment, $instructionsView, $payUrl, $whatsappUrl, $openWhatsApp,
    $downloads, $invoiceUrl, $canCancel, $invite, $registerUrl.
    A confirmation header, then what to do next (how to pay, downloads),
    the items and totals, and a side column with the order's states,
    addresses, shipments and actions.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    @php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
    @php($cancelled = in_array($order->status, [$S::CANCELLED, $S::FAILED, $S::DECLINED, $S::EXPIRED], true))
    <section class="commerce-order-page" data-commerce-order="{{ $order->order_key }}">
        @include($L::view('partials.messages'))
        <header @class(['commerce-order__hero', 'commerce-order__hero--cancelled' => $cancelled])>
            <span class="commerce-order__check" aria-hidden="true">@include($L::view('partials.icon'), ['name' => $cancelled ? 'close' : 'check'])</span>
            <p class="commerce-eyebrow">{{ $order->placed_at?->translatedFormat('j F Y H:i') }}</p>
            <h1 class="commerce-order__title">{{ $order->isQuote() ? __('commerce::checkout.order.quote_title', ['number' => $order->displayNumber()]) : __('commerce::checkout.order.title', ['number' => $order->displayNumber()]) }}</h1>
            @if ($order->isQuote() && $order->status === $S::QUOTED)
                <p class="commerce-order__thanks">{{ __('commerce::checkout.quote.intro') }}
                    @if ($order->quote_valid_until) {{ __('commerce::checkout.quote.valid_until', ['date' => $order->quote_valid_until->translatedFormat('j F Y')]) }}@endif</p>
                @if (! $order->quote_valid_until?->isPast())
                    <div class="commerce-order__quote-actions">
                        <form method="POST" action="{{ commerce_url('commerce.quote.accept', ['key' => $order->order_key]) }}">@csrf
                            <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::checkout.quote.accept') }}</button></form>
                        <form method="POST" action="{{ commerce_url('commerce.quote.decline', ['key' => $order->order_key]) }}" onsubmit="return confirm(@js(__('commerce::checkout.quote.decline_confirm')))">@csrf
                            <button type="submit" class="commerce-button commerce-button--secondary">{{ __('commerce::checkout.quote.decline') }}</button></form>
                    </div>
                @endif
            @elseif ($order->isQuote() && $order->status === $S::REQUESTED)
                <p class="commerce-order__thanks">{{ session('commerce.success') ? __('commerce::checkout.order.quote_thanks') : __('commerce::checkout.quote.requested') }}</p>
            @elseif (! $order->isQuote() && ! $cancelled)
                <p class="commerce-order__thanks">{{ __('commerce::checkout.order.thanks') }}</p>
                <p class="commerce-muted">{{ __('commerce::storefront.theme.email_sent', ['email' => $order->email]) }}</p>
            @endif
        </header>

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

                @if (($payment || ($payUrl ?? null)) && $order->isUnpaid() && $order->status !== $S::CANCELLED && $order->payment_method !== 'whatsapp')
                    <div class="commerce-order__payment">
                        <h2>{{ __('commerce::checkout.order.how_to_pay') }}</h2>
                        <p>{{ __('commerce::checkout.order.amount_due', ['amount' => $money->format($payment?->amount ?? $order->total)]) }}
                            @if ($payment?->expires_at) <strong class="commerce-order__deadline">{{ __('commerce::checkout.order.deadline', ['date' => $payment->expires_at->translatedFormat('j F Y H:i')]) }}</strong>@endif</p>
                        @if ($instructionsView)
                            @include($instructionsView, ['order' => $order, 'payment' => $payment])
                        @endif
                        @if ($payUrl ?? null)
                            <p><a href="{{ $payUrl }}" class="commerce-button commerce-button--secondary">{{ __('commerce::payments.pay_again') }}</a></p>
                        @endif
                    </div>
                @endif
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

            <aside class="commerce-order__side">
                <dl class="commerce-order__states">
                    <div><dt>{{ __('commerce::checkout.order.status') }}</dt><dd><span class="commerce-status commerce-status--{{ $order->status }}">{{ $S::label($order->status) }}</span></dd></div>
                    @unless ($order->isQuote())
                        <div><dt>{{ __('commerce::checkout.order.payment') }}</dt><dd>{{ $order->payment_method === 'whatsapp' ? $order->payment_method_title : $S::label($order->payment_status, 'payment') }}@if ($order->payment_method_title && $order->payment_method !== 'whatsapp')<span class="commerce-muted"> · {{ $order->payment_method_title }}</span>@endif</dd></div>
                        @if ($order->needsShipping())<div><dt>{{ __('commerce::checkout.order.fulfillment') }}</dt><dd>{{ $S::label($order->fulfillment_status, 'fulfillment') }}</dd></div>@endif
                    @endunless
                    <div><dt>{{ __('commerce::checkout.order.date') }}</dt><dd>{{ $order->placed_at?->translatedFormat('j F Y H:i') }}</dd></div>
                </dl>

                @if ($order->shipping_address)
                    <div class="commerce-order__address">
                        <h2>{{ __('commerce::checkout.sections.shipping') }}</h2>
                        <address>{!! nl2br(e($order->shippingAddress()->format($order->locale))) !!}</address>
                        @if ($order->shipping_method)<p>{{ $order->shipping_method['label'] ?? '' }}@if (! empty($order->shipping_method['eta'])) · {{ $order->shipping_method['eta'] }}@endif</p>@endif
                    </div>
                @elseif ($order->meta('pickup'))
                    <div class="commerce-order__address">
                        <h2>{{ __('commerce::checkout.order.pickup') }}</h2>
                        <p>{{ $order->meta('pickup.name') }}<br>{{ $order->meta('pickup.address') }}</p>
                        @if ($order->meta('pickup.instructions'))<p>{{ $order->meta('pickup.instructions') }}</p>@endif
                    </div>
                @endif

                @foreach ($order->shipments as $shipment)
                    <div class="commerce-order__shipment">
                        <h3>{{ __('commerce::checkout.order.shipment', ['courier' => $shipment->courier_name ?? $shipment->courier]) }}</h3>
                        @if ($shipment->tracking_number)
                            <p>{{ __('commerce::checkout.order.tracking') }}:
                                @if ($shipment->tracking_url)<a href="{{ $shipment->tracking_url }}" target="_blank" rel="noopener">{{ $shipment->tracking_number }}</a>@else{{ $shipment->tracking_number }}@endif
                            </p>
                        @endif
                    </div>
                @endforeach

                <div class="commerce-order__actions">
                    @if ($invoiceUrl ?? null)
                        <a href="{{ $invoiceUrl }}" target="_blank" rel="noopener" class="commerce-button commerce-button--secondary">{{ __('commerce::documents.download') }}</a>
                    @endif
                    @if ($canCancel ?? false)
                        <form method="POST" action="{{ commerce_url('commerce.order.cancel', ['key' => $order->order_key]) }}" class="commerce-order__cancel"
                            onsubmit="return confirm(@js(__('commerce::checkout.order.cancel_confirm')))">
                            @csrf
                            <button type="submit" class="commerce-button commerce-button--secondary">{{ __('commerce::checkout.order.cancel') }}</button>
                        </form>
                    @endif
                </div>

                @if ($invite && $registerUrl)
                    <p class="commerce-order__invite">{{ __('commerce::checkout.order.invite') }} <a href="{{ $registerUrl }}">{{ __('commerce::checkout.order.create_account') }}</a></p>
                @endif
            </aside>
        </div>
        <x-commerce::slot name="order.after" />
        <p class="commerce-order__continue"><a class="commerce-button commerce-button--primary" href="{{ url(\Sunrice\Support\Locales::prefix(app()->getLocale()) ?: '/') }}">{{ __('commerce::storefront.cart.continue') }}</a></p>
    </section>
@endsection
