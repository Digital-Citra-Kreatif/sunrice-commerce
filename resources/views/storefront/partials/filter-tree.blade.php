@foreach (collect($nodes)->sortBy('label', SORT_NATURAL | SORT_FLAG_CASE) as $node)
    @php($path = $parentPath === '' ? $node['label'] : $parentPath.' › '.$node['label'])
    @if ($node['children'] !== [])
        <details class="commerce-filters__branch" @if ($node['selected']) open @endif>
            <summary>{{ $node['label'] }}</summary>
            <div class="commerce-filters__children">
                @if ($node['term'] !== null)
                    @include($L::view('partials.filter-option'), ['term' => $node['term'], 'label' => $node['label']])
                @endif
                @include($L::view('partials.filter-tree'), ['nodes' => $node['children'], 'parentPath' => $path])
            </div>
        </details>
    @elseif ($node['term'] !== null)
        @include($L::view('partials.filter-option'), ['term' => $node['term'], 'label' => $node['label']])
    @endif
@endforeach
