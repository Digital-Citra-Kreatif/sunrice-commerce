<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Http\Controllers\Admin\TargetLabels;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * Creates or updates a voucher or automatic discount.
 * The admin form and the MCP tools both save through here, with the
 * form's values (fields()); values() gives a voucher's current ones.
 */
class SaveVoucher
{
    /** A new voucher with the form's defaults (a random code unless automatic). */
    public function blank(bool $automatic = false): Voucher
    {
        return new Voucher(['active' => true, 'type' => 'percent', 'value' => 1000, 'audience' => 'everyone', 'subtotal_basis' => 'cart',
            'combinable' => true, 'automatic' => $automatic, 'code' => $automatic ? null : Str::upper(Str::random(8))]);
    }

    /** @return array<int, array<string, mixed>> */
    public function fields(): array
    {
        $roles = Role::query()->orderBy('name')->pluck('name')->map(fn ($r) => ['value' => $r, 'label' => $r])->all();
        $options = fn (array $labels) => array_map(fn ($v, $l) => ['value' => $v, 'label' => $l], array_keys($labels), $labels);

        return [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Name', 'required' => true, 'translatable' => false, 'instructions' => 'Shown to customers in the cart.', 'config' => ['max' => 120]],
            ['handle' => 'automatic', 'type' => 'toggle', 'label' => 'Automatic discount (no code)'],
            ['handle' => 'code', 'type' => 'text', 'label' => 'Code', 'translatable' => false, 'validation' => ['regex:/^[A-Za-z0-9_-]*$/', 'max:64']],
            ['handle' => 'active', 'type' => 'toggle', 'label' => 'Active'],
            ['handle' => 'type', 'type' => 'select', 'label' => 'Discount', 'required' => true, 'config' => ['options' => $options([
                'percent' => 'Percent off', 'fixed_cart' => 'Amount off the order', 'fixed_item' => 'Amount off each item', 'free_shipping' => 'Free shipping', 'buy_x_get_y' => 'Buy X get Y',
            ])]],
            ['handle' => 'percent', 'type' => 'number', 'label' => 'Percent', 'config' => ['min' => 0, 'max' => 100]],
            ['handle' => 'amount', 'type' => 'commerce_money', 'label' => 'Amount', 'instructions' => 'For free shipping: the most it covers (empty: all of it).'],
            ['handle' => 'max_discount', 'type' => 'commerce_money', 'label' => 'Maximum discount', 'instructions' => 'For percent off.'],
            ['handle' => 'bxgy', 'type' => 'group', 'label' => 'Buy X get Y', 'config' => ['fields' => [
                ['handle' => 'buy_qty', 'type' => 'number', 'label' => 'Buy (units)', 'config' => ['min' => 1], 'validation' => ['integer']],
                ['handle' => 'get_qty', 'type' => 'number', 'label' => 'Get (units)', 'config' => ['min' => 1], 'validation' => ['integer']],
                ['handle' => 'get_type', 'type' => 'select', 'label' => 'Those units', 'config' => ['options' => $options(['free' => 'Free', 'percent_off' => 'Percent off', 'amount_off' => 'Amount off'])]],
                ['handle' => 'get_percent', 'type' => 'number', 'label' => 'Percent off', 'config' => ['min' => 0, 'max' => 100]],
                ['handle' => 'get_amount', 'type' => 'commerce_money', 'label' => 'Amount off'],
                ['handle' => 'buy_targets', 'type' => 'commerce_targets', 'label' => 'Buy from', 'instructions' => 'Empty: any product.'],
                ['handle' => 'get_targets', 'type' => 'commerce_targets', 'label' => 'Get from', 'instructions' => 'Empty: the same products.'],
            ]]],
            ['handle' => 'dates', 'type' => 'commerce_datetime_range', 'label' => 'When', 'instructions' => 'Empty: always.'],
            ['handle' => 'include', 'type' => 'commerce_targets', 'label' => 'Only for', 'instructions' => 'Empty: every product.'],
            ['handle' => 'exclude', 'type' => 'commerce_targets', 'label' => 'Except'],
            ['handle' => 'exclude_sale_items', 'type' => 'toggle', 'label' => 'Not for items already on sale'],
            ['handle' => 'min_subtotal', 'type' => 'commerce_money', 'label' => 'Minimum spend'],
            ['handle' => 'max_subtotal', 'type' => 'commerce_money', 'label' => 'Maximum spend'],
            ['handle' => 'subtotal_basis', 'type' => 'select', 'label' => 'Spend counted on', 'config' => ['options' => $options(['cart' => 'The whole cart', 'eligible' => 'The eligible products only'])]],
            ['handle' => 'min_quantity', 'type' => 'number', 'label' => 'Minimum items', 'config' => ['min' => 1], 'validation' => ['integer']],
            ['handle' => 'audience', 'type' => 'select', 'label' => 'Customers', 'config' => ['options' => $options([
                'everyone' => 'Everyone', 'signed_in' => 'Signed-in customers', 'roles' => 'Customers with these roles', 'customers' => 'These customers', 'first_order' => 'First order only',
            ])]],
            ['handle' => 'roles', 'type' => 'select', 'label' => 'Roles', 'config' => ['options' => $roles, 'multiple' => true]],
            ['handle' => 'emails', 'type' => 'textarea', 'label' => 'Customer emails', 'instructions' => 'One per line.', 'config' => ['max' => 20000]],
            ['handle' => 'payment_methods', 'type' => 'text', 'label' => 'Only with payment methods', 'translatable' => false, 'instructions' => 'Method keys, comma separated (e.g. bank_transfer). Empty: any.'],
            ['handle' => 'shipping_methods', 'type' => 'text', 'label' => 'Only with shipping methods', 'translatable' => false, 'instructions' => 'Method types, comma separated (e.g. flat, weight, pickup). Empty: any.'],
            ['handle' => 'destinations', 'type' => 'repeater', 'label' => 'Only for shipping to', 'config' => ['max' => 50, 'fields' => [
                ['handle' => 'region', 'type' => 'commerce_region', 'label' => 'Country / province', 'config' => ['depth' => 'city']],
            ]]],
            ['handle' => 'usage_limit', 'type' => 'number', 'label' => 'Uses in total', 'config' => ['min' => 1], 'validation' => ['integer']],
            ['handle' => 'usage_limit_per_customer', 'type' => 'number', 'label' => 'Uses per customer', 'config' => ['min' => 1], 'validation' => ['integer']],
            ['handle' => 'combinable', 'type' => 'toggle', 'label' => 'Can be combined with other vouchers'],
            ['handle' => 'exclusive', 'type' => 'toggle', 'label' => 'Exclusive: no other voucher with it'],
            ['handle' => 'priority', 'type' => 'number', 'label' => 'Priority', 'instructions' => 'Automatic discounts with a higher priority apply first.', 'validation' => ['integer']],
        ];
    }

