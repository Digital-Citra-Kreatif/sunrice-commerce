{{--
    Page links for listings, the cart, orders and search:
    $paginator->onEachSide(1)->links(Layout::view('partials.pagination')).
    $paginator and $elements come from Laravel's paginator.
--}}
@if ($paginator->hasPages())
    <ul class="commerce-pages">
        <li>
            @if ($paginator->onFirstPage())
                <span class="commerce-pages__step" aria-disabled="true">{{ __('commerce::storefront.theme.previous') }}</span>
            @else
                <a class="commerce-pages__step" href="{{ $paginator->previousPageUrl() }}" rel="prev">{{ __('commerce::storefront.theme.previous') }}</a>
            @endif
        </li>
        @foreach ($elements as $element)
            @if (is_string($element))
                <li><span class="commerce-pages__gap">{{ $element }}</span></li>
            @endif
            @if (is_array($element))
                @foreach ($element as $page => $url)
                    <li>
                        @if ($page == $paginator->currentPage())
                            <span class="commerce-pages__page" aria-current="page">{{ $page }}</span>
                        @else
                            <a class="commerce-pages__page" href="{{ $url }}">{{ $page }}</a>
                        @endif
                    </li>
                @endforeach
            @endif
        @endforeach
        <li>
            @if ($paginator->hasMorePages())
                <a class="commerce-pages__step" href="{{ $paginator->nextPageUrl() }}" rel="next">{{ __('commerce::storefront.theme.next') }}</a>
            @else
                <span class="commerce-pages__step" aria-disabled="true">{{ __('commerce::storefront.theme.next') }}</span>
            @endif
        </li>
    </ul>
@endif
