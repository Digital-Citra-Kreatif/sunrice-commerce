{{--
    Breadcrumbs: $items, each ['label' => …, 'url' => … or null for the current page].
--}}
@if (count($items) > 1)
    <nav class="commerce-breadcrumbs" aria-label="{{ __('commerce::storefront.theme.breadcrumbs') }}">
        <ol>
            @foreach ($items as $item)
                <li>
                    @if (! $loop->last && ! empty($item['url']))
                        <a href="{{ $item['url'] }}">{{ $item['label'] }}</a>
                    @else
                        <span aria-current="page">{{ $item['label'] }}</span>
                    @endif
                </li>
            @endforeach
        </ol>
    </nav>
@endif
