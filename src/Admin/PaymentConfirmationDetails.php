<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Support\MoneyFormatter;

final class PaymentConfirmationDetails
{
    /** @return array<string, mixed> */
    public static function make(PaymentConfirmation $confirmation, Order $order, MoneyFormatter $money): array
    {
        $payment = $confirmation->payment;

        return [
            'id' => $confirmation->id,
            'order' => [
                'number' => $order->displayNumber(),
                'customer' => $order->customer_name ?? $order->email,
                'href' => "commerce/orders/{$order->id}",
            ],
            'expected' => $payment !== null ? $money->format($payment->amount) : null,
            'amount' => $money->format($confirmation->amount),
            'short' => $payment !== null && $confirmation->amount < $payment->amount,
            'method' => $payment->method_title ?? $payment?->method,
            'sender_name' => $confirmation->sender_name,
            'sender_bank' => $confirmation->sender_bank,
            'transferred_at' => $confirmation->transferred_at?->toDateString(),
            'destination' => $confirmation->destination,
            'note' => $confirmation->note,
            'proof_url' => $confirmation->proof_path !== null ? route('sunrice.admin.commerce.confirmations.proof', $confirmation, false) : null,
            'proof_is_pdf' => str_ends_with((string) $confirmation->proof_path, '.pdf'),
            'status' => $confirmation->status,
            'review_note' => $confirmation->review_note,
        ];
    }
}
