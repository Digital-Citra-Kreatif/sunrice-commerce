<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Customers\Actions\SaveAddress;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Address;
use Sunrice\Commerce\Storefront\Layout;

/** My Account: landing page, profile, password, addresses, account deletion. */
class AccountController
{
    // Per request (the router keeps controller instances).
    protected function current(): CurrentCustomer
    {
        return app(CurrentCustomer::class);
    }

    public function addresses(Request $request): View
    {
        $addresses = $this->current()->get()->addresses();
        $editing = $request->filled('edit') ? (clone $addresses)->find((int) $request->input('edit')) : null;

        return $this->page('addresses', __('commerce::account.addresses.title'), [
            'addresses' => $addresses->orderByDesc('default_shipping')->orderBy('id')->get(),
            'editing' => $editing,
            'showAddressForm' => $editing !== null || $request->boolean('add'),
        ]);
    }

    public function storeAddress(Request $request, SaveAddress $save): RedirectResponse
    {
        $save->handle($this->current()->get(), (array) $request->input('address', []));

        return redirect()->to(commerce_url('commerce.account.addresses'))->with('commerce.success', __('commerce::account.addresses.saved'));
    }

    public function updateAddress(Request $request, int $address, SaveAddress $save): RedirectResponse
    {
        $model = Address::query()->where('customer_id', $this->current()->get()->id)->findOrFail($address);
        $save->handle($this->current()->get(), (array) $request->input('address', []), $model);

        return redirect()->to(commerce_url('commerce.account.addresses'))->with('commerce.success', __('commerce::account.addresses.saved'));
    }

    public function deleteAddress(int $address): RedirectResponse
    {
        Address::query()->where('customer_id', $this->current()->get()->id)->findOrFail($address)->delete();

        return back()->with('commerce.success', __('commerce::account.addresses.deleted'));
    }

    /** @param  array<string, mixed>  $data */
    public function page(string $name, string $title, array $data = []): View
    {
        return view(Layout::view('account.'.$name), [
            ...$data,
            'customer' => $this->current()->get(),
            'user' => $this->current()->user(),
            'seoTitle' => $title,
        ]);
    }
}
