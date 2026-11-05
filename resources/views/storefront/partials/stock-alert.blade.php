{{--
    "Email me when it's back", under the stock line while the product or one
    of its variants is sold out. $product: ProductView. A variable product
    lists its sold-out variants; signed-in customers aren't asked for an email.
--}}
@php($soldOut = $product->product->variants->filter(fn ($v) => app(\Sunrice\Commerce\StockAlerts\Restock::class)->soldOut($v->setRelation('product', $product->product)))->values())
@if ($soldOut->isNotEmpty() && commerce_feature('stock_alerts') && \Illuminate\Support\Facades\Route::has('commerce.stock-alerts.store'))
    @php($customer = app(\Sunrice\Commerce\Customers\CurrentCustomer::class)->get())
    <form class="commerce-stock-alert" method="POST" action="{{ commerce_url('commerce.stock-alerts.store') }}">
        @csrf <x-honeypot />
        <p class="commerce-stock-alert__title">{{ __('commerce::storefront.stock_alert.title') }}</p>
        @if ($product->isVariable())
            <label class="commerce-field"><span>{{ __('commerce::storefront.stock_alert.variant') }}</span>
                <select name="variant" required>
                    @foreach ($soldOut as $variant)
                        <option value="{{ $variant->id }}" @selected((int) old('variant') === $variant->id)>{{ $variant->title }}</option>
                    @endforeach
                </select></label>
        @else
            <input type="hidden" name="variant" value="{{ $soldOut->first()->id }}">
        @endif
        @if ($customer === null)
            <label class="commerce-field"><span>{{ __('commerce::storefront.stock_alert.email') }}</span>
                <input type="email" name="email" value="{{ old('email') }}" maxlength="255" required autocomplete="email"></label>
        @endif
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'variant'])
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'email'])
        <button type="submit" class="commerce-button commerce-button--outline">{{ __('commerce::storefront.stock_alert.submit') }}</button>
    </form>
@endif
