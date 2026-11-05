<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Reviews\Models\Review;

/** A review was written on the product page (pending or approved, as the store's settings say). */
class ReviewSubmitted
{
    use Dispatchable;

    public function __construct(public readonly Review $review) {}
}
