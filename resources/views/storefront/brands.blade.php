{{-- The brands index (/brands). $brands: terms of the brand taxonomy with live products. --}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-brands">
        <h1 class="commerce-page-title">{{ __('commerce::storefront.listing.brands') }}</h1>
        <ul class="commerce-brands__list">
            @foreach ($brands as $brand)
                <li>
                    <a href="{{ $brand['url'] }}">
                        @if ($brand['logo'])<img src="{{ $brand['logo'] }}" alt="" loading="lazy">@endif
                        <span class="commerce-brands__name">{{ $brand['name'] }}</span> <span class="commerce-brands__count">{{ trans_choice('commerce::storefront.theme.products_count', $brand['count'], ['count' => $brand['count']]) }}</span>
                    </a>
                </li>
            @endforeach
        </ul>
    </section>
@endsection
