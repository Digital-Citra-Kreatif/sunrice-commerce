{{-- "I have paid": the confirmation form, when the method asks for one. $order, $payment --}}
@php($mode = ((array) $payment->instructions)['confirmation'] ?? 'off')
@if ($mode !== 'off' && $payment->status === 'pending' && \Illuminate\Support\Facades\Route::has('commerce.confirm-payment'))
    <p class="commerce-payment__confirm">
        <a href="{{ commerce_url('commerce.confirm-payment').'?order='.$order->order_key }}" class="commerce-button commerce-button--primary">{{ __('commerce::payments.confirm_link') }}</a>
    </p>
@endif
