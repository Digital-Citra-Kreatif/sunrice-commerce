<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Actions;

use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Support\ActivityRecorder;

/** Approve or reject reviews (Shop → Reviews' bulk actions); their products' ratings follow. */
class SetReviewStatus
{
    /**
     * @param  iterable<Review>  $reviews
     * @return int how many were changed
     */
    public function handle(iterable $reviews, string $status): int
    {
        $products = [];
        $count = 0;
        foreach ($reviews as $review) {
            $review->update(['status' => $status]);
            $products[$review->product_id] = true;
            $count++;
        }
        ProductRating::refreshMany(array_keys($products));
        if ($count > 0) {
            app(ActivityRecorder::class)->record($status === 'approved' ? 'approved' : 'rejected', $count === 1 ? '1 review' : "{$count} reviews", [], 'reviews');
        }

        return $count;
    }
}
