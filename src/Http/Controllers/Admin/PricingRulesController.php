<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Support\MoneyFormatter;

/** Shop → Pricing rules: bulk, tier and customer-role prices. */
class PricingRulesController extends Controller
{
    public function index(Request $request, MoneyFormatter $money): Response
    {
        $this->guard();
        $table = TableQuery::for(PriceRule::query()->withCount('targets'))->searchable(['name'])->sortable(['name', 'priority', 'starts_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->orderByDesc('priority')->orderBy('name');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Pricing rules',
            'description' => 'Lower prices for some customers or from a quantity. The best price for the customer wins.',
            'createUrl' => 'commerce/pricing-rules/create',
            'createLabel' => 'New rule',
            ...$this->tableProps('commerce-pricing-rules', $table, [
                new Column('name', 'Name', sortable: true),
                new Column('applies', 'Applies to'),
                new Column('tiers', 'Prices'),
                new Column('dates', 'When'),
                new Column('status', 'Status', type: 'badge'),
            ], $rows->through(fn (Model $rule) => $rule instanceof PriceRule ? [
                'id' => $rule->id,
                'href' => "commerce/pricing-rules/{$rule->id}/edit",
                'name' => $rule->name,
                'applies' => match ($rule->audience) {
                    'guests' => 'Guests', 'signed_in' => 'Signed-in customers', 'roles' => implode(', ', (array) $rule->roles), default => 'Everyone',
                }.' · '.($rule->scope === 'all' ? 'all products' : $rule->targets_count.' '.$rule->scope),
                'tiers' => collect($rule->tiers)->map(fn (array $t) => "{$t['min_qty']}+: ".match ($t['type']) {
                    'percent_off' => '-'.($t['value'] / 100).'%', 'amount_off' => '-'.$money->format((int) $t['value']), default => $money->format((int) $t['value']),
                })->implode(', '),
                'dates' => trim(($rule->starts_at?->isoFormat('D MMM YYYY') ?? '').' – '.($rule->ends_at?->isoFormat('D MMM YYYY') ?? ''), ' –') ?: 'Always',
                'status' => $this->status($rule),
                'status_tone' => match ($this->status($rule)) {
                    'Active' => 'ok', 'Scheduled' => 'info', default => 'neutral'
                },
            ] : []), [], []),
        ]);
    }

    public function create(): Response
    {
        $this->guard();

        return $this->form(new PriceRule(['active' => true, 'audience' => 'everyone', 'scope' => 'all', 'quantity_basis' => 'variant', 'priority' => 0,
            'tiers' => [['min_qty' => 10, 'type' => 'percent_off', 'value' => 500]]]));
    }

    public function edit(PriceRule $rule): Response
    {
        $this->guard();

        return $this->form($rule->load('targets'));
    }

    public function store(Request $request): RedirectResponse
    {
        $this->guard();
        $rule = $this->save(new PriceRule, $request);

        return redirect()->route('sunrice.admin.commerce.pricing-rules.edit', $rule)->with('success', 'Pricing rule created.');
    }

    public function update(Request $request, PriceRule $rule): RedirectResponse
    {
        $this->guard();
        $this->save($rule, $request);

        return back()->with('success', 'Pricing rule saved.');
    }

    public function destroy(PriceRule $rule): RedirectResponse
    {
        $this->guard();
        $rule->delete();
        CatalogVersion::bump();
        app(ActivityRecorder::class)->record('deleted', "Pricing rule: {$rule->name}", [], 'price_rule');

        return redirect()->route('sunrice.admin.commerce.pricing-rules')->with('success', 'Pricing rule deleted.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('pricing_rules');
        $this->authorize('commerce.pricing-rules.manage');
    }

    protected function status(PriceRule $rule): string
    {
        return match (true) {
            ! $rule->active => 'Off',
            $rule->starts_at?->isFuture() ?? false => 'Scheduled',
            $rule->ends_at?->isPast() ?? false => 'Ended',
            default => 'Active',
        };
    }

    /** @return array<int, array<string, mixed>> */
    protected function fields(): array
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

    protected function form(PriceRule $rule): Response
    {
        $values = [
            'name' => $rule->name, 'active' => $rule->active, 'audience' => $rule->audience, 'roles' => $rule->roles ?? [], 'scope' => $rule->scope,
            'quantity_basis' => $rule->quantity_basis, 'priority' => $rule->priority,
            'dates' => ['start' => $rule->starts_at?->toIso8601String(), 'end' => $rule->ends_at?->toIso8601String()],
            'targets' => $rule->exists ? TargetLabels::for($rule->targets->map(fn ($t) => ['type' => $t->target_type, 'id' => $t->target_id])->all()) : [],
            'tiers' => array_map(fn (array $t) => ['min_qty' => $t['min_qty'], 'type' => $t['type'],
                'percent' => $t['type'] === 'percent_off' ? $t['value'] / 100 : null, 'amount' => $t['type'] !== 'percent_off' ? $t['value'] : null], (array) $rule->tiers),
        ];
        $form = SchemaForm::make($this->fields(), $values)->action(
            $rule->exists ? route('sunrice.admin.commerce.pricing-rules.update', $rule, false) : route('sunrice.admin.commerce.pricing-rules.store', [], false),
            $rule->exists ? 'put' : 'post',
        );

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => $rule->exists ? $rule->name : 'New pricing rule',
            'form' => $form,
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Pricing rules', 'href' => 'commerce/pricing-rules']],
            'deleteUrl' => $rule->exists ? "commerce/pricing-rules/{$rule->id}" : null,
        ]);
    }

    protected function save(PriceRule $rule, Request $request): PriceRule
    {
        $values = SchemaForm::make($this->fields())->validate((array) $request->input('values', []), [
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
