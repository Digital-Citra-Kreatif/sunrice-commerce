{{--
    Under the buying block: what a bundle contains, how a digital product
    is delivered, and whether it ships. $product: ProductView.
--}}
@php($model = $product->product)
@if ($model->isBundle() && $model->bundleItems->isNotEmpty())
    <section class="commerce-extras commerce-bundle" aria-labelledby="commerce-bundle-title">
        <h2 class="commerce-extras__title" id="commerce-bundle-title">{{ __('commerce::storefront.theme.bundle_contents') }}</h2>
        <ul class="commerce-bundle__items">
            @foreach ($model->bundleItems as $item)
                @php($component = $item->variant?->product?->entry())
                <li>
                    <span class="commerce-bundle__qty">{{ $item->quantity }} ×</span>
                    @if ($component?->url)<a href="{{ $component->url }}">{{ $component->title }}</a>@else<span>{{ $component?->title ?? $item->variant?->sku }}</span>@endif
                    @if (filled($item->variant?->title))<span class="commerce-muted">{{ $item->variant->title }}</span>@endif
                </li>
            @endforeach
        </ul>
    </section>
@endif
@if ($model->downloadable)
    @php($delivery = (array) ($model->delivery ?? []))
    <section class="commerce-extras commerce-digital" aria-labelledby="commerce-digital-title">
        <h2 class="commerce-extras__title" id="commerce-digital-title">{{ __('commerce::storefront.theme.digital_title') }}</h2>
        <ul class="commerce-extras__list">
            <li>{{ __('commerce::storefront.theme.digital_after_payment') }}</li>
            @if ($model->downloads->isNotEmpty())
                <li>{{ __('commerce::storefront.theme.digital_files', ['files' => $model->downloads->pluck('name')->implode(', ')]) }}</li>
            @endif
            @if (! empty($delivery['download_limit']))<li>{{ __('commerce::storefront.theme.digital_limit', ['count' => $delivery['download_limit']]) }}</li>@endif
            @if (! empty($delivery['expiry_days']))<li>{{ __('commerce::storefront.theme.digital_expiry', ['days' => $delivery['expiry_days']]) }}</li>@endif
        </ul>
    </section>
@elseif ($model->requires_shipping && $product->cta['type'] === 'cart')
    <ul class="commerce-extras commerce-extras__list commerce-extras--plain">
        <li>@include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => 'truck']) {{ __('commerce::storefront.theme.ships_from') }}</li>
    </ul>
@elseif (! $model->requires_shipping)
    <ul class="commerce-extras commerce-extras__list commerce-extras--plain">
        <li>@include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => 'check']) {{ __('commerce::storefront.theme.no_shipping') }}</li>
    </ul>
@endif
