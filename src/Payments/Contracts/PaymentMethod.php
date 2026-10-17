<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Contracts;

use DateTimeInterface;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Fee;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentStart;

/**
 * A way to pay (ARCHITECTURE.md §13.1). Register with
 * Commerce::registerPaymentMethod(); extend PaymentMethodBase for the
 * common settings (title, availability, fee, deadline). Optional
 * abilities: HandlesReturn, HandlesWebhooks, SupportsRefunds,
 * SupportsCancel, SupportsStatusCheck.
 */
interface PaymentMethod
{
    /** e.g. 'bank_transfer', 'midtrans_snap' */
    public static function key(): string;

    /** The admin name. */
    public function label(): string;

    /** @return array<int, array<string, mixed>> the method's own settings fields */
    public function settingsSchema(): array;

    /** @return array<string, mixed> */
    public function settingsRules(): array;

    public function isAvailable(PaymentContext $ctx): bool;

    public function fee(PaymentContext $ctx): ?Fee;

    /** When an unpaid order is cancelled (null: never). */
    public function deadline(Order $order): ?DateTimeInterface;

    public function start(Order $order, Payment $payment): PaymentStart;

    /** A partial shown on the order page and in emails (receives $order, $payment). */
    public function instructionsView(): ?string;
}
