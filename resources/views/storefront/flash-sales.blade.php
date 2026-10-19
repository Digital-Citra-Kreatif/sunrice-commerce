{{--
    All running and upcoming flash sales. $running, $upcoming: FlashSale[].
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-flash-sales">
        <h1 class="commerce-page-title">{{ __('commerce::storefront.flash.title') }}</h1>
        @forelse ($running as $sale)
            <x-commerce::flash-sale :slug="$sale->slug" :limit="24" />
        @empty
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.empty'), ['title' => __('commerce::storefront.flash.none')])
        @endforelse
        @if ($upcoming->isNotEmpty())
            <h2>{{ __('commerce::storefront.flash.upcoming') }}</h2>
            <ul class="commerce-flash-sales__upcoming">
                @foreach ($upcoming as $sale)
                    <li>
                        <a href="{{ commerce_url('commerce.flash-sale.show', ['sale' => $sale->slug]) }}">{{ $sale->name }}</a>
                        {{ __('commerce::storefront.flash.starts_in') }} @include(\Sunrice\Commerce\Storefront\Layout::view('partials.countdown'), ['until' => $sale->starts_at->toIso8601String()])
                    </li>
                @endforeach
            </ul>
        @endif
    </section>
@endsection
