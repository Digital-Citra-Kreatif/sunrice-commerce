{{--
    <x-commerce::compare-button>: add a product to the comparison. $productId, $added.
--}}
@php($icon = \Sunrice\Commerce\Storefront\Layout::view('partials.icon'))
@if ($added)
    <form method="POST" action="{{ commerce_url('commerce.compare.remove', ['product' => $productId]) }}" class="commerce-compare-button">
        @csrf @method('DELETE')
        <button type="submit" aria-pressed="true">@include($icon, ['name' => 'compare'])<span>{{ __('commerce::storefront.compare.remove') }}</span></button>
    </form>
@else
    <form method="POST" action="{{ commerce_url('commerce.compare.add') }}" class="commerce-compare-button">
        @csrf
        <input type="hidden" name="product" value="{{ $productId }}">
        <button type="submit" aria-pressed="false">@include($icon, ['name' => 'compare'])<span>{{ __('commerce::storefront.compare.add') }}</span></button>
    </form>
@endif
