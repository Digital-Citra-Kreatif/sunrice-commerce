<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Closure;
use DateTimeInterface;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\NumberFormat;
use Sunrice\Commerce\Support\Sequences;

/**
 * Order, quote and invoice numbers from their formats and reset rules in
 * Settings → Store (checkout.order_number_*, checkout.quote_number_*,
 * documents.invoice_number_*). Commerce::orderNumberUsing() replaces the
 * order numbering entirely.
 */
class Numbering
{
    /** @var (Closure(Order|null): string)|null */
    protected static ?Closure $orderNumbers = null;

    protected const SETTINGS = [
        'order' => ['checkout.order_number_format', 'checkout.order_number_reset', 'ORD-{Y}{m}{d}-{seq:4}', 'daily'],
        'quote' => ['checkout.quote_number_format', 'checkout.quote_number_reset', 'Q-{Y}{m}-{seq:4}', 'monthly'],
        'invoice' => ['documents.invoice_number_format', 'documents.invoice_number_reset', 'INV/{Y}/{m}/{seq:4}', 'monthly'],
    ];

    public function __construct(protected StoreSettings $settings, protected Sequences $sequences) {}

    /** @param  (Closure(Order|null): string)|null  $generator */
    public static function orderNumbersUsing(?Closure $generator): void
    {
        static::$orderNumbers = $generator;
    }

    /** The next number of a kind: order, quote or invoice. */
    public function next(string $kind, ?Order $order = null, ?DateTimeInterface $at = null): string
    {
        if ($kind === 'order' && static::$orderNumbers !== null) {
            return (static::$orderNumbers)($order);
        }
        [$formatKey, $resetKey, $defaultFormat, $defaultReset] = self::SETTINGS[$kind] ?? self::SETTINGS['order'];
        $format = (string) $this->settings->get($formatKey, $defaultFormat);
        $format = NumberFormat::valid($format) ? $format : $defaultFormat;
        $reset = (string) $this->settings->get($resetKey, $defaultReset);
        $at ??= now();

        return NumberFormat::render($format, $this->sequences->next(NumberFormat::key($kind, $reset, $at)), $at);
    }
}
