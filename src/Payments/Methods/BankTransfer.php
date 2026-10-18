<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Methods;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Contracts\AddsUniqueCode;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentStart;
use Sunrice\Models\Asset;

/**
 * Bank transfer to one of the store's accounts, with an optional unique
 * code so each open order's amount differs, and a payment confirmation.
 */
class BankTransfer extends ManualMethod implements AddsUniqueCode
{
    public static function key(): string
    {
        return 'bank_transfer';
    }

    public function label(): string
    {
        return 'Bank transfer';
    }

    public function settingsSchema(): array
    {
        $banks = [];
        foreach ((array) config('commerce.payments.banks', []) as $value => $label) {
            $banks[] = ['value' => (string) $value, 'label' => (string) $label];
        }
        $banks[] = ['value' => 'other', 'label' => 'Other'];

        return [
            ['handle' => 'accounts', 'type' => 'repeater', 'label' => 'Bank accounts', 'required' => true, 'config' => ['min' => 1, 'max' => 20, 'fields' => [
                ['handle' => 'bank', 'type' => 'select', 'label' => 'Bank', 'required' => true, 'config' => ['options' => $banks]],
                ['handle' => 'bank_name', 'type' => 'text', 'label' => 'Bank name (for Other)', 'translatable' => false, 'config' => ['max' => 80]],
                ['handle' => 'number', 'type' => 'text', 'label' => 'Account number', 'required' => true, 'translatable' => false, 'config' => ['max' => 40]],
                ['handle' => 'holder', 'type' => 'text', 'label' => 'Account holder', 'required' => true, 'translatable' => false, 'config' => ['max' => 120]],
                ['handle' => 'branch', 'type' => 'text', 'label' => 'Branch', 'translatable' => false, 'config' => ['max' => 120]],
                ['handle' => 'logo', 'type' => 'asset', 'label' => 'Logo', 'config' => ['image_only' => true]],
            ]]],
            ['handle' => 'unique_code', 'type' => 'select', 'label' => 'Unique code', 'instructions' => 'Makes each open order\'s amount different so you can tell transfers apart.', 'config' => ['options' => [
                ['value' => 'off', 'label' => 'Off'], ['value' => 'add', 'label' => 'Add to the total'], ['value' => 'subtract', 'label' => 'Subtract from the total'],
            ]]],
            ['handle' => 'unique_min', 'type' => 'number', 'label' => 'Code from', 'config' => ['min' => 1, 'max' => 999], 'validation' => ['integer']],
            ['handle' => 'unique_max', 'type' => 'number', 'label' => 'Code up to', 'config' => ['min' => 1, 'max' => 999], 'validation' => ['integer']],
            ...self::instructionFields(),
        ];
    }

    public function settingsRules(): array
    {
        return ['unique_code' => ['nullable', 'in:off,add,subtract']];
    }

    public function uniqueCodeRange(): ?array
    {
        $mode = (string) $this->setting('unique_code', 'off');

        return in_array($mode, ['add', 'subtract'], true)
            ? ['min' => (int) $this->setting('unique_min', 1), 'max' => (int) $this->setting('unique_max', 999), 'direction' => $mode]
            : null;
    }

    /** @return array<int, array{bank: string, number: string, holder: string, branch: string|null, logo: string|null}> */
    public function accounts(): array
    {
        $banks = (array) config('commerce.payments.banks', []);

        return array_values(array_map(function ($a) use ($banks): array {
            $logo = $a['logo'] ?? null;
            $logoId = is_array($logo) ? ($logo[0] ?? null) : $logo;

            return [
                'bank' => (string) (($a['bank'] ?? '') === 'other' ? ($a['bank_name'] ?? '') : ($banks[$a['bank'] ?? ''] ?? ($a['bank'] ?? ''))),
                'number' => (string) ($a['number'] ?? ''),
                'holder' => (string) ($a['holder'] ?? ''),
                'branch' => $a['branch'] ?? null,
                'logo' => $logoId !== null && class_exists(Asset::class) ? Asset::query()->find($logoId)?->url() : null,
            ];
        }, array_filter((array) $this->setting('accounts', []), 'is_array')));
    }

    public function start(Order $order, Payment $payment): PaymentStart
    {
        return PaymentStart::instructions([...$this->snapshot($order, $payment), 'accounts' => $this->accounts(),
            'unique_code' => (int) $order->adjustments()->where('kind', 'unique_code')->sum('amount')]);
    }

    public function instructionsView(): ?string
    {
        return 'commerce::storefront.payments.bank-transfer';
    }
}
