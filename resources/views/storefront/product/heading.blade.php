{{-- $entry, $product, $brand and $locale. --}}
@if ($brand)
    <p class="commerce-eyebrow"><a href="{{ $brand->url() }}">{{ $brand->title($locale) }}</a></p>
@endif
<h1 class="commerce-product__title">{{ $entry->title }}</h1>
@if ($product && commerce_feature('reviews') && $product->product->rating_count > 0)
    <p class="commerce-rating"><a href="#reviews"><span aria-hidden="true">{{ str_repeat('★', (int) round((float) $product->product->rating_average)).str_repeat('☆', 5 - (int) round((float) $product->product->rating_average)) }}</span>
        {{ trans_choice('commerce::storefront.reviews.count', $product->product->rating_count, ['count' => $product->product->rating_count]) }}</a></p>
@endif
@if (filled((commerce_values($entry)['excerpt'] ?? null)))
    <p class="commerce-product__excerpt">{{ (commerce_values($entry)['excerpt'] ?? null) }}</p>
@endif
