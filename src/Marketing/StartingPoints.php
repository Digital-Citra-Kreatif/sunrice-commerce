<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Sunrice\Support\Locales;

/**
 * Ready-made campaigns (an audience and texts to start from) and the
 * texts automations start with, from commerce::marketing.templates.
 */
final class StartingPoints
{
    /** @return array<int, array{key: string, label: string, description: string, audience: array<string, mixed>, content: array<string, array<string, string>>}> */
    public static function campaigns(): array
    {
        $list = [
            ['key' => 'announcement', 'label' => 'Announcement', 'description' => 'News for everyone who accepts marketing.',
                'audience' => ['match' => 'all', 'rules' => []]],
            ['key' => 'win_back', 'label' => 'We miss you', 'description' => 'Customers who haven\'t ordered for 90 days.',
                'audience' => ['match' => 'all', 'rules' => [['rule' => 'no_order_for_days', 'value' => 90]]]],
            ['key' => 'first_order', 'label' => 'First order nudge', 'description' => 'Customers from the last 30 days who haven\'t ordered yet.',
                'audience' => ['match' => 'all', 'rules' => [['rule' => 'signed_up_within_days', 'value' => 30], ['rule' => 'never_ordered', 'value' => null]]]],
            ['key' => 'loyal', 'label' => 'Thank our best customers', 'description' => 'Customers with 5 or more orders, with a voucher code.',
                'audience' => ['match' => 'all', 'rules' => [['rule' => 'orders_at_least', 'value' => 5]]]],
            ['key' => 'after_order', 'label' => 'Recent buyers', 'description' => 'Customers who ordered in the last 14 days.',
                'audience' => ['match' => 'all', 'rules' => [['rule' => 'ordered_within_days', 'value' => 14]]]],
        ];

        return array_map(fn (array $t) => [...$t, 'content' => self::content($t['key'])], $list);
    }

    /**
     * A template's texts in every language.
     *
     * @return array<string, array<string, string>>
     */
    public static function content(string $template): array
    {
        $out = [];
        foreach (Locales::available() as $locale) {
            $texts = __("commerce::marketing.templates.{$template}", [], $locale);
            $out[$locale] = is_array($texts) ? array_map('strval', $texts) : [];
        }

        return $out;
    }
}
