<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\Address;

/** What a shipping method quotes for: origin, destination, the package and the order. */
final class ShippingRequest
{
    public function __construct(
        public readonly Address $origin,
        public readonly ?Address $destination,
        public readonly Package $package,
        public readonly int $subtotal,
        public readonly string $currency = 'IDR',
        public readonly ?int $customerId = null,
        public readonly bool $cod = false,
        public readonly bool $freeShippingVoucher = false,
    ) {}

    /** From a calculation: the shippable lines, the subtotal after discounts and the destination. */
    public static function fromState(CalculationState $state): self
    {
        $settings = app(StoreSettings::class);
        $lines = [];
        $subtotal = 0;
        foreach ($state->lines as $line) {
            $subtotal += $line->net();
            if (! $line->requiresShipping) {
                continue;
            }
            $lines[] = self::packageLine($line);
        }
        $destination = $state->ctx->destination === null ? null : Address::fromArray($state->ctx->destination);

        return new self(
            origin: Address::fromArray((array) $settings->get('general.address', [])),
            destination: $destination,
            package: new Package($lines),
            subtotal: $subtotal,
            currency: (string) $settings->get('general.currency.code', 'IDR'),
            customerId: $state->ctx->customerId(),
            cod: $state->ctx->paymentMethod === 'cod',
            freeShippingVoucher: ! empty($state->data['free_shipping']),
        );
    }

    /** @return array{weight: int, length: int, width: int, height: int, quantity: int, value: int} */
    protected static function packageLine(CalcLine $line): array
    {
        $variant = $line->variant;

        return [
            'weight' => (int) ($variant->weight ?? 0),
            'length' => (int) ($variant->length ?? 0),
            'width' => (int) ($variant->width ?? 0),
            'height' => (int) ($variant->height ?? 0),
            'quantity' => $line->quantity,
            'value' => $line->net(),
        ];
    }
}
