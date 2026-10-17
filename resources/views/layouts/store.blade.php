{{--
    Minimal layout for store pages, used when the site has no
    sunrice.layouts.app (publish Sunrice's starter templates, or set
    commerce.storefront.layout to your own layout).
--}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <x-sunrice::seo :default-title="$seoTitle ?? null" :noindex="(bool) request()->attributes->get('commerce.noindex')" />
    @if (is_file($commerceCss = public_path('commerce-theme/commerce.css')))
        <link rel="stylesheet" href="{{ asset('commerce-theme/commerce.css') }}?v={{ filemtime($commerceCss) }}">
    @endif
    @stack('head')
    <x-sunrice::code position="head" />
</head>
<body @bodyClass>
    <x-sunrice::code position="body_start" />
    <main class="container commerce">
        @yield('content')
    </main>
    @if (is_file($commerceJs = public_path('commerce-theme/commerce.js')))
        <script src="{{ asset('commerce-theme/commerce.js') }}?v={{ filemtime($commerceJs) }}" defer></script>
    @endif
    @stack('scripts')
    <x-sunrice::code position="body_end" />
</body>
</html>
