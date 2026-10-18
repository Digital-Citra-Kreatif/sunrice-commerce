<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

/**
 * The three states of an order (status, payment, fulfilment) and the
 * quote statuses, with their labels (commerce::orders.status.*).
 */
final class OrderStatus
{
    // Order status
    public const PENDING = 'pending';

    public const ON_HOLD = 'on_hold';

    public const PROCESSING = 'processing';

    public const COMPLETED = 'completed';

    public const CANCELLED = 'cancelled';

    public const REFUNDED = 'refunded';

    public const FAILED = 'failed';

    // Quote status
    public const REQUESTED = 'requested';

    public const QUOTED = 'quoted';

    public const ACCEPTED = 'accepted';

    public const DECLINED = 'declined';

    public const EXPIRED = 'expired';

    // Payment status
    public const UNPAID = 'unpaid';

    public const AWAITING_CONFIRMATION = 'awaiting_confirmation';

    public const PAID = 'paid';

    public const PARTIALLY_REFUNDED = 'partially_refunded';

    public const PAYMENT_REFUNDED = 'refunded';

    public const PAYMENT_FAILED = 'failed';

    // Fulfilment status
    public const UNFULFILLED = 'unfulfilled';

    public const PARTIALLY_SHIPPED = 'partially_shipped';

    public const SHIPPED = 'shipped';

    public const NOT_REQUIRED = 'not_required';

    public const ORDER_STATUSES = [self::PENDING, self::ON_HOLD, self::PROCESSING, self::COMPLETED, self::CANCELLED, self::REFUNDED, self::FAILED];

    public const QUOTE_STATUSES = [self::REQUESTED, self::QUOTED, self::ACCEPTED, self::DECLINED, self::EXPIRED, self::CANCELLED];

    public const PAYMENT_STATUSES = [self::UNPAID, self::AWAITING_CONFIRMATION, self::PAID, self::PARTIALLY_REFUNDED, self::PAYMENT_REFUNDED, self::PAYMENT_FAILED];

    public const FULFILLMENT_STATUSES = [self::UNFULFILLED, self::PARTIALLY_SHIPPED, self::SHIPPED, self::NOT_REQUIRED];

    public static function label(string $status, string $kind = 'status'): string
    {
        $key = "commerce::orders.{$kind}.{$status}";
        $label = __($key);

        return $label === $key ? ucfirst(str_replace('_', ' ', $status)) : (string) $label;
    }

    /**
     * @param  array<int, string>  $statuses
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(array $statuses, string $kind = 'status'): array
    {
        return array_map(fn (string $s) => ['value' => $s, 'label' => self::label($s, $kind)], $statuses);
    }
}
