{{--
    My Account home. $customer, $user, $addresses, $recentOrders (latest 3), $links (the menu without this page).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    <h1>{{ __('commerce::account.overview.hello', ['name' => $customer->name ?? $user->name]) }}</h1>
    <x-commerce::slot name="account.overview" :customer="$customer" />

    @if (commerce_feature('orders'))
        <section class="commerce-account__recent">
            <h2>{{ __('commerce::account.overview.recent_orders') }}</h2>
            @forelse ($recentOrders as $order)
                @if ($loop->first)<ul class="commerce-account__recent-orders">@endif
                <li>
                    <a href="{{ commerce_url('commerce.account.order', ['order' => $order->id]) }}">{{ $order->displayNumber() }}</a>
                    <span>{{ $order->placed_at?->translatedFormat('j M Y') }}</span>
                    <span>{{ \Sunrice\Commerce\Orders\OrderStatus::label($order->status) }}</span>
                    <span>{{ $money->format($order->total) }}</span>
                </li>
                @if ($loop->last)</ul>@endif
            @empty
                <p>{{ __('commerce::account.overview.no_orders') }}</p>
            @endforelse
            @if ($recentOrders->isNotEmpty())
                <a href="{{ commerce_url('commerce.account.orders') }}">{{ __('commerce::account.overview.all_orders') }}</a>
            @endif
        </section>
    @endif

    @if ($links !== [])
        <section class="commerce-account__links">
            <h2>{{ __('commerce::account.overview.links') }}</h2>
            <ul>
                @foreach ($links as $link)
                    <li><a href="{{ $link['url'] }}">{{ $link['label'] }}</a></li>
                @endforeach
            </ul>
        </section>
    @endif

    @php($default = $addresses->firstWhere('default_shipping', true))
    @if ($default)
        <h2>{{ __('commerce::account.addresses.default_shipping') }}</h2>
        <address>{!! nl2br(e(\Sunrice\Commerce\Support\Address::fromArray($default->toAddress())->format())) !!}</address>
    @endif
@endsection
