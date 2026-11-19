{{-- $items, $kind and $heading: the products and label for a recommendation block. --}}
<section @class(['commerce-related', 'commerce-related--'.$kind])>
    <h2 class="commerce-section__title">{{ $heading }}</h2>
    <div class="commerce-grid commerce-grid--wide">
        @foreach ($items as $item)
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.product-card'), ['entry' => $item])
        @endforeach
    </div>
</section>
