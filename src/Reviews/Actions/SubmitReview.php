<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Actions;

use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Reviews\Events\ReviewSubmitted;
use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * A review from the product page. Who may write one and whether it shows
 * at once follow Settings → Store → Catalog: `reviews_who` (everyone,
 * customers, buyers) and `reviews_approval` (manual, buyers, none). A
 * customer reviews a product once; writing again replaces the review
 * and sends it back for approval.
 */
class SubmitReview
{
    public function __construct(protected StoreSettings $settings) {}

    /**
     * @param  array{name?: string|null, email?: string|null, rating: int, title?: string|null, body: string}  $input
     *
     * @throws ValidationException
     */
    public function handle(Product $product, array $input, ?Customer $customer, ?string $ip = null): Review
    {
        $who = (string) $this->settings->get('catalog.reviews_who', 'everyone');
        $order = $customer === null ? null : $this->purchase($product, $customer);
        if ($who !== 'everyone' && $customer === null) {
            throw ValidationException::withMessages(['review' => __('commerce::storefront.reviews.sign_in')]);
        }
        if ($who === 'buyers' && $order === null) {
            throw ValidationException::withMessages(['review' => __('commerce::storefront.reviews.buyers_only')]);
        }

        $approval = (string) $this->settings->get('catalog.reviews_approval', 'manual');
        $approved = $approval === 'none' || ($approval === 'buyers' && $order !== null);
        $attributes = [
            'name' => $customer->name ?? trim((string) ($input['name'] ?? '')),
            'email' => ($email = $customer->email ?? ($input['email'] ?? null)) === null ? null : mb_strtolower(trim($email)),
            'order_id' => $order?->id,
            'rating' => $input['rating'],
            'title' => ($input['title'] ?? '') !== '' ? $input['title'] : null,
            'body' => $input['body'],
            'locale' => app()->getLocale(),
            'status' => $approved ? 'approved' : 'pending',
            'ip_address' => $ip,
        ];
        $review = $customer !== null ? $this->replace($product, $customer, $attributes) : Review::query()->create(['product_id' => $product->id, ...$attributes]);
        ProductRating::refresh($product->id);
        ReviewSubmitted::dispatch($review);

        return $review;
    }

    /**
     * The customer's review of the product, created or replaced. Two first
     * reviews sent at once meet the unique index: the second replaces the first.
     *
     * @param  array<string, mixed>  $attributes
     */
    protected function replace(Product $product, Customer $customer, array $attributes): Review
    {
        $keys = ['product_id' => $product->id, 'customer_id' => $customer->id];
        try {
            // In a transaction (a savepoint when one is open), so PostgreSQL can go on after the violation.
            return DB::transaction(fn () => Review::query()->updateOrCreate($keys, $attributes));
        } catch (UniqueConstraintViolationException) {
            return Review::query()->updateOrCreate($keys, $attributes);
        }
    }

    /** The customer's latest order with this product that went through (verified purchase). */
    public function purchase(Product $product, Customer $customer): ?Order
    {
        return Order::query()->where('customer_id', $customer->id)->where('type', 'order')
            ->whereIn('status', [OrderStatus::PROCESSING, OrderStatus::COMPLETED])
            ->whereHas('items', fn ($q) => $q->where('product_id', $product->id))
            ->latest('id')->first();
    }
}
