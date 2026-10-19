@include('commerce::documents.partials.header', ['heading' => __('commerce::documents.invoice')])
@include('commerce::documents.partials.lines', ['prices' => true])
@include('commerce::documents.partials.totals')
<p><span class="label">{{ __('commerce::documents.payment') }}</span><br>{{ $order->payment_method_title ?? '—' }} · <span class="status">{{ \Sunrice\Commerce\Orders\OrderStatus::label($order->payment_status, 'payment') }}</span></p>
@if (! empty($bankAccounts))
<div class="bank-details">
    <span class="label">{{ __('commerce::documents.pay_to') }}</span>
    @foreach ($bankAccounts as $account)
        <div>{{ $account['bank'] ?? '' }} {{ $account['number'] ?? '' }} · {{ __('commerce::payments.holder') }}: {{ $account['holder'] ?? '' }}@if (! empty($account['branch'])) · {{ $account['branch'] }}@endif</div>
    @endforeach
</div>
@endif
@if ($order->customer_note)<p class="notes"><strong>{{ __('commerce::documents.note') }}:</strong> {!! nl2br(e($order->customer_note)) !!}</p>@endif
@if ($footer)<div class="footer">{!! nl2br(e($footer)) !!}</div>@endif
