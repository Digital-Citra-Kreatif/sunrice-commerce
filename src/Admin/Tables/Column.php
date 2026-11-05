<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Tables;

use JsonSerializable;

/** A column of a commerce list page: its row key, heading, whether it sorts, and how it shows (text, badge, money…). */
final readonly class Column implements JsonSerializable
{
    public function __construct(
        public string $key,
        public string $label,
        public bool $sortable = false,
        public string $type = 'text',
    ) {}

    /** @return array{key: string, label: string, sortable: bool, type: string} */
    public function jsonSerialize(): array
    {
        return ['key' => $this->key, 'label' => $this->label, 'sortable' => $this->sortable, 'type' => $this->type];
    }
}
