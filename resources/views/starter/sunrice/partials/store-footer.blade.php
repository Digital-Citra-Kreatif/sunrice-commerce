{{--
    The starter store footer: the `footer` menu as columns (each top item is
    a column heading, its children the links), the footer text and social
    links (global `footer`: `text`, `social` rows of label + url), the
    payment methods, languages and the copyright line.
--}}
@php
    $footer = sunrice_global('footer');
    $footerMenu = sunrice_menu('footer');
    $storeName = sunrice_global('site')->get('name') ?: commerce_store_name();
    $paymentManager = app(\Sunrice\Commerce\Payments\PaymentManager::class);
    $payments = commerce_feature('payments')
        ? collect($paymentManager->all())->filter(fn ($m) => $paymentManager->isActive($m))->map(fn ($m) => $paymentManager::titleOf($m))->filter()->unique()->values()
        : collect();
@endphp

<footer class="commerce-footer">
    <div class="commerce-footer__inner">
        <div class="commerce-footer__brand">
            <p class="commerce-footer__name">{{ $storeName }}</p>
            @if ($footer->text)
                <div class="commerce-footer__text">{!! $footer->text !!}</div>
            @endif
            @if (collect($footer->social)->isNotEmpty())
                <ul class="commerce-footer__social">
                    @foreach ($footer->social as $link)
                        <li><a href="{{ $link['url'] ?? '#' }}" rel="me noopener">{{ $link['label'] ?? $link['url'] ?? '' }}</a></li>
                    @endforeach
                </ul>
            @endif
        </div>

        @if ($footerMenu->isNotEmpty())
            <nav class="commerce-footer__menu" aria-label="{{ __('sunrice::frontend.footer_menu') }}">
                @foreach ($footerMenu as $item)
                    <div class="commerce-footer__column">
                        @if ($item->children->isNotEmpty())
                            <h2 class="commerce-footer__heading">{{ $item->label }}</h2>
                            <ul>
                                @foreach ($item->children as $child)
                                    <li><a href="{{ $child->url }}" @if ($child->newTab) target="_blank" rel="noopener" @endif>{{ $child->label }}</a></li>
                                @endforeach
                            </ul>
                        @else
                            <a class="commerce-footer__heading" href="{{ $item->url }}">{{ $item->label }}</a>
                        @endif
                    </div>
                @endforeach
            </nav>
        @endif
    </div>

    <div class="commerce-footer__bottom">
        @if ($payments->isNotEmpty())
            <ul class="commerce-footer__payments" aria-label="{{ __('commerce::storefront.theme.we_accept') }}">
                @foreach ($payments as $title)
                    <li>{{ $title }}</li>
                @endforeach
            </ul>
        @endif
        @include('sunrice.partials.store-languages')
        <p class="commerce-footer__copyright">&copy; {{ now()->year }} {{ $storeName }}</p>
    </div>
</footer>
