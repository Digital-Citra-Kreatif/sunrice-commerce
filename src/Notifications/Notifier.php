<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Support\Locales;

/**
 * Sends a store email (ARCHITECTURE.md §19): checks the module and the
 * email's switch, finds the recipients (the customer, or the staff
 * addresses plus users with the chosen roles), sends one email each in
 * their language, and notes order emails on the timeline.
 */
class Notifier
{
    public function __construct(protected Emails $emails, protected EmailSettings $settings, protected Features $features, protected Timeline $timeline) {}

    /**
     * @param  array<string, mixed>  $context
     * @return int how many were sent
     */
    public function send(string $key, Order|Customer|Variant|null $subject = null, array $context = []): int
    {
        $email = $this->emails->get($key);
        if ($email === null || ($email->feature !== null && ! $this->features->active($email->feature)) || ! $this->settings->enabled($key)) {
            return 0;
        }
        $order = $subject instanceof Order ? $subject : null;
        $customer = $subject instanceof Customer ? $subject : $order?->customer;
        $variant = $subject instanceof Variant ? $subject : null;

        $recipients = $email->audience === 'staff' ? $this->staff($key) : $this->customerRecipient($order, $customer);
        foreach ($recipients as $address => $locale) {
            Notification::route('mail', $address)->notify(
                (new StoreEmail($key, $order, $customer, $variant, $context, $locale))->locale($locale)
            );
        }
        if ($order !== null && $recipients !== []) {
            $this->timeline->record($order, 'email', __('commerce::emails.sent', ['email' => $email->label]), ['email' => $key, 'to' => array_keys($recipients)],
                Actor::system(), $email->audience === 'customer' ? 'customer' : 'internal');
        }

        return count($recipients);
    }

    /** @return array<string, string> email => locale */
    protected function customerRecipient(?Order $order, ?Customer $customer): array
    {
        $address = $order->email ?? $customer?->email;
        if ($address === null || ! filter_var($address, FILTER_VALIDATE_EMAIL) || str_ends_with($address, '@invalid.local')) {
            return [];
        }

        return [mb_strtolower($address) => (string) ($order->locale ?? ($customer !== null ? $customer->locale : null) ?? Locales::main())];
    }

    /** @return array<string, string> email => locale */
    protected function staff(string $key): array
    {
        $out = [];
        foreach ($this->settings->addresses($key) as $address) {
            $out[$address] = Locales::main();
        }
        $roles = Role::query()->whereIn('name', $this->settings->roles($key))->pluck('name')->all();
        if ($roles !== []) {
            $model = (string) config('sunrice.auth.user_model');
            foreach ($model::query()->role($roles)->get() as $user) {
                $mail = mb_strtolower((string) $user->getAttribute('email'));
                if ($mail !== '' && ! isset($out[$mail])) {
                    $out[$mail] = Locales::main();
                }
            }
        }

        return $out;
    }
}
