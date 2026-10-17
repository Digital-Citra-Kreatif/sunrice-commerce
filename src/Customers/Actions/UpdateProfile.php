<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Actions;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Customers\Notifications\VerifyCustomerEmail;
use Sunrice\Commerce\Support\Phone;

/** Name, phone, marketing consent and email (a new email must be verified again). */
class UpdateProfile
{
    /**
     * @param  array<string, mixed>  $input
     * @return bool whether a verification email was sent
     */
    public function handle(Authenticatable $user, Customer $customer, array $input): bool
    {
        $model = config('sunrice.auth.user_model');
        $data = Validator::make($input, [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', Rule::unique((new $model)->getTable(), 'email')->ignore($user->getAuthIdentifier())],
            'phone' => ['nullable', 'string', 'max:30'],
            'accepts_marketing' => ['nullable', 'boolean'],
        ])->validate();

        $email = mb_strtolower($data['email']);
        $changed = $email !== mb_strtolower((string) $user->getAttribute('email'));
        $user->forceFill(['name' => $data['name'], 'email' => $email, ...($changed ? ['email_verified_at' => null] : [])])->save();
        $consent = (bool) ($data['accepts_marketing'] ?? false);
        $customer->forceFill([
            'name' => $data['name'], 'email' => $email,
            'phone' => filled($data['phone'] ?? null) ? Phone::normalize($data['phone']) : null,
            'accepts_marketing' => $consent,
            'marketing_consent_at' => $consent ? ($customer->marketing_consent_at ?? now()) : null,
        ])->save();
        if ($changed) {
            $user->notify(new VerifyCustomerEmail(app()->getLocale()));
        }

        return $changed;
    }
}
