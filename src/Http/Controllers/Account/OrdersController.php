<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Sunrice\Commerce\Analytics\Day;
use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Http\Controllers\Storefront\OrderController;
use Sunrice\Commerce\Orders\Actions\CancelOrderByCustomer;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderCategoryFilter;
use Sunrice\Commerce\Orders\OrderStatus;
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

    public function index(Request $request, AccountController $account, OrderCategoryFilter $categories): View
    {
        $orders = $this->customerOrders('order');
        $options = $categories->options($orders);
        $input = Arr::only($request->query(), ['q', 'status', 'category', 'date_from', 'date_to']);
        $validator = Validator::make($input, [
            'q' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', Rule::in(OrderStatus::ORDER_STATUSES)],
            'category' => ['nullable', 'integer', Rule::in(array_keys($options))],
            'date_from' => ['nullable', 'date_format:Y-m-d'],
            'date_to' => ['nullable', 'date_format:Y-m-d', Rule::when($request->filled('date_from'), 'after_or_equal:date_from')],
        ], [
            'q.string' => __('commerce::account.orders.filters.invalid_search'),
            'q.max' => __('commerce::account.orders.filters.invalid_search'),
            'status.in' => __('commerce::account.orders.filters.invalid_status'),
            'category.integer' => __('commerce::account.orders.filters.invalid_category'),
            'category.in' => __('commerce::account.orders.filters.invalid_category'),
            'date_from.date_format' => __('commerce::account.orders.filters.invalid_from'),
            'date_to.date_format' => __('commerce::account.orders.filters.invalid_to'),
            'date_to.after_or_equal' => __('commerce::account.orders.filters.invalid_range'),
        ]);
        $filters = array_filter($validator->valid(), fn (mixed $value): bool => $value !== null && $value !== '');
        if (isset($filters['q'])) {
            $like = '%'.str_replace(['!', '%', '_'], ['!!', '!%', '!_'], mb_strtolower($filters['q'])).'%';
            $orders->where(fn (Builder $query) => $query
                ->whereRaw("LOWER(number) LIKE ? ESCAPE '!'", [$like])
                ->orWhereRaw("LOWER(quote_number) LIKE ? ESCAPE '!'", [$like])
                ->orWhereHas('items', fn (Builder $items) => $items->whereRaw("LOWER(name) LIKE ? ESCAPE '!'", [$like])));
        }
        if (isset($filters['status'])) {
            $orders->where('status', $filters['status']);
        }
        if (isset($filters['category'])) {
            $categories->apply($orders, $options[$filters['category']]['terms']);
        }
        if (isset($filters['date_from'])) {
            $orders->where('placed_at', '>=', Day::bounds($filters['date_from'])[0]);
        }
        if (isset($filters['date_to'])) {
            $orders->where('placed_at', '<', Day::bounds($filters['date_to'])[1]);
        }

        return $account->page('orders', __('commerce::account.orders.title'), [
            'orders' => $orders->paginate(10)->appends($filters),
            'type' => 'order',
            'orderFilters' => array_filter($input, 'is_string'),
            'orderCategories' => array_map(fn (array $option): string => $option['label'], $options),
            'orderFilterErrors' => $validator->errors(),
            'filtersActive' => $filters !== [],
        ]);
    }

    public function quotes(Request $request, AccountController $account): View
    {
        return $account->page('quotes', __('commerce::account.orders.quotes'), [
            'orders' => $this->customerOrders('quote')->paginate(10),
            'type' => 'quote',
        ]);
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

    /** @return Builder<Order> */
    protected function customerOrders(string $type): Builder
    {
        return Order::query()->where('user_id', $this->current()->user()?->getAuthIdentifier())->where('type', $type)
            ->latest('placed_at')->latest('id');
    }

    /** One of the signed-in customer's orders (404 for anyone else's). */
    protected function own(int $id): Order
    {
        $order = Order::query()->whereKey($id)->where('user_id', $this->current()->user()?->getAuthIdentifier())->first();
        abort_if($order === null, 404);

        return $order;
    }
}
