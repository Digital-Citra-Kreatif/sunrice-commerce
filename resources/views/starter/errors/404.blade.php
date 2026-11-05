{{--
    Page not found, in the starter layout: a search box and links back to
    the shop. Laravel renders resources/views/errors/404.blade.php for any
    404, the CMS's included (cms_page() is null here).
--}}
@extends('cms.layout', ['seoTitle' => __('commerce::storefront.theme.not_found_title')])

@php
    $locale = app()->getLocale();
    $shop = \Sunrice\Cms\Models\Collection::query()->where('handle', (string) (config('commerce.catalog.collections', ['products'])[0] ?? 'products'))->first();
    $shopUrl = $shop?->listingUrl($locale) ?? url('/products');
@endphp

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-empty commerce-empty--page">
        <p class="commerce-empty__code">404</p>
        <h1 class="commerce-empty__title">{{ __('commerce::storefront.theme.not_found_title') }}</h1>
        <p class="commerce-muted">{{ __('commerce::storefront.theme.not_found_text') }}</p>
        <form class="commerce-search" method="GET" action="{{ $shopUrl }}" role="search">
            <label class="commerce-visually-hidden" for="commerce-404-q">{{ __('commerce::storefront.listing.search') }}</label>
            <input id="commerce-404-q" type="search" name="q" placeholder="{{ __('commerce::storefront.theme.search_placeholder') }}" maxlength="100">
            <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::storefront.theme.search') }}</button>
        </form>
        <p class="commerce-empty__actions">
            <a class="commerce-button commerce-button--secondary" href="{{ url(\Sunrice\Cms\Support\Locales::prefix($locale) ?: '/') }}">{{ __('commerce::storefront.theme.back_home') }}</a>
            <a class="commerce-button commerce-button--primary" href="{{ $shopUrl }}">{{ __('commerce::storefront.theme.shop_now') }}</a>
        </p>
    </section>
@endsection
