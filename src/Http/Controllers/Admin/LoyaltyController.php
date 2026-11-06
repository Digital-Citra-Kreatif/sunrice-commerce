<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Admin\Tables\Column;
use Sunrice\Commerce\Admin\Tables\TableQuery;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Loyalty\Actions\AdjustPoints;
use Sunrice\Commerce\Loyalty\Models\LoyaltyTransaction;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Support\MoneyFormatter;

/** Shop → Customers → Loyalty points: customers' balances and history; staff add or take points. */
class LoyaltyController extends Controller
{
    public function index(Request $request): Response
    {
        $this->guard();
        $table = TableQuery::for(Customer::query()->whereNotNull('user_id'))->searchable(['name', 'email'])
            ->filter('balance', fn ($q, $v) => $v === 'yes' ? $q->where('loyalty_points', '>', 0) : $q)
            ->sortable(['name', 'loyalty_points'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->orderByDesc('loyalty_points')->orderBy('id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Loyalty points',
            'description' => 'What customers have to spend. Rules: Settings → Loyalty.',
            'createUrl' => null,
            ...$this->tableProps('commerce-loyalty', $table, [
                new Column('name', 'Customer', sortable: true),
                new Column('email', 'Email'),
                new Column('loyalty_points', 'Points', sortable: true),
            ], $rows->through(fn (Model $c) => $c instanceof Customer ? [
                'id' => $c->id, 'href' => "commerce/loyalty/{$c->id}", 'name' => $c->name ?: $c->email, 'email' => $c->email,
                'loyalty_points' => number_format($c->loyalty_points, 0, ',', '.'),
            ] : []), [
                ['key' => 'balance', 'label' => 'Balance', 'type' => 'select', 'options' => [['value' => 'yes', 'label' => 'With points']]],
            ]),
        ]);
    }

    public function edit(Customer $customer, MoneyFormatter $money): Response
    {
        $this->guard();
        $history = LoyaltyTransaction::query()->with('order')->where('customer_id', $customer->id)->latest('id')->limit(50)->get()
            ->map(fn (LoyaltyTransaction $t) => ($t->created_at?->isoFormat('D MMM YYYY') ?? '').': '.ucfirst($t->kind).' '.($t->points > 0 ? '+' : '').number_format($t->points, 0, ',', '.')
                .($t->order !== null ? ' ('.$t->order->displayNumber().')' : '').($t->note ? ' — '.$t->note : ''))->implode(' · ');

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => 'Points: '.($customer->name ?: $customer->email),
            'description' => 'Balance '.number_format($customer->loyalty_points, 0, ',', '.').' points ('.$money->format($customer->loyalty_points).')'.($history !== '' ? ' · '.$history : ''),
            'form' => SchemaForm::make([
                ['handle' => 'points', 'type' => 'number', 'label' => 'Add points', 'required' => true, 'instructions' => 'Negative to take points away (never below zero).', 'validation' => ['integer']],
                ['handle' => 'note', 'type' => 'text', 'label' => 'Why', 'translatable' => false, 'instructions' => 'Shown to staff in the history.', 'validation' => ['max:500']],
            ], ['points' => null, 'note' => null])->action(route('sunrice.admin.commerce.loyalty.update', $customer, false), 'put'),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Loyalty points', 'href' => 'commerce/loyalty']],
        ]);
    }

    public function update(Request $request, Customer $customer, AdjustPoints $adjust): RedirectResponse
    {
        $this->guard();
        $data = $request->validate([
            'values.points' => ['required', 'integer', 'not_in:0', 'min:-1000000000000', 'max:1000000000000'],
            'values.note' => ['nullable', 'string', 'max:500'],
        ]);
        $adjust->handle($customer, (int) $data['values']['points'], $data['values']['note'] ?? null, (int) $request->user()->getAuthIdentifier());
        app(ActivityRecorder::class)->record('updated', 'Points of '.($customer->email ?? $customer->name), ['points' => (int) $data['values']['points']], 'customer');

        return back()->with('success', 'Points saved.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('loyalty');
        $this->authorize('commerce.loyalty.manage');
    }
}
