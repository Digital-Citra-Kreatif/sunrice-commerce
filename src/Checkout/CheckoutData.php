<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Support\AddressRules;

/**
 * What the customer entered at checkout, kept on the cart
 * (commerce_carts.checkout) so a reload keeps it. Passwords are never
 * stored here.
 */
final class CheckoutData
{
    public const KEYS = [
        'email', 'phone', 'name', 'shipping_address', 'billing_same', 'billing_address', 'shipping_rate', 'payment_method',
        'notes', 'dropship', 'terms', 'create_account', 'accepts_marketing', 'fields', 'save_address', 'address_id',
    ];

    /** @param  array<string, mixed>  $values */
    public function __construct(public readonly array $values = []) {}

    public static function fromCart(?Cart $cart): self
    {
        return new self((array) $cart?->checkout);
    }

    /**
     * Posted checkout input, cleaned (addresses normalized with region
     * names), laid over what was stored.
     *
     * @param  array<string, mixed>  $input
     */
    public function merge(array $input): self
    {
        $values = $this->values;
        foreach (self::KEYS as $key) {
            if (! array_key_exists($key, $input)) {
                continue;
            }
            $value = $input[$key];
            $values[$key] = match ($key) {
                'shipping_address', 'billing_address' => is_array($value) ? AddressRules::normalize($value)->toArray() : null,
                'billing_same', 'terms', 'create_account', 'accepts_marketing', 'save_address' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
                'email' => is_string($value) ? mb_strtolower(trim($value)) : null,
                'dropship', 'fields' => is_array($value) ? $value : [],
                'address_id' => is_numeric($value) ? (int) $value : null,
                default => is_scalar($value) ? trim((string) $value) : null,
            };
        }
        // Checkboxes that are absent from a full form post are unticked.
        if (($input['_form'] ?? null) === 'checkout') {
            foreach (['billing_same', 'terms', 'create_account', 'accepts_marketing', 'save_address'] as $flag) {
                $values[$flag] = filter_var($input[$flag] ?? false, FILTER_VALIDATE_BOOLEAN);
            }
            $values['dropship'] = (array) ($input['dropship'] ?? []);
        }

        return new self($values);
    }

    public function get(string $key, mixed $default = null): mixed
    {
        $value = data_get($this->values, $key);

        return $value === null || $value === '' ? $default : $value;
    }

    public function email(): ?string
    {
        return $this->get('email');
    }

    public function phone(): ?string
    {
        return $this->get('phone');
    }

    /** @return array<string, string|null>|null */
    public function shippingAddress(): ?array
    {
        $address = $this->get('shipping_address');

        return is_array($address) && array_filter($address) !== [] ? $address : null;
    }

    public function billingSame(): bool
    {
        return (bool) $this->get('billing_same', true);
    }

    /** @return array<string, string|null>|null */
    public function billingAddress(): ?array
    {
        if ($this->billingSame()) {
            return $this->shippingAddress();
        }
        $address = $this->get('billing_address');

        return is_array($address) && array_filter($address) !== [] ? $address : null;
    }

    public function shippingRate(): ?string
    {
        return $this->get('shipping_rate');
    }

    public function paymentMethod(): ?string
    {
        return $this->get('payment_method');
    }

    public function isPickup(): bool
    {
        return str_starts_with((string) $this->shippingRate(), 'pickup:');
    }

    /** @return array{enabled: bool, name: string|null, phone: string|null} */
    public function dropship(): array
    {
        $d = (array) $this->get('dropship', []);

        return ['enabled' => filter_var($d['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN), 'name' => $d['name'] ?? null, 'phone' => $d['phone'] ?? null];
    }

    /** @return array<string, mixed> */
    public function fields(): array
    {
        return (array) $this->get('fields', []);
    }

    /**
     * The pricing context changes this data implies: destination (none
     * for pickup), billing address, chosen rate and payment method, email
     * and phone.
     *
     * @return array<string, mixed>
     */
    public function context(): array
    {
        $destination = $this->isPickup() ? null : $this->shippingAddress();

        return array_filter([
            'destination' => $destination,
            'billingAddress' => $this->billingAddress(),
            'shippingRate' => $this->shippingRate(),
            'paymentMethod' => $this->paymentMethod(),
            'email' => $this->email(),
            'phone' => $this->phone(),
        ], fn ($v) => $v !== null);
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return $this->values;
    }
}
