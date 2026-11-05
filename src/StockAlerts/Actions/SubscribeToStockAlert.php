<?php

declare(strict_types=1);

namespace Sunrice\Commerce\StockAlerts\Actions;

use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\StockAlerts\Models\StockAlert;

/** Ask to be emailed when a sold-out variant can be bought again (once per address and variant). */
class SubscribeToStockAlert
{
    /** @throws ValidationException */
    public function handle(Variant $variant, string $email, ?Customer $customer = null): StockAlert
    {
        if (! $variant->active || $variant->stock_status !== 'out_of_stock' || $variant->product->removed_at !== null) {
            throw ValidationException::withMessages(['variant' => __('commerce::storefront.stock_alert.available')]);
        }

        $keys = ['variant_id' => $variant->id, 'email' => mb_strtolower(trim($email))];
        $values = ['product_id' => $variant->product_id, 'customer_id' => $customer?->id, 'locale' => app()->getLocale(), 'notified_at' => null];
        try {
            // In a transaction (a savepoint when one is open), so PostgreSQL can go on after the violation.
            return DB::transaction(fn () => StockAlert::query()->updateOrCreate($keys, $values));
        } catch (UniqueConstraintViolationException) {
            // The same address asked twice at once: the other request made the row.
            return StockAlert::query()->updateOrCreate($keys, $values);
        }
    }
}
