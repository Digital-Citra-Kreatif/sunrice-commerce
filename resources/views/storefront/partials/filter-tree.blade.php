@foreach (collect($nodes)->sortBy('label', SORT_NATURAL | SORT_FLAG_CASE) as $node)
    @php($path = $parentPath === '' ? $node['label'] : $parentPath.' › '.$node['label'])
    @if ($node['children'] !== [])
        <div class="commerce-filters__parent">
            @if ($node['term'] !== null)
                @include($L::view('partials.filter-option'), ['term' => $node['term'], 'label' => $node['label'], 'branch' => true])
            @else
                <span class="commerce-filters__parent-label">{{ $node['label'] }}</span>
            @endif
            <details class="commerce-filters__branch" @if ($node['selected']) open @endif>
                <summary aria-label="{{ __('commerce::storefront.listing.subcategories', ['name' => $path]) }}"></summary>
                <div class="commerce-filters__children">
                    @include($L::view('partials.filter-tree'), ['nodes' => $node['children'], 'parentPath' => $path])
                </div>
            </details>
        </div>
    @elseif ($node['term'] !== null)
        @include($L::view('partials.filter-option'), ['term' => $node['term'], 'label' => $node['label']])
    @endif
@endforeach
