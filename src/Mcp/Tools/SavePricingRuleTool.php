<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Database\Eloquent\Model;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Promotions\Actions\SavePricingRule;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;

/** @extends SaveWithFormTool<PriceRule> */
#[Description('Create or change a pricing rule, like Shop → Pricing rules: quantity tiers (min_qty with percent_off, amount_off or fixed_price) for an audience (everyone, signed-in customers or roles) on all products or chosen products, variants, categories or brands. Call without values to see the fields and current values.')]
class SavePricingRuleTool extends SaveWithFormTool
{
    protected string $name = 'save_pricing_rule';

    protected ?string $feature = 'pricing_rules';

    protected ?string $permission = 'commerce.pricing-rules.manage';

    protected function action(): object
    {
        return app(SavePricingRule::class);
    }

    protected function record(?int $id): ?Model
    {
        return $id === null ? app(SavePricingRule::class)->blank() : PriceRule::query()->find($id);
    }

    /** @param  PriceRule  $m */
    protected function present(Model $m): array
    {
        return ['id' => $m->id, 'name' => $m->name, 'active' => (bool) $m->active, 'audience' => $m->audience, 'scope' => $m->scope, 'tiers' => $m->tiers];
    }
}
