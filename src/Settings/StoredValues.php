<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Settings;

use Sunrice\Admin\Resources\Forms\Form;
use Sunrice\Admin\Settings\Settings;

/**
 * Where Settings → Store keeps its values: one panel settings section
 * ("commerce"), holding every store section as one array. Not registered
 * with the panel (Settings → Store has its own pages): StoreSettings
 * reads and writes it.
 *
 * @internal
 */
final class StoredValues extends Settings
{
    /** @var array<string, mixed> section => values */
    public array $values = [];

    public static function key(): string
    {
        return StoreSettings::KEY;
    }

    public static function form(Form $form): Form
    {
        return $form;
    }
}
