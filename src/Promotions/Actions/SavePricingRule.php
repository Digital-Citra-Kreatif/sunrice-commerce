<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Http\Controllers\Admin\TargetLabels;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * Creates or updates a pricing rule (quantity tiers for an audience).
 * The admin form and the MCP tools both save through here, with the
 * form's values (fields()); values() gives a rule's current ones.
 */
class SavePricingRule
{
    /** A new rule with the form's defaults. */
    public function blank(): PriceRule
    {
        return new PriceRule(['active' => true, 'audience' => 'everyone', 'scope' => 'all', 'quantity_basis' => 'variant', 'priority' => 0,
            'tiers' => [['min_qty' => 10, 'type' => 'percent_off', 'value' => 500]]]);
    }

    /** @return array<int, array<string, mixed>> */
    public function fields(): array
    {
        $roles = Role::query()->orderBy('name')->pluck('name')->map(fn ($r) => ['value' => $r, 'label' => $r])->all();

        return [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Name', 'required' => true, 'translatable' => false, 'config' => ['max' => 120]],
            ['handle' => 'active', 'type' => 'toggle', 'label' => 'Active'],
            ['handle' => 'dates', 'type' => 'commerce_datetime_range', 'label' => 'When', 'instructions' => 'Empty: always.'],
            ['handle' => 'audience', 'type' => 'select', 'label' => 'Customers', 'config' => ['options' => [
                ['value' => 'everyone', 'label' => 'Everyone'], ['value' => 'guests', 'label' => 'Guests only'],
                ['value' => 'signed_in', 'label' => 'Signed-in customers'], ['value' => 'roles', 'label' => 'Customers with these roles'],
            ]]],
            ['handle' => 'roles', 'type' => 'select', 'label' => 'Roles', 'config' => ['options' => $roles, 'multiple' => true]],
            ['handle' => 'scope', 'type' => 'select', 'label' => 'Products', 'config' => ['options' => [
                ['value' => 'all', 'label' => 'All products'], ['value' => 'products', 'label' => 'Chosen products'], ['value' => 'variants', 'label' => 'Chosen variants'],
                ['value' => 'categories', 'label' => 'Chosen categories (and their subcategories)'], ['value' => 'brands', 'label' => 'Chosen brands'],
            ]]],
            ['handle' => 'targets', 'type' => 'commerce_targets', 'label' => 'Chosen'],
            ['handle' => 'quantity_basis', 'type' => 'select', 'label' => 'Count the quantity', 'config' => ['options' => [
                ['value' => 'variant', 'label' => 'Per variant (each size/color separately)'], ['value' => 'product', 'label' => 'Per product (all its variants together)'],
                ['value' => 'rule', 'label' => 'Across every product of this rule'],
            ]]],
            ['handle' => 'tiers', 'type' => 'repeater', 'label' => 'Prices', 'required' => true, 'config' => ['min' => 1, 'max' => 20, 'fields' => [
                ['handle' => 'min_qty', 'type' => 'number', 'label' => 'From (units)', 'required' => true, 'config' => ['min' => 1], 'validation' => ['integer']],
                ['handle' => 'type', 'type' => 'select', 'label' => 'Price', 'required' => true, 'config' => ['options' => [
                    ['value' => 'percent_off', 'label' => 'Percent off'], ['value' => 'amount_off', 'label' => 'Amount off per unit'], ['value' => 'fixed_price', 'label' => 'Fixed unit price'],
                ]]],
                ['handle' => 'percent', 'type' => 'number', 'label' => 'Percent (for percent off)', 'config' => ['min' => 0, 'max' => 100]],
                ['handle' => 'amount', 'type' => 'commerce_money', 'label' => 'Amount (for amount off or fixed price)'],
            ]]],
            ['handle' => 'priority', 'type' => 'number', 'label' => 'Priority', 'instructions' => 'Only for display order: the best price always wins.', 'validation' => ['integer']],
        ];
    }

    /** @return array<string, mixed> */
    public function values(PriceRule $rule): array
    {
        $values = [
            'name' => $rule->name, 'active' => $rule->active, 'audience' => $rule->audience, 'roles' => $rule->roles ?? [], 'scope' => $rule->scope,
            'quantity_basis' => $rule->quantity_basis, 'priority' => $rule->priority,
            'dates' => ['start' => $rule->starts_at?->toIso8601String(), 'end' => $rule->ends_at?->toIso8601String()],
            'targets' => $rule->exists ? TargetLabels::for($rule->targets->map(fn ($t) => ['type' => $t->target_type, 'id' => $t->target_id])->all()) : [],
            'tiers' => array_map(fn (array $t) => ['min_qty' => $t['min_qty'], 'type' => $t['type'],
                'percent' => $t['type'] === 'percent_off' ? $t['value'] / 100 : null, 'amount' => $t['type'] !== 'percent_off' ? $t['value'] : null], (array) $rule->tiers),
        ];

        return $values;
    }

    /**
     * @param  array<string, mixed>  $input  the form's values
     *
     * @throws ValidationException
     */
    public function handle(PriceRule $rule, array $input): PriceRule
    {
        $values = SchemaForm::make($this->fields())->validate($input, [
            'audience' => ['required', 'in:'.implode(',', PriceRule::AUDIENCES)],
            'scope' => ['required', 'in:'.implode(',', PriceRule::SCOPES)],
            'quantity_basis' => ['required', 'in:'.implode(',', PriceRule::BASES)],
            'roles' => ['required_if:audience,roles'],
            'targets' => ['required_unless:scope,all'],
        ]);
        $tiers = [];
        foreach ((array) $values['tiers'] as $i => $tier) {
            $type = (string) $tier['type'];
            $value = $type === 'percent_off' ? (int) round((float) ($tier['percent'] ?? 0) * 100) : (int) ($tier['amount'] ?? 0);
            if ($type === 'percent_off' && ($value <= 0 || $value > 10000)) {
                throw SchemaForm::prefixed(ValidationException::withMessages(["tiers.{$i}.percent" => 'Enter a percentage between 0 and 100.']));
            }
            $tiers[] = ['min_qty' => max(1, (int) $tier['min_qty']), 'type' => $type, 'value' => $value];
        }
        usort($tiers, fn ($a, $b) => $a['min_qty'] <=> $b['min_qty']);

        DB::transaction(function () use ($rule, $values, $tiers): void {
            $rule->fill([
                'name' => $values['name'], 'active' => (bool) $values['active'], 'audience' => $values['audience'],
                'roles' => $values['audience'] === 'roles' ? array_values((array) $values['roles']) : null,
                'scope' => $values['scope'], 'quantity_basis' => $values['quantity_basis'], 'priority' => (int) ($values['priority'] ?? 0),
                'starts_at' => $values['dates']['start'] ?? null, 'ends_at' => $values['dates']['end'] ?? null, 'tiers' => $tiers,
            ])->save();
            $rule->targets()->delete();
            $type = ['products' => 'product', 'variants' => 'variant', 'categories' => 'term', 'brands' => 'term'][$rule->scope] ?? null;
            foreach ($type === null ? [] : (array) $values['targets'] as $target) {
                if ($target['type'] === $type) {
                    $rule->targets()->create(['target_type' => $type, 'target_id' => $target['id']]);
                }
            }
        });
        CatalogVersion::bump();
        app(ActivityRecorder::class)->record($rule->wasRecentlyCreated ? 'created' : 'updated', "Pricing rule: {$rule->name}", [], 'price_rule');

        return $rule;
    }
}
