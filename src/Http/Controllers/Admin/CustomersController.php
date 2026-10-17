<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Customers\Actions\AnonymizeCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Customers\Notifications\CustomerResetPassword;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Support\Address;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Commerce\Support\Phone;

/** Shop → Customers: everyone who registered or ordered. */
class CustomersController extends Controller
{
    public function index(Request $request, MoneyFormatter $money): Response
    {
        $this->authorize('commerce.customers.view');
        $table = TableQuery::for(Customer::query()->whereNull('anonymized_at'))
            ->searchable(['name', 'email', 'phone'])
            ->filter('account', fn (Builder $q, mixed $v) => $v === 'registered' ? $q->whereNotNull('user_id') : $q->whereNull('user_id'))
            ->filter('marketing', fn (Builder $q, mixed $v) => $q->where('accepts_marketing', $v === 'yes'))
            ->filter('deletion', fn (Builder $q) => $q->whereNotNull('deletion_requested_at'))
            ->sortable(['name', 'email', 'orders_count', 'total_spent', 'last_order_at', 'created_at'])
            ->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->latest('id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Customers',
            'description' => 'Everyone who registered or ordered.',
            'createUrl' => null,
            ...$this->tableProps('commerce-customers', $table, [
                new Column('name', 'Name', sortable: true),
                new Column('email', 'Email', sortable: true),
                new Column('phone', 'Phone'),
                new Column('orders_count', 'Orders', sortable: true, type: 'number'),
                new Column('total_spent', 'Spent', sortable: true),
                new Column('last_order_at', 'Last order', sortable: true),
                new Column('account', 'Account', type: 'badge'),
            ], $rows->through(fn (Model $c) => $c instanceof Customer ? [
                'id' => $c->id,
                'href' => "commerce/customers/{$c->id}",
                'name' => $c->name ?? '—',
                'email' => $c->email,
                'phone' => $c->phone,
                'orders_count' => $c->orders_count,
                'total_spent' => $money->format($c->total_spent),
                'last_order_at' => $c->last_order_at?->isoFormat('D MMM YYYY'),
                'account' => $c->deletion_requested_at ? 'Deletion requested' : ($c->user_id ? 'Registered' : 'Guest'),
                'account_tone' => $c->deletion_requested_at ? 'warning' : ($c->user_id ? 'ok' : 'neutral'),
            ] : []), [
                ['key' => 'account', 'label' => 'Account', 'type' => 'select', 'options' => [['value' => 'registered', 'label' => 'Registered'], ['value' => 'guest', 'label' => 'Guests']]],
                ['key' => 'marketing', 'label' => 'Marketing', 'type' => 'select', 'options' => [['value' => 'yes', 'label' => 'Accepts marketing'], ['value' => 'no', 'label' => "Doesn't"]]],
                ['key' => 'deletion', 'label' => 'Requests', 'type' => 'select', 'options' => [['value' => 'yes', 'label' => 'Deletion requested']]],
            ]),
        ]);
    }

    public function show(Request $request, Customer $customer, MoneyFormatter $money): Response
    {
        $this->authorize('commerce.customers.view');
        $user = $customer->user();
        $customerRoles = (array) app(StoreSettings::class)->get('accounts.customer_roles', ['Customer']);

        return Inertia::render('Commerce/Customers/Show', [
            'customer' => [
                'id' => $customer->id, 'name' => $customer->name, 'email' => $customer->email, 'phone' => $customer->phone, 'note' => $customer->note,
                'accepts_marketing' => $customer->accepts_marketing, 'locale' => $customer->locale,
                'orders_count' => $customer->orders_count, 'total_spent' => $money->format($customer->total_spent),
                'first_order_at' => $customer->first_order_at?->toIso8601String(), 'last_order_at' => $customer->last_order_at?->toIso8601String(),
                'created_at' => $customer->created_at?->toIso8601String(),
                'deletion_requested_at' => $customer->deletion_requested_at?->toIso8601String(),
                'anonymized' => $customer->anonymized_at !== null,
                'addresses' => $customer->addresses()->get()->map(fn ($a) => ['id' => $a->id, 'label' => $a->label, 'text' => Address::fromArray($a->toAddress())->format(),
                    'default_shipping' => $a->default_shipping, 'default_billing' => $a->default_billing])->all(),
            ],
            'account' => $user === null ? null : [
                'email_verified' => $user->getAttribute('email_verified_at') !== null,
                'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames()->all() : [],
                'google' => DB::table('commerce_social_accounts')->where('user_id', $user->getAuthIdentifier())->value('email'),
            ],
            'roleOptions' => array_values(array_unique([...$customerRoles, ...Role::query()->whereDoesntHave('permissions', fn ($q) => $q->where('name', 'sunrice.access-admin'))->pluck('name')->all()])),
            'orders' => Order::query()->where('customer_id', $customer->id)->latest('placed_at')->limit(20)->get()
                ->map(fn ($o) => ['id' => $o->id, 'number' => $o->displayNumber(), 'date' => $o->placed_at?->toIso8601String(),
                    'status' => OrderStatus::label($o->status), 'total' => $money->format($o->total), 'href' => "commerce/orders/{$o->id}"])->all(),
            'can' => [
                'edit' => $request->user()->can('commerce.customers.edit'),
                'delete' => $request->user()->can('commerce.customers.delete'),
            ],
        ]);
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorize('commerce.customers.edit');
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30'],
            'note' => ['nullable', 'string', 'max:5000'],
            'accepts_marketing' => ['boolean'],
            'roles' => ['array'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
        ]);
        $customer->forceFill([
            'name' => $data['name'] ?? $customer->name, 'phone' => filled($data['phone'] ?? null) ? Phone::normalize($data['phone']) : null,
            'note' => $data['note'] ?? null, 'accepts_marketing' => (bool) ($data['accepts_marketing'] ?? false),
        ])->save();
        $user = $customer->user();
        if ($user !== null && array_key_exists('roles', $data) && method_exists($user, 'syncRoles')) {
            // Only roles without admin access can be given here.
            $allowed = Role::query()->whereIn('name', (array) $data['roles'])->whereDoesntHave('permissions', fn ($q) => $q->where('name', 'sunrice.access-admin'))->pluck('name')->all();
            $staff = $user->roles()->whereHas('permissions', fn ($q) => $q->where('name', 'sunrice.access-admin'))->pluck('name')->all();
            $user->syncRoles([...$staff, ...$allowed]);
        }
        app(ActivityRecorder::class)->record('updated', "Customer: {$customer->email}", [], 'customer');

        return back()->with('success', 'Customer saved.');
    }

    public function sendPasswordReset(Customer $customer): RedirectResponse
    {
        $this->authorize('commerce.customers.edit');
        abort_if($customer->user_id === null, 404);
        Password::broker((string) config('commerce.auth.passwords', 'users'))->sendResetLink(['email' => $customer->email],
            fn ($user, string $token) => $user->notify(new CustomerResetPassword($token, $customer->locale ?? 'id')));

        return back()->with('success', 'Password reset link sent.');
    }

    public function markVerified(Customer $customer): RedirectResponse
    {
        $this->authorize('commerce.customers.edit');
        $user = $customer->user();
        abort_if($user === null, 404);
        $user->forceFill(['email_verified_at' => $user->getAttribute('email_verified_at') ?? now()])->save();
        app(ActivityRecorder::class)->record('verified email', "Customer: {$customer->email}", [], 'customer');

        return back()->with('success', 'Email marked as verified.');
    }

    public function anonymize(Customer $customer, AnonymizeCustomer $anonymize): RedirectResponse
    {
        $this->authorize('commerce.customers.delete');
        $user = $customer->user();
        abort_if($user !== null && method_exists($user, 'can') && $user->can('sunrice.access-admin'), 403, 'Staff accounts are managed in Users.');
        $anonymize->handle($customer);

        return redirect()->route('sunrice.admin.commerce.customers')->with('success', 'Personal data removed.');
    }
}
