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
use Sunrice\Commerce\Support\Staff;

/** Shop → Customers → Loyalty points: customers' balances and history; staff add or take points. */
class LoyaltyController extends Controller
{
    private const HISTORY_TYPES = [
        'earn' => 'Earned',
        'redeem' => 'Redeemed',
        'release' => 'Returned',
        'refund' => 'Refunded',
        'revoke' => 'Revoked',
        'adjust' => 'Manual adjustment',
        'expire' => 'Expired',
    ];

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

    public function edit(Request $request, Customer $customer, MoneyFormatter $money): Response
    {
        $this->guard();
        $history = TableQuery::for(LoyaltyTransaction::query()->where('customer_id', $customer->id)
            ->with(['order' => fn ($query) => $query->withTrashed()])
            ->select('commerce_loyalty_transactions.*')
            // Subtract every later movement, including ones excluded by the current table filter.
            ->selectRaw('(
                SELECT wallet.loyalty_points FROM commerce_customers AS wallet
                WHERE wallet.id = commerce_loyalty_transactions.customer_id
            ) - COALESCE((
                SELECT SUM(later.points) FROM commerce_loyalty_transactions AS later
                WHERE later.customer_id = commerce_loyalty_transactions.customer_id
                    AND later.id > commerce_loyalty_transactions.id
            ), 0) AS balance_after'))
            ->searchable(['note'])
            ->filter('kind', fn ($query, $kind) => isset(self::HISTORY_TYPES[$kind]) ? $query->where('kind', $kind) : $query)
            ->apply($request);
        $history->builder()->latest('id');
        $rows = $history->defaultPerPage(25)->paginate($request);
        $staffIds = $rows->getCollection()->pluck('user_id')->filter()->unique();
        $users = Staff::userModel();
        $names = $staffIds->isEmpty() ? collect() : $users::query()->whereIn('id', $staffIds)->pluck('name', 'id');
        $canViewOrders = commerce_feature('orders') && $request->user()->can('commerce.orders.view');
        $kinds = collect(self::HISTORY_TYPES)->map(fn (string $label, string $kind) => ['label' => $label, 'value' => $kind])->values()->all();

        return Inertia::render('Commerce/Loyalty/Show', [
            'title' => 'Points: '.($customer->name ?: $customer->email),
            'description' => 'Balance '.number_format($customer->loyalty_points, 0, ',', '.').' points ('.$money->format($customer->loyalty_points).')',
            'balance' => $customer->loyalty_points,
            'history' => $this->tableProps('commerce-loyalty-history', $history, [
                new Column('created_at', 'Date and time'),
                new Column('kind', 'Activity'),
                new Column('points', 'Change', type: 'number'),
                new Column('balance_after', 'Balance after', type: 'number'),
                new Column('order_number', 'Order'),
                new Column('actor', 'Source'),
                new Column('expires_at', 'Expires'),
                new Column('note', 'Reason'),
            ], $rows->through(function (Model $transaction) use ($names, $canViewOrders): array {
                if (! $transaction instanceof LoyaltyTransaction) {
                    throw new \LogicException('Expected a loyalty transaction.');
                }

                $order = $transaction->order;

                return [
                    'id' => $transaction->id,
                    'created_at' => $transaction->created_at?->toIso8601String(),
                    'kind' => self::HISTORY_TYPES[$transaction->kind] ?? ucfirst($transaction->kind),
                    'points' => $transaction->points,
                    'balance_after' => (int) $transaction->getAttribute('balance_after'),
                    'order_number' => $order?->displayNumber(),
                    'order_url' => $canViewOrders && $order !== null ? route('sunrice.admin.commerce.orders.show', $order, false) : null,
                    'actor' => $transaction->user_id === null
                        ? ($transaction->kind === 'redeem' ? 'Checkout' : 'System')
                        : ($names->get($transaction->user_id) ?? 'Staff #'.$transaction->user_id),
                    'expires_at' => $transaction->expires_at?->toIso8601String(),
                    'note' => $transaction->note,
                ];
            }), [
                ['key' => 'kind', 'label' => 'Activity', 'type' => 'select', 'options' => $kinds],
            ]),
            'form' => SchemaForm::make([
                ['handle' => 'points', 'type' => 'number', 'label' => 'Add points', 'required' => true, 'instructions' => 'Negative to take points away (never below zero).', 'validation' => ['integer']],
                ['handle' => 'note', 'type' => 'text', 'label' => 'Why', 'translatable' => false, 'instructions' => 'Shown to staff in the history.', 'validation' => ['max:500']],
            ], ['points' => null, 'note' => null])->action(route('sunrice.admin.commerce.loyalty.update', $customer, false), 'put'),
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

        return redirect()->route('sunrice.admin.commerce.loyalty.edit', $customer)->with('success', 'Points saved.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('loyalty');
        $this->authorize('commerce.loyalty.manage');
    }
}
