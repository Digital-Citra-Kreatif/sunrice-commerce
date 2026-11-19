{{-- $lines: a paginator of cart view rows. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($taxDisplay = app(\Sunrice\Commerce\Taxes\TaxDisplay::class))
<table class="commerce-cart__lines">
    <caption class="commerce-visually-hidden">{{ __('commerce::storefront.cart.title') }}</caption>
    <tbody>
        @foreach ($lines as $row)
            @include($L::view('cart.line'))
        @endforeach
    </tbody>
</table>
@if ($lines->hasPages())
    <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">
        {{ $lines->onEachSide(1)->links($L::view('partials.pagination')) }}
    </nav>
@endif
