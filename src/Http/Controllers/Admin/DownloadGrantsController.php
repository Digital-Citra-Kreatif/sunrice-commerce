<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Digital\Actions\ManageGrant;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;

/** The order page's downloads panel: resend, extend, reset the count, revoke. */
class DownloadGrantsController extends Controller
{
    public function update(Request $request, Order $order, DownloadGrant $grant, ManageGrant $manage): RedirectResponse
    {
        $this->authorize('commerce.orders.edit');
        abort_unless($grant->order_id === $order->id, 404);
        $data = $request->validate(['action' => ['required', 'in:extend,reset,revoke,resend'], 'days' => ['nullable', 'integer', 'min:1', 'max:3650'], 'limit' => ['nullable', 'integer', 'min:1']]);
        $actor = Actor::admin($request->user());
        match ((string) $data['action']) {
            'extend' => $manage->extend($grant, (int) ($data['days'] ?? 7), $actor),
            'reset' => $manage->reset($grant, isset($data['limit']) ? (int) $data['limit'] : null, $actor),
            'revoke' => $manage->revoke($grant, $actor),
            default => $manage->resend($grant, $actor),
        };

        return back()->with('success', 'Download updated.');
    }
}
