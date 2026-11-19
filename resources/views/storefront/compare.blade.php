{{--
    Product comparison. $entries: the products side by side, $fields: the compared attributes, $specLabels.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-compare">
        <h1 class="commerce-page-title">{{ __('commerce::storefront.compare.title') }}</h1>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
        @if ($entries->isEmpty())
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.empty'), ['title' => __('commerce::storefront.compare.empty'), 'icon' => 'compare',
                'action' => ['url' => app(\Sunrice\Commerce\Storefront\ShoppingDestination::class)->url(), 'label' => __('commerce::storefront.cart.continue')]])
        @else
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.compare-table'))
        @endif
    </section>
@endsection
