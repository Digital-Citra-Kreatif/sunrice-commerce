<?php

declare(strict_types=1);

namespace Sunrice\Commerce\GiftCards\Actions;

use Carbon\CarbonInterface;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\GiftCards\Models\GiftCard;
use Sunrice\Commerce\GiftCards\Models\GiftCardTransaction;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\MoneyFormatter;

/** Staff issue a gift card (Shop → Promotions → Gift cards); its code is emailed to the recipient, when given. */
class IssueGiftCard
{
    /** Letters and digits that can't be read as one another (no 0/O, 1/I/L). */
    protected const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    public function __construct(protected StoreSettings $settings, protected Notifier $notifier, protected MoneyFormatter $money) {}

    public function handle(int $amount, ?string $code = null, ?CarbonInterface $expiresAt = null, ?string $recipient = null, ?string $note = null, ?int $userId = null): GiftCard
    {
        $card = null;
        // A generated code that happens to exist already gets another one (a savepoint each, for PostgreSQL).
        for ($attempt = 0; $card === null; $attempt++) {
            try {
                $card = DB::transaction(fn (): GiftCard => $this->create($amount, $code ?? self::code(), $expiresAt, $recipient, $note, $userId));
            } catch (UniqueConstraintViolationException $e) {
                if ($code !== null || $attempt >= 4) {
                    throw $e;
                }
            }
        }
        if ($card->recipient_email !== null) {
            $this->notifier->sendTo('gift_card_issued', $card->recipient_email, Locales::default(), null, [
                'code' => $card->code, 'amount' => $this->money->format($card->balance), 'expires' => $card->expires_at?->isoFormat('D MMMM YYYY'), 'url' => url('/'),
            ]);
        }

        return $card;
    }

    /** A random code: four groups of four, like ABCD-EFGH-JKMN-PQRS. */
    public static function code(): string
    {
        $chars = '';
        for ($i = 0; $i < 16; $i++) {
            $chars .= self::ALPHABET[random_int(0, strlen(self::ALPHABET) - 1)];
        }

        return implode('-', str_split($chars, 4));
    }

    protected function create(int $amount, string $code, ?CarbonInterface $expiresAt, ?string $recipient, ?string $note, ?int $userId): GiftCard
    {
        $card = GiftCard::query()->create([
            'code' => mb_strtoupper(trim($code)), 'initial_amount' => $amount, 'balance' => $amount,
            'currency' => (string) $this->settings->get('general.currency.code', 'IDR'),
            'expires_at' => $expiresAt, 'recipient_email' => $recipient !== null ? mb_strtolower(trim($recipient)) : null, 'note' => $note,
        ]);
        GiftCardTransaction::query()->create(['gift_card_id' => $card->id, 'kind' => 'issue', 'amount' => $amount, 'user_id' => $userId]);

        return $card;
    }
}
