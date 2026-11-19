@php($addUrl = commerce_url("commerce.$collection.add"))
@php($removeUrl = commerce_url("commerce.$collection.remove", ['product' => $productId]))
@php($addLabel = __("commerce::storefront.$collection.add"))
@php($removeLabel = __("commerce::storefront.$collection.$selectedLabel"))
<form method="POST" action="{{ $selected ? $removeUrl : $addUrl }}"
    @class(['commerce-'.$collection.'-button', 'commerce-wishlist-button--compact' => $compact])
    @if ($collection === 'wishlist') data-commerce-wishlist @endif
    data-commerce-collection="{{ $collection }}" data-product-id="{{ $productId }}"
    data-add-url="{{ $addUrl }}" data-remove-url="{{ $removeUrl }}" data-add-label="{{ $addLabel }}" data-remove-label="{{ $removeLabel }}"
    data-unconfirmed="{{ __('commerce::storefront.collection_unconfirmed') }}">
    @csrf
    <input type="hidden" name="_method" value="DELETE" @disabled(! $selected)>
    <input type="hidden" name="product" value="{{ $productId }}">
    <button type="submit" aria-pressed="{{ $selected ? 'true' : 'false' }}">
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => $icon])
        <span @class(['commerce-wishlist-button__label' => $collection === 'wishlist']) data-commerce-collection-label>{{ $selected ? $removeLabel : $addLabel }}</span>
    </button>
    <template data-commerce-collection-success-action>
        <a class="commerce-toast__action" href="{{ commerce_url("commerce.$collection") }}" aria-label="{{ __("commerce::storefront.$collection.view") }}">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => $icon])
        </a>
    </template>
</form>
