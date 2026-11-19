{{-- $address, $addresses and $showAddressForm. --}}
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
