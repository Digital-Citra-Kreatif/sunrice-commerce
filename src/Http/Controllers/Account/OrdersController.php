<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Http\Controllers\Storefront\OrderController;
use Sunrice\Commerce\Orders\Actions\CancelOrderByCustomer;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/**
 * My Account → Orders (and Quotes): the signed-in customer's own orders,
 * linked guest orders included once their email is verified; the order
 * page, buy again and cancel.
 */
class OrdersController
{
    protected CurrentCustomer $current {
        get => app(CurrentCustomer::class);
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

        return $account->page('order', __('commerce::checkout.order.title', ['number' => $model->displayNumber()]), [
            ...$orders->data($request, $model),
            'current' => $model->isQuote() ? 'quotes' : 'orders',
        ]);
    }

    public function buyAgain(int $order, AddToCart $add): RedirectResponse
    {
        $model = $this->own($order);
        $added = 0;
        $missing = [];
        foreach ($model->items()->whereNull('parent_id')->get() as $item) {
            try {
                if ($item->variant_id === null) {
                    throw new CartException('');
                }
                $add->handle($item->variant_id, $item->quantity);
                $added++;
            } catch (CartException) {
                $missing[] = $item->title();
            }
        }
        $redirect = redirect(StorefrontRoutes::url('commerce.cart'));
        if ($missing !== []) {
            $redirect->with('commerce.error', __('commerce::account.orders.unavailable', ['products' => implode(', ', $missing)]));
        }

        return $added > 0 ? $redirect->with('commerce.success', __('commerce::account.orders.added_again')) : back()->with('commerce.error', __('commerce::account.orders.unavailable', ['products' => implode(', ', $missing)]));
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

    protected function list(AccountController $account, string $type, string $page): View
    {
        $orders = Order::query()->where('user_id', $this->current->user()?->getAuthIdentifier())->where('type', $type)
            ->latest('placed_at')->latest('id')->paginate(10);

        return $account->page($page, __('commerce::account.orders.'.($type === 'quote' ? 'quotes' : 'title')), ['orders' => $orders, 'type' => $type]);
    }

    /** One of the signed-in customer's orders (404 for anyone else's). */
    protected function own(int $id): Order
    {
        $order = Order::query()->whereKey($id)->where('user_id', $this->current->user()?->getAuthIdentifier())->first();
        abort_if($order === null, 404);

        return $order;
    }
}
