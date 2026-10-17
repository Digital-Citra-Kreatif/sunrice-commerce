{{--
    My Account home. $customer, $user, $addresses.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    <h1>{{ __('commerce::account.overview.hello', ['name' => $customer->name ?? $user->name]) }}</h1>
    <x-commerce::slot name="account.overview" :customer="$customer" />
    @php($default = $addresses->firstWhere('default_shipping', true))
    @if ($default)
        <h2>{{ __('commerce::account.addresses.default_shipping') }}</h2>
        <address>{!! nl2br(e(\Sunrice\Commerce\Support\Address::fromArray($default->toAddress())->format())) !!}</address>
    @endif
@endsection
