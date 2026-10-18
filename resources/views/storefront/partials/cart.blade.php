{{-- <x-commerce::cart>: $cart (Sunrice\Commerce\Cart\CartView). --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($taxDisplay = app(\Sunrice\Commerce\Taxes\TaxDisplay::class))
<div class="commerce-cart" data-commerce-cart>
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
    @foreach (collect($cart->state->notices)->whereNotIn('code', ['voucher_conditional']) as $notice)
        <p class="commerce-notice commerce-notice--{{ $notice['code'] }}">{{ $notice['message'] }}</p>
    @endforeach

    @if ($cart->isEmpty())
        <p class="commerce-cart__empty">{{ __('commerce::storefront.cart.empty') }}</p>
        <a href="{{ \Illuminate\Support\Facades\Route::has('sunrice.frontend.home') ? route('sunrice.frontend.home') : url('/') }}">{{ __('commerce::storefront.cart.continue') }}</a>
    @else
        <table class="commerce-cart__lines">
            <tbody>
                @foreach ($cart->lines as $row)
                    @php($line = $row['line'])
                    <tr data-commerce-cart-line="{{ $row['item']->id }}">
                        <td class="commerce-cart__product">
                            @php($image = $row['entry'] ? collect($row['entry']->get('gallery') ?? [])->first() : null)
                            @if (is_object($image))<img src="{{ $image->url() }}" alt="" width="64" loading="lazy">@endif
                            <a href="{{ $row['entry']?->url }}">{{ $row['entry']?->title }}</a>
                            @if ($line->variant->title !== '')<span class="commerce-cart__variant">{{ $line->variant->title }}</span>@endif
                            @if ($line->priceSource['type'] === 'flash_sale')<span class="commerce-badge commerce-badge--sale">{{ $line->priceSource['label'] ?? '' }}</span>@endif
                        </td>
                        <td class="commerce-cart__price">
                            @if ($line->regularUnitPrice > $line->unitPrice)<del>{{ $money->format($taxDisplay->line($line, $line->regularUnitPrice)) }}</del>@endif
                            {{ $money->format($taxDisplay->line($line, $line->unitPrice)) }}
                        </td>
                        <td class="commerce-cart__qty">
                            <form method="POST" action="{{ commerce_url('commerce.cart.update', ['item' => $row['item']->id]) }}">
                                @csrf @method('PATCH')
                                <input type="number" name="quantity" value="{{ $line->quantity }}" min="0" step="{{ $line->variant->qty_step }}" @if ($line->variant->max_qty) max="{{ $line->variant->max_qty }}" @endif aria-label="{{ __('commerce::storefront.cart.quantity') }}">
                                <button type="submit">{{ __('commerce::storefront.cart.update') }}</button>
                            </form>
                        </td>
                        <td class="commerce-cart__total">
                            @if ($line->discount() > 0)<del>{{ $money->format($taxDisplay->line($line, $line->subtotal)) }}</del>@endif
                            {{ $money->format($taxDisplay->line($line, $line->net())) }}
                        </td>
                        <td>
                            <form method="POST" action="{{ commerce_url('commerce.cart.remove', ['item' => $row['item']->id]) }}">
                                @csrf @method('DELETE')
                                <button type="submit" aria-label="{{ __('commerce::storefront.cart.remove') }}">×</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <x-commerce::slot name="cart.after_items" :cart="$cart" />

        @if (commerce_feature('vouchers'))
            <div class="commerce-cart__vouchers">
                @foreach ($cart->state->appliedCodes as $code)
                    <form method="POST" action="{{ commerce_url('commerce.cart.voucher.remove', ['code' => $code]) }}" class="commerce-voucher-chip">
                        @csrf @method('DELETE')
                        <span>{{ $code }}</span> <button type="submit" aria-label="{{ __('commerce::storefront.cart.remove') }}">×</button>
                    </form>
                @endforeach
                @foreach (collect($cart->state->notices)->where('code', 'voucher_conditional') as $notice)
                    <p class="commerce-notice">{{ $notice['message'] }}</p>
                @endforeach
                <form method="POST" action="{{ commerce_url('commerce.cart.voucher') }}" data-commerce-voucher-form>
                    @csrf
                    <label><span>{{ __('commerce::storefront.cart.voucher') }}</span> <input type="text" name="code" autocomplete="off" maxlength="64"></label>
                    <button type="submit">{{ __('commerce::storefront.cart.apply') }}</button>
                </form>
            </div>
        @endif

        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.totals'), ['state' => $cart->state])
        <x-commerce::slot name="cart.totals_after" :cart="$cart" />

        @if (\Illuminate\Support\Facades\Route::has('commerce.checkout') && commerce_feature('checkout'))
            <a class="commerce-button commerce-cart__checkout" href="{{ commerce_url('commerce.checkout') }}">{{ __('commerce::storefront.cart.checkout') }}</a>
        @endif

        @php($crossSells = collect($cart->lines)->flatMap(fn ($row) => collect($row['entry']?->get('cross_sells') ?? []))->filter()->unique('id')
            ->reject(fn ($entry) => collect($cart->lines)->contains(fn ($row) => $row['entry']?->id === $entry->id))->take(4))
        @if ($crossSells->isNotEmpty())
            <section class="commerce-cross-sells">
                <h2>{{ __('commerce::storefront.cart.cross_sells') }}</h2>
                <div class="commerce-grid">
                    @foreach ($crossSells as $entry)
                        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.product-card'), ['entry' => $entry])
                    @endforeach
                </div>
            </section>
        @endif
    @endif
</div>
