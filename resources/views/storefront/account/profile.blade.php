{{--
    My Account → Profile: name, email, phone, password, Google link, deleting the account. $customer, $user, $google.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    <h1>{{ __('commerce::account.profile.title') }}</h1>
    <form method="POST" action="{{ commerce_url('commerce.account.profile.update') }}" class="commerce-form">
        @csrf @method('PUT')
        <label class="commerce-field"><span>{{ __('commerce::account.register.name') }}</span>
            <input type="text" name="name" value="{{ old('name', $customer->name ?? $user->name) }}" required autocomplete="name">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'name'])
        </label>
        <label class="commerce-field"><span>{{ __('commerce::account.login.email') }}</span>
            <input type="email" name="email" value="{{ old('email', $user->email) }}" required autocomplete="email">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'email'])
        </label>
        @if (($customer->meta['password_set'] ?? true) !== false)
            <label class="commerce-field"><span>{{ __('commerce::account.profile.current_password_for_email') }}</span>
                <input type="password" name="current_password" autocomplete="current-password">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'current_password'])
            </label>
        @endif
        <label class="commerce-field"><span>{{ __('commerce::account.register.phone') }}</span>
            <input type="tel" name="phone" value="{{ old('phone', $customer->phone) }}" autocomplete="tel">
        </label>
        <label class="commerce-check"><input type="checkbox" name="accepts_marketing" value="1" @checked(old('accepts_marketing', $customer->accepts_marketing))> {{ __('commerce::account.register.marketing') }}</label>
        @if ($google)
            <p>{{ __('commerce::account.profile.google_linked', ['email' => $google]) }}</p>
        @endif
        <button type="submit">{{ __('commerce::account.profile.save') }}</button>
    </form>

    <h2>{{ __('commerce::account.password.title') }}</h2>
    <form method="POST" action="{{ commerce_url('commerce.account.password') }}" class="commerce-form">
        @csrf @method('PUT')
        @if (($customer->meta['password_set'] ?? true) !== false)
            <label class="commerce-field"><span>{{ __('commerce::account.password.current') }}</span>
                <input type="password" name="current_password" required autocomplete="current-password">
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'current_password'])
            </label>
        @endif
        <label class="commerce-field"><span>{{ __('commerce::account.reset.new_password') }}</span>
            <input type="password" name="password" required autocomplete="new-password">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'password'])
        </label>
        <label class="commerce-field"><span>{{ __('commerce::account.register.password_confirmation') }}</span>
            <input type="password" name="password_confirmation" required autocomplete="new-password">
        </label>
        <button type="submit">{{ __('commerce::account.profile.save') }}</button>
    </form>

    <h2>{{ __('commerce::account.delete.title') }}</h2>
    @if ($customer->deletion_requested_at)
        <p>{{ __('commerce::account.delete.requested') }}</p>
    @else
        <form method="POST" action="{{ commerce_url('commerce.account.delete') }}" class="commerce-form">
            @csrf
            <p>{{ __('commerce::account.delete.intro') }}</p>
            <label class="commerce-check"><input type="checkbox" name="confirm" value="1" required> {{ __('commerce::account.delete.confirm') }}</label>
            <button type="submit">{{ __('commerce::account.delete.title') }}</button>
        </form>
    @endif
@endsection
