@php($cta = $product->cta)
<div class="commerce-cta commerce-cta--{{ $cta['type'] }}">
    @if ($cta['type'] === 'external')
        @foreach ($cta['links'] as $link)
            <a class="commerce-cta__link" href="{{ $link['url'] }}" target="_blank" rel="noopener nofollow">{{ $link['label'] }}</a>
        @endforeach
    @elseif ($cta['url'])
        <a class="commerce-cta__button" href="{{ $cta['url'] }}" data-commerce-cta="{{ $cta['type'] }}" @if ($cta['type'] === 'whatsapp') target="_blank" rel="noopener nofollow" @endif>{{ $cta['label'] }}</a>
    @endif
</div>
