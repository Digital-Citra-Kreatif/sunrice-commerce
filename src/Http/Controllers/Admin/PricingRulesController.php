<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Promotions\Actions\SavePricingRule;
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

        return $this->form(app(SavePricingRule::class)->blank());
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
        return app(SavePricingRule::class)->fields();
    }

    protected function form(PriceRule $rule): Response
    {
        $values = app(SavePricingRule::class)->values($rule);
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
        return app(SavePricingRule::class)->handle($rule, (array) $request->input('values', []));
    }
}
