{{--
    <x-commerce::compare-button>: add a product to the comparison. $productId, $added.
--}}
@include(\Sunrice\Commerce\Storefront\Layout::view('partials.collection-button'), [
    'collection' => 'compare', 'selected' => $added, 'icon' => 'compare', 'selectedLabel' => 'remove',
    'compact' => false,
])
