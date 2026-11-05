<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Actions;

use Illuminate\Support\Collection;
use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Support\ActivityRecorder;

/** Approve, reject, reply to or delete reviews; the products' ratings follow. */
class ModerateReview
{
    /** @param  iterable<Review>  $reviews */
    public function status(iterable $reviews, string $status): int
    {
        return $this->each($reviews, function (Review $review) use ($status): void {
            $review->update(['status' => $status]);
        }, $status === 'approved' ? 'approved' : 'rejected');
    }

    public function reply(Review $review, ?string $reply, string $status): void
    {
        $reply = trim((string) $reply) === '' ? null : trim((string) $reply);
        $review->update(['status' => $status, 'reply' => $reply, 'replied_at' => $reply === null ? null : ($review->reply === $reply ? $review->replied_at : now())]);
        ProductRating::refresh($review->product_id);
        app(ActivityRecorder::class)->record('updated', "Review #{$review->id}", ['changes' => ['status', 'reply']], 'reviews');
    }

    /** @param  iterable<Review>  $reviews */
    public function delete(iterable $reviews): int
    {
        return $this->each($reviews, fn (Review $review) => $review->delete(), 'deleted');
    }

    /**
     * @param  iterable<Review>  $reviews
     * @param  callable(Review): mixed  $change
     */
    protected function each(iterable $reviews, callable $change, string $action): int
    {
        $products = new Collection;
        $count = 0;
        foreach ($reviews as $review) {
            $change($review);
            $products->push($review->product_id);
            $count++;
        }
        $products->unique()->each(fn (int $id) => ProductRating::refresh($id));
        if ($count > 0) {
            app(ActivityRecorder::class)->record($action, $count === 1 ? '1 review' : "{$count} reviews", [], 'reviews');
        }

        return $count;
    }
}
