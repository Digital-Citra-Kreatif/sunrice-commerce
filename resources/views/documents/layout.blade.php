<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        @page { margin: 28px 32px; }
        body { font-family: "DejaVu Sans", sans-serif; font-size: 11px; color: #111; }
        .page { page-break-after: always; }
        .page:last-child { page-break-after: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; vertical-align: top; padding: 5px 6px; }
        .lines th { border-bottom: 1px solid #333; font-size: 10px; text-transform: uppercase; }
        .lines td { border-bottom: 1px solid #ddd; }
        .num { text-align: right; white-space: nowrap; }
        .muted { color: #666; }
        .totals td { padding: 3px 6px; }
        .totals .total td { border-top: 1px solid #333; font-weight: bold; font-size: 13px; }
        h1 { font-size: 20px; margin: 0 0 4px; }
        .small { font-size: 9px; }
        .bank-details { margin-top: 12px; padding: 8px; border: 1px solid #ddd; }
        .notes { margin-top: 12px; }
        .footer { margin-top: 24px; font-size: 9px; color: #666; }
    </style>
</head>
<body>
    @foreach ($pages as $page)
        <div class="page">{!! $page !!}</div>
    @endforeach
</body>
</html>
