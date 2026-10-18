{{--
    My Account → Addresses. $addresses, $editing (the address being edited, or null).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    <h1>{{ __('commerce::account.addresses.title') }}</h1>
    @forelse ($addresses as $address)
        <div class="commerce-address-card">
            @if ($address->label)<strong>{{ $address->label }}</strong>@endif
            <address>{!! nl2br(e(\Sunrice\Commerce\Support\Address::fromArray($address->toAddress())->format())) !!}</address>
            @if ($address->default_shipping)<span class="commerce-badge">{{ __('commerce::account.addresses.default_shipping') }}</span>@endif
            @if ($address->default_billing)<span class="commerce-badge">{{ __('commerce::account.addresses.default_billing') }}</span>@endif
            <a href="?edit={{ $address->id }}">{{ __('commerce::account.addresses.edit') }}</a>
            <form method="POST" action="{{ commerce_url('commerce.account.addresses.delete', ['address' => $address->id]) }}">@csrf @method('DELETE')<button type="submit" class="commerce-link">{{ __('commerce::account.addresses.delete') }}</button></form>
        </div>
    @empty
        <p>{{ __('commerce::account.addresses.empty') }}</p>
    @endforelse

    <h2>{{ $editing ? __('commerce::account.addresses.edit') : __('commerce::account.addresses.add') }}</h2>
    <form method="POST" action="{{ $editing ? commerce_url('commerce.account.addresses.update', ['address' => $editing->id]) : commerce_url('commerce.account.addresses.store') }}" class="commerce-form">
        @csrf
        @if ($editing) @method('PUT') @endif
        <label class="commerce-field"><span>{{ __('commerce::account.addresses.label') }}</span>
            <input type="text" name="address[label]" value="{{ old('address.label', $editing?->label) }}" maxlength="60">
        </label>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.address-fields'), ['prefix' => 'address', 'address' => $editing?->toAddress() ?? [], 'company' => true])
        <label class="commerce-check"><input type="checkbox" name="address[default_shipping]" value="1" @checked(old('address.default_shipping', $editing?->default_shipping))> {{ __('commerce::account.addresses.default_shipping') }}</label>
        <label class="commerce-check"><input type="checkbox" name="address[default_billing]" value="1" @checked(old('address.default_billing', $editing?->default_billing))> {{ __('commerce::account.addresses.default_billing') }}</label>
        <button type="submit">{{ __('commerce::account.profile.save') }}</button>
    </form>
@endsection
