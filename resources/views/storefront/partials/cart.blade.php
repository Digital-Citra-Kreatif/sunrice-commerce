{{--
    <x-commerce::cart>: $cart (Sunrice\Commerce\Cart\CartView), $lines (this page of $cart->lines, a paginator).
    The lines on the left (a card per line on phones), the summary on the
    right: voucher codes, totals, checkout; cross-sells below. Every form
    posts without JavaScript.
--}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($taxDisplay = app(\Sunrice\Commerce\Taxes\TaxDisplay::class))
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($home = \Illuminate\Support\Facades\Route::has('sunrice.frontend.home') ? route('sunrice.frontend.home') : url('/'))
<div class="commerce-cart" data-commerce-cart>
    @include($L::view('partials.messages'))
    @foreach (collect($cart->state->notices)->whereNotIn('code', ['voucher_conditional']) as $notice)
        <p class="commerce-notice commerce-notice--{{ $notice['code'] }}">{{ $notice['message'] }}</p>
    @endforeach

    @if ($cart->isEmpty())
        <div class="commerce-cart__empty">
            @include($L::view('partials.empty'), ['title' => __('commerce::storefront.cart.empty'), 'text' => __('commerce::storefront.theme.cart_empty_text'), 'icon' => 'bag',
                'action' => ['url' => $home, 'label' => __('commerce::storefront.cart.continue')]])
        </div>
    @else
        <div class="commerce-cart__layout">
            <div class="commerce-cart__items">
                <table class="commerce-cart__lines">
                    <caption class="commerce-visually-hidden">{{ __('commerce::storefront.cart.title') }}</caption>
                    <tbody>
                        @foreach ($lines as $row)
                            @php($line = $row['line'])
                            <tr data-commerce-cart-line="{{ $row['item']->id }}">
                                <td class="commerce-cart__product">
                                    @php($image = $row['entry'] ? collect($row['entry']->get('gallery') ?? [])->first() : null)
                                    <span class="commerce-cart__thumb">@if (is_object($image))<img src="{{ $image->url() }}" alt="" width="96" height="120" loading="lazy">@endif</span>
                                    <span class="commerce-cart__info">
                                        <a href="{{ $row['entry']?->url }}">{{ $row['entry']?->title }}</a>
                                        @if ($line->variant->title !== '')<span class="commerce-cart__variant">{{ $line->variant->title }}</span>@endif
                                        @if ($line->priceSource['type'] === 'flash_sale')<span class="commerce-badge commerce-badge--sale">{{ $line->priceSource['label'] ?? '' }}</span>@endif
                                    </span>
                                </td>
                                <td class="commerce-cart__price">
                                    @if ($line->regularUnitPrice > $line->unitPrice)<del>{{ $money->format($taxDisplay->line($line, $line->regularUnitPrice)) }}</del>@endif
                                    {{ $money->format($taxDisplay->line($line, $line->unitPrice)) }}
                                </td>
                                <td class="commerce-cart__qty">
                                    <form method="POST" action="{{ commerce_url('commerce.cart.update', ['item' => $row['item']->id]) }}">
                                        @csrf @method('PATCH')
                                        <span class="commerce-stepper" data-commerce-stepper data-commerce-autosubmit>
                                            <input type="number" name="quantity" value="{{ $line->quantity }}" min="0" step="{{ $line->variant->qty_step }}" @if ($line->variant->max_qty) max="{{ $line->variant->max_qty }}" @endif aria-label="{{ __('commerce::storefront.cart.quantity') }}">
                                        </span>
                                        <button type="submit" class="commerce-cart__update">{{ __('commerce::storefront.cart.update') }}</button>
                                    </form>
                                </td>
                                <td class="commerce-cart__total">
                                    @if ($line->discount() > 0)<del>{{ $money->format($taxDisplay->line($line, $line->subtotal)) }}</del>@endif
                                    {{ $money->format($taxDisplay->line($line, $line->net())) }}
                                </td>
                                <td class="commerce-cart__remove">
                                    <form method="POST" action="{{ commerce_url('commerce.cart.remove', ['item' => $row['item']->id]) }}">
                                        @csrf @method('DELETE')
                                        <button type="submit" aria-label="{{ __('commerce::storefront.cart.remove') }}">@include($L::view('partials.icon'), ['name' => 'close'])</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                @if ($lines->hasPages())
                    <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">
                        {{ $lines->onEachSide(1)->links($L::view('partials.pagination')) }}
                    </nav>
                @endif
                <x-commerce::slot name="cart.after_items" :cart="$cart" />
                <p class="commerce-cart__continue"><a href="{{ $home }}">← {{ __('commerce::storefront.cart.continue') }}</a></p>
            </div>

            <aside class="commerce-cart__summary" aria-labelledby="commerce-cart-summary">
                <h2 class="commerce-cart__summary-title" id="commerce-cart-summary">{{ __('commerce::storefront.theme.order_summary') }}</h2>
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
                        <form method="POST" action="{{ commerce_url('commerce.cart.voucher') }}" class="commerce-voucher-form" data-commerce-voucher-form>
                            @csrf
                            <label for="commerce-voucher-code">{{ __('commerce::storefront.cart.voucher') }}</label>
                            <span class="commerce-inline-form">
                                <input type="text" id="commerce-voucher-code" name="code" autocomplete="off" maxlength="64" autocapitalize="characters">
                                <button type="submit" class="commerce-button commerce-button--secondary">{{ __('commerce::storefront.cart.apply') }}</button>
                            </span>
                        </form>
                    </div>
                @endif

                @include($L::view('partials.totals'), ['state' => $cart->state])
                <x-commerce::slot name="cart.totals_after" :cart="$cart" />

                @if (\Illuminate\Support\Facades\Route::has('commerce.checkout') && commerce_feature('checkout'))
                    <a class="commerce-button commerce-button--primary commerce-button--block commerce-cart__checkout" href="{{ commerce_url('commerce.checkout') }}">{{ __('commerce::storefront.cart.checkout') }}</a>
                @endif
                <ul class="commerce-cart__assurances">
                    <li>@include($L::view('partials.icon'), ['name' => 'truck']) {{ __('commerce::storefront.theme.shipping_estimate') }}</li>
                    <li>@include($L::view('partials.icon'), ['name' => 'check']) {{ __('commerce::storefront.theme.secure_checkout') }}</li>
                </ul>
            </aside>
        </div>

        @php($crossSells = collect($cart->lines)->flatMap(fn ($row) => collect($row['entry']?->get('cross_sells') ?? []))->filter()->unique('id')
            ->reject(fn ($entry) => collect($cart->lines)->contains(fn ($row) => $row['entry']?->id === $entry->id))->take(5))
        @if ($crossSells->isNotEmpty())
            <section class="commerce-cross-sells">
                <h2 class="commerce-section__title">{{ __('commerce::storefront.cart.cross_sells') }}</h2>
                <div class="commerce-grid commerce-grid--wide">
                    @foreach ($crossSells as $entry)
                        @include($L::view('partials.product-card'), ['entry' => $entry])
                    @endforeach
                </div>
            </section>
        @endif
    @endif
</div>
