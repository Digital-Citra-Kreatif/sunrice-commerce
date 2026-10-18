<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Listeners;

use Sunrice\Commerce\Catalog\ProductProjector;
use Sunrice\Events\EntryDeleted;
use Sunrice\Events\EntryPublished;

/** Keeps the commerce tables in step with published product entries. */
class ProjectProducts
{
    public function __construct(protected ProductProjector $projector) {}

    public function published(EntryPublished $event): void
    {
        if (ProductProjector::isProduct($event->entry)) {
            $this->projector->sync($event->entry);
        }
    }

    /** Trashing changes nothing (Sunrice decides visibility); a force delete removes the product. */
    public function deleted(EntryDeleted $event): void
    {
        if (! ProductProjector::entryExists($event->entry->id)) {
            $this->projector->remove($event->entry->id);
        }
    }
}
