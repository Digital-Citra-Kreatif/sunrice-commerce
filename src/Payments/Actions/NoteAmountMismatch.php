<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Actions;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * A gateway reported a paid amount that isn't the payment's: an internal
 * note on the order's timeline, once per payment and amount (kept in the
 * payment's meta.amount_mismatches), so retries don't repeat it. The
 * payment itself is not changed.
 */
class NoteAmountMismatch
{
    public function __construct(protected Timeline $timeline, protected MoneyFormatter $money) {}

    /** Whether a note was written (false: this amount was already noted). */
    public function handle(Payment $payment, int $amount, string $reference): bool
    {
        return DB::transaction(function () use ($payment, $amount, $reference): bool {
            /** @var Payment $locked */
            $locked = Payment::query()->whereKey($payment->id)->lockForUpdate()->firstOrFail();
            $noted = (array) ($locked->meta['amount_mismatches'] ?? []);
            if (in_array($amount, $noted, true)) {
                return false;
            }
            $locked->forceFill(['meta' => [...(array) $locked->meta, 'amount_mismatches' => [...$noted, $amount]]])->save();
            $this->timeline->record(Order::withTrashed()->findOrFail($locked->order_id), 'note', Timeline::text('commerce::orders.timeline.amount_mismatch', [
                'method' => $locked->method_title ?? $locked->method, 'amount' => $this->money->format($amount), 'expected' => $this->money->format($locked->amount),
            ]), ['payment_id' => $locked->id, 'reference' => $reference, 'amount' => $amount], Actor::gateway($locked->method));

            return true;
        });
    }
}
