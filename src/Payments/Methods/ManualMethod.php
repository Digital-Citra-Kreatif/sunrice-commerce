<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Methods;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentMethodBase;
use Sunrice\Support\Locales;

/** Shared parts of the manual methods: per-language instructions and the confirmation setting. */
abstract class ManualMethod extends PaymentMethodBase
{
    public static function feature(): ?string
    {
        return 'manual_payments';
    }

    /** Payment confirmation: required | optional | off. */
    public function confirmation(): string
    {
        return (string) $this->setting('confirmation', 'optional');
    }

    public function instructionsText(?string $locale = null): ?string
    {
        return $this->localized('instructions', $locale);
    }

    /** @return array<string, mixed> what every manual method snapshots on the payment */
    protected function snapshot(Order $order, Payment $payment): array
    {
        return [
            'amount' => $payment->amount,
            'instructions' => $this->instructionsText($order->locale),
            'confirmation' => $this->confirmation(),
            'deadline' => $payment->expires_at?->toIso8601String(),
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected static function instructionFields(): array
    {
        $fields = [];
        foreach (Locales::available() as $locale) {
            $fields[] = ['handle' => $locale, 'type' => 'textarea', 'label' => Locales::name($locale), 'translatable' => false, 'config' => ['max' => 3000]];
        }

        return [
            ['handle' => 'instructions', 'type' => 'group', 'label' => 'Instructions on the order page and in the email', 'config' => ['fields' => $fields]],
            ['handle' => 'confirmation', 'type' => 'select', 'label' => 'Payment confirmation', 'config' => ['options' => [
                ['value' => 'required', 'label' => 'Required: customers confirm with a proof'],
                ['value' => 'optional', 'label' => 'Optional'],
                ['value' => 'off', 'label' => 'Off'],
            ]]],
        ];
    }
}
