{{--
    Links the published theme (public/commerce-theme/commerce.css and
    commerce.js) on store pages, whatever layout they extend. Included
    once by every store page.
--}}
@once
    @push('head')
        @if (is_file($commerceCss = public_path('commerce-theme/commerce.css')))
            <link rel="stylesheet" href="{{ asset('commerce-theme/commerce.css') }}?v={{ filemtime($commerceCss) }}">
        @endif
        <meta name="csrf-token" content="{{ csrf_token() }}">
    @endpush
    @push('scripts')
        @if (is_file($commerceJs = public_path('commerce-theme/commerce.js')))
            <script src="{{ asset('commerce-theme/commerce.js') }}?v={{ filemtime($commerceJs) }}" defer></script>
        @endif
    @endpush
@endonce
