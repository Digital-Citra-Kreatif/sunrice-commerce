{{--
    The CSS store emails are inlined with: the app's mail theme plus the store's color
    (Settings → Store → General → Brand color) on buttons, headings and links. $brand (hex or null).
--}}
@include('mail::themes.'.config('mail.markdown.theme', 'default'))
@if ($brand)
h1, h2, h3, a { color: {{ $brand }}; }
.button-primary, .button-blue { background-color: {{ $brand }}; border-bottom: 8px solid {{ $brand }}; border-left: 18px solid {{ $brand }}; border-right: 18px solid {{ $brand }}; border-top: 8px solid {{ $brand }}; color: #ffffff; }
.header a { color: {{ $brand }}; }
@endif
