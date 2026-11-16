<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing;

/**
 * Everything a calculation knows and produces (ARCHITECTURE.md §8.2):
 * lines, requested codes, adjustments, shipping, totals and notices.
 */
final class CalculationState
{
    /** @var array<string, CalcLine> */
    public array $lines = [];

    /** @var array<int, string> requested voucher codes (uppercase) */
    public array $codes = [];

    /** @var array<int, string> codes that apply */
    public array $appliedCodes = [];

    /** @var array<string, Adjustment> */
    public array $adjustments = [];

    /**
     * @var array{needed: bool, rates: array<int, array<string, mixed>>, rate: array<string, mixed>|null, cost: int}
     */
    public array $shipping = ['needed' => false, 'rates' => [], 'rate' => null, 'cost' => 0];

    /** @var array{subtotal: int, discount: int, shipping: int, shipping_discount: int, fee: int, tax: int, points: int, total: int} total: what is left to pay (after loyalty points) */
    public array $totals = ['subtotal' => 0, 'discount' => 0, 'shipping' => 0, 'shipping_discount' => 0, 'fee' => 0, 'tax' => 0, 'points' => 0, 'total' => 0];

    /** @var array<int, array{code: string, message: string, line?: string|null, voucher?: string|null}> */
    public array $notices = [];

    /** @var array<string, mixed> stages and providers may share data here */
    public array $data = [];

    /**
     * A deposit asked instead of the whole total, set by a calculation stage
     * after the totals (priority above 90): amount (what is paid at checkout),
     * balance_due_at (ISO 8601 date-time or null), label (shown to the
     * customer, or null). Ignored unless 0 < amount < total.
     *
     * @var array{amount: int, balance_due_at: string|null, label: string|null}|null
     */
    public ?array $deposit = null;

    public function __construct(public PricingContext $ctx) {}

    /** The deposit to ask, when one is set and is less than the total. */
    public function depositDue(): ?int
    {
        $amount = (int) ($this->deposit['amount'] ?? 0);

        return $amount > 0 && $amount < $this->totals['total'] ? $amount : null;
    }

    public function notice(string $code, string $message, ?string $line = null, ?string $voucher = null): void
    {
        $this->notices[] = array_filter(['code' => $code, 'message' => $message, 'line' => $line, 'voucher' => $voucher], fn ($v) => $v !== null);
    }

    public function addAdjustment(Adjustment $adjustment): void
    {
        $this->adjustments[$adjustment->key] = $adjustment;
        if ($adjustment->type === Adjustment::DISCOUNT) {
            foreach ($adjustment->allocations as $lineKey => $amount) {
                if (isset($this->lines[$lineKey])) {
                    $this->lines[$lineKey]->discounts[$adjustment->key] = ($this->lines[$lineKey]->discounts[$adjustment->key] ?? 0) + $amount;
                }
            }
        }
    }

    /** @return array<int, Adjustment> */
    public function adjustmentsOfType(string $type): array
    {
        return array_values(array_filter($this->adjustments, fn (Adjustment $a) => $a->type === $type));
    }

    public function needsShipping(): bool
    {
        foreach ($this->lines as $line) {
            if ($line->requiresShipping) {
                return true;
            }
        }

        return false;
    }

    public function isEmpty(): bool
    {
        return $this->lines === [];
    }

    /**
     * A fingerprint of what the customer will pay: each line's variant,
     * quantity and unit price, the adjustments, shipping, taxes, total and
     * any deposit.
     * Checkout renders it; placing the order compares it.
     */
    public function hash(): string
    {
        $lines = array_map(fn (CalcLine $l) => [$l->variant->id, $l->quantity, $l->unitPrice, $l->discount(), $l->tax()], array_values($this->lines));
        $adjustments = array_map(fn (Adjustment $a) => [$a->key, $a->type, $a->amount], array_values($this->adjustments));
        ksort($adjustments);

        $parts = [$lines, $adjustments, $this->shipping['rate']['id'] ?? null, $this->shipping['cost'], $this->totals];
        if ($this->depositDue() !== null) {
            $parts[] = [$this->depositDue(), $this->deposit['balance_due_at'] ?? null];
        }

        return hash('sha256', (string) json_encode($parts));
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'lines' => array_map(fn (CalcLine $l) => $l->toArray(), array_values($this->lines)),
            'codes' => $this->appliedCodes,
            'adjustments' => array_map(fn (Adjustment $a) => $a->toArray(), array_values($this->adjustments)),
            'shipping' => $this->shipping,
            'totals' => $this->totals,
            'deposit' => $this->depositDue() !== null ? $this->deposit : null,
            'notices' => $this->notices,
            'hash' => $this->hash(),
        ];
    }
}
