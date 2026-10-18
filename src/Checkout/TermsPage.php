<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\Entry;

/**
 * The terms page customers agree to at checkout and when creating an
 * account (Settings → Store → Checkout → Terms page), in the visitor's
 * language.
 */
final class TermsPage
{
    public static function url(): ?string
    {
        $page = app(StoreSettings::class)->get('checkout.terms_page');
        if (! $page) {
            return null;
        }
        $entry = Entry::query()->with('translations', 'collection')->find(is_array($page) ? ($page[0] ?? null) : $page);
        $entry?->resolveFor(app()->getLocale());

        return $entry?->url;
    }
}
