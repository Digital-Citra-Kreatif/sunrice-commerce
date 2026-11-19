{{-- $tiers: the product's resolved bulk pricing tiers. --}}
<div class="commerce-quantity-offer">
    <table class="commerce-tiers" data-commerce-tiers>
        <caption>{{ __('commerce::storefront.price.tiers') }}</caption>
        <tbody>
            @foreach ($tiers as $tier)
                <tr>
                    <th scope="row">{{ __('commerce::storefront.price.tier_row', ['qty' => $tier['min_qty']]) }}</th>
                    <td><strong>{{ $tier['price'] ?? '-'.$tier['label'] }}</strong>@if (isset($tier['price'])) <span>{{ __('commerce::storefront.price.tier_unit') }}</span>@endif</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
