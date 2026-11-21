{{--
    My Account → Points. $balance: int, $history: LoyaltyTransaction[],
    $expiring: the next lot to expire, or null; $percent: what orders earn; $max: the most one order earns (0: no limit).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))

@section('account')
    <h1>{{ __('commerce::account.points.title') }}</h1>
    <div class="commerce-points__summary">
        <div class="commerce-points__card">
            <p>{{ __('commerce::account.points.available') }}</p>
            <p class="commerce-points__amount">{{ number_format($balance, 0, ',', '.') }} <span>{{ __('commerce::account.points.points') }}</span></p>
            <p>{{ __('commerce::account.points.value', ['value' => $money->format($balance)]) }}</p>
        </div>
        @if ($percent > 0 || $expiring)
            <div class="commerce-points__notes">
                @if ($percent > 0)
                    <p>{{ __('commerce::account.points.how', ['percent' => rtrim(rtrim(number_format($percent, 2, ',', '.'), '0'), ',')]) }}
                        @if (($max ?? 0) > 0) {{ __('commerce::account.points.max', ['max' => number_format($max, 0, ',', '.')]) }} @endif</p>
                @endif
                @if ($expiring)
                    <p class="commerce-points__expiry">{{ __('commerce::account.points.expiring', ['points' => number_format($expiring->remaining, 0, ',', '.'), 'date' => $expiring->expires_at?->isoFormat('D MMMM YYYY')]) }}</p>
                @endif
            </div>
        @endif
    </div>
    <form method="POST" action="{{ commerce_url('commerce.account.points.redeem') }}" class="commerce-form commerce-points__redeem">
        @csrf
        <h2>{{ __('commerce::account.points.gift_card.title') }}</h2>
        <p class="commerce-muted">{{ __('commerce::account.points.gift_card.intro') }}</p>
        <label class="commerce-field"><span>{{ __('commerce::account.points.gift_card.code') }}</span>
            <input type="text" name="code" value="{{ old('code') }}" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCD-EFGH-JKLM" required maxlength="40">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'code'])
        </label>
        <button type="submit" class="commerce-button">{{ __('commerce::account.points.gift_card.submit') }}</button>
    </form>
    <h2>{{ __('commerce::account.points.history') }}</h2>
    @if ($history->isEmpty())
        <p>{{ __('commerce::account.points.none') }}</p>
    @else
        <table class="commerce-account__orders commerce-points__history">
            <thead><tr><th>{{ __('commerce::account.points.date') }}</th><th>{{ __('commerce::account.points.what') }}</th><th class="commerce-num">{{ __('commerce::account.points.points') }}</th></tr></thead>
            <tbody>
                @foreach ($history as $row)
                    <tr>
                        <td data-label="{{ __('commerce::account.points.date') }}">{{ $row->created_at?->isoFormat('D MMM YYYY') }}</td>
                        <td data-label="{{ __('commerce::account.points.what') }}">{{ __('commerce::account.points.kinds.'.$row->kind) }}@if ($row->order) · <a href="{{ commerce_url('commerce.account.order', ['order' => $row->order->id]) }}">{{ $row->order->displayNumber() }}</a>@endif</td>
                        <td class="commerce-num" data-label="{{ __('commerce::account.points.points') }}">{{ $row->points > 0 ? '+' : '' }}{{ number_format($row->points, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
