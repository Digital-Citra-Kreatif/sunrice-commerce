<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Closure;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * Which orders a staff member may see in the admin (Commerce::scopeAdminOrders()):
 * a branch's staff only their branch's, say. Every scope registered narrows
 * the orders list and its export and bulk actions, the dashboard's recent
 * orders, a customer's orders and the payment confirmations; an order
 * outside it is "not found" on its own pages.
 */
final class AdminOrderScopes
{
    /** @var list<Closure(Builder<Order>, Authenticatable): void> */
    protected array $scopes = [];

    /** @param  Closure(Builder<Order>, Authenticatable): void  $scope */
    public function register(Closure $scope): void
    {
        $this->scopes[] = $scope;
    }

    /**
     * @template TBuilder of Builder<Order>
     *
     * @param  TBuilder  $orders
     * @return TBuilder
     */
    public function apply(Builder $orders, ?Authenticatable $user = null): Builder
    {
        $user ??= auth()->user();
        if ($user !== null) {
            foreach ($this->scopes as $scope) {
                $scope($orders, $user);
            }
        }

        return $orders;
    }

    public function scoped(): bool
    {
        return $this->scopes !== [];
    }

    public function allows(Order|int $order, ?Authenticatable $user = null): bool
    {
        if ($this->scopes === []) {
            return true;
        }
        $id = $order instanceof Order ? $order->id : $order;

        return $this->apply(Order::withTrashed()->whereKey($id), $user)->exists();
    }
}
