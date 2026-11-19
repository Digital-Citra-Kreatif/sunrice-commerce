{{-- $orderFilters, $orderCategories, $orderFilterErrors and $filtersActive. --}}
@php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
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
            <span>{{ __('commerce::account.orders.filters.category') }}</span>
            <select name="category" @disabled(empty($orderCategories))>
                <option value="">{{ __('commerce::account.orders.filters.all_categories') }}</option>
                @foreach ($orderCategories ?? [] as $id => $label)
                    <option value="{{ $id }}" @selected(($orderFilters['category'] ?? '') === (string) $id)>{{ $label }}</option>
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
        <div class="commerce-order-filters__actions">
            @if ($filtersActive || $orderFilterErrors->any())
                <a class="commerce-link commerce-link--action commerce-order-filters__reset" href="{{ $ordersUrl }}">{{ __('commerce::account.orders.filters.reset') }}</a>
            @endif
            <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::account.orders.filters.apply') }}</button>
        </div>
    </div>
    @if ($orderFilterErrors->any())
        <ul class="commerce-order-filters__errors commerce-field__error" role="alert">
            @foreach ($orderFilterErrors->all() as $message)
                <li>{{ $message }}</li>
            @endforeach
        </ul>
    @endif
</form>
