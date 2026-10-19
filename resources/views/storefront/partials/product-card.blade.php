{{--
    A product in a listing. $entry: the product entry.
    Shows the first image (the second on hover), the colour swatches and
    size range of a variable product, badges, title and price, and the
    wishlist heart. Everything it reads is loaded with the listing, so a
    card adds no queries: swatches come from the colour terms' `swatch`
    field (a hex colour), read from the terms the product view loaded.
--}}
@php
    $card = commerce_product($entry);
    $images = collect($entry->get('gallery') ?? [])->filter(fn ($image) => is_object($image))->values();
    $swatches = [];
    $sizes = [];
    foreach ($card?->product->options ?? [] as $option) {
        $values = $option->values->map(fn ($value) => [
            'label' => $value->label ?? (string) ($value->term?->resolveFor(app()->getLocale())->name ?? ''),
            'swatch' => $value->term?->translations->first()?->data['swatch'] ?? null,
        ]);
        if ($values->contains(fn ($value) => filled($value['swatch']))) {
            $swatches = $values->filter(fn ($value) => filled($value['swatch']))->values()->all();
        } elseif ($sizes === []) {
            $sizes = $values->pluck('label')->filter()->values()->all();
        }
    }
@endphp
<article class="commerce-card">
    <a href="{{ $entry->url }}" class="commerce-card__link">
        <span class="commerce-card__media">
            @if ($images->isNotEmpty())
                <img class="commerce-card__image" src="{{ $images[0]->url() }}" alt="{{ $images[0]->alt ?? $entry->title }}" loading="lazy" width="600" height="750">
                @if ($images->count() > 1)
                    <img class="commerce-card__image commerce-card__image--alt" src="{{ $images[1]->url() }}" alt="" loading="lazy" width="600" height="750">
                @endif
            @endif
        </span>
        <h3 class="commerce-card__title">{{ $entry->title }}</h3>
    </a>
    @if ($swatches !== [] || $sizes !== [])
        <div class="commerce-card__meta">
            @if ($swatches !== [])
                <ul class="commerce-card__swatches" aria-label="{{ trans_choice('commerce::storefront.theme.colors', count($swatches), ['count' => count($swatches)]) }}">
                    @foreach (array_slice($swatches, 0, 6) as $swatch)
                        <li style="--swatch: {{ preg_match('/^#[0-9a-fA-F]{3,8}$/', (string) $swatch['swatch']) ? $swatch['swatch'] : 'transparent' }}" title="{{ $swatch['label'] }}"><span class="commerce-visually-hidden">{{ $swatch['label'] }}</span></li>
                    @endforeach
                    @if (count($swatches) > 6)<li class="commerce-card__more">+{{ count($swatches) - 6 }}</li>@endif
                </ul>
            @endif
            @if ($sizes !== [])
                <span class="commerce-card__sizes">{{ count($sizes) > 1 ? $sizes[0].'–'.$sizes[count($sizes) - 1] : $sizes[0] }}</span>
            @endif
        </div>
    @endif
    @if ($card)
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.badges'), ['product' => $card])
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.price'), ['product' => $card])
        @if (commerce_feature('wishlist') && \Illuminate\Support\Facades\Route::has('commerce.wishlist.add'))
            <div class="commerce-card__wishlist">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.wishlist-button'), ['productId' => $card->id(), 'saved' => app(\Sunrice\Commerce\Wishlist\WishlistManager::class)->has($card->id()), 'compact' => true])
            </div>
        @endif
    @endif
</article>
