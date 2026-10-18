@if ($order?->quote_valid_until)
{{ __('commerce::checkout.quote.valid_until', ['date' => $order->quote_valid_until->translatedFormat('j F Y')]) }}
@endif
