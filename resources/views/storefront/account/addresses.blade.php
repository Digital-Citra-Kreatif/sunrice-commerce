{{--
    My Account → Addresses. $addresses, $editing (the address being edited, or null).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    @php($addressBookUrl = commerce_url('commerce.account.addresses'))

    <header class="commerce-address-book__header">
        <h1>{{ __('commerce::account.addresses.title') }}</h1>
        @unless ($showAddressForm)
            <a href="{{ commerce_url('commerce.account.addresses', ['add' => 1]) }}#address-form" class="commerce-button commerce-button--primary">{{ __('commerce::account.addresses.add') }}</a>
        @endunless
    </header>

    @if ($showAddressForm)
        <section id="address-form" class="commerce-address-book__form" aria-labelledby="address-form-title">
            <h2 id="address-form-title">{{ $editing ? __('commerce::account.addresses.edit') : __('commerce::account.addresses.add') }}</h2>
            <form method="POST" action="{{ $editing ? commerce_url('commerce.account.addresses.update', ['address' => $editing->id]) : commerce_url('commerce.account.addresses.store') }}" class="commerce-form">
                @csrf
                @if ($editing) @method('PUT') @endif
                <label class="commerce-field"><span>{{ __('commerce::account.addresses.label') }}</span>
                    <input type="text" name="address[label]" value="{{ old('address.label', $editing?->label) }}" maxlength="60">
                </label>
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.address-fields'), ['prefix' => 'address', 'address' => $editing?->toAddress() ?? [], 'company' => true])
                <label class="commerce-check"><input type="checkbox" name="address[default_shipping]" value="1" @checked(old('address.default_shipping', $editing?->default_shipping))> {{ __('commerce::account.addresses.default_shipping') }}</label>
                <label class="commerce-check"><input type="checkbox" name="address[default_billing]" value="1" @checked(old('address.default_billing', $editing?->default_billing))> {{ __('commerce::account.addresses.default_billing') }}</label>
                <div class="commerce-address-book__form-actions">
                    <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::account.profile.save') }}</button>
                    <a href="{{ $addressBookUrl }}" class="commerce-link commerce-link--action">{{ __('commerce::account.addresses.cancel') }}</a>
                </div>
            </form>
        </section>
    @endif

    <div class="commerce-address-cards">
        @forelse ($addresses as $address)
            @php($locality = collect([$address->city, $address->province ?: $address->state])->filter()->unique()->implode(', '))
            <details class="commerce-address-card" @if ($addresses->count() === 1 && !$showAddressForm) open @endif>
                <summary class="commerce-address-card__summary">
                    <span class="commerce-address-card__identity">
                        <strong>{{ $address->label ?: $address->line1 }}</strong>
                        @if ($locality !== '')
                            <span>{{ $locality }}</span>
                        @endif
                    </span>
                    @if ($address->default_shipping || $address->default_billing)
                        <span class="commerce-address-card__badges">
                            @if ($address->default_shipping)<span class="commerce-badge">{{ __('commerce::account.addresses.default_shipping') }}</span>@endif
                            @if ($address->default_billing)<span class="commerce-badge">{{ __('commerce::account.addresses.default_billing') }}</span>@endif
                        </span>
                    @endif
                </summary>
                <div class="commerce-address-card__body">
                    <address>{!! nl2br(e(\Sunrice\Commerce\Support\Address::fromArray($address->toAddress())->format())) !!}</address>
                    <div class="commerce-address-card__actions">
                        <a href="{{ commerce_url('commerce.account.addresses', ['edit' => $address->id]) }}#address-form">{{ __('commerce::account.addresses.edit') }}</a>
                        <form method="POST" action="{{ commerce_url('commerce.account.addresses.delete', ['address' => $address->id]) }}">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="commerce-link">{{ __('commerce::account.addresses.delete') }}</button>
                        </form>
                    </div>
                </div>
            </details>
        @empty
            @unless ($showAddressForm)
                <p>{{ __('commerce::account.addresses.empty') }}</p>
            @endunless
        @endforelse
    </div>
@endsection
