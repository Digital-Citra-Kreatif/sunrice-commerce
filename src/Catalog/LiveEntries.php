<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Closure;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Sunrice\Cms\Content;
use Sunrice\Cms\Fields\HydrationContext;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Query\EntryQuery;
use Sunrice\Cms\Site\Page;
use Sunrice\Cms\Support\Locales;

/**
 * Product entries as the site shows them, through the CMS's own queries:
 * which are live (published, past their date, in a collection not in the
 * trash, in the page's language or the main one standing in), and the
 * translation a visitor sees of each, the object templates get as
 * `$entry` (title, url(), values()).
 */
final class LiveEntries
{
    /**
     * The ids of the live entries of a collection, as a subquery
     * (`whereIn('entry_id', LiveEntries::ids('products'))`).
     *
     * @param  (Closure(EntryQuery): mixed)|null  $configure  more conditions (whereTerm(), search()…)
     */
    public static function ids(string $collection, ?Closure $configure = null): Builder
    {
        $query = Content::entries($collection);
        if ($configure !== null) {
            $configure($query);
        }

        return $query->toBase()->toBase()->reorder()->select('sunrice_entry_translations.entry_id');
    }

    /**
     * What visitors see of these entries in the page's language, keyed by
     * entry id, in the order given; entries not live are left out. They
     * share one hydration context, so their values() load what they point
     * at once for all.
     *
     * @param  list<int>  $entryIds
     * @return Collection<int, EntryTranslation>
     */
    public static function shown(string $collection, array $entryIds): Collection
    {
        if ($entryIds === []) {
            return collect();
        }
        $live = array_flip(array_map('intval', self::ids($collection)->whereIn('sunrice_entry_translations.entry_id', $entryIds)->pluck('entry_id')->all()));
        $locale = Locales::current();
        $context = new HydrationContext($locale);
        $entries = Entry::query()->with(['translations', 'collection'])->whereIn('id', array_keys($live))->get()->keyBy('id');
        $shown = collect();
        foreach ($entryIds as $id) {
            $translation = isset($live[$id]) ? $entries->get($id)?->shownIn($locale) : null;
            if ($translation !== null) {
                $shown->put($id, $translation->hydrateWith($context));
            }
        }
        $context->share($shown->values()->all());

        return $shown;
    }

    /**
     * The translation to show for an entry: what visitors see in the page's
     * language, else (an entry that isn't live, as in a cart or an order)
     * the main language's.
     */
    public static function translation(Entry|EntryTranslation $entry): ?EntryTranslation
    {
        if ($entry instanceof EntryTranslation) {
            return $entry;
        }

        return $entry->shownIn() ?? $entry->mainTranslation()?->setRelation('entry', $entry);
    }

    /** The entry's id, from the entry or one of its translations. */
    public static function id(Entry|EntryTranslation $entry): int
    {
        return (int) ($entry instanceof EntryTranslation ? $entry->entry_id : $entry->id);
    }

    /** Whether this is the entry an editor is previewing (its draft is shown). */
    public static function previewing(EntryTranslation $translation): bool
    {
        $page = Page::current();

        return $page !== null && $page->preview && $page->entry !== null && $page->entry->is($translation);
    }
}
