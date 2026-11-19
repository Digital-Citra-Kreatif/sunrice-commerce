{{-- $entry and $projectedProduct: wishlist and comparison controls. --}}
<div class="commerce-product__actions">
    <x-commerce::wishlist-button :entry="$entry" :projected-product="$projectedProduct" />
    <x-commerce::compare-button :entry="$entry" :projected-product="$projectedProduct" />
</div>
