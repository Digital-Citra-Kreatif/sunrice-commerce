{{-- $entry: the product entry; its rich-text description is sanitized at render too. --}}
@if (filled($description = (commerce_values($entry)['description'] ?? null)))
    <details class="commerce-accordion" open>
        <summary>{{ __('commerce::storefront.theme.description') }}</summary>
        <div class="commerce-product__description commerce-prose">{!! commerce_rich_text(is_string($description) ? $description : null) !!}</div>
    </details>
@endif
