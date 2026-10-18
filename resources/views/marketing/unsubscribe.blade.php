{{-- The unsubscribe page of marketing emails: standalone, so it works without the site's session. $send (or null), $done, $token. --}}
@php($store = commerce_store_name())
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>{{ __('commerce::marketing.unsubscribe_page.title') }} · {{ $store }}</title>
    <style>
        body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #f5f5f4; color: #1c1917; }
        main { max-width: 28rem; margin: 10vh auto; padding: 2rem; background: #fff; border-radius: .75rem; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
        h1 { font-size: 1.25rem; margin: 0 0 1rem; }
        p { line-height: 1.5; }
        .note { color: #78716c; font-size: .875rem; }
        button { font: inherit; padding: .6rem 1.2rem; border: 0; border-radius: .5rem; background: #1c1917; color: #fff; cursor: pointer; }
        a { color: inherit; }
    </style>
</head>
<body>
<main>
    <h1>{{ __('commerce::marketing.unsubscribe_page.title') }}</h1>
    @if ($send === null)
        <p>{{ __('commerce::marketing.unsubscribe_page.unknown') }}</p>
    @elseif ($done)
        <p>{{ __('commerce::marketing.unsubscribe_page.done', ['store' => $store]) }}</p>
    @else
        <p>{{ __('commerce::marketing.unsubscribe_page.question', ['store' => $store, 'email' => $send->email]) }}</p>
        <p class="note">{{ __('commerce::marketing.unsubscribe_page.note') }}</p>
        <form method="post" action="{{ route('commerce.marketing.unsubscribe', ['token' => $token]) }}">
            <button type="submit">{{ __('commerce::marketing.unsubscribe_page.confirm') }}</button>
        </form>
    @endif
    <p class="note"><a href="{{ url('/') }}">{{ $store }}</a></p>
</main>
</body>
</html>
