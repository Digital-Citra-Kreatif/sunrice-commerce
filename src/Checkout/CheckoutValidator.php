<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Validator as ValidatorInstance;
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\AddressRules;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * The checkout's rules (ARCHITECTURE.md §11.1), from the settings and the
 * active modules: contact, account, addresses (Indonesian region chains),
 * the shipping rate among the current rates, an available payment method,
 * terms, notes, dropshipper and extension fields.
 */
class CheckoutValidator
{
    public function __construct(
        protected StoreSettings $settings,
        protected CheckoutMode $mode,
        protected PaymentManager $payments,
        protected CheckoutFields $fields,
    ) {}

    /**
     * @param  array<string, mixed>  $extra  inputs that aren't stored (password)
     *
     * @throws ValidationException
     */
    public function validate(CheckoutData $data, CalculationState $state, array $extra = []): void
    {
        $input = [...$data->toArray(), ...$extra];
        $validator = Validator::make($input, $this->rules($data, $state), [], $this->attributes());
        $validator->after(function (ValidatorInstance $v) use ($data, $state): void {
            $this->after($v, $data, $state);
        });
        $validator->validate();
    }

    /** @return array<string, mixed> */
    public function rules(CheckoutData $data, CalculationState $state): array
    {
        $s = $this->settings;
        $guest = commerce_customer() === null;
        $rules = [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email:rfc', 'max:190'],
            'phone' => [$s->get('checkout.require_phone', true) ? 'required' : 'nullable', 'string', 'max:30'],
        ];

        $require = [
            'phone' => (bool) $s->get('checkout.require_phone', true),
            'postal_code' => (bool) $s->get('checkout.require_postal_code', false),
            'village' => (bool) $s->get('checkout.village_level', false),
        ];
        if ($this->needsAddress($data, $state)) {
            $rules += AddressRules::rules('shipping_address', $require);
        }
        if ($this->needsAddress($data, $state) && ! $data->billingSame()) {
            $rules += AddressRules::rules('billing_address', $require);
        }
        if ($s->get('checkout.company_fields', false)) {
            $rules['fields.company'] = ['nullable', 'string', 'max:120'];
            $rules['fields.tax_id'] = ['nullable', 'string', 'max:40'];
        }
        if ($guest && $this->createsAccount($data)) {
            $rules['password'] = ['required', 'string', 'min:8', 'max:190'];
        }
        if ($s->get('checkout.order_notes', true)) {
            $rules['notes'] = ['nullable', 'string', 'max:1000'];
        }
        if ($s->get('checkout.dropshipper', false) && $data->dropship()['enabled']) {
            $rules['dropship.name'] = ['required', 'string', 'max:120'];
            $rules['dropship.phone'] = ['required', 'string', 'max:30'];
        }
        if ($s->get('checkout.terms_page')) {
            $rules['terms'] = ['accepted'];
        }

        return [...$rules, ...$this->fields->rules($data, $state)];
    }

    protected function after(ValidatorInstance $v, CheckoutData $data, CalculationState $state): void
    {
        if ($state->isEmpty()) {
            $v->errors()->add('cart', __('commerce::checkout.errors.empty'));

            return;
        }
        if (commerce_customer() === null && ! $this->settings->get('checkout.guest_checkout', true)) {
            $v->errors()->add('email', __('commerce::checkout.errors.sign_in'));
        }
        $minimum = (int) $this->settings->get('checkout.minimum_order', 0);
        if ($minimum > 0 && $minimum > $state->totals['subtotal'] - $state->totals['discount']) {
            $v->errors()->add('cart', __('commerce::checkout.errors.minimum', ['amount' => app(MoneyFormatter::class)->format($minimum)]));
        }
        if ($this->needsAddress($data, $state)) {
            AddressRules::after($v, 'shipping_address');
            if (! $data->billingSame()) {
                AddressRules::after($v, 'billing_address');
            }
        }
        if ($state->shipping['needed'] && $this->mode->shipping()) {
            $ids = array_column($state->shipping['rates'], 'id');
            if ($this->mode->requiresRate() && $ids === [] && $data->shippingAddress() !== null) {
                $v->errors()->add('shipping_rate', __('commerce::checkout.errors.no_rates'));
            } elseif ($this->mode->requiresRate() && ! in_array($data->shippingRate(), $ids, true)) {
                $v->errors()->add('shipping_rate', __('commerce::checkout.errors.rate'));
            } elseif (! $this->mode->requiresRate() && $data->shippingRate() !== null && ! in_array($data->shippingRate(), $ids, true)) {
                $v->errors()->add('shipping_rate', __('commerce::checkout.errors.rate'));
            }
        }
        if ($this->mode->payment() && $state->totals['total'] > 0) {
            $available = $this->payments->available(PaymentContext::fromState($state));
            if ($available === []) {
                $v->errors()->add('payment_method', __('commerce::checkout.errors.no_payment'));
            } elseif (! array_key_exists((string) $data->paymentMethod(), $available)) {
                $v->errors()->add('payment_method', __('commerce::checkout.errors.payment'));
            }
        }
    }

    /** Something ships, shipping is on, and it isn't picked up. */
    public function needsAddress(CheckoutData $data, CalculationState $state): bool
    {
        return $state->shipping['needed'] && $this->mode->shipping() && ! $data->isPickup();
    }

    public function createsAccount(CheckoutData $data): bool
    {
        if (! commerce_feature('accounts') || ! $this->settings->get('accounts.registration', true)) {
            return false;
        }

        return match ((string) $this->settings->get('checkout.create_account', 'offer')) {
            'always' => true,
            'offer' => (bool) $data->get('create_account', false),
            default => false,
        };
    }

    /** @return array<string, string> */
    protected function attributes(): array
    {
        $attributes = [];
        foreach (['name', 'email', 'phone', 'password', 'notes'] as $field) {
            $attributes[$field] = __('commerce::checkout.fields.'.$field);
        }
        $attributes['terms'] = __('commerce::checkout.terms_link');
        foreach (['shipping_address', 'billing_address'] as $prefix) {
            foreach (['name', 'phone', 'company', 'country', 'province_code', 'city_code', 'district_code', 'village_code', 'city', 'postal_code', 'line1'] as $field) {
                $attributes["{$prefix}.{$field}"] = __('commerce::account.address.'.str_replace('_code', '', $field));
            }
        }

        return $attributes;
    }
}
