<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Actions;

use Sunrice\Commerce\Reviews\Models\Review;
use Sunrice\Commerce\Reviews\ProductRating;
use Sunrice\Commerce\Support\ActivityRecorder;

/** Edit a review, including its status and the store's reply (an empty reply removes it). */
class ReplyToReview
{
    /** @param array{rating?: int|string, title?: string|null, body?: string} $content */
    public function handle(Review $review, ?string $reply, string $status, array $content = []): void
    {
        $reply = trim((string) $reply) === '' ? null : trim((string) $reply);
        $review->update([...$content, 'status' => $status, 'reply' => $reply, 'replied_at' => $reply === null ? null : ($review->reply === $reply ? $review->replied_at : now())]);
        ProductRating::refresh($review->product_id);
        app(ActivityRecorder::class)->record('updated', "Review #{$review->id}", ['changes' => array_keys($review->getChanges())], 'reviews');
    }
}
