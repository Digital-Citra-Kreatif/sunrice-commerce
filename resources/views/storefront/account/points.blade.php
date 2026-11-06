{{--
    My Account → Points. $balance: int, $history: LoyaltyTransaction[],
    $expiring: the next lot to expire, or null; $percent: what orders earn.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))

@section('account')
    <h1>{{ __('commerce::account.points.title') }}</h1>
    <p class="commerce-points__balance">{{ __('commerce::account.points.balance', ['points' => number_format($balance, 0, ',', '.'), 'value' => $money->format($balance)]) }}</p>
    @if ($percent > 0)
        <p>{{ __('commerce::account.points.how', ['percent' => rtrim(rtrim(number_format($percent, 2, ',', '.'), '0'), ',')]) }}</p>
    @endif
    @if ($expiring)
        <p class="commerce-notice">{{ __('commerce::account.points.expiring', ['points' => number_format($expiring->remaining, 0, ',', '.'), 'date' => $expiring->expires_at?->isoFormat('D MMMM YYYY')]) }}</p>
    @endif
    @if ($history->isEmpty())
        <p>{{ __('commerce::account.points.none') }}</p>
    @else
        <table class="commerce-table">
            <thead><tr><th>{{ __('commerce::account.points.date') }}</th><th>{{ __('commerce::account.points.what') }}</th><th class="commerce-num">{{ __('commerce::account.points.points') }}</th></tr></thead>
            <tbody>
                @foreach ($history as $row)
                    <tr>
                        <td>{{ $row->created_at?->isoFormat('D MMM YYYY') }}</td>
                        <td>{{ __('commerce::account.points.kinds.'.$row->kind) }}@if ($row->order) · <a href="{{ commerce_url('commerce.account.order', ['order' => $row->order->id]) }}">{{ $row->order->displayNumber() }}</a>@endif</td>
                        <td class="commerce-num">{{ $row->points > 0 ? '+' : '' }}{{ number_format($row->points, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