    /** @return array<string, mixed> */
    public function values(Voucher $voucher): array
    {
        $targets = fn (string $mode) => $voucher->exists
            ? TargetLabels::for($voucher->targets->where('mode', $mode)->map(fn ($t) => ['type' => $t->target_type, 'id' => $t->target_id])->values()->all())
            : [];
        $bxgy = (array) $voucher->bxgy + ['buy_qty' => 2, 'get_qty' => 1, 'get_type' => 'free', 'get_value' => 0];
        $values = [
            'name' => $voucher->name, 'automatic' => $voucher->automatic, 'code' => $voucher->code, 'active' => $voucher->active, 'type' => $voucher->type,
            'percent' => $voucher->type === 'percent' ? $voucher->value / 100 : null,
            'amount' => in_array($voucher->type, ['fixed_cart', 'fixed_item', 'free_shipping'], true) && $voucher->value > 0 ? $voucher->value : null,
            'max_discount' => $voucher->max_discount,
            'bxgy' => ['buy_qty' => $bxgy['buy_qty'], 'get_qty' => $bxgy['get_qty'], 'get_type' => $bxgy['get_type'],
                'get_percent' => $bxgy['get_type'] === 'percent_off' ? $bxgy['get_value'] / 100 : null, 'get_amount' => $bxgy['get_type'] === 'amount_off' ? $bxgy['get_value'] : null,
                'buy_targets' => $targets('buy'), 'get_targets' => $targets('get')],
            'dates' => ['start' => $voucher->starts_at?->toIso8601String(), 'end' => $voucher->ends_at?->toIso8601String()],
            'include' => $targets('include'), 'exclude' => $targets('exclude'),
            'exclude_sale_items' => $voucher->exclude_sale_items, 'min_subtotal' => $voucher->min_subtotal, 'max_subtotal' => $voucher->max_subtotal,
            'subtotal_basis' => $voucher->subtotal_basis, 'min_quantity' => $voucher->min_quantity, 'audience' => $voucher->audience, 'roles' => $voucher->roles ?? [],
            'emails' => $voucher->exists ? $voucher->customers->pluck('email')->filter()->implode("\n") : '',
            'payment_methods' => implode(', ', (array) $voucher->payment_methods), 'shipping_methods' => implode(', ', (array) $voucher->shipping_methods),
            'destinations' => array_map(fn (array $d) => ['region' => ['country' => $d['country'], 'province_code' => strlen((string) ($d['region_code'] ?? '')) === 2 ? $d['region_code'] : null,
                'city_code' => strlen((string) ($d['region_code'] ?? '')) === 5 ? $d['region_code'] : null]], (array) $voucher->destinations),
            'usage_limit' => $voucher->usage_limit, 'usage_limit_per_customer' => $voucher->usage_limit_per_customer,
            'combinable' => $voucher->combinable, 'exclusive' => $voucher->exclusive, 'priority' => $voucher->priority,
        ];

        return $values;
    }

