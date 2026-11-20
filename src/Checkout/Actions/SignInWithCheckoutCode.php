<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Actions;

use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Sunrice\Commerce\Customers\Actions\AssignCustomerRole;
use Sunrice\Commerce\Customers\Auth\LoginCodes;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Support\Staff;

class SignInWithCheckoutCode
{
    public function __construct(
        private CheckoutCode $codes,
        private AssignCustomerRole $roles,
    ) {}

    public function handle(Request $request, string $code): bool
    {
        $email = $this->codes->verify($request, $code);
        if ($email === null) {
            return false;
        }

        $user = DB::transaction(fn () => $this->verifiedUser($email));
        if ($user === null) {
            return false;
        }

        Auth::guard(CurrentCustomer::guard())->login($user);
        $request->session()->regenerate();
        $request->session()->forget('url.intended');

        return true;
    }

    private function verifiedUser(string $email): (Model&Authenticatable)|null
    {
        $model = Staff::userModel();
        $user = $model::query()->where('email', $email)->first() ?? $model::query()->firstOrCreate(['email' => $email], [
            'name' => '',
            'password' => Hash::make(Str::random(64)),
        ]);

        if (LoginCodes::isRefusedStaff($user)) {
            return null;
        }

        if ($user->getAttribute('email_verified_at') === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        if ($user->wasRecentlyCreated) {
            $this->roles->handle($user);
            $customer = Customer::forUser($user);
            $customer->forceFill(['meta' => [...(array) $customer->meta, 'password_set' => false]])->save();
            DB::afterCommit(fn () => event(new Registered($user)));
        }

        return $user;
    }
}
