{{-- $row (line, item, entry), $money, $taxDisplay and $variantImages. --}}
@php
    $L = \Sunrice\Commerce\Storefront\Layout::class;
    $line = $row['line'];
    $productName = $row['entry']?->title ?? $row['entry']?->draft_title ?? '';
    $itemName = implode(' · ', array_filter([$productName, $line->variant->title]));
    $image = ($variantImages ?? collect())->get($line->variant->image_asset_id)
        ?? collect($row['entry'] ? (commerce_values($row['entry'])['gallery'] ?? []) : [])
            ->first(fn ($media) => $media instanceof \Sunrice\Admin\Media\Media && $media->isImage());
@endphp
<tr data-commerce-cart-line="{{ $row['item']->id }}">
    <td class="commerce-cart__product">
        <div class="commerce-cart__product-content">
            <span class="commerce-cart__thumb">@if ($image)<img src="{{ $image->url('thumb') }}" alt="" width="64" height="80" loading="lazy">@endif</span>
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
                <input type="number" name="quantity" value="{{ $line->quantity }}" min="{{ max(1, $line->variant->minOrderQuantity()) }}" step="{{ $line->variant->qty_step }}" required @if ($line->variant->maxOrderQuantity()) max="{{ $line->variant->maxOrderQuantity() }}" @endif aria-label="{{ __('commerce::storefront.cart.quantity') }}">
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
