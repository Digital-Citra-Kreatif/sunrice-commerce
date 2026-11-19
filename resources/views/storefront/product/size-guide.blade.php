{{-- $content: resolved optional size guide. --}}
@if (filled($guide = $content['size_guide']))
    <details class="commerce-accordion commerce-size-guide" id="size-guide"><summary>{{ __('commerce::storefront.product.size_guide') }}</summary><div class="commerce-prose">{!! $guide !!}</div></details>
@endif
