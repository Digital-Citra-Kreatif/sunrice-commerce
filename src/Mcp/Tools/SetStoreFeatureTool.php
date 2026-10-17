<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\FeatureRegistry;
use Sunrice\Commerce\Mcp\CommerceTool;

#[Description('Switch a store module on or off (Settings → Store → Features; get_store_info lists them). Modules that need it follow (switching off orders also switches off checkout); the result lists what changed. Needs confirm: true — ask the user first, as customers see the difference.')]
class SetStoreFeatureTool extends CommerceTool
{
    protected string $name = 'set_store_feature';

    protected ?string $permission = 'commerce.settings.features';

    protected function run(Request $request): Response
    {
        $args = $request->validate(['feature' => ['required', 'string'], 'on' => ['required', 'boolean'], 'confirm' => ['boolean']]);
        $feature = app(FeatureRegistry::class)->get($args['feature']);
        if ($feature === null) {
            return Response::error("Unknown module \"{$args['feature']}\".");
        }
        if ($feature->key === 'ai_tools' && ! $args['on']) {
            return Response::error('Switching off the store tools must be done in the admin.');
        }
        if (($refused = $this->unconfirmed($request, 'switch '.($args['on'] ? 'on' : 'off')." \"{$feature->label}\"")) !== null) {
            return $refused;
        }

        return $this->json(['feature' => $feature->key, 'on' => (bool) $args['on'], ...app(ToggleFeature::class)->handle($feature->key, (bool) $args['on'])]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'feature' => $schema->string()->description('The module key, e.g. wishlist, vouchers, flash_sales.')->required(),
            'on' => $schema->boolean()->required(),
            'confirm' => $schema->boolean()->description('true once the user agreed.'),
        ];
    }
}
