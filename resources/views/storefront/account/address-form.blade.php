{{-- $editing: an existing address or null. --}}
@php($addressBookUrl = commerce_url('commerce.account.addresses'))
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
