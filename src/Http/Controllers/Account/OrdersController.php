<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Http\Controllers\Storefront\OrderController;
use Sunrice\Commerce\Orders\Actions\CancelOrderByCustomer;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Returns\Actions\RequestReturn;
use Sunrice\Commerce\Returns\Models\ReturnRequest;
use Sunrice\Commerce\Returns\Returns;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/**
 * My Account → Orders (and Quotes): the signed-in customer's own orders,
 * linked guest orders included once their email is verified; the order
 * page, buy again and cancel.
 */
class OrdersController
{
    protected function current(): CurrentCustomer
    {
        return app(CurrentCustomer::class);
    }

    public function index(Request $request, AccountController $account): View
    {
        return $this->list($account, 'order', 'orders');
    }

    public function quotes(Request $request, AccountController $account): View
    {
        return $this->list($account, 'quote', 'quotes');
    }

    public function show(Request $request, int $order, AccountController $account, OrderController $orders): View
    {
        $model = $this->own($order);

        $returns = app(Returns::class);

        return $account->page('order', __('commerce::checkout.order.title', ['number' => $model->displayNumber()]), [
            ...$orders->data($request, $model),
            'current' => $model->isQuote() ? 'quotes' : 'orders',
            // The Returns module: requests made, and what may still be returned (null when nothing).
            'returns' => commerce_feature('returns') ? ReturnRequest::query()->where('order_id', $model->id)->with('items')->latest('id')->get() : collect(),
            'returnable' => $returns->open($model) ? $returns->returnable($model) : null,
        ]);
    }

    public function buyAgain(int $order, AddToCart $add): RedirectResponse
    {
        $model = $this->own($order);
        $added = 0;
        $missing = [];
        $full = null;
        foreach ($model->items()->whereNull('parent_id')->get() as $item) {
            try {
                if ($item->variant_id === null) {
                    throw new CartException('');
                }
                $add->handle($item->variant_id, $item->quantity);
                $added++;
            } catch (CartException $e) {
                if ($e->reason === 'cart_full') {
                    $full = $e->getMessage();
                    break;
                }
                $missing[] = $item->title();
            }
        }
        $error = $full ?? __('commerce::account.orders.unavailable', ['products' => implode(', ', $missing)]);
        $redirect = redirect(StorefrontRoutes::url('commerce.cart'));
        if ($full !== null || $missing !== []) {
            $redirect->with('commerce.error', $error);
        }

        return $added > 0 ? $redirect->with('commerce.success', __('commerce::account.orders.added_again')) : back()->with('commerce.error', $error);
    }

    /** POST orders/{order}/returns: ask to return items (the Returns module, within the return window). */
    public function requestReturn(Request $request, int $order, RequestReturn $returns): RedirectResponse
    {
        $model = $this->own($order);
        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*' => ['nullable', 'integer', 'min:0'],
            'reason' => ['required', Rule::in(ReturnRequest::REASONS)],
            'details' => ['nullable', 'string', 'max:2000'],
        ]);
        $returns->handle($model, $data['items'], $data['reason'], $data['details'] ?? null, Actor::customer($request->user()));

        return back()->with('commerce.success', __('commerce::account.returns.requested'));
    }

    public function cancel(Request $request, int $order, CancelOrderByCustomer $cancel): RedirectResponse
    {
        $model = $this->own($order);
        try {
            $cancel->handle($model, $request->string('reason')->limit(250)->toString() ?: null);
        } catch (InvalidTransition $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return back()->with('commerce.success', __('commerce::checkout.order.cancelled'));
    }

    public function downloads(AccountController $account): View
    {
        $grants = DownloadGrant::query()->with(['file', 'item', 'order'])
            ->whereHas('order', fn ($q) => $q->where('user_id', $this->current()->user()?->getAuthIdentifier()))
            ->latest('id')->get();

        return $account->page('downloads', __('commerce::digital.title'), ['grants' => $grants]);
    }

    protected function list(AccountController $account, string $type, string $page): View
    {
        $orders = Order::query()->where('user_id', $this->current()->user()?->getAuthIdentifier())->where('type', $type)
            ->latest('placed_at')->latest('id')->paginate(10);

        return $account->page($page, __('commerce::account.orders.'.($type === 'quote' ? 'quotes' : 'title')), ['orders' => $orders, 'type' => $type]);
    }

    /** One of the signed-in customer's orders (404 for anyone else's). */
    protected function own(int $id): Order
    {
        $order = Order::query()->whereKey($id)->where('user_id', $this->current()->user()?->getAuthIdentifier())->first();
        abort_if($order === null, 404);

        return $order;
    }
}
