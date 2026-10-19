{{--
    An empty state: nothing in the cart, no results, no orders yet.
    $title, $text (optional), $action (optional: ['url' => …, 'label' => …]), $icon (optional icon name).
--}}
<div class="commerce-empty">
    @if ($icon ?? null)
        <span class="commerce-empty__icon">@include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => $icon])</span>
    @endif
    <p class="commerce-empty__title">{{ $title }}</p>
    @if (filled($text ?? null))
        <p class="commerce-muted">{{ $text }}</p>
    @endif
    @if (! empty($action['url']))
        <p class="commerce-empty__actions"><a class="commerce-button commerce-button--primary" href="{{ $action['url'] }}">{{ $action['label'] }}</a></p>
    @endif
</div>
