<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Actions;

use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Support\ActivityRecorder;

/** Delete reviews for good; their products' ratings follow. */
class DeleteReviews
{
    /**
     * @param  iterable<Review>  $reviews
     * @return int how many were deleted
     */
    public function handle(iterable $reviews): int
    {
        $products = [];
        $count = 0;
        foreach ($reviews as $review) {
            $review->delete();
            $products[$review->product_id] = true;
            $count++;
        }
        ProductRating::refreshMany(array_keys($products));
        if ($count > 0) {
            app(ActivityRecorder::class)->record('deleted', $count === 1 ? '1 review' : "{$count} reviews", [], 'reviews');
        }

        return $count;
    }
}
