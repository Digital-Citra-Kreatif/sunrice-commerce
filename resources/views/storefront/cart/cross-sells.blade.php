{{-- $cart: the cart view used to resolve product recommendations. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($crossSells = collect($cart->lines)->flatMap(fn ($row) => collect(($row['entry'] ? (commerce_values($row['entry'])['cross_sells'] ?? null) : null) ?? []))->filter()->unique('id')
    ->reject(fn ($entry) => collect($cart->lines)->contains(fn ($row) => $row['entry']?->entry_id === $entry->entry_id))->take(5))
@if ($crossSells->isNotEmpty())
    <section class="commerce-cross-sells">
        <h2 class="commerce-section__title">{{ __('commerce::storefront.cart.cross_sells') }}</h2>
        <div class="commerce-grid commerce-grid--wide">
            @foreach ($crossSells as $entry)
                @include($L::view('partials.product-card'), ['entry' => $entry])
            @endforeach
        </div>
    </section>
@endif
