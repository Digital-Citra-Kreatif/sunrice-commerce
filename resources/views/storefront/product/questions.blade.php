{{-- $content: resolved questions and answers. --}}
@if (filled($faq = $content['faq']))
    <details class="commerce-accordion">
        <summary>{{ __('commerce::storefront.product.faq') }}</summary>
        @foreach ($faq as $row)
            <details class="commerce-faq"><summary>{{ data_get($row, 'question') }}</summary><p>{{ data_get($row, 'answer') }}</p></details>
        @endforeach
    </details>
@endif
