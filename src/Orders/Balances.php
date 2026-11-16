<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use DateTimeInterface;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\Orders\Events\BalanceOverdue;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\MoneyFormatter;
use Throwable;

/**
 * commerce:tick, for orders paid with a deposit: the customer is reminded
 * checkout.balance_reminder_days before the balance is due (once), and
 * when the due date passes unpaid the order says so, staff are emailed
 * and BalanceOverdue fires (once). Nothing is cancelled: staff decide.
 */
class Balances
{
    public function __invoke(): int
    {
        return $this->remind() + $this->overdue();
    }

    public function remind(): int
    {
        $days = (int) app(StoreSettings::class)->get('checkout.balance_reminder_days', 2);
        if ($days <= 0) {
            return 0;
        }

        // Not once it's overdue: that is the next step's.
        return $this->each(now()->addDays($days), 'balance_reminded_at', function (Order $order): void {
            app(Notifier::class)->send('balance_reminder', $order);
        }, after: now());
    }

    public function overdue(): int
    {
        return $this->each(now(), 'balance_overdue_at', function (Order $order): void {
            app(Timeline::class)->record($order, 'note', Timeline::text('commerce::orders.timeline.balance_overdue', [
                'amount' => app(MoneyFormatter::class)->format($order->balanceDue()), 'date' => $order->balance_due_at?->translatedFormat('j F Y') ?? '',
            ]), [], Actor::system());
            app(Notifier::class)->send('staff_balance_overdue', $order);
            BalanceOverdue::dispatch($order);
        });
    }

    /** Open, partially paid orders due by $before (and after $after) that don't have $flag yet: flag each, then run $step. */
    protected function each(DateTimeInterface $before, string $flag, callable $step, ?DateTimeInterface $after = null): int
    {
        $count = 0;
        Order::query()->where('payment_status', OrderStatus::PARTIALLY_PAID)->whereNotNull('balance_due_at')->where('balance_due_at', '<=', $before)
            ->when($after !== null, fn ($q) => $q->where('balance_due_at', '>', $after))
            ->whereNotIn('status', [OrderStatus::CANCELLED, OrderStatus::REFUNDED, OrderStatus::COMPLETED])
            ->whereNull("meta->{$flag}")->orderBy('id')->limit(200)->get()
            ->each(function (Order $order) use ($flag, $step, &$count): void {
                try {
                    $order->setMeta($flag, now()->toIso8601String())->save();
                    $step($order);
                    $count++;
                } catch (Throwable $e) {
                    report($e);
                }
            });

        return $count;
    }
}
