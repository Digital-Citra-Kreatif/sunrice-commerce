{{--
    The starter store layout (commerce:install --starter): every page of the
    site, the CMS's and the store's, in the same clean look. Published to
    resources/views/cms/layout.blade.php, the site layout the CMS's
    templates extend (@extends('cms.layout')) and the store pages' too
    (commerce.storefront.layout).

    Child templates fill @section('content') and may pass `seoTitle`. It
    reads the page shown from cms_page() (null on the store's own pages),
    never from $entry or $term. The header and footer are partials:
    cms/partials/store-header and store-footer.

    Styles and scripts: public/commerce-theme/commerce.css and commerce.js
    (partials.assets). The font is Plus Jakarta Sans from Google Fonts;
    delete the three <link>s below to use the system font, or change
    --commerce-font in commerce.css.
--}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ cms_dir() }}" class="commerce-site">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script nonce="{{ cms_nonce() }}">document.documentElement.classList.add('js');</script>
    <x-sunrice-cms::seo :default-title="$seoTitle ?? null" :noindex="(bool) request()->attributes->get('commerce.noindex')" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    @stack('head')
    <x-commerce::slot name="head" />
    <x-sunrice-cms::code place="head" />
</head>
<body @bodyClass(commerce_body_classes())>
    <x-sunrice-cms::code place="body-start" />
    <a class="commerce-skip" href="#content">{{ __('commerce::storefront.theme.skip') }}</a>
    @include('cms.partials.store-header')

    <main id="content" class="commerce-main commerce" tabindex="-1">
        @yield('content')
    </main>

    @include('cms.partials.store-footer')
    @stack('scripts')
    <x-sunrice-cms::code place="body-end" />
</body>
</html>
