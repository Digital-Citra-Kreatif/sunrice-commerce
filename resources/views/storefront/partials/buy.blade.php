{{-- The buying block (<x-commerce::product>). $product: ProductView. --}}
@php($default = $product->defaultVariant())
<div class="commerce-buy" data-commerce-product="{{ $product->id() }}">
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.badges'))
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.price'))
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
        <table class="commerce-tiers">
            <caption>{{ __('commerce::storefront.price.tiers') }}</caption>
            <tbody>
                @foreach ($product->tiers as $tier)
                    <tr><th scope="row">{{ __('commerce::storefront.price.tier_row', ['qty' => $tier['min_qty']]) }}</th><td>{{ $tier['price'] ?? '-'.$tier['label'] }}</td></tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if ($product->cta['type'] === 'cart')
        @php($action = Route::has('commerce.cart.add') ? commerce_url('commerce.cart.add') : null)
        <form class="commerce-add" method="POST" action="{{ $action }}" data-commerce-add>
            @csrf
            <input type="hidden" name="variant" value="{{ $default?->id }}" data-commerce-variant>
            @if ($product->isVariable())
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.variant-picker'))
            @endif
            <label class="commerce-add__qty">
                <span>{{ __('commerce::storefront.product.quantity') }}</span>
                <input type="number" name="quantity" value="{{ $default?->min_qty ?? 1 }}" min="{{ $default?->min_qty ?? 1 }}" step="{{ $default?->qty_step ?? 1 }}" @if ($default?->max_qty) max="{{ $default->max_qty }}" @endif inputmode="numeric">
            </label>
            @if ($action !== null && $product->canAddToCart() && commerce_feature('cart'))
                <button type="submit" class="commerce-add__button">{{ $product->cta['label'] }}</button>
            @elseif ($product->price['signIn'] && Route::has('commerce.account.login'))
                <a class="commerce-add__button" href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::storefront.cta.sign_in_for_price') }}</a>
            @endif
        </form>
    @else
        @if ($product->isVariable())
            <div class="commerce-add">@include(\Sunrice\Commerce\Storefront\Layout::view('partials.variant-picker'))</div>
        @endif
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.cta'))
    @endif

    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.stock'))
    @if (! $product->isVariable() && $default?->sku)
        <p class="commerce-sku">{{ __('commerce::storefront.product.sku') }}: <span data-commerce-sku>{{ $default->sku }}</span></p>
    @endif
</div>
