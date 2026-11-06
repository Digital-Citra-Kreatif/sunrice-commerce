<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Contracts\View\View;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Loyalty\Models\LoyaltyTransaction;
use Sunrice\Commerce\Settings\StoreSettings;

/** My Account → Points: the balance, how points are earned and the history. */
class PointsController
{
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
        ]);
    }
}
