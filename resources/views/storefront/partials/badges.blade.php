{{--
    Sale, new, stock and featured badges. $product: ProductView.
--}}
@if ($product->badges !== [])
    <ul class="commerce-badges">
        @foreach ($product->badges as $badge)
            <li class="commerce-badge commerce-badge--{{ $badge }}">
                {{ in_array($badge, ['out_of_stock', 'backorder'], true) ? __('commerce::storefront.stock.'.$badge) : __('commerce::storefront.price.'.$badge) }}
            </li>
        @endforeach
    </ul>
@endif
