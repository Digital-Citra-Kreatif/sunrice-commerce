{{--
    Language links for the starter header and footer: the page shown in
    every language it's on (<x-sunrice-cms::language-switcher>, no queries
    of its own). Shows nothing on one-language sites and on the store's
    own pages.
--}}
<x-sunrice-cms::language-switcher missing="hide">
    @if (count($component->languages) > 1)
        <ul class="commerce-languages" aria-label="{{ __('commerce::storefront.theme.languages') }}">
            @foreach ($component->languages as $language)
                <li>
                    @if ($language->current)
                        <a href="{{ $language->url }}" hreflang="{{ $language->tag }}" lang="{{ $language->tag }}" aria-current="true">{{ strtoupper($language->code) }}</a>
                    @else
                        <a href="{{ $language->url }}" hreflang="{{ $language->tag }}" lang="{{ $language->tag }}" title="{{ $language->name }}">{{ strtoupper($language->code) }}</a>
                    @endif
                </li>
            @endforeach
        </ul>
    @endif
</x-sunrice-cms::language-switcher>
