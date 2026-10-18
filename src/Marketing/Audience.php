<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Marketing\Models\Campaign;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Support\Locales;

/**
 * Who a marketing email goes to: customers who accept marketing (never
 * anonymized ones, or those who asked to be deleted), narrowed by rules
 * that all match (`match: all`) or any one matches (`match: any`).
 *
 *     ['match' => 'all', 'rules' => [['rule' => 'no_order_for_days', 'value' => 60], ['rule' => 'orders_at_least', 'value' => 2]]]
 */
class Audience
{
    /**
     * The rules: key => label, the value's input (none, days, number, money,
     * select, text, products, categories) and the options of a select.
     *
     * @return array<string, array{label: string, group: string, input: string, options?: array<int, array{value: string, label: string}>}>
     */
    public static function rules(): array
    {
        $campaigns = Campaign::query()->where('type', Campaign::CAMPAIGN)->whereIn('status', ['sending', 'sent'])->latest('id')->limit(50)->get(['id', 'name'])
            ->map(fn (Campaign $c) => ['value' => (string) $c->id, 'label' => $c->name])->all();

        return [
            'no_order_for_days' => ['label' => 'Hasn\'t ordered for (days)', 'group' => 'Orders', 'input' => 'days'],
            'ordered_within_days' => ['label' => 'Ordered in the last (days)', 'group' => 'Orders', 'input' => 'days'],
            'never_ordered' => ['label' => 'Has never ordered', 'group' => 'Orders', 'input' => 'none'],
            'orders_at_least' => ['label' => 'Orders: at least', 'group' => 'Orders', 'input' => 'number'],
            'orders_at_most' => ['label' => 'Orders: at most', 'group' => 'Orders', 'input' => 'number'],
            'spent_at_least' => ['label' => 'Total spent: at least', 'group' => 'Orders', 'input' => 'money'],
            'spent_at_most' => ['label' => 'Total spent: at most', 'group' => 'Orders', 'input' => 'money'],
            'bought_product' => ['label' => 'Bought one of the products', 'group' => 'Orders', 'input' => 'products'],
            'bought_category' => ['label' => 'Bought from the categories or brands', 'group' => 'Orders', 'input' => 'categories'],

            'signed_up_within_days' => ['label' => 'Became a customer in the last (days)', 'group' => 'Customer', 'input' => 'days'],
            'signed_up_before_days' => ['label' => 'Customer for more than (days)', 'group' => 'Customer', 'input' => 'days'],
            'account' => ['label' => 'Account', 'group' => 'Customer', 'input' => 'select', 'options' => [
                ['value' => 'registered', 'label' => 'Registered'], ['value' => 'guest', 'label' => 'Guest (ordered without an account)'],
            ]],
            'role' => ['label' => 'Has the role', 'group' => 'Customer', 'input' => 'select', 'options' => array_map(fn (string $r) => ['value' => $r, 'label' => $r],
                Role::query()->whereIn('name', (array) app(StoreSettings::class)->get('accounts.customer_roles', ['Customer']))->pluck('name')->all() ?: ['Customer'])],
            'language' => ['label' => 'Language', 'group' => 'Customer', 'input' => 'select', 'options' => array_map(fn (string $l) => ['value' => $l, 'label' => Locales::name($l)], Locales::available())],
            'province' => ['label' => 'Province (address)', 'group' => 'Customer', 'input' => 'text'],
            'city' => ['label' => 'City (address)', 'group' => 'Customer', 'input' => 'text'],

            'has_active_cart' => ['label' => 'Has products in their cart', 'group' => 'Activity', 'input' => 'none'],
            'has_wishlist' => ['label' => 'Has products in their wishlist', 'group' => 'Activity', 'input' => 'none'],
            'opened_within_days' => ['label' => 'Opened a marketing email in the last (days)', 'group' => 'Activity', 'input' => 'days'],
            'not_opened_within_days' => ['label' => 'Hasn\'t opened a marketing email in the last (days)', 'group' => 'Activity', 'input' => 'days'],
            'received_campaign' => ['label' => 'Received the campaign', 'group' => 'Activity', 'input' => 'select', 'options' => $campaigns],
            'not_received_campaign' => ['label' => 'Didn\'t receive the campaign', 'group' => 'Activity', 'input' => 'select', 'options' => $campaigns],
        ];
    }

