{{--
    The starter store header: an announcement bar, then a sticky bar with
    the menu button (small screens), the logo, the department menu with its
    mega panels, the product search and the account, wishlist and cart
    icons (partials.header-links).

    Admin setup it reads (all optional):
      - Global `site`: `name`, `logo` (image), `announcement` (text)
      - Menu `main`: departments; their children fill the mega panel
    The search goes to the product listing (?q=), with its filters.
--}}
@php
    $site = sunrice_global('site');
    $mainMenu = sunrice_menu('main');
    $L = \Sunrice\Commerce\Storefront\Layout::class;
    $home = url(\Sunrice\Support\Locales::prefix($locale ?? app()->getLocale()) ?: '/');
    $products = \Sunrice\Models\Collection::query()->where('handle', (string) (config('commerce.catalog.collections', ['products'])[0] ?? 'products'))->first();
    $searchUrl = url($products !== null ? app(\Sunrice\Frontend\UrlGenerator::class)->archive($products, $locale ?? null) : '/products');
    $storeName = $site->get('name') ?: commerce_store_name();
@endphp

@if (filled($site->get('announcement')))
    <p class="commerce-announcement">{{ $site->get('announcement') }}</p>
@endif

<header class="commerce-header" data-commerce-header>
    <div class="commerce-header__bar">
        <button class="commerce-header__icon commerce-header__menu-button" type="button" aria-controls="commerce-nav" aria-expanded="false" data-commerce-nav-toggle>
            @include($L::view('partials.icon'), ['name' => 'menu'])
            <span class="commerce-visually-hidden">{{ __('commerce::storefront.theme.menu') }}</span>
        </button>

        <a class="commerce-header__logo" href="{{ $home }}">
            @if ($site->logo)
                <img src="{{ $site->logo->url() }}" alt="{{ $storeName }}" width="120" height="40">
            @else
                <span>{{ $storeName }}</span>
            @endif
        </a>

        <nav class="commerce-nav" id="commerce-nav" aria-label="{{ __('commerce::storefront.theme.main_menu') }}" data-commerce-nav>
            <div class="commerce-nav__head">
                <span class="commerce-nav__title">{{ __('commerce::storefront.theme.menu') }}</span>
                <button class="commerce-header__icon" type="button" data-commerce-nav-close>
                    @include($L::view('partials.icon'), ['name' => 'close'])
                    <span class="commerce-visually-hidden">{{ __('commerce::storefront.cart.close') }}</span>
                </button>
            </div>
            @if ($mainMenu->isNotEmpty())
                <ul class="commerce-nav__list">
                    @foreach ($mainMenu as $item)
                        <li @class(['commerce-nav__item', 'commerce-nav__item--parent' => $item->children->isNotEmpty(), 'is-active' => $item->isActiveOrAncestor()])>
                            <a class="commerce-nav__link" href="{{ $item->url }}" @if ($item->isActive) aria-current="page" @endif @if ($item->newTab) target="_blank" rel="noopener" @endif>{{ $item->label }}</a>
                            @if ($item->children->isNotEmpty())
                                <div class="commerce-nav__panel">
                                    <ul class="commerce-nav__sublist">
                                        @foreach ($item->children as $child)
                                            <li><a href="{{ $child->url }}" @if ($child->isActive) aria-current="page" @endif>{{ $child->label }}</a></li>
                                        @endforeach
                                        <li class="commerce-nav__all"><a href="{{ $item->url }}">{{ __('commerce::storefront.theme.view_all_in', ['name' => $item->label]) }}</a></li>
                                    </ul>
                                </div>
                            @endif
                        </li>
                    @endforeach
                </ul>
            @endif
            @include('sunrice.partials.store-languages')
        </nav>

        <form class="commerce-header__search" method="GET" action="{{ $searchUrl }}" role="search">
            <label class="commerce-visually-hidden" for="commerce-header-q">{{ __('commerce::storefront.listing.search') }}</label>
            <input id="commerce-header-q" type="search" name="q" value="{{ request()->url() === $searchUrl ? request('q') : '' }}"
                placeholder="{{ __('commerce::storefront.theme.search_placeholder') }}" autocomplete="off" maxlength="100">
            <button type="submit" class="commerce-header__search-button">
                @include($L::view('partials.icon'), ['name' => 'search'])
                <span class="commerce-visually-hidden">{{ __('commerce::storefront.theme.search') }}</span>
            </button>
        </form>

        @include($L::view('partials.header-links'))
    </div>
</header>
