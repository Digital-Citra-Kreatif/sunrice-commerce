<?php

declare(strict_types=1);

namespace Sunrice\Commerce\GiftCards\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Stored value spent at checkout with its code: it lowers what is left
 * to pay after tax (GiftCards\GiftCards), its balance is taken when the
 * order is placed and given back when the order is cancelled.
 *
 * @property int $id
 * @property string $code uppercase
 * @property int $initial_amount
 * @property int $balance
 * @property string $currency
 * @property Carbon|null $expires_at
 * @property Carbon|null $disabled_at
 * @property string|null $recipient_email
 * @property string|null $note
 * @property Carbon|null $created_at
 * @property-read Collection<int, GiftCardTransaction> $transactions
 */
class GiftCard extends Model
{
    protected $table = 'commerce_gift_cards';

    protected $guarded = ['id'];

    protected $casts = [
        'initial_amount' => 'integer',
        'balance' => 'integer',
        'expires_at' => 'datetime',
        'disabled_at' => 'datetime',
    ];

    /** @return HasMany<GiftCardTransaction, $this> */
    public function transactions(): HasMany
    {
        return $this->hasMany(GiftCardTransaction::class);
    }

    /** Can be spent now: switched on and not expired (the balance aside). */
    public function usable(): bool
    {
        return $this->disabled_at === null && ($this->expires_at === null || $this->expires_at->isFuture());
    }

    /** The code with all but the last four characters hidden, for places customers see. */
    public function masked(): string
    {
        return str_repeat('•', max(0, strlen($this->code) - 4)).substr($this->code, -4);
    }
}
