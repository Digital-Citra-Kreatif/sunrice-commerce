{{--
    The stock line ("In stock", "Only 3 left"…). $product: ProductView.
--}}
@php($selectedStock = $product->isVariable() ? collect($product->variants)->firstWhere('id', ($default ?? $product->defaultVariant())?->id)['stock'] ?? null : null)
<p class="commerce-stock commerce-stock--{{ $selectedStock ?? $product->stock['status'] }}" data-commerce-stock aria-live="polite"
    data-in-stock="{{ __('commerce::storefront.stock.in_stock') }}"
    data-out-of-stock="{{ __('commerce::storefront.stock.out_of_stock') }}"
    data-backorder="{{ __('commerce::storefront.stock.backorder') }}">{{ $selectedStock ? __('commerce::storefront.stock.'.$selectedStock) : $product->stock['message'] }}</p>
