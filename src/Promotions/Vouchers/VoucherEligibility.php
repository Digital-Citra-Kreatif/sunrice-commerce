<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Promotions\TargetMatcher;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * Checks a voucher against a calculation, in order (ARCHITECTURE.md §9.3);
 * the first failure is the reason given to the customer.
 */
class VoucherEligibility
{
    public function __construct(protected VoucherUsage $usage, protected TargetMatcher $targets, protected MoneyFormatter $money) {}

    /** @param  array<int, Voucher>  $applied  vouchers already applied to this calculation */
    public function check(Voucher $voucher, CalculationState $state, array $applied = []): Eligibility
    {
        $ctx = $state->ctx;
        $now = $ctx->now();

        // 1. Active and within dates
        if (! $voucher->active || $voucher->trashed()) {
            return new Eligibility('inactive');
        }
        if ($voucher->starts_at !== null && $voucher->starts_at > $now) {
            return new Eligibility('not_started', params: ['date' => $voucher->starts_at->isoFormat('D MMM YYYY HH:mm')]);
        }
        if ($voucher->ends_at !== null && $voucher->ends_at <= $now) {
            return new Eligibility('expired');
        }

        // 2. Audience
        $audience = match ($voucher->audience) {
            'signed_in' => $ctx->isGuest() ? 'sign_in' : null,
            'roles' => $ctx->isGuest() ? 'sign_in' : (array_intersect((array) $voucher->roles, $ctx->roles) === [] ? 'audience' : null),
            'customers' => $this->forCustomer($voucher, $state) ? null : ($ctx->isGuest() && $ctx->email === null ? 'sign_in' : 'audience'),
            'first_order' => $this->usage->hasOrdered($ctx) ? 'first_order' : null,
            default => null,
        };
        if ($audience !== null) {
            return new Eligibility($audience);
        }

        // 3. Usage
        if ($voucher->usage_limit !== null && $voucher->times_used >= $voucher->usage_limit) {
            return new Eligibility('usage_limit');
        }
        if ($voucher->usage_limit_per_customer !== null && $this->usage->byCustomer($voucher, $ctx) >= $voucher->usage_limit_per_customer) {
            return new Eligibility('customer_limit');
        }

        // 4. Destination, payment and shipping: checked once known
        $pending = [];
        if (! empty($voucher->destinations)) {
            if ($ctx->destination === null) {
                $pending[] = 'destination';
            } elseif (! $this->destinationMatches($voucher, $ctx->destination)) {
                return new Eligibility('destination');
            }
        }
        if (! empty($voucher->payment_methods)) {
            if ($ctx->paymentMethod === null) {
                $pending[] = 'payment_method';
            } elseif (! in_array($ctx->paymentMethod, (array) $voucher->payment_methods, true)) {
                return new Eligibility('payment_method');
            }
        }
        if (! empty($voucher->shipping_methods)) {
            // Rate ids are "method:service"; the chosen one is known before rates are quoted.
            $method = $state->shipping['rate']['method'] ?? ($state->ctx->shippingRate !== null ? explode(':', $state->ctx->shippingRate)[0] : null);
            if ($method === null) {
                $pending[] = 'shipping_method';
            } elseif (! in_array($method, (array) $voucher->shipping_methods, true)) {
                return new Eligibility('shipping_method');
            }
        }

        // 5. Eligible lines
        $this->targets->preload(array_map(fn (CalcLine $l) => (int) $l->product()->entry_id, array_values($state->lines)));
        $voucher->loadMissing('targets');
        $include = $voucher->targets->where('mode', 'include');
        $exclude = $voucher->targets->where('mode', 'exclude');
        $lines = [];
        foreach ($state->lines as $key => $line) {
            if ($include->isNotEmpty() && ! $this->targets->matches($include, $line->variant)) {
                continue;
            }
            if ($exclude->isNotEmpty() && $this->targets->matches($exclude, $line->variant)) {
                continue;
            }
            if ($voucher->exclude_sale_items && $line->onSale) {
                continue;
            }
            $lines[] = $key;
        }
        if ($lines === [] && $voucher->type !== 'free_shipping') {
            return new Eligibility('no_eligible_items');
        }

        // 6. Subtotal and quantity
        $basisLines = $voucher->subtotal_basis === 'eligible' ? $lines : array_keys($state->lines);
        $subtotal = array_sum(array_map(fn (string $k) => $state->lines[$k]->net(), $basisLines));
        if ($voucher->min_subtotal !== null && $subtotal < $voucher->min_subtotal) {
            return new Eligibility('min_subtotal', params: ['amount' => $this->money->format($voucher->min_subtotal), 'missing' => $this->money->format($voucher->min_subtotal - $subtotal)]);
        }
        if ($voucher->max_subtotal !== null && $subtotal > $voucher->max_subtotal) {
            return new Eligibility('max_subtotal', params: ['amount' => $this->money->format($voucher->max_subtotal)]);
        }
        $quantity = array_sum(array_map(fn (string $k) => $state->lines[$k]->quantity, $basisLines));
        if ($voucher->min_quantity !== null && $quantity < $voucher->min_quantity) {
            return new Eligibility('min_quantity', params: ['count' => $voucher->min_quantity]);
        }

        // 7. Combination
        foreach ($applied as $other) {
            if ($other->exclusive || $voucher->exclusive || ! $voucher->combinable || ! $other->combinable) {
                return new Eligibility('not_combinable', params: ['code' => $other->label()]);
            }
        }

        return new Eligibility(null, $lines, $pending);
    }

    protected function forCustomer(Voucher $voucher, CalculationState $state): bool
    {
        $ctx = $state->ctx;

        return $voucher->customers()->where(fn ($q) => $q
            ->when($ctx->customerId() !== null, fn ($w) => $w->orWhere('customer_id', $ctx->customerId()))
            ->when($ctx->email !== null, fn ($w) => $w->orWhere('email', mb_strtolower((string) $ctx->email))))
            ->exists() && ($ctx->customerId() !== null || $ctx->email !== null);
    }

    /** @param  array<string, mixed>  $destination */
    protected function destinationMatches(Voucher $voucher, array $destination): bool
    {
        $country = strtoupper((string) ($destination['country'] ?? 'ID'));
        $codes = array_filter([$destination['village_code'] ?? null, $destination['district_code'] ?? null, $destination['city_code'] ?? null, $destination['province_code'] ?? null]);
        foreach ((array) $voucher->destinations as $rule) {
            if (strtoupper($rule['country']) !== $country) {
                continue;
            }
            if (empty($rule['region_code']) || in_array($rule['region_code'], $codes, true)) {
                return true;
            }
        }

        return false;
    }
}
