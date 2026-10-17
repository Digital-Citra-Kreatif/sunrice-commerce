{{--
    Links the storefront theme (commerce.css and commerce.js) on store
    pages, whatever layout they extend: the published copy in
    public/commerce-theme when there is one (commerce-templates), else the
    package's own in public/vendor/commerce/theme (commerce-assets, which
    commerce:install and commerce:publish-assets publish). Included once by
    every store page.
--}}
@once
    @php($commerceTheme = is_file(public_path('commerce-theme/commerce.css')) ? 'commerce-theme' : 'vendor/commerce/theme')
    @push('head')
        @if (is_file($commerceCss = public_path($commerceTheme.'/commerce.css')))
            <link rel="stylesheet" href="{{ asset($commerceTheme.'/commerce.css') }}?v={{ filemtime($commerceCss) }}">
        @endif
        <meta name="csrf-token" content="{{ csrf_token() }}">
    @endpush
    @push('scripts')
        @if (is_file($commerceJs = public_path($commerceTheme.'/commerce.js')))
            <script src="{{ asset($commerceTheme.'/commerce.js') }}?v={{ filemtime($commerceJs) }}" defer></script>
        @endif
    @endpush
@endonce
