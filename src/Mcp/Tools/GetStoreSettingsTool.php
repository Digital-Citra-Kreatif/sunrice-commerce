<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Settings\SettingsRegistry;
use Sunrice\Commerce\Settings\SettingsSection;
use Sunrice\Commerce\Settings\StoreSettings;

#[IsReadOnly]
#[Description('Read store settings (Settings → Store): without section, the sections you may change; with section (general, catalog, checkout, accounts, taxes, documents…), its fields and current values. Payments, shipping zones and emails have their own admin pages and are not here. Change values with update_store_settings.')]
class GetStoreSettingsTool extends CommerceTool
{
    protected string $name = 'get_store_settings';

    public function shouldRegister(): bool
    {
        return parent::shouldRegister() && self::sections() !== [];
    }

    /** @return array<string, SettingsSection> the schema sections the user may change */
    public static function sections(): array
    {
        $out = [];
        foreach (app(SettingsRegistry::class)->visibleTo(auth()->user()) as $section) {
            if ($section->page === null && $section->key !== 'features') {
                $out[$section->key] = $section;
            }
        }

        return $out;
    }

    protected function run(Request $request): Response
    {
        $sections = self::sections();
        $key = (string) $request->get('section', '');
        if ($key === '') {
            return $this->json(['sections' => array_values(array_map(fn (SettingsSection $s) => ['key' => $s->key, 'label' => $s->label], $sections))]);
        }
        $section = $sections[$key] ?? null;
        if ($section === null) {
            return Response::error('Unknown section, or you may not change it. Sections: '.implode(', ', array_keys($sections)).'.');
        }
        $fields = array_values(array_filter($section->fields(), fn (array $f) => ($f['type'] ?? '') !== 'password'));
        $values = array_intersect_key(app(StoreSettings::class)->section($key), array_flip(array_column($fields, 'handle')));

        return $this->json(['section' => $key, 'label' => $section->label, 'fields' => array_map(fn (array $f) => array_filter([
            'handle' => $f['handle'], 'type' => $f['type'] ?? null, 'label' => $f['label'] ?? null, 'instructions' => $f['instructions'] ?? null,
            'options' => isset($f['config']['options']) ? array_column($f['config']['options'], 'value') : null,
        ], fn ($v) => $v !== null), $fields), 'values' => $values]);
    }

    public function schema(JsonSchema $schema): array
    {
        return ['section' => $schema->string()->description('A section key; leave out to list them.')];
    }
}
