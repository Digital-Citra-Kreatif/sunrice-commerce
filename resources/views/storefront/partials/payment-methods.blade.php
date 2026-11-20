{{-- Available payment methods. $paymentMethods [{key, title, description, logos}], $data --}}
@php
    $selected = $data->paymentMethod();
    $selected = in_array($selected, array_column($paymentMethods, 'key'), true) ? $selected : ($paymentMethods[0]['key'] ?? null);
@endphp
<div class="commerce-payment-methods" data-commerce-payments>
    @forelse ($paymentMethods as $method)
        <label class="commerce-radio">
            <input type="radio" name="payment_method" value="{{ $method['key'] }}" @checked($selected === $method['key'])>
            <span class="commerce-radio__label">{{ $method['title'] }}</span>
            @if ($method['description'])<small class="commerce-radio__detail">{{ $method['description'] }}</small>@endif
            @if (! empty($method['logos']))
                <span class="commerce-radio__logos">
                    @foreach ($method['logos'] as $logo)
                        <img class="commerce-radio__logo" src="{{ $logo['url'] }}" alt="{{ $logo['alt'] }}" width="48" height="26">
                    @endforeach
                </span>
            @endif
        </label>
    @empty
        <p>{{ __('commerce::checkout.errors.no_payment') }}</p>
    @endforelse
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'payment_method'])
</div>
