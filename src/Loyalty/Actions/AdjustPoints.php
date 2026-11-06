<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Actions;

use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Loyalty\Wallet;

/** Staff add points to a customer's wallet or take them away, with a note. */
class AdjustPoints
{
    public function __construct(protected Wallet $wallet) {}

    /** @throws ValidationException */
    public function handle(Customer $customer, int $points, ?string $note, ?int $userId): void
    {
        if ($points > 0) {
            $this->wallet->credit($customer, $points, 'adjust', null, $note, $userId);
        } elseif ($points < 0 && $this->wallet->debit($customer, -$points, 'adjust', null, $note, $userId) === 0) {
            throw ValidationException::withMessages(['values.points' => 'The balance can\'t go below zero.']);
        }
    }
}
