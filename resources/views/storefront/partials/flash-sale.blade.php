{{-- <x-commerce::flash-sale>: $sale, $products (entries). --}}
<section class="commerce-flash-sale" data-commerce-flash-sale="{{ $sale->id }}">
    <header class="commerce-flash-sale__header">
        <h2>{{ $sale->name }}</h2>
        @if ($sale->show_countdown)
            <p class="commerce-flash-sale__timer">{{ __('commerce::storefront.flash.ends_in') }} @include(\Sunrice\Commerce\Storefront\Layout::view('partials.countdown'), ['until' => $sale->ends_at->toIso8601String()])</p>
        @endif
        @if (\Illuminate\Support\Facades\Route::has('commerce.flash-sale.show'))
            <a class="commerce-flash-sale__more" href="{{ commerce_url('commerce.flash-sale.show', ['sale' => $sale->slug]) }}">{{ __('commerce::storefront.theme.view_all') }} →</a>
        @endif
    </header>
    <div class="commerce-grid commerce-grid--wide">
        @foreach ($products as $entry)
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.product-card'), ['entry' => $entry])
        @endforeach
    </div>
</section>
