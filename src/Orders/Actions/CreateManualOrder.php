<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Orders\Events\PaymentLinkRequested;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Numbering;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\AddressRules;
use Sunrice\Commerce\Support\Phone;

/**
 * An order staff create for a customer (from a chat, a phone call): lines
 * with optional price overrides, a hand-set shipping cost and discount,
 * and the payment status — unpaid (with an optional payment link) or
 * paid (a manual payment is recorded).
 */
class CreateManualOrder
{
    public function __construct(
        protected StaffPricing $pricing,
        protected Numbering $numbering,
        protected Timeline $timeline,
        protected StoreSettings $settings,
    ) {}

    /**
     * @param  array<string, mixed>  $input  customer_id | email, name, phone; lines; shipping_address; billing_address;
     *                                       shipping {label, cost}; discount {label, amount}; payment_status; payment_method; reference; note; send_link
     *
     * @throws ValidationException
     */
    public function handle(array $input, Actor $actor, mixed $staff): Order
    {
        $data = Validator::make($input, [
            'customer_id' => ['nullable', 'integer'],
            'email' => ['required_without:customer_id', 'nullable', 'email', 'max:190'],
            'name' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30'],
            'lines' => ['required', 'array', 'min:1', 'max:200'],
            'lines.*.variant_id' => ['required', 'integer'],
            'lines.*.quantity' => ['required', 'integer', 'min:1', 'max:100000'],
            'lines.*.unit_price' => ['nullable', 'integer', 'min:0'],
            'shipping.label' => ['nullable', 'string', 'max:120'],
            'shipping.cost' => ['nullable', 'integer', 'min:0'],
            'discount.label' => ['nullable', 'string', 'max:120'],
            'discount.amount' => ['nullable', 'integer', 'min:0'],
            'payment_status' => ['required', 'in:unpaid,paid'],
            'payment_method' => ['nullable', 'string', 'max:60'],
            'reference' => ['nullable', 'string', 'max:120'],
            'note' => ['nullable', 'string', 'max:5000'],
            'send_link' => ['boolean'],
        ])->validate();

        $customer = isset($data['customer_id']) ? Customer::query()->findOrFail($data['customer_id'])
            : Customer::query()->firstOrCreate(['email' => mb_strtolower((string) $data['email'])], ['name' => $data['name'] ?? null]);
        $user = $customer->user();
        $shippingAddress = is_array($input['shipping_address'] ?? null) && trim((string) ($input['shipping_address']['line1'] ?? '')) !== ''
            ? AddressRules::normalize($input['shipping_address'])->toArray() : null;
        $billingAddress = is_array($input['billing_address'] ?? null) && trim((string) ($input['billing_address']['line1'] ?? '')) !== ''
            ? AddressRules::normalize($input['billing_address'])->toArray() : $shippingAddress;

        $overrides = array_filter([
            'shipping' => isset($data['shipping']['cost']) || ! empty($data['shipping']['label'])
                ? ['label' => (string) ($data['shipping']['label'] ?? __('commerce::checkout.sections.shipping_method')), 'cost' => (int) ($data['shipping']['cost'] ?? 0)] : null,
            'discount' => ($data['discount']['amount'] ?? 0) > 0 ? ['label' => (string) ($data['discount']['label'] ?? ''), 'amount' => (int) $data['discount']['amount']] : null,
        ]);
        $state = $this->pricing->calculate($data['lines'], $user, $shippingAddress, $overrides, $staff, email: $customer->email);
        if ($state->isEmpty()) {
            throw ValidationException::withMessages(['lines' => 'Add at least one product.']);
        }
        $method = ! empty($data['payment_method']) ? app(PaymentManager::class)->get($data['payment_method']) : null;
        $paid = $data['payment_status'] === 'paid';

        $order = DB::transaction(function () use ($data, $customer, $user, $shippingAddress, $billingAddress, $state, $method, $paid, $actor): Order {
            $country = (string) ($shippingAddress['country'] ?? 'ID');
            $order = new Order;
            $order->forceFill([
                'type' => 'order',
                'number' => $this->numbering->next('order'),
                'order_key' => Str::random(40),
                'status' => $state->totals['total'] === 0 ? OrderStatus::PROCESSING : OrderStatus::PENDING,
                'payment_status' => $state->totals['total'] === 0 ? OrderStatus::PAID : OrderStatus::UNPAID,
                'fulfillment_status' => $state->shipping['needed'] ? OrderStatus::UNFULFILLED : OrderStatus::NOT_REQUIRED,
                'channel' => 'admin',
                'selling_mode' => (string) $this->settings->get('general.selling_mode', 'shop'),
                'customer_id' => $customer->id,
                'user_id' => $user?->getAuthIdentifier(),
                'email' => $customer->email,
                'phone' => Phone::normalize($data['phone'] ?? $customer->phone, $country) ?? ($data['phone'] ?? $customer->phone),
                'customer_name' => $data['name'] ?? $customer->name,
                'shipping_address' => $state->shipping['needed'] ? $shippingAddress : null,
                'billing_address' => $billingAddress,
                'shipping_method' => $state->shipping['rate'],
                'payment_method' => $method !== null ? PaymentManager::idOf($method) : ($paid ? 'manual' : null),
                'payment_method_title' => $method !== null ? PaymentManager::titleOf($method) : ($paid ? 'Manual payment' : null),
                'currency' => (string) $this->settings->get('general.currency.code', 'IDR'),
                'locale' => $customer->locale ?? app()->getLocale(),
                'prices_include_tax' => (bool) ($state->data['prices_include_tax'] ?? $this->settings->get('taxes.prices_include_tax', true)),
                'subtotal' => $state->totals['subtotal'],
                'discount_total' => $state->totals['discount'] + $state->totals['shipping_discount'],
                'shipping_total' => $state->totals['shipping'],
                'fee_total' => $state->totals['fee'],
                'tax_total' => $state->totals['tax'],
                'total' => $state->totals['total'],
                'weight' => (int) array_sum(array_map(fn ($l) => $l->requiresShipping ? (int) $l->variant->weight * $l->quantity : 0, $state->lines)),
                'placed_at' => now(),
                'paid_at' => $state->totals['total'] === 0 ? now() : null,
            ])->save();
            app(PlaceOrder::class)->insertLines($order, $state);
            app(PlaceOrder::class)->insertAdjustments($order, $state);
            try {
                app(PlaceOrder::class)->reserve($order, $state);
            } catch (CheckoutRefused $e) {
                throw ValidationException::withMessages(['lines' => $e->getMessage()]);
            }
            $this->timeline->record($order, 'status', __('commerce::orders.timeline.placed'), ['to' => $order->status, 'channel' => 'admin'], $actor);
            if (! empty($data['note'])) {
                $this->timeline->record($order, 'note', (string) $data['note'], [], $actor);
            }
            if ($order->total > 0 && ($method !== null || $paid)) {
                $deadline = $method?->deadline($order);
                Payment::query()->create(['order_id' => $order->id, 'method' => (string) $order->payment_method, 'method_title' => $order->payment_method_title,
                    'amount' => $order->total, 'currency' => $order->currency, 'status' => 'pending', 'expires_at' => $paid ? null : $deadline]);
                $order->forceFill(['expires_at' => $paid ? null : $deadline])->save();
            }

            return $order;
        });

        DB::afterCommit(fn () => OrderPlaced::dispatch($order));
        if ($paid && $order->total > 0) {
            app(MarkOrderPaid::class)->handle($order, $actor, $data['reference'] ?? null);
        }
        if (! $paid && ($data['send_link'] ?? false)) {
            DB::afterCommit(fn () => PaymentLinkRequested::dispatch($order));
        }

        return $order->refresh();
    }
}
