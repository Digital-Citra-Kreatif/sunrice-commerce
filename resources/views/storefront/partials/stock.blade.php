{{--
    The stock line ("In stock", "Only 3 left"…). $product: ProductView.
--}}
<p class="commerce-stock commerce-stock--{{ $product->stock['status'] }}" data-commerce-stock>{{ $product->stock['message'] }}</p>
