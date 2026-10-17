@include('commerce::documents.partials.header', ['heading' => __('commerce::documents.invoice')])
@include('commerce::documents.partials.lines', ['prices' => true])
@include('commerce::documents.partials.totals')
<p>{{ __('commerce::documents.payment') }}: {{ $order->payment_method_title ?? '—' }} · {{ \Sunrice\Commerce\Orders\OrderStatus::label($order->payment_status, 'payment') }}</p>
@if ($footer)<div class="footer">{!! nl2br(e($footer)) !!}</div>@endif
