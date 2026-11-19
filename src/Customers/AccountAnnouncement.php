<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers;

use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Settings\StoreSettings;

/** Optional store announcement, displayed only in the signed-in account area. */
final class AccountAnnouncement
{
    public function __construct(private StoreSettings $settings) {}

    public function position(): ?string
    {
        if (! $this->settings->get('accounts.announcement_enabled') || $this->message() === '') {
            return null;
        }

        $position = $this->settings->get('accounts.announcement_position');

        return in_array($position, ['tab', 'above', 'below'], true) ? $position : null;
    }

    public function title(): string
    {
        return $this->localized('title') ?: __('commerce::account.announcement.title');
    }

    public function message(): string
    {
        return $this->localized('message');
    }

    private function localized(string $field): string
    {
        $values = (array) $this->settings->get('accounts.announcement_'.$field);
        $localized = trim((string) ($values[app()->getLocale()] ?? ''));

        return $localized !== '' ? $localized : trim((string) ($values[Locales::default()] ?? ''));
    }
}
