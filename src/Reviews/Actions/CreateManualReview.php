<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Actions;

use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Reviews\ReviewablePurchase;
use Sunrice\Commerce\Support\ActivityRecorder;

/** Record a review a buyer shared with the store, using their qualifying order. */
final class CreateManualReview
{
    /** @param array{rating: int, title?: string|null, body: string, status: string} $content */
    public function handle(Product $product, string $number, array $content): Review
    {
        $order = ReviewablePurchase::forProduct($product)->where('number', $number)->first();
        $customer = $order?->customer;
        if ($order === null || $customer === null || $customer->anonymized_at !== null) {
            throw ValidationException::withMessages(['values.order_number' => 'Enter a paid order for this product with a customer record.']);
        }

        $review = Review::query()->createOrFirst(['product_id' => $product->id, 'customer_id' => $customer->id], [
            ...$content,
            'order_id' => $order->id,
            'name' => $customer->name ?: ($order->customer_name ?: __('commerce::storefront.reviews.buyer')),
            'email' => $customer->email,
            'locale' => $order->locale ?? app()->getLocale(),
        ]);
        if (! $review->wasRecentlyCreated) {
            throw ValidationException::withMessages(['values.order_number' => 'This buyer already reviewed the product. Edit their existing review.']);
        }

        ProductRating::refresh($product->id);
        app(ActivityRecorder::class)->record('created', "Review #{$review->id}", [], 'reviews');

        return $review;
    }
}
