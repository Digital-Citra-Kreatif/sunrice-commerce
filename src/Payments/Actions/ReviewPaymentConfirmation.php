<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Actions;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Payments\Events\PaymentConfirmationApproved;
use Sunrice\Commerce\Payments\Events\PaymentConfirmationRejected;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Support\DomainException;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * Staff approve a confirmation (the payment is recorded paid; a lower
 * amount than expected needs "approve anyway") or reject it with a reason
 * (the payment is unpaid again and its deadline resumes, extended by the
 * time it spent in review).
 */
class ReviewPaymentConfirmation
{
    public function __construct(protected RecordPaymentResult $record) {}

    /** @throws DomainException */
    public function approve(PaymentConfirmation $confirmation, Actor $actor, bool $anyway = false): PaymentConfirmation
    {
        $payment = $confirmation->payment;
        if ($confirmation->status !== 'submitted' || $payment === null) {
            throw new DomainException('This confirmation was already reviewed.');
        }
        if ($confirmation->amount < $payment->amount && ! $anyway) {
            throw new DomainException('The amount sent ('.app(MoneyFormatter::class)->format($confirmation->amount).') is less than expected ('
                .app(MoneyFormatter::class)->format($payment->amount).'). Approve anyway to accept it.');
        }
        DB::transaction(function () use ($confirmation, $payment, $actor): void {
            $confirmation->forceFill(['status' => 'approved', 'reviewed_by' => $actor->userId, 'reviewed_at' => now()])->save();
            $this->record->handle($payment, PaymentResult::paid($payment->amount, 'confirmation:'.$confirmation->id,
                $confirmation->transferred_at !== null ? Carbon::instance($confirmation->transferred_at) : null), $actor);
        });
        DB::afterCommit(fn () => PaymentConfirmationApproved::dispatch($confirmation));

        return $confirmation;
    }

    /** @throws DomainException */
    public function reject(PaymentConfirmation $confirmation, string $reason, Actor $actor): PaymentConfirmation
    {
        $payment = $confirmation->payment;
        if ($confirmation->status !== 'submitted' || $payment === null) {
            throw new DomainException('This confirmation was already reviewed.');
        }
        DB::transaction(function () use ($confirmation, $payment, $reason, $actor): void {
            $confirmation->forceFill(['status' => 'rejected', 'review_note' => $reason, 'reviewed_by' => $actor->userId, 'reviewed_at' => now()])->save();
            $since = isset($payment->meta['awaiting_since']) ? Carbon::parse($payment->meta['awaiting_since']) : null;
            if ($payment->expires_at !== null && $since !== null) {
                $deadline = $payment->expires_at->copy()->addSeconds((int) $since->diffInSeconds(now()));
                $payment->forceFill(['expires_at' => $deadline])->save();
                $payment->order->forceFill(['expires_at' => $deadline])->save();
            }
            $this->record->handle($payment, PaymentResult::pending('confirmation:'.$confirmation->id), $actor);
        });
        DB::afterCommit(fn () => PaymentConfirmationRejected::dispatch($confirmation));

        return $confirmation;
    }
}
