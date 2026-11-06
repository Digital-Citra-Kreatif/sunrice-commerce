<?php

declare(strict_types=1);

namespace Sunrice\Commerce\GiftCards\Actions;

use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\GiftCards\Models\GiftCard;
use Sunrice\Commerce\GiftCards\Models\GiftCardTransaction;

/** Staff switch a gift card off or on, change its expiry and note, and add to or take from its balance. */
class UpdateGiftCard
{
    /** @throws ValidationException */
    public function handle(GiftCard $card, bool $disabled, ?CarbonInterface $expiresAt, ?string $note, int $adjust = 0, ?int $userId = null): GiftCard
    {
        DB::transaction(function () use ($card, $disabled, $expiresAt, $note, $adjust, $userId): void {
            // Locked: an order taking from the card at the same time can't take it below zero with this.
            /** @var GiftCard $locked */
            $locked = GiftCard::query()->whereKey($card->id)->lockForUpdate()->firstOrFail();
            if ($locked->balance + $adjust < 0) {
                throw ValidationException::withMessages(['values.adjust' => 'The balance can\'t go below zero.']);
            }
            $locked->update([
                'disabled_at' => $disabled ? ($locked->disabled_at ?? now()) : null,
                'expires_at' => $expiresAt, 'note' => $note, 'balance' => $locked->balance + $adjust,
            ]);
            if ($adjust !== 0) {
                GiftCardTransaction::query()->create(['gift_card_id' => $locked->id, 'kind' => 'adjust', 'amount' => $adjust, 'user_id' => $userId]);
            }
            $card->setRawAttributes($locked->getAttributes(), true);
        });

        return $card;
    }
}
