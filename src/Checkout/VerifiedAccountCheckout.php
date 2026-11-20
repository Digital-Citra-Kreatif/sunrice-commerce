<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Who can check out (Settings → Checkout → Who can check out, `checkout.access`):
 *
 * - `guest`: anyone, as a guest or signed in;
 * - `guest_verified`: anyone, after confirming their email with an emailed
 *   code. The order stays a guest order unless the shopper is signed in or
 *   asks for an account (`checkout.create_account`);
 * - `account`: only signed-in customers;
 * - `verified_account`: only customers with a verified account; the emailed
 *   code signs in to the account for that email or creates it.
 *
 * Stores saved before `checkout.access` existed keep their behaviour: it is
 * read from `require_verified_account` and `guest_checkout`.
 */
class VerifiedAccountCheckout
{
    public const MODES = ['guest', 'guest_verified', 'account', 'verified_account'];

    /** Where a code-confirmed guest email is kept for the session. */
    public const SESSION_EMAIL = 'checkout_access.verified_email';

    public function __construct(private StoreSettings $settings) {}

    public function mode(): string
    {
        $stored = (array) ($this->settings->stored()['checkout'] ?? []);
        $mode = $stored['access'] ?? null;
        if (! in_array($mode, self::MODES, true)) {
            $mode = match (true) {
                (bool) $this->settings->get('checkout.require_verified_account', false) => 'verified_account',
                ! $this->settings->get('checkout.guest_checkout', true) => 'account',
                default => 'guest',
            };
        }

        // Without the Accounts module no account can be made: the code confirms the email only.
        return $mode === 'verified_account' && ! commerce_feature('accounts') ? 'guest_verified' : $mode;
    }

    /** A verified account is required: the code signs in or creates one. */
    public function required(): bool
    {
        return $this->mode() === 'verified_account';
    }

    /** Checkout waits for an emailed code (or a verified signed-in customer). */
    public function codeRequired(): bool
    {
        return in_array($this->mode(), ['guest_verified', 'verified_account'], true);
    }

    /** Shoppers who aren't signed in may place orders. */
    public function guestAllowed(): bool
    {
        return in_array($this->mode(), ['guest', 'guest_verified'], true);
    }

    /** The signed-in customer, when their email is verified. */
    public function user(): (Model&Authenticatable)|null
    {
        $user = commerce_customer();

        return $user instanceof Model && $user->getAttribute('email_verified_at') !== null
            && filled($user->getAttribute('email')) ? $user : null;
    }

    /**
     * The email this shopper has confirmed: a verified signed-in customer's,
     * or (in `guest_verified`) the one confirmed with a code this session.
     */
    public function verifiedEmail(): ?string
    {
        if (($user = $this->user()) !== null) {
            return (string) $user->getAttribute('email');
        }
        if ($this->mode() !== 'guest_verified' || ! app()->bound('request') || ! request()->hasSession()) {
            return null;
        }
        $email = request()->session()->get(self::SESSION_EMAIL);

        return is_string($email) && $email !== '' ? $email : null;
    }
}
