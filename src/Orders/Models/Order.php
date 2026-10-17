<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Support\Address;

/**
 * An order or a quote (type). Three states are kept apart: status,
 * payment_status and fulfillment_status (SPEC § Orders). Addresses,
 * shipping method and lines are snapshots taken when it was placed.
 *
 * @property int $id
 * @property string $type order | quote
 * @property string|null $number
 * @property string|null $quote_number
 * @property string $order_key
 * @property string|null $checkout_token
 * @property string $status
 * @property string $payment_status
 * @property string $fulfillment_status
 * @property string $channel storefront | admin | whatsapp | mcp | api
 * @property string $selling_mode
 * @property int|null $customer_id
 * @property int|null $user_id
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $customer_name
 * @property array<string, string|null>|null $billing_address
 * @property array<string, string|null>|null $shipping_address
 * @property array<string, mixed>|null $shipping_method
 * @property string|null $payment_method
 * @property string|null $payment_method_title
 * @property string $currency
 * @property string|null $locale
 * @property bool $prices_include_tax
 * @property int $subtotal
 * @property int $discount_total
 * @property int $shipping_total
 * @property int $fee_total
 * @property int $tax_total
 * @property int $total
 * @property int $paid_total
 * @property int $refunded_total
 * @property int $weight
 * @property string|null $customer_note
 * @property array<string, mixed>|null $dropship
 * @property array<string, mixed>|null $fields
 * @property array<string, mixed>|null $meta
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property Carbon|null $placed_at
 * @property Carbon|null $paid_at
 * @property Carbon|null $completed_at
 * @property Carbon|null $cancelled_at
 * @property Carbon|null $expires_at
 * @property Carbon|null $quote_valid_until
 * @property string|null $cancel_reason
 * @property int $version
 * @property Carbon|null $created_at
 * @property Carbon|null $deleted_at
 * @property-read Collection<int, OrderItem> $items
 * @property-read Collection<int, OrderAdjustment> $adjustments
 * @property-read Collection<int, OrderEvent> $events
 * @property-read Collection<int, Payment> $payments
 * @property-read Collection<int, Shipment> $shipments
 * @property-read Collection<int, Refund> $refunds
 * @property-read Customer|null $customer
 */
class Order extends Model
{
    use SoftDeletes;

    protected $table = 'commerce_orders';

    protected $guarded = [];

    protected $attributes = ['type' => 'order', 'version' => 1, 'meta' => null];

    protected $casts = [
        'billing_address' => 'array',
        'shipping_address' => 'array',
        'shipping_method' => 'array',
        'dropship' => 'array',
        'fields' => 'array',
        'meta' => 'array',
        'prices_include_tax' => 'boolean',
        'placed_at' => 'datetime',
        'paid_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'expires_at' => 'datetime',
        'quote_valid_until' => 'datetime',
        'subtotal' => 'integer',
        'discount_total' => 'integer',
        'shipping_total' => 'integer',
        'fee_total' => 'integer',
        'tax_total' => 'integer',
        'total' => 'integer',
        'paid_total' => 'integer',
        'refunded_total' => 'integer',
        'version' => 'integer',
    ];

    /** @return HasMany<OrderItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class)->orderBy('id');
    }

    /** @return HasMany<OrderAdjustment, $this> */
    public function adjustments(): HasMany
    {
        return $this->hasMany(OrderAdjustment::class)->orderBy('id');
    }

    /** @return HasMany<OrderEvent, $this> */
    public function events(): HasMany
    {
        return $this->hasMany(OrderEvent::class)->orderBy('id');
    }

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class)->orderBy('id');
    }

    /** @return HasMany<PaymentConfirmation, $this> */
    public function confirmations(): HasMany
    {
        return $this->hasMany(PaymentConfirmation::class)->orderBy('id');
    }

    /** @return HasMany<Shipment, $this> */
    public function shipments(): HasMany
    {
        return $this->hasMany(Shipment::class)->orderBy('id');
    }

    /** @return HasMany<Refund, $this> */
    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class)->orderBy('id');
    }

    /** @return HasMany<Document, $this> */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class)->orderBy('id');
    }

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function isQuote(): bool
    {
        return $this->type === 'quote';
    }

    /** The number shown to people: the order number, or the quote number. */
    public function displayNumber(): string
    {
        return (string) ($this->number ?? $this->quote_number ?? '#'.$this->id);
    }

    /** The latest payment (the one the order page offers). */
    public function payment(): ?Payment
    {
        return $this->payments->last();
    }

    public function isPaid(): bool
    {
        return in_array($this->payment_status, [OrderStatus::PAID, OrderStatus::PARTIALLY_REFUNDED, OrderStatus::PAYMENT_REFUNDED], true);
    }

    public function isUnpaid(): bool
    {
        return in_array($this->payment_status, [OrderStatus::UNPAID, OrderStatus::AWAITING_CONFIRMATION, OrderStatus::PAYMENT_FAILED], true);
    }

    public function isOpen(): bool
    {
        return ! in_array($this->status, [OrderStatus::CANCELLED, OrderStatus::REFUNDED, OrderStatus::COMPLETED, OrderStatus::DECLINED, OrderStatus::EXPIRED, OrderStatus::ACCEPTED], true);
    }

    public function needsShipping(): bool
    {
        return $this->fulfillment_status !== OrderStatus::NOT_REQUIRED;
    }

    public function shippingAddress(): ?Address
    {
        return $this->shipping_address === null ? null : Address::fromArray($this->shipping_address);
    }

    public function billingAddress(): ?Address
    {
        return $this->billing_address === null ? null : Address::fromArray($this->billing_address);
    }

    public function meta(string $key, mixed $default = null): mixed
    {
        return data_get($this->meta ?? [], $key, $default);
    }

    /** Set a meta value (saved with the next save). */
    public function setMeta(string $key, mixed $value): static
    {
        $meta = (array) $this->meta;
        data_set($meta, $key, $value);
        $this->meta = $meta;

        return $this;
    }

    /** The customer's order page (by key, no sign-in). */
    public function url(): string
    {
        return commerce_url($this->isQuote() ? 'commerce.quote' : 'commerce.order', ['key' => $this->order_key]);
    }
}