    /**
     * Customers who may get marketing email at all.
     *
     * @return Builder<Customer>
     */
    public static function reachable(): Builder
    {
        return Customer::query()
            ->where('commerce_customers.accepts_marketing', true)
            ->whereNull('commerce_customers.anonymized_at')
            ->whereNull('commerce_customers.deletion_requested_at')
            ->where('commerce_customers.email', 'not like', '%@invalid.local');
    }

    /**
     * @param  array<string, mixed>|null  $audience
     * @return Builder<Customer>
     */
    public function query(?array $audience): Builder
    {
        $query = self::reachable();
        $rules = self::clean($audience)['rules'];
        if ($rules === []) {
            return $query;
        }
        $any = ($audience['match'] ?? 'all') === 'any';

        return $query->where(function (Builder $q) use ($rules, $any): void {
            foreach ($rules as $rule) {
                $apply = fn (Builder $inner) => $this->apply($inner, $rule['rule'], $rule['value'] ?? null);
                $any ? $q->orWhere($apply) : $q->where($apply);
            }
        });
    }

    /** @param  array<string, mixed>|null  $audience */
    public function count(?array $audience): int
    {
        return $this->query($audience)->count();
    }

    /**
     * Validated audience: known rules with their values, in a stable shape.
     *
     * @param  array<string, mixed>|null  $audience
     * @return array{match: string, rules: array<int, array{rule: string, value: mixed}>}
     *
     * @throws ValidationException
     */
    public static function clean(?array $audience): array
    {
        $known = self::rules();
        $rules = [];
        foreach (array_values((array) ($audience['rules'] ?? [])) as $i => $rule) {
            $key = (string) ($rule['rule'] ?? '');
            if (! isset($known[$key])) {
                throw ValidationException::withMessages(["audience.rules.{$i}.rule" => 'Choose a rule.']);
            }
            $value = $rule['value'] ?? null;
            $value = match ($known[$key]['input']) {
                'none' => null,
                'days', 'number', 'money' => is_numeric($value) && (float) $value >= 0 ? (int) $value
                    : throw ValidationException::withMessages(["audience.rules.{$i}.value" => 'Enter a number.']),
                'products', 'categories' => array_values(array_filter(array_map(fn ($v) => is_array($v) && is_numeric($v['id'] ?? null)
                    ? ['id' => (int) $v['id'], 'label' => (string) ($v['label'] ?? $v['id'])] : null, (array) $value)))
                    ?: throw ValidationException::withMessages(["audience.rules.{$i}.value" => 'Choose at least one.']),
                default => is_scalar($value) && trim((string) $value) !== '' ? trim((string) $value)
                    : throw ValidationException::withMessages(["audience.rules.{$i}.value" => 'Choose or enter a value.']),
            };
            $rules[] = ['rule' => $key, 'value' => $value];
        }

        return ['match' => ($audience['match'] ?? 'all') === 'any' ? 'any' : 'all', 'rules' => $rules];
    }

