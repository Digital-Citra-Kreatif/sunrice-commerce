<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Customers\AccountNavigation;
use Sunrice\Commerce\Customers\Actions\RequestAccountDeletion;
use Sunrice\Commerce\Customers\Actions\SaveAddress;
use Sunrice\Commerce\Customers\Actions\UpdateProfile;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Address;
use Sunrice\Commerce\Storefront\Layout;

/** My Account: overview, profile, password, addresses, account deletion. */
class AccountController
{
    public function __construct(protected CurrentCustomer $current) {}

    public function overview(): View
    {
        return $this->page('overview', __('commerce::account.overview.title'), [
            'addresses' => $this->current->get()->addresses()->orderByDesc('default_shipping')->get(),
        ]);
    }

    public function profile(): View
    {
        return $this->page('profile', __('commerce::account.profile.title'), ['google' => DB::table('commerce_social_accounts')
            ->where('user_id', $this->current->user()?->getAuthIdentifier())->where('provider', 'google')->value('email')]);
    }

    public function updateProfile(Request $request, UpdateProfile $update): RedirectResponse
    {
        $sent = $update->handle($this->current->user(), $this->current->get(), $request->only(['name', 'email', 'phone', 'accepts_marketing']));

        return back()->with('commerce.success', __($sent ? 'commerce::account.profile.verify_new_email' : 'commerce::account.profile.saved'));
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $user = $this->current->user();
        $customer = $this->current->get();
        $data = $request->validate(['current_password' => ['nullable', 'string'], 'password' => ['required', 'confirmed', PasswordRule::min(8)]]);
        // Accounts made by code or Google set their first password without an old one.
        if (($customer->meta['password_set'] ?? true) !== false && ! Hash::check((string) ($data['current_password'] ?? ''), (string) $user->getAuthPassword())) {
            throw ValidationException::withMessages(['current_password' => __('commerce::account.password.current_wrong')]);
        }
        $user->forceFill(['password' => Hash::make($data['password'])])->save();
        $customer->forceFill(['meta' => [...(array) $customer->meta, 'password_set' => true]])->save();
        $request->session()->regenerate();

        return back()->with('commerce.success', __('commerce::account.password.saved'));
    }

    public function addresses(): View
    {
        return $this->page('addresses', __('commerce::account.addresses.title'), [
            'addresses' => $this->current->get()->addresses()->orderByDesc('default_shipping')->orderBy('id')->get(),
            'editing' => request()->filled('edit') ? $this->current->get()->addresses()->find((int) request('edit')) : null,
        ]);
    }

    public function storeAddress(Request $request, SaveAddress $save): RedirectResponse
    {
        $save->handle($this->current->get(), (array) $request->input('address', []));

        return redirect()->to(url()->previous())->with('commerce.success', __('commerce::account.addresses.saved'));
    }

    public function updateAddress(Request $request, int $address, SaveAddress $save): RedirectResponse
    {
        $model = Address::query()->where('customer_id', $this->current->get()->id)->findOrFail($address);
        $save->handle($this->current->get(), (array) $request->input('address', []), $model);

        return back()->with('commerce.success', __('commerce::account.addresses.saved'));
    }

    public function deleteAddress(int $address): RedirectResponse
    {
        Address::query()->where('customer_id', $this->current->get()->id)->findOrFail($address)->delete();

        return back()->with('commerce.success', __('commerce::account.addresses.deleted'));
    }

    public function requestDeletion(Request $request, RequestAccountDeletion $request_): RedirectResponse
    {
        $request->validate(['confirm' => ['accepted']]);
        $request_->handle($this->current->get());

        return back()->with('commerce.success', __('commerce::account.delete.requested'));
    }

    /** @param  array<string, mixed>  $data */
    protected function page(string $name, string $title, array $data = []): View
    {
        return view(Layout::view('account.'.$name), [
            ...$data,
            'customer' => $this->current->get(),
            'user' => $this->current->user(),
            'navigation' => app(AccountNavigation::class)->items(),
            'current' => $name,
            'seoTitle' => $title,
        ]);
    }
}
