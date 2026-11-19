{{-- Shared by the order confirmation and My Account. The amount comes from the payment snapshot when active. --}}
@php
    $status = \Sunrice\Commerce\Orders\OrderStatus::class;
    $balance = $order->isPartiallyPaid() && $order->balanceDue() > 0;
    $awaiting = $order->payment_status === $status::AWAITING_CONFIRMATION;
    $activePayment = $payment && in_array($payment->status, ['pending', 'awaiting_confirmation'], true);
    $showInstructions = $activePayment && ! $awaiting && $payment->status === 'pending' && $instructionsView;
@endphp
@if (! $order->isQuote() && $order->isOpen() && $order->payment_method !== 'whatsapp'
    && ($balance || ($order->isUnpaid() && ($activePayment || $payUrl || $awaiting))))
    @php
        $money = app(\Sunrice\Commerce\Support\MoneyFormatter::class);
        $amount = $activePayment ? (int) ($payment->instructions['amount'] ?? $payment->amount) : $order->balanceDue();
        $deadline = ($activePayment ? $payment->expires_at : null) ?? ($balance ? $order->balance_due_at : null);
        $copyAmount = $showInstructions && $instructionsView === 'commerce::storefront.payments.bank-transfer';
    @endphp
    <section class="commerce-order__payment" aria-labelledby="commerce-order-payment-title">
        <header class="commerce-order__payment-header">
            <div>
                <h2 id="commerce-order-payment-title">{{ $balance ? __('commerce::payments.pay_balance') : __('commerce::checkout.order.how_to_pay') }}</h2>
                <p class="commerce-payment__amount">
                    <strong @if ($copyAmount) data-commerce-copy="{{ $amount }}" @endif>{{ $money->format($amount) }}</strong>
                    @if ($copyAmount)
                        <button type="button" class="commerce-link commerce-link--action" data-commerce-copy-button>{{ __('commerce::payments.copy') }}</button>
                    @endif
                </p>
            </div>
            @if ($awaiting)
                <p class="commerce-order__payment-meta">{{ $status::label($status::AWAITING_CONFIRMATION, 'payment') }}</p>
            @elseif ($deadline)
                <p class="commerce-order__payment-meta">{{ __('commerce::checkout.order.deadline', ['date' => $deadline->translatedFormat('j F Y H:i')]) }}</p>
            @endif
        </header>
        @if ($showInstructions)
            @include(\Sunrice\Commerce\Storefront\Layout::paymentView($instructionsView), ['order' => $order, 'payment' => $payment, 'showAmount' => false])
        @endif
        @if ($payUrl && ! $awaiting)
            <div class="commerce-order__payment-actions">
                <a href="{{ $payUrl }}" @class(['commerce-link commerce-link--action' => $showInstructions, 'commerce-button commerce-button--primary' => ! $showInstructions])>
                    {{ __($balance ? 'commerce::payments.pay_balance' : 'commerce::payments.pay_again') }}
                </a>
            </div>
        @endif
    </section>
@endif
