<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty;

use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Loyalty\Models\LoyaltyTransaction;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Customers' points wallets: the balance on the customer
 * (`loyalty_points`) and the ledger behind it. Every change goes through
 * credit() or debit(), in a transaction with the customer row locked, so
 * the balance always equals the sum of the ledger.
 */
class Wallet
{
    public function __construct(protected StoreSettings $settings) {}

    /** Adds points as a lot; earned and given-back points expire after `loyalty.expiry_days` (0: never). */
    public function credit(Customer|int $customer, int $points, string $kind, ?Order $order = null, ?string $note = null, ?int $userId = null, ?CarbonInterface $expiresAt = null): void
    {
        if ($points <= 0) {
            return;
        }
        $days = (int) $this->settings->get('loyalty.expiry_days', 0);
        DB::transaction(function () use ($customer, $points, $kind, $order, $note, $userId, $expiresAt, $days): void {
            $id = $this->lock($customer);
            DB::table('commerce_customers')->where('id', $id)->increment('loyalty_points', $points);
            LoyaltyTransaction::query()->create([
                'customer_id' => $id, 'order_id' => $order?->id, 'kind' => $kind, 'points' => $points, 'remaining' => $points,
                'expires_at' => $expiresAt ?? ($days > 0 ? now()->addDays($days)->endOfDay() : null), 'note' => $note, 'user_id' => $userId,
            ]);
        });
    }

    /**
     * Takes up to $points (all of them, or none when $all and the balance is short), from the lots that expire first.
     *
     * @return int the points taken
     */
    public function debit(Customer|int $customer, int $points, string $kind, ?Order $order = null, ?string $note = null, ?int $userId = null, bool $all = true): int
    {
        if ($points <= 0) {
            return 0;
        }

        return DB::transaction(function () use ($customer, $points, $kind, $order, $note, $userId, $all): int {
            $id = $this->lock($customer);
            $balance = (int) DB::table('commerce_customers')->where('id', $id)->value('loyalty_points');
            $take = min($points, max(0, $balance));
            if ($take === 0 || ($all && $take < $points)) {
                return 0;
            }
            $this->consume($id, $take);
            DB::table('commerce_customers')->where('id', $id)->decrement('loyalty_points', $take);
            LoyaltyTransaction::query()->create(['customer_id' => $id, 'order_id' => $order?->id, 'kind' => $kind, 'points' => -$take, 'note' => $note, 'user_id' => $userId]);

            return $take;
        });
    }

    /** @return int points that expired */
    public function expireDue(): int
    {
        $expired = 0;
        LoyaltyTransaction::query()->where('remaining', '>', 0)->whereNotNull('expires_at')->where('expires_at', '<=', now())
            ->orderBy('id')->chunkById(200, function ($lots) use (&$expired): void {
                foreach ($lots as $lot) {
                    /** @var LoyaltyTransaction $lot */
                    DB::transaction(function () use ($lot, &$expired): void {
                        $this->lock($lot->customer_id);
                        $left = (int) LoyaltyTransaction::query()->whereKey($lot->id)->value('remaining');
                        if ($left <= 0) {
                            return;
                        }
                        LoyaltyTransaction::query()->whereKey($lot->id)->update(['remaining' => 0]);
                        DB::table('commerce_customers')->where('id', $lot->customer_id)->decrement('loyalty_points', $left);
                        LoyaltyTransaction::query()->create(['customer_id' => $lot->customer_id, 'kind' => 'expire', 'points' => -$left]);
                        $expired += $left;
                    });
                }
            });

        return $expired;
    }

    /** Locks the customer row: changes to one wallet happen one at a time. */
    protected function lock(Customer|int $customer): int
    {
        $id = $customer instanceof Customer ? $customer->id : $customer;
        DB::table('commerce_customers')->where('id', $id)->lockForUpdate()->first();

        return $id;
    }

    /** Takes $points from the lots, the ones that expire first (then the oldest). */
    protected function consume(int $customerId, int $points): void
    {
        $lots = LoyaltyTransaction::query()->where('customer_id', $customerId)->where('remaining', '>', 0)
            ->orderByRaw('case when expires_at is null then 1 else 0 end')->orderBy('expires_at')->orderBy('id')->get();
        foreach ($lots as $lot) {
            if ($points <= 0) {
                break;
            }
            $part = min($points, $lot->remaining);
            LoyaltyTransaction::query()->whereKey($lot->id)->update(['remaining' => $lot->remaining - $part]);
            $points -= $part;
        }
    }
}
