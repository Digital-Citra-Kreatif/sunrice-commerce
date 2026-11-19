{{--
    My Account → Orders. $orders (paginated), $type: order.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    @php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
    <h1>{{ $type === 'quote' ? __('commerce::account.orders.quotes') : __('commerce::account.orders.title') }}</h1>
    @isset($orderFilters)
        @php($ordersUrl = commerce_url('commerce.account.orders'))
        <form class="commerce-order-filters" method="GET" action="{{ $ordersUrl }}" aria-label="{{ __('commerce::account.orders.filters.title') }}">
            <div class="commerce-order-filters__fields">
                <label class="commerce-field commerce-order-filters__search">
                    <span>{{ __('commerce::account.orders.filters.search') }}</span>
                    <input type="search" name="q" maxlength="120" value="{{ $orderFilters['q'] ?? '' }}" placeholder="{{ __('commerce::account.orders.filters.search_hint') }}">
                </label>
                <label class="commerce-field commerce-order-filters__status">
                    <span>{{ __('commerce::checkout.order.status') }}</span>
                    <select name="status">
                        <option value="">{{ __('commerce::account.orders.filters.all_statuses') }}</option>
                        @foreach ($S::options($S::ORDER_STATUSES) as $option)
                            <option value="{{ $option['value'] }}" @selected(($orderFilters['status'] ?? '') === $option['value'])>{{ $option['label'] }}</option>
                        @endforeach
                    </select>
                </label>
                <label class="commerce-field">
                    <span>{{ __('commerce::account.orders.filters.date_from') }}</span>
                    <input type="date" name="date_from" value="{{ $orderFilters['date_from'] ?? '' }}">
                </label>
                <label class="commerce-field">
                    <span>{{ __('commerce::account.orders.filters.date_to') }}</span>
                    <input type="date" name="date_to" value="{{ $orderFilters['date_to'] ?? '' }}">
                </label>
            </div>
            @if ($orderFilterErrors->any())
                <ul class="commerce-order-filters__errors commerce-field__error" role="alert">
                    @foreach ($orderFilterErrors->all() as $message)
                        <li>{{ $message }}</li>
                    @endforeach
                </ul>
            @endif
            <div class="commerce-order-filters__actions">
                <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::account.orders.filters.apply') }}</button>
                @if ($filtersActive || $orderFilterErrors->any())
                    <a class="commerce-link commerce-link--action" href="{{ $ordersUrl }}">{{ __('commerce::account.orders.filters.reset') }}</a>
                @endif
            </div>
        </form>
    @endisset
    @if ($orders->isEmpty())
        @php($empty = ($filtersActive ?? false) || $orders->total() > 0 ? 'filters.empty' : ($type === 'quote' ? 'no_quotes' : 'empty'))
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.empty'), ['title' => __('commerce::account.orders.'.$empty), 'icon' => 'bag'])
    @else
        <table class="commerce-account__orders">
            <thead><tr>
                <th>{{ __('commerce::account.orders.number') }}</th><th>{{ __('commerce::checkout.order.date') }}</th>
                <th>{{ __('commerce::checkout.order.status') }}</th><th>{{ __('commerce::storefront.cart.total') }}</th>
            </tr></thead>
            <tbody>
                @foreach ($orders as $order)
                    <tr>
                        <td data-label="{{ __('commerce::account.orders.number') }}"><a href="{{ commerce_url('commerce.account.order', ['order' => $order->id]) }}">{{ $order->displayNumber() }}</a></td>
                        <td data-label="{{ __('commerce::checkout.order.date') }}">{{ $order->placed_at?->translatedFormat('j M Y') }}</td>
                        <td data-label="{{ __('commerce::checkout.order.status') }}"><span class="commerce-status commerce-status--{{ $order->status }}">{{ $S::label($order->status) }}</span></td>
                        <td data-label="{{ __('commerce::storefront.cart.total') }}">{{ $money->format($order->total) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
    @if ($orders->hasPages())
        <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">{{ $orders->onEachSide(1)->links(\Sunrice\Commerce\Storefront\Layout::view('partials.pagination')) }}</nav>
    @endif
@endsection
