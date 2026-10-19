{{--
    The CSS store emails are inlined with: the app's mail theme plus the store's color
    (Settings → Store → General → Brand color) on buttons, headings and links. $brand (hex or null).
--}}
@include('mail::themes.'.config('mail.markdown.theme', 'default'))
/* The store look: near-black text, square buttons, thin lines, small uppercase headings (same as the storefront theme). */
body, .wrapper, .body { background-color: #f4f4f4; }
body, td, th, p, li { color: #1b1b1b; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
.inner-body { border-radius: 0; border: 0; box-shadow: none; }
.header a { color: #1b1b1b; font-size: 22px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; }
h1 { color: #1b1b1b; font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
h2, h3 { color: #1b1b1b; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
a { color: #1b1b1b; }
.button { border-radius: 0; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.button-primary, .button-blue { background-color: #1b1b1b; border-bottom: 12px solid #1b1b1b; border-left: 24px solid #1b1b1b; border-right: 24px solid #1b1b1b; border-top: 12px solid #1b1b1b; }
.table table { border-top: 1px solid #1b1b1b; }
.table th { border-bottom: 1px solid #1b1b1b; color: #666666; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
.table td { border-bottom: 1px solid #e5e5e5; padding: 10px 0; }
.panel { border-left: 3px solid #d7001d; }
.panel-content { background-color: #f4f4f4; }
.footer p { color: #666666; }
@if ($brand ?? null)
h1, h2, h3, a { color: {{ $brand }}; }
.button-primary, .button-blue { background-color: {{ $brand }}; border-bottom: 8px solid {{ $brand }}; border-left: 18px solid {{ $brand }}; border-right: 18px solid {{ $brand }}; border-top: 8px solid {{ $brand }}; color: #ffffff; }
.header a { color: {{ $brand }}; }
@endif
