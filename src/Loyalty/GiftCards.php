<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Loyalty\Models\GiftCard;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Gift cards as loyalty points: a code (issued when a gift card product is
 * paid, or made by staff) that a customer with an account redeems once in
 * My Account → Points. Redeeming credits its value as points (1 point is 1
 * unit of the store's currency), which then pay at checkout like any points.
 *
 * Settings: loyalty.gift_card_valid_days (a code can be redeemed for so
 * many days; 0: any time) and loyalty.gift_card_points_expiry_days (the
 * points it adds expire after so many days; 0: never).
 */
class GiftCards
{
    /** Letters and digits people don't confuse (no 0/O, 1/I/L). */
    protected const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    public function __construct(protected StoreSettings $settings, protected Wallet $wallet) {}

    /** A new code: 12 characters, shown as ABCD-EFGH-JKLM. */
    public function code(): string
    {
        do {
            $code = '';
            for ($i = 0; $i < 12; $i++) {
                $code .= self::ALPHABET[random_int(0, strlen(self::ALPHABET) - 1)];
            }
        } while (GiftCard::query()->where('code', $code)->exists());

        return $code;
    }

    /** A code as typed ("abcd-efgh jklm"): capitals, no dashes or spaces. */
    public static function normalize(string $code): string
    {
        return strtoupper((string) preg_replace('/[^A-Za-z0-9]/', '', $code));
    }

    /** Make a gift card worth $value (minor units). */
    public function make(int $value, ?Order $order = null, ?OrderItem $item = null, ?string $note = null, ?int $userId = null, mixed $expiresAt = null): GiftCard
    {
        $days = (int) $this->settings->get('loyalty.gift_card_valid_days', 0);

        return GiftCard::query()->create([
            'code' => $this->code(), 'value' => $value, 'status' => GiftCard::ACTIVE,
            'expires_at' => $expiresAt ?? ($days > 0 ? now()->addDays($days)->endOfDay() : null),
            'order_id' => $order?->id, 'order_item_id' => $item?->id, 'note' => $note, 'user_id' => $userId,
        ]);
    }

    /**
     * The gift cards a paid order bought: one per unit of each gift card line, worth the
     * line's price before discounts. Once per line (a second call issues nothing).
     *
     * @return list<GiftCard> the new ones
     */
    public function issueFor(Order $order): array
    {
        return DB::transaction(function () use ($order): array {
            /** @var Order $locked */
            $locked = Order::withTrashed()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            $new = [];
            foreach ($locked->items()->whereNull('parent_id')->with('product')->get() as $item) {
                if (! ($item->product->gift_card ?? false) || GiftCard::query()->where('order_item_id', $item->id)->exists()) {
                    continue;
                }
                $value = max((int) $item->regular_unit_price, (int) $item->unit_price);
                for ($i = 0; $i < $item->quantity; $i++) {
                    $new[] = $this->make($value, $locked, $item);
                }
            }

            return $new;
        });
    }

    /** The order was cancelled or refunded: its gift cards not redeemed yet stop working. */
    public function disableFor(Order $order): int
    {
        return GiftCard::query()->where('order_id', $order->id)->where('status', GiftCard::ACTIVE)->update(['status' => GiftCard::DISABLED]);
    }

    /**
     * Redeem a code for a customer: its value as points, once.
     *
     * @throws ValidationException code: unknown, used, disabled or expired
     */
    public function redeem(Customer $customer, string $code): GiftCard
    {
        $code = self::normalize($code);

        return DB::transaction(function () use ($customer, $code): GiftCard {
            $card = GiftCard::query()->where('code', $code)->lockForUpdate()->first();
            if ($card === null || ! $card->redeemable()) {
                $reason = match (true) {
                    $card === null => 'unknown',
                    $card->status === GiftCard::REDEEMED => 'used',
                    $card->status === GiftCard::DISABLED => 'disabled',
                    default => 'expired',
                };
                throw ValidationException::withMessages(['code' => __("commerce::account.points.gift_card.{$reason}")]);
            }
            $days = (int) $this->settings->get('loyalty.gift_card_points_expiry_days', 0);
            $card->forceFill(['status' => GiftCard::REDEEMED, 'redeemed_by' => $customer->id, 'redeemed_at' => now()])->save();
            $this->wallet->credit($customer, $card->value, 'gift_card', note: $card->formatted(),
                expiresAt: $days > 0 ? now()->addDays($days)->endOfDay() : null, noExpiry: $days === 0);

            return $card;
        });
    }
}
