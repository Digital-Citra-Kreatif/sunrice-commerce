@include('commerce::documents.partials.header', ['heading' => __('commerce::documents.quotation')])
@include('commerce::documents.partials.lines', ['prices' => true])
@include('commerce::documents.partials.totals')
@if ($order->customer_note)<p class="notes"><strong>{{ __('commerce::documents.note') }}:</strong> {!! nl2br(e($order->customer_note)) !!}</p>@endif
@if ($footer)<div class="footer">{!! nl2br(e($footer)) !!}</div>@endif
