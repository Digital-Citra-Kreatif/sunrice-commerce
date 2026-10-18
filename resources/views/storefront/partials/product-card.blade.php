{{-- A product in a listing. $entry: the product entry. --}}
@php($card = commerce_product($entry))
<article class="commerce-card">
    <a href="{{ $entry->url }}" class="commerce-card__link">
        @php($image = collect($entry->get('gallery') ?? [])->first())
        @if (is_object($image))
            <img src="{{ $image->url() }}" alt="{{ $image->alt ?? $entry->title }}" loading="lazy">
        @endif
        <h3 class="commerce-card__title">{{ $entry->title }}</h3>
    </a>
    @if ($card)
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.badges'), ['product' => $card])
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.price'), ['product' => $card])
    @endif
</article>
