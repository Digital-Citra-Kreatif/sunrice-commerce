{{-- $content: resolved product specifications. --}}
@if (filled($specs = $content['specifications']))
    <details class="commerce-accordion" open>
        <summary>{{ __('commerce::storefront.product.specifications') }}</summary>
        <dl class="commerce-specs">
            @foreach ($specs as $row)
                <div><dt>{{ data_get($row, 'label') }}</dt><dd>{{ data_get($row, 'value') }}</dd></div>
            @endforeach
        </dl>
    </details>
@endif
