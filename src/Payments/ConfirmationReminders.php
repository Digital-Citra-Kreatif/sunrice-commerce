<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Settings\StoreSettings;
use Throwable;

/**
 * commerce:tick: a payment confirmation still waiting for review after
 * checkout.confirmation_reminder_hours (24 by default; 0 for never) is sent
 * to staff again, once. The payment itself never expires while it waits:
 * the customer has paid, as far as anyone knows.
 */
class ConfirmationReminders
{
    public function __invoke(): int
    {
        $hours = (int) app(StoreSettings::class)->get('checkout.confirmation_reminder_hours', 24);
        if ($hours <= 0) {
            return 0;
        }
        $count = 0;
        PaymentConfirmation::query()->with('order')->where('status', 'submitted')->whereNull('reminded_at')
            ->where('created_at', '<=', now()->subHours($hours))->orderBy('id')->limit(100)->get()
            ->each(function (PaymentConfirmation $confirmation) use (&$count): void {
                try {
                    $confirmation->forceFill(['reminded_at' => now()])->save();
                    app(Notifier::class)->send('staff_payment_confirmation', $confirmation->order, ['confirmation' => $confirmation]);
                    app(Timeline::class)->record($confirmation->order, 'note', Timeline::text('commerce::payments.confirmation_waiting', [
                        'hours' => (int) $confirmation->created_at?->diffInHours(now()),
                    ]), ['confirmation_id' => $confirmation->id], Actor::system());
                    $count++;
                } catch (Throwable $e) {
                    report($e);
                }
            });

        return $count;
    }
}
