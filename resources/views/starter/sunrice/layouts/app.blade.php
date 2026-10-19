{{--
    The starter store layout (commerce:install --starter): every page of the
    site, Sunrice's and the store's, in the same clean look. Published to
    resources/views/sunrice/layouts/app.blade.php, where Sunrice's pages and
    the store pages (commerce.storefront.layout) both find it.

    Child templates fill @section('content') and may pass `seoTitle`.
    Sunrice passes $locale, $pageType and $sunricePage; store pages pass
    their own variables. The header and footer are partials:
    sunrice/partials/store-header and store-footer.

    Styles and scripts: public/commerce-theme/commerce.css and commerce.js
    (partials.assets). The font is Plus Jakarta Sans from Google Fonts;
    delete the two <link>s below to use the system font, or change
    --commerce-font in commerce.css.
--}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $locale ?? app()->getLocale()) }}" class="commerce-site">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>document.documentElement.classList.add('js');</script>
    <x-sunrice::seo :default-title="$seoTitle ?? null" :noindex="(bool) request()->attributes->get('commerce.noindex')" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    @stack('head')
    <x-commerce::slot name="head" />
    <x-sunrice::code position="head" />
</head>
<body @bodyClass>
    <x-sunrice::code position="body_start" />
    <a class="commerce-skip" href="#content">{{ __('commerce::storefront.theme.skip') }}</a>
    @include('sunrice.partials.store-header')

    <main id="content" class="commerce-main commerce">
        @yield('content')
    </main>

    @include('sunrice.partials.store-footer')
    @stack('scripts')
    <x-sunrice::code position="body_end" />
</body>
</html>
