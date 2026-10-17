<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Notifications;

/**
 * An email the store sends: who it goes to, the module it belongs to,
 * whether it can be switched off, and the attachments it may carry.
 * Texts default to commerce::emails.{key}.* (or $lang for a package's
 * own translations) and can be changed per language in Settings → Emails.
 */
final class EmailDefinition
{
    /**
     * @param  'customer'|'staff'  $audience
     * @param  array<int, string>  $attachments  invoice | quotation | packing_slip | downloads
     * @param  array<int, string>  $defaultAttachments
     */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $audience = 'customer',
        public readonly ?string $feature = null,
        public readonly bool $locked = false,
        public readonly array $attachments = [],
        public readonly array $defaultAttachments = [],
        public readonly string $description = '',
        public readonly ?string $lang = null,
        public readonly bool $enabledByDefault = true,
    ) {}

    /** The translation key prefix of its default texts. */
    public function langPrefix(): string
    {
        return $this->lang ?? 'commerce::emails.'.$this->key;
    }
}
