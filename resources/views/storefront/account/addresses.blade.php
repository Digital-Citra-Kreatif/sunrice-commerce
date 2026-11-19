{{--
    My Account → Addresses. $addresses, $editing (the address being edited, or null).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    <header class="commerce-address-book__header">
        <h1>{{ __('commerce::account.addresses.title') }}</h1>
        @unless ($showAddressForm)
            <a href="{{ commerce_url('commerce.account.addresses', ['add' => 1]) }}#address-form" class="commerce-button commerce-button--primary">{{ __('commerce::account.addresses.add') }}</a>
        @endunless
    </header>

    @if ($showAddressForm)
        @include(\Sunrice\Commerce\Storefront\Layout::view('account.address-form'))
    @endif

    <div class="commerce-address-cards">
        @forelse ($addresses as $address)
            @include(\Sunrice\Commerce\Storefront\Layout::view('account.address-card'))
        @empty
            @unless ($showAddressForm)
                <p>{{ __('commerce::account.addresses.empty') }}</p>
            @endunless
        @endforelse
    </div>
@endsection