    /**
     * @param  array<string, mixed>  $input  the form's values
     *
     * @throws ValidationException
     */
    public function handle(Voucher $voucher, array $input): Voucher
    {
        // Codes are stored uppercase (and deleted vouchers keep theirs).
        $input['code'] = is_string($input['code'] ?? null) ? mb_strtoupper(trim($input['code'])) : null;
        $values = SchemaForm::make($this->fields())->validate($input, [
            'code' => ['required_unless:automatic,true', Rule::unique('commerce_vouchers', 'code')->ignore($voucher->id)],
            'type' => ['in:'.implode(',', Voucher::TYPES)],
            'audience' => ['in:'.implode(',', Voucher::AUDIENCES)],
            'roles' => ['required_if:audience,roles'],
            'emails' => ['required_if:audience,customers'],
        ]);
        $fail = fn (string $key, string $message) => throw SchemaForm::prefixed(ValidationException::withMessages([$key => $message]));
        $value = match ($values['type']) {
            'percent' => (int) round((float) ($values['percent'] ?? 0) * 100),
            'buy_x_get_y' => 0,
            default => (int) ($values['amount'] ?? 0),
        };
        if ($values['type'] === 'percent' && ($value <= 0 || $value > 10000)) {
            $fail('percent', 'Enter a percentage between 0 and 100.');
        }
        if (in_array($values['type'], ['fixed_cart', 'fixed_item'], true) && $value <= 0) {
            $fail('amount', 'Enter the amount.');
        }
        $bxgy = null;
        if ($values['type'] === 'buy_x_get_y') {
            $b = (array) $values['bxgy'];
            $getType = in_array($b['get_type'] ?? 'free', ['free', 'percent_off', 'amount_off'], true) ? $b['get_type'] : 'free';
            $bxgy = ['buy_qty' => max(1, (int) ($b['buy_qty'] ?? 1)), 'get_qty' => max(1, (int) ($b['get_qty'] ?? 1)), 'get_type' => $getType,
                'get_value' => match ($getType) {
                    'percent_off' => (int) round((float) ($b['get_percent'] ?? 0) * 100), 'amount_off' => (int) ($b['get_amount'] ?? 0), default => 0
                }];
        }
        $list = fn (?string $text) => array_values(array_filter(array_map('trim', explode(',', (string) $text))));
        $emails = array_values(array_unique(array_filter(array_map(fn ($e) => mb_strtolower(trim($e)), preg_split('/[\s,;]+/', (string) $values['emails']) ?: []),
            fn ($e) => filter_var($e, FILTER_VALIDATE_EMAIL) !== false)));

        DB::transaction(function () use ($voucher, $values, $value, $bxgy, $list, $emails): void {
            $voucher->fill([
                'name' => $values['name'], 'automatic' => (bool) $values['automatic'], 'code' => $values['automatic'] ? null : $values['code'],
                'active' => (bool) $values['active'], 'type' => $values['type'], 'value' => $value,
                'max_discount' => $values['type'] === 'percent' ? $values['max_discount'] : null, 'bxgy' => $bxgy,
                'starts_at' => $values['dates']['start'] ?? null, 'ends_at' => $values['dates']['end'] ?? null,
                'min_subtotal' => $values['min_subtotal'], 'max_subtotal' => $values['max_subtotal'], 'subtotal_basis' => $values['subtotal_basis'] ?: 'cart',
                'min_quantity' => $values['min_quantity'], 'exclude_sale_items' => (bool) $values['exclude_sale_items'],
                'audience' => $values['audience'] ?: 'everyone', 'roles' => $values['audience'] === 'roles' ? array_values((array) $values['roles']) : null,
                'payment_methods' => $list($values['payment_methods']) ?: null, 'shipping_methods' => $list($values['shipping_methods']) ?: null,
                'destinations' => array_values(array_filter(array_map(fn ($row) => isset($row['region']['country']) ? [
                    'country' => $row['region']['country'], 'region_code' => $row['region']['city_code'] ?? $row['region']['province_code'] ?? null,
                ] : null, (array) $values['destinations']))) ?: null,
                'usage_limit' => $values['usage_limit'], 'usage_limit_per_customer' => $values['usage_limit_per_customer'],
                'combinable' => (bool) $values['combinable'], 'exclusive' => (bool) $values['exclusive'], 'priority' => (int) ($values['priority'] ?? 0),
            ])->save();
            $voucher->targets()->delete();
            foreach (['include' => $values['include'], 'exclude' => $values['exclude'], 'buy' => $values['bxgy']['buy_targets'] ?? [], 'get' => $values['bxgy']['get_targets'] ?? []] as $mode => $targets) {
                foreach ((array) $targets as $target) {
                    $voucher->targets()->create(['mode' => $mode, 'target_type' => $target['type'], 'target_id' => $target['id']]);
                }
            }
            $voucher->customers()->delete();
            if ($voucher->audience === 'customers') {
                $users = config('sunrice.auth.user_model');
                $ids = $users::query()->whereIn('email', $emails)->pluck('id', 'email');
                foreach ($emails as $email) {
                    $voucher->customers()->create(['email' => $email, 'customer_id' => $ids[$email] ?? null]);
                }
            }
        });
        app(ActivityRecorder::class)->record($voucher->wasRecentlyCreated ? 'created' : 'updated', 'Voucher: '.$voucher->label(), [], 'voucher');

        return $voucher;
    }
}
