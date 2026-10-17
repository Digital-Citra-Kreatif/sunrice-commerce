@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    <section class="commerce-confirm-page">
        <h1>{{ __('commerce::payments.confirm.title') }}</h1>
        @include($L::view('partials.messages'))
        @error('order')<p class="commerce-message commerce-message--error" role="alert">{{ $message }}</p>@enderror

        @if (! $order)
            <p>{{ __('commerce::payments.confirm.find') }}</p>
            <form method="POST" action="{{ commerce_url('commerce.confirm-payment.lookup') }}" class="commerce-form">
                @csrf <x-honeypot />
                <label class="commerce-field"><span>{{ __('commerce::checkout.track.number') }}</span>
                    <input type="text" name="number" value="{{ old('number') }}" required>
                    @include($L::view('partials.field-error'), ['name' => 'number'])</label>
                <label class="commerce-field"><span>{{ __('commerce::checkout.fields.email') }}</span>
                    <input type="email" name="email" value="{{ old('email') }}" required></label>
                <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::checkout.track.submit') }}</button>
            </form>
        @elseif (! $payment)
            <p>{{ __('commerce::payments.confirm.not_open') }}</p>
            <p><a href="{{ $order->url() }}">{{ __('commerce::payments.back_to_order') }}</a></p>
        @else
            <p>{{ __('commerce::checkout.order.title', ['number' => $order->displayNumber()]) }} · {{ __('commerce::checkout.order.amount_due', ['amount' => $money->format($payment->amount)]) }}</p>
            <form method="POST" action="{{ commerce_url('commerce.confirm-payment.submit') }}" enctype="multipart/form-data" class="commerce-form">
                @csrf <x-honeypot />
                <input type="hidden" name="order" value="{{ $order->order_key }}">
                <label class="commerce-field"><span>{{ __('commerce::payments.confirm.sender_name') }} *</span>
                    <input type="text" name="sender_name" value="{{ old('sender_name', $order->customer_name) }}" required>
                    @include($L::view('partials.field-error'), ['name' => 'sender_name'])</label>
                <label class="commerce-field"><span>{{ __('commerce::payments.confirm.sender_bank') }}</span>
                    <input type="text" name="sender_bank" value="{{ old('sender_bank') }}"></label>
                <label class="commerce-field"><span>{{ __('commerce::payments.confirm.amount') }} *</span>
                    <input type="number" name="amount" value="{{ old('amount', $payment->amount) }}" min="1" required inputmode="numeric">
                    @include($L::view('partials.field-error'), ['name' => 'amount'])</label>
                <label class="commerce-field"><span>{{ __('commerce::payments.confirm.date') }} *</span>
                    <input type="date" name="transferred_at" value="{{ old('transferred_at', now()->toDateString()) }}" max="{{ now()->toDateString() }}" required>
                    @include($L::view('partials.field-error'), ['name' => 'transferred_at'])</label>
                @if ($accounts)
                    <label class="commerce-field"><span>{{ __('commerce::payments.confirm.account') }} *</span>
                        <select name="account" required>
                            @foreach ($accounts as $i => $account)
                                <option value="{{ $i }}" @selected((string) old('account') === (string) $i)>{{ $account['bank'] }} · {{ $account['number'] }} · {{ $account['holder'] }}</option>
                            @endforeach
                        </select>
                        @include($L::view('partials.field-error'), ['name' => 'account'])</label>
                @endif
                <label class="commerce-field"><span>{{ __('commerce::payments.confirm.proof') }} @if ($proofRequired)*@endif</span>
                    <input type="file" name="proof" accept="image/jpeg,image/png,image/webp,application/pdf" @required($proofRequired)>
                    <small>{{ __('commerce::payments.confirm.proof_help') }}</small>
                    @include($L::view('partials.field-error'), ['name' => 'proof'])</label>
                <label class="commerce-field"><span>{{ __('commerce::payments.confirm.note') }}</span>
                    <textarea name="note" rows="2" maxlength="500">{{ old('note') }}</textarea></label>
                @if ($captcha)
                    <script src="{{ $captcha['script'] }}" async defer></script>
                    <div class="{{ $captcha['class'] }}" data-sitekey="{{ $captcha['site_key'] }}"></div>
                    @include($L::view('partials.field-error'), ['name' => 'captcha'])
                @endif
                <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::payments.confirm.submit') }}</button>
            </form>
        @endif
    </section>
@endsection
