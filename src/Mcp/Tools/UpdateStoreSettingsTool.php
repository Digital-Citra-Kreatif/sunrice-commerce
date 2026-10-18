<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Settings\Actions\SaveStoreSettings;
use Sunrice\Commerce\Settings\StoreSettings;

#[Description('Change store settings in one section (see get_store_settings): send only the values that change; they are merged over the current ones and validated like the admin form. Some settings are locked once orders exist (the currency).')]
class UpdateStoreSettingsTool extends CommerceTool
{
    protected string $name = 'update_store_settings';

    public function shouldRegister(): bool
    {
        return parent::shouldRegister() && GetStoreSettingsTool::sections() !== [];
    }

    protected function run(Request $request): Response
    {
        $args = $request->validate(['section' => ['required', 'string'], 'values' => ['required', 'array']]);
        if (! isset(GetStoreSettingsTool::sections()[$args['section']])) {
            return Response::error('Unknown section, or you may not change it.');
        }
        $current = app(StoreSettings::class)->section($args['section']);
        $saved = app(SaveStoreSettings::class)->handle($args['section'], array_replace($current, $args['values']));

        return $this->json(['saved' => true, 'section' => $args['section'], 'values' => array_intersect_key($saved, $args['values'])]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'section' => $schema->string()->description('The section key.')->required(),
            'values' => $schema->object()->description('The values to change, by field handle.')->required(),
        ];
    }
}
