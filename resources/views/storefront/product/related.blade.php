{{-- $entry: the product entry whose recommendations are displayed. --}}
@php($items = collect(commerce_values($entry)['related_products'] ?? [])->filter()->take(5))
@if ($items->isNotEmpty())
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.recommendations'), [
        'items' => $items, 'kind' => 'related_products', 'heading' => __('commerce::storefront.product.related'),
    ])
@endif
