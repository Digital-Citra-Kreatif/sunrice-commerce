@include('commerce::documents.partials.header', ['heading' => __('commerce::documents.packing_slip')])
@if ($order->dropship)
    <p><strong>{{ __('commerce::documents.sender') }}</strong>: {{ $order->dropship['name'] ?? '' }} · {{ $order->dropship['phone'] ?? '' }}</p>
@endif
@include('commerce::documents.partials.lines', ['prices' => false])
@if ($order->shipping_method)<p>{{ __('commerce::documents.shipping') }}: {{ $order->shipping_method['label'] ?? '' }}</p>@endif
@if ($order->customer_note)<p><strong>{{ __('commerce::documents.note') }}</strong>: {{ $order->customer_note }}</p>@endif
