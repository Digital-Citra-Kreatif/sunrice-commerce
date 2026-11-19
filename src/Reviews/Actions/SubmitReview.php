<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Actions;

use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Reviews\Events\ReviewSubmitted;
use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Reviews\ReviewablePurchase;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * A review from a verified buyer. Writing again replaces the customer's
 * existing review and checks the store's approval setting again.
 */
class SubmitReview
{
    public function __construct(protected StoreSettings $settings) {}

    /**
     * @param  array{rating: int, title?: string|null, body: string}  $input
     *
     * @throws ValidationException
     */
    public function handle(Product $product, array $input, ?Customer $customer, ?string $ip = null): Review
    {
        if ($customer === null) {
            throw ValidationException::withMessages(['review' => __('commerce::storefront.reviews.sign_in')]);
        }
        $order = $this->purchase($product, $customer);
        if ($order === null) {
            throw ValidationException::withMessages(['review' => __('commerce::storefront.reviews.buyers_only')]);
        }

        $approval = (string) $this->settings->get('catalog.reviews_approval', 'manual');
        $approved = in_array($approval, ['none', 'buyers'], true);
        $attributes = [
            'name' => $customer->name ?: ($order->customer_name ?: __('commerce::storefront.reviews.buyer')),
            'email' => mb_strtolower(trim($customer->email)),
            'order_id' => $order->id,
            'rating' => $input['rating'],
            'title' => ($input['title'] ?? '') !== '' ? $input['title'] : null,
            'body' => $input['body'],
            'locale' => app()->getLocale(),
            'status' => $approved ? 'approved' : 'pending',
            // A replaced review starts without the store's reply to the old one.
            'reply' => null,
            'replied_at' => null,
            'ip_address' => $ip,
        ];
        $review = $this->replace($product, $customer, $attributes);
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
        return ReviewablePurchase::forProduct($product)->where('customer_id', $customer->id)
            ->latest('id')->first();
    }
}
