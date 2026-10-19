{{--
    Language links for the starter header and footer: this page in every
    language (sunrice_locale_urls()). Shows nothing on one-language sites.
--}}
@php
    $page = $sunricePage ?? null;
    $languages = sunrice_locale_urls($page?->entry ?? $page?->term, $page?->term ? $page->collection : null);
@endphp
@if (count($languages) > 1)
    <ul class="commerce-languages" aria-label="{{ __('sunrice::frontend.languages') }}">
        @foreach ($languages as $code => $href)
            <li><a href="{{ $href }}" hreflang="{{ $code }}" lang="{{ $code }}" @if ($code === ($locale ?? app()->getLocale())) aria-current="true" @endif>{{ strtoupper($code) }}</a></li>
        @endforeach
    </ul>
@endif
