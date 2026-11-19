{{-- The buying block (<x-commerce::product>). $product: ProductView. --}}
@php($default = $product->defaultVariant())
@if ($product->isVariable() && isset($errors) && $errors->hasAny(['variant', 'email']))
    @php($default = $product->product->variants->first(fn ($variant) => $variant->active && $variant->id === (int) old('variant')) ?? $default)
@endif
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
        <table class="commerce-tiers" data-commerce-tiers>
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
        <form class="commerce-add" method="POST" action="{{ $action }}" data-commerce-add data-commerce-cart-api="{{ Route::has('commerce.api.cart.add') ? commerce_url('commerce.api.cart.add') : '' }}">
            @csrf
            <x-honeypot />
            <input type="hidden" name="variant" value="{{ $default?->id }}" data-commerce-variant>
            @if ($product->isVariable())
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.variant-picker'))
            @endif
            <div class="commerce-add__controls" data-commerce-buy-controls>
                <label class="commerce-add__qty">
                    <span>{{ __('commerce::storefront.product.quantity') }}</span>
                    <span class="commerce-stepper" data-commerce-stepper>
                        <input type="number" name="quantity" value="{{ $default?->minOrderQuantity() ?? 1 }}" min="{{ $default?->minOrderQuantity() ?? 1 }}" step="{{ $default?->qty_step ?? 1 }}" @if ($default?->maxOrderQuantity()) max="{{ $default->maxOrderQuantity() }}" @endif inputmode="numeric" required aria-label="{{ __('commerce::storefront.product.quantity') }}">
                    </span>
                </label>
                @if ($action !== null && $product->canAddToCart() && commerce_feature('cart'))
                    <button type="submit" class="commerce-add__button">{{ $product->cta['label'] }}</button>
                @elseif ($product->price['signIn'] && Route::has('commerce.account.login'))
                    <a class="commerce-add__button" href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::storefront.cta.sign_in_for_price') }}</a>
                @endif
            </div>
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
