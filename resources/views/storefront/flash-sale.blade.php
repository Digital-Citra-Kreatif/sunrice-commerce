{{--
    One flash sale with its products and countdown. $sale: FlashSale, $products: ProductView[].
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-flash-sale-page">
        <h1>{{ $sale->name }}</h1>
        @if (filled($description = $sale->descriptionFor()))
            <p>{{ $description }}</p>
        @endif
        @if ($sale->starts_at->isFuture())
            <p>{{ __('commerce::storefront.flash.starts_in') }} @include(\Sunrice\Commerce\Storefront\Layout::view('partials.countdown'), ['until' => $sale->starts_at->toIso8601String()])</p>
        @elseif ($sale->show_countdown)
            <p>{{ __('commerce::storefront.flash.ends_in') }} @include(\Sunrice\Commerce\Storefront\Layout::view('partials.countdown'), ['until' => $sale->ends_at->toIso8601String()])</p>
        @endif
        <div class="commerce-grid">
            @foreach ($products as $entry)
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.product-card'), ['entry' => $entry])
            @endforeach
        </div>
    </section>
@endsection
