<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Listeners;

use Sunrice\Cms\Events\EntryDeleted;
use Sunrice\Cms\Events\EntryPublished;
use Sunrice\Commerce\Catalog\ProductProjector;

/** Keeps the commerce tables in step with published product entries. */
class ProjectProducts
{
    public function __construct(protected ProductProjector $projector) {}

    public function published(EntryPublished $event): void
    {
        // The product field is shared by every language: the main one's publish carries it.
        $translation = $event->translation;
        if ($translation->isMain() && ProductProjector::isProduct($translation->entry)) {
            $this->projector->sync($translation->entry);
        }
    }

    /** Trashing changes nothing (the CMS decides visibility); a force delete removes the product. */
    public function deleted(EntryDeleted $event): void
    {
        if (! ProductProjector::entryExists($event->entry->id)) {
            $this->projector->remove($event->entry->id);
        }
    }
}
