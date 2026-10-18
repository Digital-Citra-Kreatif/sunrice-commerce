{{--
    Marketing emails (campaigns and automations). $store (name, url, logo), $brand, $preheader,
    $body (the email's HTML, on one line), $button (label, url) or null, $unsubscribe_url, $lang.
    The colors come from emails/theme.blade.php.
--}}
<x-mail::layout>
<x-slot:header>
<x-mail::header :url="$store['url']">
@if ($store['logo'] ?? null)
<img src="{{ $store['logo'] }}" alt="{{ $store['name'] }}" style="max-height: 60px; max-width: 240px; border: 0;">
@else
{{ $store['name'] }}
@endif
</x-mail::header>
</x-slot:header>

@if ($preheader !== '')
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">{{ $preheader }}</div>
@endif

{!! $body !!}

@if ($button)
<x-mail::button :url="$button['url']">
{{ $button['label'] }}
</x-mail::button>
@endif

<x-slot:footer>
<x-mail::footer>
{{ __('commerce::marketing.footer', ['store' => $store['name']], $lang) }}
[{{ __('commerce::marketing.unsubscribe', [], $lang) }}]({{ $unsubscribe_url }})

© {{ date('Y') }} {{ $store['name'] }}
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>
