{{--
    <x-commerce::cart>: $cart (Sunrice\Commerce\Cart\CartView), $lines (this page of $cart->lines, a paginator).
    The lines on the left, the summary and checkout on the right, and cross-sells
    below. Every form posts without JavaScript.
--}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($taxDisplay = app(\Sunrice\Commerce\Taxes\TaxDisplay::class))
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($continueShopping = app(\Sunrice\Commerce\Storefront\ShoppingDestination::class)->url())
<div class="commerce-cart" data-commerce-cart>
    @include($L::view('partials.messages'))
    @foreach (collect($cart->state->notices)->whereNotIn('code', ['voucher_conditional']) as $notice)
        <p class="commerce-notice commerce-notice--{{ $notice['code'] }}">{{ $notice['message'] }}</p>
    @endforeach

    @if ($cart->isEmpty())
        <div class="commerce-cart__empty">
            @include($L::view('partials.empty'), ['title' => __('commerce::storefront.cart.empty'), 'text' => __('commerce::storefront.theme.cart_empty_text'), 'icon' => 'bag',
                'action' => ['url' => $continueShopping, 'label' => __('commerce::storefront.cart.continue')]])
        </div>
    @else
        <div class="commerce-cart__layout">
            <div class="commerce-cart__items">
                <table class="commerce-cart__lines">
                    <caption class="commerce-visually-hidden">{{ __('commerce::storefront.cart.title') }}</caption>
                    <tbody>
                        @foreach ($lines as $row)
                            @php($line = $row['line'])
                            @php($productName = $row['entry']?->title ?? $row['entry']?->draft_title ?? '')
                            @php($itemName = implode(' · ', array_filter([$productName, $line->variant->title])))
                            <tr data-commerce-cart-line="{{ $row['item']->id }}">
                                <td class="commerce-cart__product">
                                    <div class="commerce-cart__product-content">
                                        @php($image = $row['entry'] ? collect((commerce_values($row['entry'])['gallery'] ?? null) ?? [])->first() : null)
                                        <span class="commerce-cart__thumb">@if (is_object($image))<img src="{{ $image->url() }}" alt="" width="64" height="80" loading="lazy">@endif</span>
                                        <span class="commerce-cart__info">
                                            <a href="{{ $row['entry']?->url() }}">{{ $productName }}</a>
                                            @if ($line->variant->title !== '')<span class="commerce-cart__variant">{{ $line->variant->title }}</span>@endif
                                            @foreach (app(\Sunrice\Commerce\Cart\LineDetails::class)->for($line->meta) as $detail)<span class="commerce-cart__detail">{{ $detail }}</span>@endforeach
                                            @if ($line->priceSource['type'] === 'flash_sale')<span class="commerce-badge commerce-badge--sale">{{ $line->priceSource['label'] ?? '' }}</span>@endif
                                            <span class="commerce-cart__price">
                                                <span class="commerce-visually-hidden">{{ __('commerce::storefront.cart.unit_price') }}</span>
                                                @if ($line->regularUnitPrice > $line->unitPrice)<del>{{ $money->format($taxDisplay->line($line, $line->regularUnitPrice)) }}</del>@endif
                                                {{ $money->format($taxDisplay->line($line, $line->unitPrice)) }}
                                            </span>
                                        </span>
                                    </div>
                                </td>
                                <td class="commerce-cart__qty">
                                    <form method="POST" action="{{ commerce_url('commerce.cart.update', ['item' => $row['item']->id]) }}">
                                        @csrf @method('PATCH')
                                        <span class="commerce-stepper" data-commerce-stepper data-commerce-autosubmit>
                                            <input type="number" name="quantity" value="{{ $line->quantity }}" min="{{ max(1, $line->variant->min_qty) }}" step="{{ $line->variant->qty_step }}" required @if ($line->variant->max_qty) max="{{ $line->variant->max_qty }}" @endif aria-label="{{ __('commerce::storefront.cart.quantity') }}">
                                        </span>
                                        <button type="submit" class="commerce-cart__update">{{ __('commerce::storefront.cart.update') }}</button>
                                    </form>
                                </td>
                                <td class="commerce-cart__total">
                                    <span class="commerce-visually-hidden">{{ __('commerce::storefront.cart.line_total') }}</span>
                                    @if ($line->discount() > 0)<del>{{ $money->format($taxDisplay->line($line, $line->subtotal)) }}</del>@endif
                                    {{ $money->format($taxDisplay->line($line, $line->net())) }}
                                </td>
                                <td class="commerce-cart__remove">
                                    <form method="POST" action="{{ commerce_url('commerce.cart.remove', ['item' => $row['item']->id]) }}" data-commerce-cart-remove="{{ $itemName }}">
                                        @csrf @method('DELETE')
                                        <details class="commerce-cart__remove-disclosure">
                                            <summary class="commerce-cart__remove-trigger" data-commerce-cart-remove-trigger
                                                aria-label="{{ __('commerce::storefront.cart.remove_item', ['item' => $itemName]) }}">@include($L::view('partials.icon'), ['name' => 'trash'])</summary>
                                            <div class="commerce-cart__remove-fallback">
                                                <p>{{ __('commerce::storefront.cart.remove_confirm') }}</p>
                                                <button type="submit" class="commerce-button commerce-button--accent">{{ __('commerce::storefront.cart.remove') }}</button>
                                            </div>
                                        </details>
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
                <p class="commerce-cart__continue"><a href="{{ $continueShopping }}">← {{ __('commerce::storefront.cart.continue') }}</a></p>
            </div>

            <aside class="commerce-cart__summary" aria-labelledby="commerce-cart-summary">
                <h2 class="commerce-cart__summary-title" id="commerce-cart-summary">{{ __('commerce::storefront.theme.order_summary') }}</h2>
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

        <dialog class="commerce-cart__remove-dialog" data-commerce-cart-remove-dialog
            aria-labelledby="commerce-cart-remove-title" aria-describedby="commerce-cart-remove-item">
            <h2 id="commerce-cart-remove-title">{{ __('commerce::storefront.cart.remove_confirm') }}</h2>
            <p id="commerce-cart-remove-item" data-commerce-cart-remove-item></p>
            <form method="dialog" class="commerce-cart__remove-actions">
                <button type="submit" value="cancel" class="commerce-link commerce-link--action" autofocus>{{ __('commerce::storefront.cart.remove_cancel') }}</button>
                <button type="submit" value="remove" class="commerce-button commerce-button--accent">{{ __('commerce::storefront.cart.remove') }}</button>
            </form>
        </dialog>

        @php($crossSells = collect($cart->lines)->flatMap(fn ($row) => collect(($row['entry'] ? (commerce_values($row['entry'])['cross_sells'] ?? null) : null) ?? []))->filter()->unique('id')
            ->reject(fn ($entry) => collect($cart->lines)->contains(fn ($row) => $row['entry']?->entry_id === $entry->entry_id))->take(5))
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
