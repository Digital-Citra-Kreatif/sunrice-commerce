{{-- $order and $cancelled: the order or quote and its status. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
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
                    <button type="submit" class="commerce-link commerce-link--action">{{ __('commerce::checkout.quote.decline') }}</button></form>
            </div>
        @endif
    @elseif ($order->isQuote() && $order->status === $S::REQUESTED)
        <p class="commerce-order__thanks">{{ session('commerce.success') ? __('commerce::checkout.order.quote_thanks') : __('commerce::checkout.quote.requested') }}</p>
    @elseif (! $order->isQuote() && ! $cancelled)
        <p class="commerce-order__thanks">{{ __('commerce::checkout.order.thanks') }}</p>
        <p class="commerce-muted">{{ __('commerce::storefront.theme.email_sent', ['email' => $order->email]) }}</p>
    @endif
</header>
