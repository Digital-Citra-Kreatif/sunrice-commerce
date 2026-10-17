<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Closure;
use Sunrice\Commerce\Pricing\CalculationState;

/**
 * Extra checkout fields from apps and packages (Commerce::checkoutFieldsUsing()),
 * stored on the order in `fields`. A field:
 * ['handle', 'label', 'type' => text|textarea|checkbox|select, 'options' => [value => label],
 *  'rules' => [...], 'section' => contact|shipping|extra, 'instructions' => ?].
 */
class CheckoutFields
{
    /** @var array<int, Closure(CheckoutData, CalculationState): array<int, array<string, mixed>>> */
    protected array $resolvers = [];

    /** @param  Closure(CheckoutData, CalculationState): array<int, array<string, mixed>>  $fields */
    public function add(Closure $fields): void
    {
        $this->resolvers[] = $fields;
    }

    /** @return array<int, array<string, mixed>> */
    public function for(CheckoutData $data, CalculationState $state): array
    {
        $fields = [];
        foreach ($this->resolvers as $resolver) {
            foreach ($resolver($data, $state) as $field) {
                if (isset($field['handle'], $field['label'])) {
                    $fields[] = ['type' => 'text', 'section' => 'extra', 'rules' => ['nullable', 'string', 'max:500'], ...$field];
                }
            }
        }

        return $fields;
    }

    /** @return array<string, mixed> rules keyed fields.{handle} */
    public function rules(CheckoutData $data, CalculationState $state): array
    {
        $rules = [];
        foreach ($this->for($data, $state) as $field) {
            $rules['fields.'.$field['handle']] = $field['rules'];
        }

        return $rules;
    }
}
