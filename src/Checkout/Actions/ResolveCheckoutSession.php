<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Actions;

use Illuminate\Support\Facades\DB;
use RuntimeException;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Checkout\VerifiedAccountCheckout;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Orders\Listeners\ReleaseReservations;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Numbering;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Contracts\StartsCheckoutSession;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Support\Staff;
use Throwable;

class ResolveCheckoutSession
{
    public const TYPE = 'checkout';

    public const SESSION_KEY = 'commerce.checkout_session';

    public function draft(Cart $cart): ?Order
    {
        return Order::onlyTrashed()->where('type', self::TYPE)->where('checkout_token', hash('sha256', $cart->token))->first();
    }

    /** Return a placed order when a payment has started. Otherwise release the cart for editing. */
    public function handle(Order $draft, bool $cancelUnstarted = true): ?Order
    {
        $payment = $draft->payment();
        $gateway = $payment === null ? null : app(PaymentManager::class)->get($payment->method);
        if (! $gateway instanceof StartsCheckoutSession) {
            throw new CheckoutRefused(__('commerce::checkout.errors.payment_status'));
        }

        if ($payment->reference === null) {
            return $cancelUnstarted ? $this->release($draft, onlyUnopened: true) : null;
        }

        try {
            $result = $gateway->checkoutStatus($payment);
            if ($result !== null && $this->committed($result)) {
                return $this->promote($payment, $result);
            }
            if (! $cancelUnstarted) {
                return null;
            }
            // A gateway status of "not found" is insufficient: the old URL can still accept money.
            if ($gateway->cancelCheckoutSession($payment)) {
                return $this->release($draft);
            }
            $result = $gateway->checkoutStatus($payment);
            if ($result !== null && $this->committed($result)) {
                return $this->promote($payment, $result);
            }
        } catch (Throwable $error) {
            report($error);
        }

        throw new CheckoutRefused(__('commerce::checkout.errors.payment_status'));
    }

    public function committed(PaymentResult $result): bool
    {
        return in_array($result->status, ['paid', 'pending', 'awaiting_confirmation'], true);
    }

    public function releaseUnopened(Order $draft): void
    {
        $this->release($draft, onlyUnopened: true);
    }

    public function observe(Payment $payment): bool
    {
        $gateway = app(PaymentManager::class)->get($payment->method);
        $result = $gateway instanceof StartsCheckoutSession ? $gateway->checkoutStatus($payment) : null;

        if ($result === null) {
            throw new RuntimeException('The gateway has not confirmed the checkout payment yet.');
        }

        return $this->committed($result) && $this->promote($payment, $result) !== null;
    }

    /** Called only after an authenticated provider status or webhook. */
    public function promote(Payment $payment, PaymentResult $result): ?Order
    {
        return DB::transaction(function () use ($payment, $result): ?Order {
            $draft = Order::withTrashed()->whereKey($payment->order_id)->lockForUpdate()->first();
            if ($draft === null) {
                return null;
            }
            if ($draft->type === self::TYPE) {
                $draft->forceFill([
                    'type' => 'order', 'deleted_at' => null, 'number' => app(Numbering::class)->next('order'), 'placed_at' => now(),
                ])->save();
                Cart::query()->whereKey((int) $draft->meta('checkout_cart_id'))->where('status', 'active')
                    ->update(['status' => 'converted', 'order_id' => $draft->id]);
                app(Timeline::class)->record($draft, 'status', Timeline::text('commerce::orders.timeline.placed'),
                    ['to' => $draft->status, 'channel' => 'storefront'], Actor::customer());
                if ($draft->user_id !== null && filled($draft->customer_name) && app(VerifiedAccountCheckout::class)->required()) {
                    $userModel = Staff::userModel();
                    $userModel::query()->whereKey($draft->user_id)->where('name', '')->update(['name' => $draft->customer_name]);
                }
                DB::afterCommit(fn () => OrderPlaced::dispatch($draft->refresh()));
            }
            app(RecordPaymentResult::class)->handle($payment, $result, Actor::gateway($payment->method));

            return $draft->refresh();
        }, 3);
    }

    private function release(Order $draft, bool $onlyUnopened = false): ?Order
    {
        return DB::transaction(function () use ($draft, $onlyUnopened): ?Order {
            $locked = Order::withTrashed()->whereKey($draft->id)->lockForUpdate()->first();
            if ($locked === null || $locked->type !== self::TYPE) {
                return $locked;
            }

            if ($onlyUnopened && $locked->payment()?->reference !== null) {
                throw new CheckoutRefused(__('commerce::checkout.errors.payment_status'));
            }
            app(ReleaseReservations::class)->release($locked, cancelPayments: false);
            $locked->forceDelete();

            return null;
        }, 3);
    }

    public function expire(): void
    {
        Order::onlyTrashed()->where('type', self::TYPE)->where('expires_at', '<=', now())->orderBy('id')
            ->chunkById(100, function ($drafts): void {
                foreach ($drafts as $draft) {
                    try {
                        $this->handle($draft);
                    } catch (CheckoutRefused) {
                        // The gateway did not confirm it was safe to release the reservation. Retry next tick.
                    }
                }
            });
    }
}
