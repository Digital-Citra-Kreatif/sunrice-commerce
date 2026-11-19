{{-- $entry: the product entry whose recommendations are displayed. --}}
@php($items = collect(commerce_values($entry)['upsells'] ?? [])->filter()->take(5))
@if ($items->isNotEmpty())
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.recommendations'), [
        'items' => $items, 'kind' => 'upsells', 'heading' => __('commerce::storefront.theme.upsells'),
    ])
@endif
