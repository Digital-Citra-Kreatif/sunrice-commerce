{{-- The buying block (<x-commerce::product>). $product: ProductView. --}}
@php($default = $product->defaultVariant())
@if ($product->isVariable() && isset($errors) && $errors->hasAny(['variant', 'email']))
    @php($default = $product->product->variants->first(fn ($variant) => $variant->active && $variant->id === (int) old('variant')) ?? $default)
@endif
@php($variantPrice = $product->isVariable() && ! $product->price['hidden'] && $default ? collect($product->variants)->firstWhere('id', $default->id) : null)
@if ($product->price['isRange'] && ! request()->filled('variant') && ! old('variant'))
    @php($variantPrice = null)
@endif
<div class="commerce-buy" data-commerce-product="{{ $product->id() }}">
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.badges'))
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.price'), ['variantPrice' => $variantPrice, 'updateVariantPrice' => $product->isVariable()])
    @if ($product->flashSale)
        <div class="commerce-flash" data-commerce-flash>
            <strong>{{ $product->flashSale['badge'] ?: $product->flashSale['name'] }}</strong>
            @if ($product->flashSale['countdown'])
                {{ __('commerce::storefront.flash.ends_in') }} @include(\Sunrice\Commerce\Storefront\Layout::view('partials.countdown'), ['until' => $product->flashSale['ends_at']])
            @endif
            @if ($product->flashSale['sold_percent'] !== null)
                <progress max="100" value="{{ $product->flashSale['sold_percent'] }}">{{ $product->flashSale['sold_percent'] }}%</progress>
                <span>{{ __('commerce::storefront.flash.sold', ['sold' => $product->flashSale['sold'], 'limit' => $product->flashSale['limit']]) }}</span>
            @endif
        </div>
    @endif

    @if ($product->tiers !== [])
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.bulk-pricing'), ['tiers' => $product->tiers])
    @endif

    @if ($product->cta['type'] === 'cart')
        @php($action = Route::has('commerce.cart.add') ? commerce_url('commerce.cart.add') : null)
        <form class="commerce-add" method="POST" action="{{ $action }}" data-commerce-add data-commerce-cart-api="{{ Route::has('commerce.api.cart.add') ? commerce_url('commerce.api.cart.add') : '' }}">
            @csrf
            <x-honeypot />
            <input type="hidden" name="variant" value="{{ $default?->id }}" data-commerce-variant>
            @if ($product->isVariable())
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.variant-picker'))
            @endif
            @include(\Sunrice\Commerce\Storefront\Layout::view('product.buy-controls'))
            @if (Route::has('commerce.cart'))
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.add-recovery'))
            @endif
        </form>
    @else
        @if ($product->isVariable())
            <div class="commerce-add">@include(\Sunrice\Commerce\Storefront\Layout::view('partials.variant-picker'))</div>
        @endif
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.cta'))
    @endif

    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.stock'))
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.stock-alert'))
    @if (! $product->isVariable() && $default?->sku)
        <p class="commerce-sku">{{ __('commerce::storefront.product.sku') }}: <span data-commerce-sku>{{ $default->sku }}</span></p>
    @endif
</div>
