{{--
    <x-commerce::wishlist-button>: add or remove a product from the wishlist. $productId, $saved.
    $compact (optional): the heart only, its label kept for screen readers (product cards).
--}}
@include(\Sunrice\Commerce\Storefront\Layout::view('partials.collection-button'), [
    'collection' => 'wishlist', 'selected' => $saved, 'icon' => 'heart', 'selectedLabel' => 'saved',
    'compact' => $compact ?? false,
])
