<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Loyalty\GiftCards;
use Sunrice\Commerce\Loyalty\Models\LoyaltyTransaction;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Sunrice\Commerce\Support\MoneyFormatter;

/** My Account → Points: the balance, how points are earned, the history and redeeming a gift card. */
class PointsController
{
    /** A gift card code becomes points (GiftCards::redeem). */
    public function redeem(Request $request, GiftCards $cards, MoneyFormatter $money): RedirectResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:40']]);
        $customer = app(CurrentCustomer::class)->get();
        abort_if($customer === null, 403);
        $card = $cards->redeem($customer, $data['code']);

        return redirect(StorefrontRoutes::url('commerce.account.points'))
            ->with('commerce.success', __('commerce::account.points.gift_card.redeemed', ['points' => number_format($card->value, 0, ',', '.'), 'value' => $money->format($card->value)]));
    }

    public function index(AccountController $account, StoreSettings $settings): View
    {
        $customer = app(CurrentCustomer::class)->get();
        $history = $customer === null ? collect() : LoyaltyTransaction::query()->with('order')->where('customer_id', $customer->id)->latest('id')->limit(50)->get();
        $expiring = $customer === null ? null : LoyaltyTransaction::query()->where('customer_id', $customer->id)->where('remaining', '>', 0)
            ->whereNotNull('expires_at')->orderBy('expires_at')->first();

        return $account->page('points', __('commerce::account.points.title'), [
            'balance' => (int) ($customer->loyalty_points ?? 0),
            'history' => $history,
            'expiring' => $expiring,
            'percent' => (float) $settings->get('loyalty.earn_percent', 0),
            'max' => (int) $settings->get('loyalty.max_points', 0),
        ]);
    }
}
