{{-- $entry: the product entry with a sanitized rich-text description. --}}
@if (filled((commerce_values($entry)['description'] ?? null)))
    <details class="commerce-accordion" open>
        <summary>{{ __('commerce::storefront.theme.description') }}</summary>
        <div class="commerce-product__description commerce-prose">{!! (commerce_values($entry)['description'] ?? null) !!}</div>
    </details>
@endif
