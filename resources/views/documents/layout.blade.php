<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        /* dompdf: CSS 2.1 and tables only. Clean and airy: near-black text, thin lines, one red accent. */
        @page { margin: 36px 40px; }
        body { font-family: "DejaVu Sans", sans-serif; font-size: 10px; line-height: 1.45; color: #1b1b1b; }
        .page { page-break-after: always; }
        .page:last-child { page-break-after: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; vertical-align: top; padding: 6px 8px; }
        .accent { height: 4px; background: #d7001d; font-size: 0; line-height: 0; }
        .brand td { padding: 14px 0 18px; }
        .store-name { font-size: 15px; font-weight: bold; letter-spacing: 1px; }
        h1 { font-size: 22px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 2px; }
        .label { font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666; }
        .meta td { padding: 2px 0; }
        .parties { border-top: 1px solid #1b1b1b; border-bottom: 1px solid #dddddd; }
        .parties td { padding: 12px 12px 12px 0; }
        .lines { margin-top: 18px; }
        .lines th { border-bottom: 1px solid #1b1b1b; font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #666; padding: 6px 8px; }
        .lines td { border-bottom: 1px solid #e5e5e5; padding: 9px 8px; }
        .lines th:first-child, .lines td:first-child { padding-left: 0; }
        .lines th:last-child, .lines td:last-child { padding-right: 0; }
        .num { text-align: right; white-space: nowrap; }
        .muted { color: #666; }
        .totals { margin-top: 8px; }
        .totals td { padding: 4px 0; }
        .totals .total td { border-top: 1px solid #1b1b1b; padding-top: 8px; font-weight: bold; font-size: 13px; }
        .small { font-size: 8px; }
        .bank-details { margin-top: 16px; padding: 10px 12px; background: #f4f4f4; }
        .notes { margin-top: 14px; }
        .footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #dddddd; font-size: 8px; color: #666; }
        .status { font-weight: bold; }
    </style>
</head>
<body>
    @foreach ($pages as $page)
        <div class="page">{!! $page !!}</div>
    @endforeach
</body>
</html>
