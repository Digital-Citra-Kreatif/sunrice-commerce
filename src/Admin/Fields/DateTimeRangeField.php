<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Fields;

use Carbon\CarbonImmutable;
use Sunrice\Fields\FieldType;

/**
 * A start and end date-time: {start: ISO 8601|null, end: ISO 8601|null}.
 * config: require_start, require_end.
 */
class DateTimeRangeField extends FieldType
{
    public static function type(): string
    {
        return 'commerce_datetime_range';
    }

    public function rules(array $field): array
    {
        return ['array:start,end', function (string $attribute, mixed $value, \Closure $fail) use ($field): void {
            $start = $this->parse($value['start'] ?? null);
            $end = $this->parse($value['end'] ?? null);
            if (($value['start'] ?? null) && $start === null || ($value['end'] ?? null) && $end === null) {
                $fail('Enter valid dates.');
            } elseif (($field['config']['require_start'] ?? false) && $start === null) {
                $fail('Choose when it starts.');
            } elseif (($field['config']['require_end'] ?? false) && $end === null) {
                $fail('Choose when it ends.');
            } elseif ($start !== null && $end !== null && $end <= $start) {
                $fail('The end must be after the start.');
            }
        }];
    }

    public function normalize(mixed $value, array $field): mixed
    {
        $value = is_array($value) ? $value : [];

        return [
            'start' => $this->parse($value['start'] ?? null)?->toIso8601String(),
            'end' => $this->parse($value['end'] ?? null)?->toIso8601String(),
        ];
    }

    protected function parse(mixed $value): ?CarbonImmutable
    {
        if (! is_string($value) || $value === '') {
            return null;
        }
        try {
            return CarbonImmutable::parse($value);
        } catch (\Throwable) {
            return null;
        }
    }
}
