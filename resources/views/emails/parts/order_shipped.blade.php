@php($shipment = $context['shipment'] ?? null)
@if ($shipment)
**{{ $shipment->courier_name ?? $shipment->courier }}**@if ($shipment->service) {{ $shipment->service }}@endif
@if ($shipment->tracking_number)

{{ __('commerce::checkout.order.tracking') }}: @if ($shipment->tracking_url)[{{ $shipment->tracking_number }}]({{ $shipment->tracking_url }})@else{{ $shipment->tracking_number }}@endif
@endif
@endif