    /** @param  Builder<Customer>  $q */
    protected function apply(Builder $q, string $rule, mixed $value): void
    {
        $days = fn () => now()->subDays((int) $value);
        $factor = 10 ** (int) app(StoreSettings::class)->get('general.currency.decimals', 0);
        $ids = fn () => array_map(fn (array $v) => (int) $v['id'], (array) $value);

        match ($rule) {
            'no_order_for_days' => $q->where('orders_count', '>', 0)->where('last_order_at', '<=', $days()),
            'ordered_within_days' => $q->where('last_order_at', '>=', $days()),
            'never_ordered' => $q->where('orders_count', 0),
            'orders_at_least' => $q->where('orders_count', '>=', (int) $value),
            'orders_at_most' => $q->where('orders_count', '<=', (int) $value),
            'spent_at_least' => $q->where('total_spent', '>=', (int) $value * $factor),
            'spent_at_most' => $q->where('total_spent', '<=', (int) $value * $factor),
            'bought_product' => $q->whereIn('commerce_customers.id', $this->buyers()->whereIn('i.product_id', $ids())),
            'bought_category' => $q->whereIn('commerce_customers.id', $this->buyers()
                ->join('sunrice_entry_term as et', 'et.entry_id', '=', 'i.entry_id')->whereIn('et.term_id', $ids())),
            'signed_up_within_days' => $q->where('commerce_customers.created_at', '>=', $days()),
            'signed_up_before_days' => $q->where('commerce_customers.created_at', '<=', $days()),
            'account' => $value === 'guest' ? $q->whereNull('user_id') : $q->whereNotNull('user_id'),
            'role' => $q->whereIn('user_id', DB::table('model_has_roles')->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
                ->where('roles.name', (string) $value)->where('model_has_roles.model_type', self::userMorphClass())->select('model_has_roles.model_id')),
            'language' => (string) $value === Locales::main()
                ? $q->where(fn (Builder $w) => $w->where('locale', $value)->orWhereNull('locale'))
                : $q->where('locale', (string) $value),
            'province', 'city' => $q->whereIn('commerce_customers.id', DB::table('commerce_addresses')
                ->whereLike($rule, '%'.str_replace(['%', '_'], ['\%', '\_'], (string) $value).'%')->select('customer_id')),
            'has_active_cart' => $q->whereIn('commerce_customers.id', DB::table('commerce_carts as c')->where('c.status', 'active')->whereNotNull('c.customer_id')
                ->whereExists(fn (QueryBuilder $e) => $e->from('commerce_cart_items as ci')->whereColumn('ci.cart_id', 'c.id'))->select('c.customer_id')),
            'has_wishlist' => $q->whereIn('commerce_customers.id', DB::table('commerce_wishlists as w')->whereNotNull('w.customer_id')
                ->whereExists(fn (QueryBuilder $e) => $e->from('commerce_wishlist_items as wi')->whereColumn('wi.wishlist_id', 'w.id'))->select('w.customer_id')),
            'opened_within_days' => $q->whereIn('commerce_customers.id', $this->openers($days())),
            'not_opened_within_days' => $q->whereNotIn('commerce_customers.id', $this->openers($days())),
            'received_campaign' => $q->whereIn('commerce_customers.id', $this->receivers((int) $value)),
            'not_received_campaign' => $q->whereNotIn('commerce_customers.id', $this->receivers((int) $value)),
            default => null,
        };
    }

    /** Customer ids with a paid-for (not cancelled) order, joined to its items as `i`. */
    protected function buyers(): QueryBuilder
    {
        return DB::table('commerce_orders as o')->join('commerce_order_items as i', 'i.order_id', '=', 'o.id')
            ->whereNotNull('o.customer_id')->where('o.type', 'order')->whereNotIn('o.status', ['cancelled', 'failed'])
            ->whereNull('o.deleted_at')->select('o.customer_id');
    }

    protected function openers(\DateTimeInterface $since): QueryBuilder
    {
        return DB::table('commerce_campaign_sends')->whereNotNull('customer_id')->where('opened_at', '>=', $since)->select('customer_id');
    }

    protected function receivers(int $campaign): QueryBuilder
    {
        return DB::table('commerce_campaign_sends')->where('campaign_id', $campaign)->where('status', 'sent')->whereNotNull('customer_id')->select('customer_id');
    }

    protected static function userMorphClass(): string
    {
        $class = (string) config('sunrice.auth.user_model');

        return class_exists($class) && is_subclass_of($class, Model::class) ? (new $class)->getMorphClass() : $class;
    }
}
