{{--
    Minimal layout for store pages, used when the site has no
    the app's own layout (set
    commerce.storefront.layout to your own layout).
--}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="commerce-site">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <x-sunrice-cms::seo :default-title="$seoTitle ?? null" :noindex="(bool) request()->attributes->get('commerce.noindex')" />
    @stack('head')
    <x-commerce::slot name="head" />
    <x-sunrice-cms::code place="head" />
</head>
<body @bodyClass(commerce_body_classes())>
    <x-sunrice-cms::code place="body-start" />
    <main class="container commerce-main commerce">
        @yield('content')
    </main>
    @stack('scripts')
    <x-sunrice-cms::code place="body-end" />
</body>
</html>
